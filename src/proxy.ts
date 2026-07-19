import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, authenticated } = await updateSupabaseSession(request);
  if (request.nextUrl.pathname.startsWith("/studio") && !request.nextUrl.pathname.startsWith("/studio/login")) {
    // This is only a convenience redirect. Every Studio endpoint checks auth itself.
    if (!authenticated) return NextResponse.redirect(new URL("/studio/login", request.url));
  }
  return response;
}

export const config = { matcher: ["/studio/:path*"] };
