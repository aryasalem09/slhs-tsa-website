import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnvironment } from "./env";

export async function getSupabaseServerClient() {
  const env = getSupabaseEnvironment();
  if (!env) return null;
  const cookieStore = await cookies();
  return createServerClient(env.url, env.publishableKey, {
    cookieOptions: { path: "/", sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (entries) => {
        try { entries.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Components cannot set cookies. */ }
      },
    },
  });
}

/** Service client is server-only; never import this module into client components. */
export function getSupabaseAdminClient() {
  const env = getSupabaseEnvironment();
  if (!env?.serviceRoleKey) return null;
  return createClient(env.url, env.serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
}
