import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnvironment } from "./env";

/** Refreshes auth cookies. Route handlers still authorize independently. */
export async function updateSupabaseSession(request: NextRequest) {
  const env = getSupabaseEnvironment();
  if (!env) return { response: NextResponse.next({ request }), authenticated: false };
  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.publishableKey, {
    cookieOptions: { path: "/", sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (entries, headers) => {
        entries.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        entries.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  return { response, authenticated: Boolean(data?.claims?.sub) };
}
