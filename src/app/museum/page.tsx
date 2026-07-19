import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";
import { isSafeInternalHref } from "@/lib/urls";

/** The museum now lives on the combined CEG page. */
type SearchParams = Promise<{ studio?: string; draft?: string }>;

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({
    pageKey: "museum",
    route: "/museum",
    fallbackTitle: "Museum",
    fallbackDescription: "Redirects to the SLHS TSA Competitive Events Guide museum.",
  });
}

export default async function MuseumRedirect({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const document = await getDocumentForRender({ draftPreview: params.studio === "1" || params.draft === "1" });
  const sections = getPageSections<{ redirectTo?: unknown }>(document, "museum");
  const redirectTo = isSafeInternalHref(sections?.redirectTo)
    ? sections.redirectTo
    : "/ceg";
  permanentRedirect(`${redirectTo}#museum`);
}
