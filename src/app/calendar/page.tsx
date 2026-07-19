import type { Metadata } from "next";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { meetings, site } from "@/content/site";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({
    pageKey: "calendar",
    route: "/calendar",
    fallbackTitle: "Calendar",
    fallbackDescription: "View the SLHS TSA calendar for Seven Lakes High School meetings, deadlines, competitions, socials, trips, and chapter updates.",
  });
}

type CalendarSections = { calendarEmbedSrc?: unknown; meetings?: unknown };
type PageProps = { searchParams: Promise<{ studio?: string; draft?: string }> };

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function safeEmbedSrc(value: unknown) {
  if (typeof value !== "string") return site.links.calendarEmbedSrc;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : site.links.calendarEmbedSrc;
  } catch {
    return site.links.calendarEmbedSrc;
  }
}

export default async function CalendarPage({ searchParams }: PageProps) {
  const preview = await searchParams;
  const document = await getDocumentForRender({ draftPreview: preview.studio === "1" || preview.draft === "1" });
  const sections = getPageSections<CalendarSections>(document, "calendar");
  const meetingDetails = asRecord(sections?.meetings);
  const meetingBlurb = typeof meetingDetails?.blurb === "string" ? meetingDetails.blurb : meetings.blurb;
  const calendarEmbedSrc = safeEmbedSrc(sections?.calendarEmbedSrc);

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
        <p data-studio-id="calendar.meetings" className="mt-1 font-hand text-2xl text-muted-ink">{meetingBlurb}</p>
      </div>

      <div data-studio-id="calendar.schedule" className="edge-paper relative mt-8 border-[3px] border-ink/85 bg-card p-3 shadow-paper sm:p-4">
        <span aria-hidden="true" className="tape -top-3 left-10 rotate-[-6deg]" />
        <span aria-hidden="true" className="tape -top-3 right-10 rotate-[5deg]" />
        <iframe
          title="SLHS TSA Calendar"
          src={calendarEmbedSrc}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          className="h-[70vh] min-h-[520px] w-full rounded-md border border-ink/15 bg-white"
        />
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-muted-ink">
        Tap an event for details. Times are Central.
      </p>
    </div>
  );
}
