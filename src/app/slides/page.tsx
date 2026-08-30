import { createPageMetadata } from "@/lib/seo";
import { DashWrap, WonkyTitle } from "@/components/decor";
import MeetingSlides from "@/components/MeetingSlides";
import { meetingSlides } from "@/content/site";

export const metadata = createPageMetadata({
  path: "/slides",
  title: "Meeting Slides",
  description: "Missed a meeting? Every SLHS TSA slideshow lives here, so you can catch up whenever you need to.",
});

export default function SlidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="text-center">
        <h1 className="sr-only">Meeting slides</h1>
        <DashWrap>
          <WonkyTitle text="MEETING SLIDES" outline className="text-[1.7rem] leading-none sm:text-[2.4rem]" />
        </DashWrap>
      </div>
      {meetingSlides.length === 0 ? (
        <div className="edge-paper relative mx-auto mt-12 max-w-xl rotate-[-0.5deg] border-[3px] border-ink/85 bg-card p-8 text-center shadow-paper">
          <span aria-hidden="true" className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
          <p className="font-hand text-3xl font-bold text-ink">nothing here yet!</p>
          <p className="mx-auto mt-3 max-w-sm font-semibold text-muted-ink">Slides from every meeting will show up here once the year kicks off.</p>
        </div>
      ) : <MeetingSlides decks={meetingSlides} />}
    </div>
  );
}
