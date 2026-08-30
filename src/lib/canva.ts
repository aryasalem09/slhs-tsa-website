/**
 * Converts a public Canva design URL into the embed URL used by the site.
 * Only presentation links from Canva's design route are trusted here.
 */
export function toCanvaEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !["canva.com", "www.canva.com"].includes(url.hostname)
    ) {
      return null;
    }

    const path = url.pathname.replace(/\/$/, "");
    if (!/^\/design\/[^/]+\/[^/]+(?:\/view)?$/.test(path)) return null;

    const viewPath = path.endsWith("/view") ? path : `${path}/view`;
    return `https://www.canva.com${viewPath}?embed`;
  } catch {
    return null;
  }
}

export function isCanvaDesignUrl(value: string): boolean {
  return toCanvaEmbedUrl(value) !== null;
}
