import type { Metadata } from "next";
import Link from "next/link";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { DashWrap, WonkyTitle } from "@/components/decor";
import {
  IconArrowRight,
  IconDiscord,
  IconExternal,
  IconInstagram,
  IconRemind,
} from "@/components/icons";
import { meetings, site } from "@/content/site";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({
    pageKey: "join",
    route: "/join",
    fallbackTitle: "How to Join",
    fallbackDescription: "Want in? Here's how to join SLHS TSA: fill out the form, pay your dues on Katy ISD Pay N' Go, and hop on Remind and Discord.",
  });
}

const payNGoPath = [
  "High School",
  "SLHS",
  "SLHS Clubs & Enrichment Programs",
  "TSA",
  "Membership Dues",
];

const stepCardCls =
  "edge-paper relative border-[3px] border-ink/85 bg-card p-6 pt-8 shadow-paper sm:p-8 sm:pt-8";

function StepBadge({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-5 left-6 flex h-11 w-11 rotate-[-6deg] items-center justify-center rounded-full border-2 border-ink bg-spartan-orange font-display text-xl font-black text-ink shadow-[2px_2px_0_0_rgb(37_50_68_/_0.6)]"
    >
      {n}
    </span>
  );
}

type JoinSections = { links?: unknown; socials?: unknown; meetings?: unknown };
type PageProps = { searchParams: Promise<{ studio?: string; draft?: string }> };

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function safeExternalHref(value: unknown, fallback: string | null) {
  if (typeof value !== "string") return fallback;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function safeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export default async function JoinPage({ searchParams }: PageProps) {
  const preview = await searchParams;
  const document = await getDocumentForRender({ draftPreview: preview.studio === "1" || preview.draft === "1" });
  const sections = getPageSections<JoinSections>(document, "join");
  const links = asRecord(sections?.links);
  const socials = asRecord(sections?.socials);
  const meetingDetails = asRecord(sections?.meetings);
  const form = safeExternalHref(links?.registrationForm, site.links.registrationForm);
  const payNGo = safeExternalHref(links?.payNGo, site.links.payNGo) ?? site.links.payNGo;
  const remind = safeExternalHref(socials?.remind, site.socials.remind) ?? site.socials.remind;
  const discord = safeExternalHref(socials?.discord, site.socials.discord) ?? site.socials.discord;
  const instagram = safeExternalHref(socials?.instagram, site.socials.instagram) ?? site.socials.instagram;
  const meetingBlurb = safeText(meetingDetails?.blurb, meetings.blurb);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <div className="text-center">
        <h1 className="sr-only">How to join</h1>
        <DashWrap>
          <WonkyTitle
            text="HOW TO JOIN"
            outline
            className="text-[1.9rem] leading-none sm:text-[2.5rem]"
          />
        </DashWrap>
        <p className="mx-auto mt-5 max-w-lg font-hand text-2xl font-semibold leading-snug text-muted-ink">
          sign-ups for 26-27 open soon! we&apos;ll announce it by email and Remind.
        </p>
        <p data-studio-id="join.meetings" className="mx-auto mt-3 max-w-lg font-semibold text-muted-ink">
          {meetingBlurb}
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-10">
        {/* step 1 */}
        <SpotlightCard data-studio-id="join.registration" className={stepCardCls}>
          <StepBadge n={1} />
          <h2 className="font-display text-2xl font-black text-tsa-blue">
            Fill out the registration form
          </h2>
          <p className="mt-2 font-semibold leading-relaxed text-ink/85">
            Every member starts here. It gets you on the roster and our email list.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {form ? (
              <a
                href={form}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-marker edge-sketch inline-block bg-tsa-blue px-5 py-2 font-bold text-cream"
              >
                Open the registration form
                <IconExternal className="ml-2 inline-block align-[-2px]" aria-hidden="true" />
              </a>
            ) : (
              <>
                <span
                  aria-disabled="true"
                  className="edge-sketch inline-block cursor-not-allowed border-2 border-dashed border-ink/40 bg-cream px-5 py-2 font-bold text-muted-ink"
                >
                  Registration form opens soon
                </span>
                <span className="font-hand text-xl text-muted-ink">
                  (check back when school starts!)
                </span>
              </>
            )}
          </div>
        </SpotlightCard>

        <p aria-hidden="true" className="-rotate-2 text-center font-hand text-2xl text-muted-ink">
          then…
        </p>

        {/* step 2 */}
        <SpotlightCard data-studio-id="join.dues" className={stepCardCls}>
          <StepBadge n={2} />
          <h2 className="font-display text-2xl font-black text-tsa-blue">
            Pay your dues on Pay N&apos; Go
          </h2>
          <p className="mt-2 font-semibold leading-relaxed text-ink/85">
            Go to Katy ISD Pay N&apos; Go, log in, then follow this trail:
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-y-2 leading-none">
            {payNGoPath.map((step, i) => (
              <span key={step} className="inline-flex items-center">
                <span className="edge-paper-sm inline-block border-2 border-ink/30 bg-cream px-2.5 py-1.5 text-sm font-extrabold text-ink">
                  {step}
                </span>
                {i < payNGoPath.length - 1 && (
                  <IconArrowRight
                    className="mx-1.5 text-lg text-tsa-red"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </p>
          <a
            href={payNGo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-marker edge-sketch mt-5 inline-block bg-tsa-blue px-5 py-2 font-bold text-cream"
          >
            Open Katy ISD Pay N&apos; Go
            <IconExternal className="ml-2 inline-block align-[-2px]" aria-hidden="true" />
          </a>
        </SpotlightCard>

        <p aria-hidden="true" className="rotate-1 text-center font-hand text-2xl text-muted-ink">
          and finally…
        </p>

        {/* step 3 */}
        <SpotlightCard data-studio-id="join.socials" className={stepCardCls}>
          <StepBadge n={3} />
          <h2 id="remind" className="scroll-mt-28 font-display text-2xl font-black text-tsa-blue">
            Stay in the loop
          </h2>
          <p className="mt-2 font-semibold leading-relaxed text-ink/85">
            All our announcements go out on Remind and Discord, so join both!
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={remind}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-marker edge-sketch inline-flex items-center gap-2 bg-tsa-red px-5 py-2 font-bold text-white"
            >
              <IconRemind aria-hidden="true" /> Join Remind
            </a>
            <a
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-marker edge-sketch inline-flex items-center gap-2 bg-tsa-blue px-5 py-2 font-bold text-cream"
            >
              <IconDiscord aria-hidden="true" /> Join Discord
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-marker edge-sketch inline-flex items-center gap-2 bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] px-5 py-2 font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]"
            >
              <IconInstagram aria-hidden="true" /> Follow @slhs.tsa
            </a>
          </div>
        </SpotlightCard>
      </div>

      <p className="mt-12 text-center font-semibold text-muted-ink">
        Questions?{" "}
        <Link
          href="/contact"
          className="text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          Send us a message
        </Link>{" "}
        or ask any officer.
      </p>
    </div>
  );
}
