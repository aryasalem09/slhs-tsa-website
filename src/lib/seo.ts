import type { Metadata } from "next";

/**
 * Shared Open Graph base. Next.js replaces (not merges) a page's openGraph
 * object over the layout's, so every page pulls the full set from here and
 * adds its own url via pageSeo().
 */
const ogBase = {
  siteName: "SLHS TSA",
  type: "website" as const,
  locale: "en_US",
  images: [
    {
      url: "/og.jpg",
      width: 1200,
      height: 630,
      alt: "SLHS TSA members at the TSA 2026 state conference marquee",
    },
  ],
};

/** Canonical + Open Graph plumbing shared by every page. */
export function pageSeo(path: string): Pick<Metadata, "alternates" | "openGraph"> {
  return {
    alternates: { canonical: path },
    openGraph: { ...ogBase, url: path },
  };
}
