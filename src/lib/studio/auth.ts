import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { can, type StudioRole, type StudioSession } from "./types";

type Profile = { username: string; display_name: string | null; role: StudioRole };

export async function getStudioSession(): Promise<StudioSession | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("studio_profiles").select("username, display_name, role").eq("id", user.id).maybeSingle<Profile>();
  if (!data) return null;
  return { userId: user.id, username: data.username, displayName: data.display_name, role: data.role };
}

export async function requireStudioSession(permission: keyof typeof import("./types").permissions = "read") {
  const session = await getStudioSession();
  if (!session || !can(session.role, permission)) return null;
  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "You do not have permission for this action" }, { status: 403 });
}
