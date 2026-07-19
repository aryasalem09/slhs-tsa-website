import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireStudioSession, unauthorizedResponse } from "@/lib/studio/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { readBodyWithLimit, rejectCrossOrigin, RequestBodyTooLargeError } from "@/lib/studio/http";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 512 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const session = await requireStudioSession("edit");
  if (!session) return unauthorizedResponse();
  let form: FormData;
  try {
    const body = await readBodyWithLimit(request, MAX_REQUEST_BYTES);
    const headers = new Headers(request.headers);
    headers.delete("content-length");
    const requestBody = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;
    form = await new Request(request.url, { method: "POST", headers, body: requestBody }).formData();
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    return NextResponse.json({ error: "Upload a valid JPEG, PNG, or WebP image smaller than 8 MB." }, { status });
  }
  const file = form.get("file");
  if (!(file instanceof File) || !ACCEPTED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Upload a JPEG, PNG, or WebP image smaller than 8 MB." }, { status: 400 });
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Studio is not configured" }, { status: 503 });
  try {
    const sharp = (await import("sharp")).default;
    const output = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40_000_000, failOn: "warning" })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86 })
      .toBuffer();
    if (output.length > MAX_FILE_BYTES) throw new Error("Processed image is too large");
    const path = `${session.userId}/${randomUUID()}.webp`;
    const { error } = await supabase.storage.from("studio-media").upload(path, output, { contentType: "image/webp", upsert: false });
    if (error) throw error;
    const assetId = randomUUID();
    const url = `/api/studio/media/${assetId}`;
    const { error: metadataError } = await supabase.from("studio_assets").insert({ id: assetId, path, public_url: url, mime_type: "image/webp", size_bytes: output.length, uploaded_by: session.userId });
    if (metadataError) {
      await supabase.storage.from("studio-media").remove([path]);
      throw metadataError;
    }
    return NextResponse.json({ id: assetId, path, url, mimeType: "image/webp", sizeBytes: output.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to process this image." }, { status: 422 });
  }
}
