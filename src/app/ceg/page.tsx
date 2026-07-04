import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "CEG Navigation",
  description: "SLHS TSA's guide through the TSA Competitive Events Guide — under construction.",
};

/*
 * TODO(ceg, August): build the CEG Navigation experience. Planned content from
 * the planning doc — a slideshow/walkthrough of the Competitive Events Guide:
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
    <>
      <h1 className="sr-only">CEG Navigation</h1>
      <UnderConstruction title="CEG NAVIGATION" />
    </>
  );
}
