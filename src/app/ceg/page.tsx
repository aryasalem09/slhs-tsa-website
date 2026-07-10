import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import CegExplorer from "@/components/CegExplorer";
import InspirationBubble from "@/components/InspirationBubble";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { ceg } from "@/content/site";

export const metadata: Metadata = {
  title: "CEG Navigation",
  description:
    "SLHS TSA's guide through the Competitive Events Guide: one master slideshow plus a deck per event, and the TSA Museum project archive.",
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
        <div className="mt-6 flex justify-center lg:absolute lg:right-1 lg:top-0 lg:mt-0 lg:block">
          <InspirationBubble />
        </div>
      </div>

      <CegExplorer master={ceg.master} events={ceg.events} />
    </div>
  );
}
