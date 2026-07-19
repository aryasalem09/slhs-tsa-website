import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { studioSeedDocument } from "./seed";
import { studioDocumentSchema } from "./validation";
import type { StudioDocument, StudioRecord, StudioRevision } from "./types";

type DocumentRow = { id: string; kind: "draft" | "published"; document: unknown; lock_version: number; updated_at: string; updated_by: string | null };

const toRecord = (row: DocumentRow): StudioRecord | null => {
  const parsed = studioDocumentSchema.safeParse(row.document);
  if (!parsed.success) return null;
  return { id: row.id, kind: row.kind, document: parsed.data, lockVersion: row.lock_version, updatedAt: row.updated_at, updatedBy: row.updated_by };
};

/** Public consumers use the seed until Supabase is deliberately configured. */
export async function getPublishedDocument(): Promise<StudioDocument> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return studioSeedDocument;
  const { data, error } = await supabase.from("studio_documents").select("*").eq("kind", "published").maybeSingle();
  if (error || !data) return studioSeedDocument;
  return toRecord(data)?.document ?? studioSeedDocument;
}

export async function getDraftDocument(): Promise<StudioRecord | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("studio_documents").select("*").eq("kind", "draft").maybeSingle();
  return error || !data ? null : toRecord(data);
}

export async function saveDraft(document: StudioDocument, expectedLockVersion: number) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Studio is not configured" as const };
  const parsed = studioDocumentSchema.parse(document);
  const { data, error } = await supabase.rpc("save_studio_draft", { p_document: parsed, p_expected_lock_version: expectedLockVersion });
  if (error) return { error: error.code === "P0001" ? "This document changed elsewhere. Reload before saving." : "Unable to save the draft." as const };
  const record = toRecord(data);
  return record ? { record } : { error: "The saved draft could not be validated." as const };
}

export async function publishDraft(expectedLockVersion: number) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Studio is not configured" as const };
  const existingDraft = await getDraftDocument();
  let reviewedLockVersion = expectedLockVersion;
  if (!existingDraft) {
    if (expectedLockVersion !== 0) return { error: "This draft changed elsewhere. Reload before publishing.", conflict: true as const };
    const seeded = await saveDraft({ ...studioSeedDocument, updatedAt: new Date().toISOString() }, 0);
    if ("error" in seeded) return { ...seeded, conflict: seeded.error?.includes("changed") === true };
    reviewedLockVersion = seeded.record.lockVersion;
  }
  const { data, error } = await supabase.rpc("publish_studio_document", { p_expected_lock_version: reviewedLockVersion });
  if (error) return error.code === "P0001"
    ? { error: "This draft changed elsewhere. Reload before publishing.", conflict: true as const }
    : { error: "Unable to publish the draft." as const };
  const record = toRecord(data);
  return record ? { record } : { error: "The published document could not be validated." as const };
}

export async function listRevisions({ limit = 50, offset = 0 }: { limit?: number; offset?: number } = {}) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { revisions: [] as StudioRevision[], nextOffset: null };
  const boundedLimit = Math.min(Math.max(limit, 1), 50);
  const { data, error } = await supabase.from("studio_revisions").select("id, label, created_at, created_by").order("created_at", { ascending: false }).range(offset, offset + boundedLimit);
  if (error) return { error: "Unable to load version history." as const };
  const rows = data ?? [];
  return {
    revisions: rows.slice(0, boundedLimit).map((row) => ({ id: row.id, createdAt: row.created_at, createdBy: row.created_by, label: row.label })),
    nextOffset: rows.length > boundedLimit ? offset + boundedLimit : null,
  };
}

export async function restoreRevision(revisionId: string, expectedLockVersion: number) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Studio is not configured" as const };
  const { data, error } = await supabase.rpc("restore_studio_revision", { p_revision_id: revisionId, p_expected_lock_version: expectedLockVersion });
  if (error) return error.code === "P0001"
    ? { error: "This draft changed elsewhere. Reload before restoring.", conflict: true as const }
    : { error: "Unable to restore that revision." as const };
  const record = toRecord(data);
  return record ? { record } : { error: "The restored draft could not be validated." as const };
}
