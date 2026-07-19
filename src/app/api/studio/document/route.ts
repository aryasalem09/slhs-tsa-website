import { NextResponse } from "next/server";
import { requireStudioSession, unauthorizedResponse } from "@/lib/studio/auth";
import { getDraftDocument, saveDraft } from "@/lib/studio/repository";
import { saveDocumentSchema } from "@/lib/studio/validation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { studioSeedDocument } from "@/lib/studio/seed";
import { readJsonWithLimit, rejectCrossOrigin, RequestBodyTooLargeError } from "@/lib/studio/http";

export async function GET() {
  const session = await requireStudioSession();
  if (!session) return unauthorizedResponse();
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Studio is not configured" }, { status: 503 });
  const record = await getDraftDocument();
  // The first autosave materializes this seed as the initial draft.
  return NextResponse.json({ document: record ?? { id: "seed", kind: "draft", document: studioSeedDocument, lockVersion: 0, updatedAt: studioSeedDocument.updatedAt, updatedBy: null } });
}

export async function PUT(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const session = await requireStudioSession("edit");
  if (!session) return unauthorizedResponse();
  try {
    const input = saveDocumentSchema.parse(await readJsonWithLimit(request, 2 * 1024 * 1024));
    const result = await saveDraft({ ...input.document, updatedAt: new Date().toISOString() }, input.lockVersion);
    if ("error" in result) {
      const message = result.error ?? "Unable to save the draft.";
      return NextResponse.json({ error: message }, { status: message.includes("changed") ? 409 : 503 });
    }
    return NextResponse.json({ document: result.record });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: "Document payload is too large" }, { status: 413 });
    return NextResponse.json({ error: "Invalid document payload" }, { status: 400 });
  }
}
