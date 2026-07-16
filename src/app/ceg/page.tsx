import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import CegExplorer from "@/components/CegExplorer";
import InspirationBubble from "@/components/InspirationBubble";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { ceg } from "@/content/site";

export const metadata: Metadata = {
  title: "CEG Navigation",
  description:
    "New to competing? Our slideshows walk you through the whole Competitive Events Guide, event by event, plus a museum of past projects to spark ideas.",
  ...pageSeo("/ceg"),
};

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
export default function CegPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="sr-only">CEG Navigation and TSA Museum</h1>
      <div className="relative">
        <div className="text-center">
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
        <div className="mt-6 flex justify-center">
          <InspirationBubble />
        </div>
      </div>

      <CegExplorer master={ceg.master} events={ceg.events} />
    </div>
  );
}
