import { NextResponse } from "next/server";
import { requireStudioSession, unauthorizedResponse } from "@/lib/studio/auth";
import { listRevisions } from "@/lib/studio/repository";

export async function GET(request: Request) {
  const session = await requireStudioSession();
  if (!session) return unauthorizedResponse();
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "50");
  const offset = Number(url.searchParams.get("offset") ?? "0");
  if (!Number.isInteger(limit) || !Number.isInteger(offset) || limit < 1 || limit > 50 || offset < 0) return NextResponse.json({ error: "Invalid revision page." }, { status: 400 });
  const result = await listRevisions({ limit, offset });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 503 });
  return NextResponse.json(result);
}
