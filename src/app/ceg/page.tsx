import type { Metadata } from "next";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import CegExplorer from "@/components/CegExplorer";
import InspirationBubble from "@/components/InspirationBubble";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { ceg, site } from "@/content/site";
import type { CegDeck } from "@/content/site";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({
    pageKey: "ceg",
    route: "/ceg",
    fallbackTitle: "CEG Navigation",
    fallbackDescription: "New to competing? Our slideshows walk you through the whole Competitive Events Guide, event by event, plus a museum of past projects to spark ideas.",
  });
}

/*
 * TODO(ceg): as decks get made, fill in `ceg` in src/content/site.ts.
 * Planned deck content from the planning doc:
 *   - how many people in each team
 *   - whether each event is an open event
 *   - dress code (state/regionals/nationals)
 *   - DQ violations (incl. height requirements)
 *   - copyright checklist
 *   - AI checklist (new)
 *   - rubric breakdowns
 *   - static vs. non-static
 * "READ THIS RELIGIOUSLY."
 */
type SearchParams = Promise<{ studio?: string; draft?: string }>;

function isCanvaUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "www.canva.com" && url.pathname.startsWith("/design/");
  } catch {
    return false;
  }
}

function isDeck(value: unknown): value is CegDeck {
  return Boolean(
    value
    && typeof value === "object"
    && typeof (value as CegDeck).name === "string"
    && (value as CegDeck).name.trim().length > 0
    && ((value as CegDeck).canvaUrl === null || (value as CegDeck).canvaUrl === "" || isCanvaUrl((value as CegDeck).canvaUrl)),
  );
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function safeExternalHref(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

export default async function CegPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const document = await getDocumentForRender({ draftPreview: params.studio === "1" || params.draft === "1" });
  const sections = getPageSections<{ ceg?: { master?: unknown; events?: unknown }; competing?: unknown; museum?: unknown }>(document, "ceg");
  const visibleCeg = isDeck(sections?.ceg?.master) && Array.isArray(sections.ceg.events) && sections.ceg.events.every(isDeck)
    ? { master: sections.ceg.master, events: sections.ceg.events }
    : ceg;
  const museum = asRecord(sections?.museum);
  const museumFormUrl = safeExternalHref(museum?.shortForm, site.links.museumFormShort);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="sr-only">CEG Navigation and TSA Museum</h1>
      <div className="relative">
        <div className="text-center" data-studio-id="ceg.heading">
          <DashWrap>
            <WonkyTitle
              text="CEG NAVIGATION"
              outline
              className="text-[1.8rem] leading-none sm:text-[2.4rem]"
            />
          </DashWrap>
          <p className="mt-3 -rotate-1 font-hand text-xl font-semibold text-muted-ink">
            your map through the Competitive Events Guide
          </p>
        </div>

        {/* floating "don't copy" reminder — bobs, and kabooms when you poke it */}
        <div className="mt-6 flex justify-center" data-studio-id="ceg.inspiration">
          <InspirationBubble />
        </div>
      </div>

      <div data-studio-id="ceg.decks">
        <CegExplorer master={visibleCeg.master} events={visibleCeg.events} museumFormUrl={museumFormUrl} />
      </div>
    </div>
  );
}
