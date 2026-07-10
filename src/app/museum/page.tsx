import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { IconExternal } from "@/components/icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "TSA Museum",
  description:
    "The SLHS TSA chapter archive — submit your past TSA projects and boards to add to the collection.",
  ...pageSeo("/museum"),
};

/*
 * The submission form (site.links.museumFormEmbed) requires a Google sign-in,
 * so embedding it just shows a "Sign in to continue" wall. We link out instead.
 * If you loosen the form to "anyone can respond" in Google Forms, you can swap
 * this CTA for the calendar-style <iframe src={site.links.museumFormEmbed} />.
 */
export default function MuseumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="sr-only">TSA Museum</h1>
      <div className="text-center">
        <DashWrap>
          <WonkyTitle
            text="TSA MUSEUM"
            outline
            logoWord="TSA"
            className="text-[1.8rem] leading-none sm:text-[2.5rem]"
          />
        </DashWrap>
      </div>

      <div className="edge-paper relative mx-auto mt-10 max-w-xl rotate-[-0.4deg] border-[3px] border-ink/85 bg-card p-7 text-center shadow-paper sm:p-9">
        <span aria-hidden="true" className="tape -top-3 left-8 rotate-[-6deg]" />
        <span aria-hidden="true" className="tape -top-3 right-8 rotate-[5deg]" />

        <p className="font-hand text-3xl font-bold text-ink">Add to the archive!</p>
        <p className="mx-auto mt-3 max-w-md text-ink/85">View past submissions!</p>

        <a
          href={site.links.museumFormShort}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-marker edge-sketch mt-7 inline-flex items-center gap-2.5 bg-tsa-blue px-6 py-3 font-display text-lg font-bold text-card hover:bg-tsa-blue/90"
        >
          Submit a project
          <IconExternal aria-hidden="true" className="text-xl" />
        </a>
      </div>

      {/* Friendly "inspiration, not copying" disclaimer — a little thought bubble. */}
      <div className="relative mx-auto mt-10 w-fit max-w-md -rotate-1">
        <div className="rounded-[1.9rem] border-2 border-ink/70 bg-[#fff7df] px-6 py-4 text-center shadow-paper">
          <p className="font-hand text-xl font-bold text-ink">
            Take <span className="text-tsa-red">inspiration</span>, don&apos;t copy!
          </p>
          <p className="mt-1 text-sm text-ink/75">
            Reusing someone else&apos;s past work counts as plagiarism and can get you
            disqualified. Use these to spark your own ideas.
          </p>
        </div>
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-12 h-3.5 w-3.5 rounded-full border-2 border-ink/70 bg-[#fff7df]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-5 left-8 h-2.5 w-2.5 rounded-full border-2 border-ink/70 bg-[#fff7df]"
        />
      </div>
    </div>
  );
}
