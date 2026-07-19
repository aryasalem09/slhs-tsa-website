import { NextResponse } from "next/server";
import { getStudioSession } from "@/lib/studio/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { loginSchema } from "@/lib/studio/validation";
import { readJsonWithLimit, rejectCrossOrigin } from "@/lib/studio/http";
import { clearLoginAttempts, consumeLoginAttempt } from "@/lib/studio/rate-limit";

const SESSION_HEADERS = { "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0", Expires: "0", Pragma: "no-cache" };

function sessionJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  for (const [name, value] of Object.entries(SESSION_HEADERS)) headers.set(name, value);
  return NextResponse.json(body, { ...init, headers });
}

export async function GET() {
  if (!isSupabaseConfigured()) return sessionJson({ configured: false });
  const session = await getStudioSession();
  return session ? sessionJson({ configured: true, session }) : sessionJson({ error: "Authentication required" }, { status: 401 });
}

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  if (!isSupabaseConfigured()) return sessionJson({ error: "Studio authentication is not configured" }, { status: 503 });
  try {
    const { username, password } = loginSchema.parse(await readJsonWithLimit(request, 4_096));
    const clientAddress = (
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")?.trim()
      ?? "local"
    ).slice(0, 120);
    const throttleKeys = [`ip:${clientAddress}`, `account:${username}`];
    const throttleResults = [consumeLoginAttempt(throttleKeys[0], 50), consumeLoginAttempt(throttleKeys[1], 10)];
    const throttle = throttleResults.find((result) => !result.allowed) ?? { allowed: true, retryAfterSeconds: 0 };
    if (!throttle.allowed) {
      return sessionJson(
        { error: "Too many sign-in attempts. Please wait and try again." },
        { status: 429, headers: { "Retry-After": String(throttle.retryAfterSeconds) } },
      );
    }
    const client = await getSupabaseServerClient();
    if (!client) return sessionJson({ error: "Studio authentication is not configured" }, { status: 503 });
    const email = `${username}@studio.slhstsa.invalid`;
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) return sessionJson({ error: "Invalid username or password" }, { status: 401 });
    const session = await getStudioSession();
    if (!session) {
      await client.auth.signOut();
      return sessionJson({ error: "Invalid username or password" }, { status: 401 });
    }
    clearLoginAttempts(throttleKeys);
    return sessionJson({ session });
  } catch {
    return sessionJson({ error: "Invalid username or password" }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const client = await getSupabaseServerClient();
  if (!client) return sessionJson({ ok: true });
  await client.auth.signOut();
  return sessionJson({ ok: true });
}
