import "server-only";
import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { getPublishedDocument } from "./repository";

type StudioPageMetadataOptions = {
  pageKey: string;
  route: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  /** Seed labels such as "Home" should inherit the descriptive layout title. */
  genericTitles?: readonly string[];
  /** Let the public home description follow the published site-wide setting. */
  useSiteDescription?: boolean;
};

function nonEmptyText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** Resolves public SEO from the published Studio document, never a draft preview. */
export async function getStudioPageMetadata({
  pageKey,
  route,
  fallbackTitle,
  fallbackDescription,
  genericTitles,
  useSiteDescription = false,
}: StudioPageMetadataOptions): Promise<Metadata> {
  const document = await getPublishedDocument();
  const page = document.pages[pageKey];
  const pageTitle = nonEmptyText(page?.title);
  const siteDescription = nonEmptyText(document.site.metaDescription);
  const isGenericTitle = pageTitle !== undefined && genericTitles?.some((title) => title.toLocaleLowerCase() === pageTitle.toLocaleLowerCase());

  return {
    title: isGenericTitle ? fallbackTitle : pageTitle ?? fallbackTitle,
    description: useSiteDescription ? siteDescription ?? nonEmptyText(page?.description) ?? fallbackDescription : nonEmptyText(page?.description) ?? fallbackDescription,
    ...pageSeo(route),
  };
}
