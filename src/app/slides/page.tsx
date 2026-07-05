import type { Metadata } from "next";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { IconExternal } from "@/components/icons";
import { meetingSlides } from "@/content/site";

export const metadata: Metadata = {
  title: "Meeting Slides",
  description:
    "Every SLHS TSA meeting deck in one place.",
};

export default function SlidesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <div className="text-center">
        <h1 className="sr-only">Meeting slides</h1>
        <DashWrap>
          <WonkyTitle
            text="MEETING SLIDES"
            outline
            className="text-[1.7rem] leading-none sm:text-[2.4rem]"
          />
        </DashWrap>
      </div>

      {meetingSlides.length === 0 ? (
        <div className="edge-paper relative mx-auto mt-12 max-w-xl rotate-[-0.5deg] border-[3px] border-ink/85 bg-card p-8 text-center shadow-paper">
          <span aria-hidden="true" className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
          <p className="font-hand text-3xl font-bold text-ink">
            nothing here yet!
          </p>
          <p className="mx-auto mt-3 max-w-sm font-semibold text-muted-ink">
            Slides from every meeting will show up here once the year kicks off.
          </p>
        </div>
      ) : (
        <ul className="mt-12 space-y-5">
          {meetingSlides.map((deck, i) => (
            <li key={deck.url}>
              <a
                href={deck.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`edge-paper group flex flex-wrap items-center gap-x-5 gap-y-2 border-2 border-ink/80 bg-card p-5 shadow-paper transition hover:-translate-y-0.5 hover:shadow-lift ${
                  i % 2 === 0 ? "rotate-[0.3deg]" : "-rotate-[0.3deg]"
                }`}
              >
                <span className="edge-sketch shrink-0 border-2 border-ink/40 bg-cream px-3 py-1 font-hand text-lg font-semibold text-ink">
                  {deck.date}
                </span>
                <span className="min-w-0 flex-1 font-display text-lg font-black text-tsa-blue group-hover:text-tsa-red">
                  {deck.title}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-muted-ink">
                  {deck.platform === "canva" ? "Canva" : "Google Slides"}
                  <IconExternal aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
