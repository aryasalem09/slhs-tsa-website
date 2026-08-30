import type { Metadata } from "next";

type PageMetadataOptions = {
  path: string;
  title?: string;
  description: string;
};

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

/** Canonical, crawl, and Open Graph metadata shared by every public page. */
export function pageSeo(
  path: string,
): Pick<Metadata, "alternates" | "openGraph" | "robots"> {
  return {
    alternates: { canonical: path },
    openGraph: { ...ogBase, url: path },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function createPageMetadata({
  path,
  title,
  description,
}: PageMetadataOptions): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    ...pageSeo(path),
  };
}
