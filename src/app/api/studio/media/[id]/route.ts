import { NextResponse } from "next/server";
import { getStudioSession } from "@/lib/studio/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function documentReferencesAsset(value: unknown, url: string): boolean {
  if (typeof value === "string") return value === url;
  if (Array.isArray(value)) return value.some((item) => documentReferencesAsset(item, url));
  if (value && typeof value === "object") return Object.values(value).some((item) => documentReferencesAsset(item, url));
  return false;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return new NextResponse("Not found", { status: 404 });
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Studio is not configured" }, { status: 503 });

  const { data: asset } = await admin.from("studio_assets").select("path, public_url, mime_type").eq("id", id).maybeSingle<{
    path: string;
    public_url: string;
    mime_type: string;
  }>();
  if (!asset) return new NextResponse("Not found", { status: 404 });

  const session = await getStudioSession();
  let isPublished = false;
  if (!session) {
    const { data: published } = await admin.from("studio_documents").select("document").eq("kind", "published").maybeSingle<{ document: unknown }>();
    isPublished = documentReferencesAsset(published?.document, asset.public_url);
    if (!isPublished) return new NextResponse("Not found", { status: 404 });
  }

  const { data, error } = await admin.storage.from("studio-media").download(asset.path);
  if (error || !data) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(await data.arrayBuffer(), {
    headers: {
      "Content-Type": asset.mime_type,
      // Published membership can change on the next publish/restore. Never let a
      // browser or CDN retain a previously public student image after that gate closes.
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
