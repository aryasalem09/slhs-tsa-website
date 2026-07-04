import type { Metadata } from "next";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { meetings, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Calendar",
  description:
    "SLHS TSA calendar — meetings, presubmit deadlines, competitions, payment deadlines, socials, trips, and check-ins.",
};

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10">
      <h1 className="sr-only">Calendar</h1>
      <div className="text-center">
        <DashWrap>
          <WonkyTitle
            text="CALENDAR"
            outline
            className="text-[1.9rem] leading-none sm:text-[2.5rem]"
          />
        </DashWrap>
        <p className="mt-5 text-lg font-semibold text-ink/90">
          Meetings, deadlines, socials, trips, and check-ins.
        </p>
        <p className="mt-1 font-hand text-2xl text-muted-ink">{meetings.blurb}</p>
      </div>

      <div className="edge-paper relative mt-8 border-[3px] border-ink/85 bg-card p-3 shadow-paper sm:p-4">
        <span aria-hidden="true" className="tape -top-3 left-10 rotate-[-6deg]" />
        <span aria-hidden="true" className="tape -top-3 right-10 rotate-[5deg]" />
        <iframe
          title="SLHS TSA Calendar"
          src={site.links.calendarEmbedSrc}
          loading="lazy"
          className="h-[70vh] min-h-[520px] w-full rounded-md border border-ink/15 bg-white"
        />
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-muted-ink">
        Tap an event for details — times are US Central.
      </p>
    </div>
  );
}
