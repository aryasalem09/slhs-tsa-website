import { NextResponse } from "next/server";
import { requireStudioSession, forbiddenResponse, unauthorizedResponse } from "@/lib/studio/auth";
import { restoreRevision } from "@/lib/studio/repository";
import { readJsonWithLimit, rejectCrossOrigin } from "@/lib/studio/http";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const session = await requireStudioSession();
  if (!session) return unauthorizedResponse();
  if (session.role !== "admin" && session.role !== "publisher") return forbiddenResponse();
  let lockVersion: number;
  try {
    const body: unknown = await readJsonWithLimit(request, 2048);
    if (!body || typeof body !== "object" || !Number.isInteger((body as { lockVersion?: unknown }).lockVersion) || (body as { lockVersion: number }).lockVersion < 0) throw new Error("invalid");
    lockVersion = (body as { lockVersion: number }).lockVersion;
  } catch {
    return NextResponse.json({ error: "A current draft lock version is required." }, { status: 400 });
  }
  const result = await restoreRevision((await params).id, lockVersion);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: "conflict" in result && result.conflict ? 409 : 404 });
  return NextResponse.json({ document: result.record });
}
