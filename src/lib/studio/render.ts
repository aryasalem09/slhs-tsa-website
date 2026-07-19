import "server-only";
import { getStudioSession } from "./auth";
import { getDraftDocument, getPublishedDocument } from "./repository";
import { studioSeedDocument } from "./seed";
import type { StudioDocument } from "./types";

/**
 * Public rendering always uses published content. Draft preview additionally
 * requires a signed-in Studio member; callers should only set it from a
 * same-origin Studio preview control, never from a public query alone.
 */
export async function getDocumentForRender({ draftPreview = false }: { draftPreview?: boolean } = {}): Promise<StudioDocument> {
  if (draftPreview && await getStudioSession()) return (await getDraftDocument())?.document ?? studioSeedDocument;
  return getPublishedDocument();
}

export function getPage<TSections extends Record<string, unknown> = Record<string, unknown>>(document: StudioDocument, key: string) {
  return document.pages[key] as (typeof document.pages)[string] & { sections: TSections } | undefined;
}

export function getPageSections<TSections extends Record<string, unknown> = Record<string, unknown>>(document: StudioDocument, key: string): TSections | undefined {
  return getPage<TSections>(document, key)?.sections;
}
