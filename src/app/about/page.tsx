import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import StickerLogo from "@/components/StickerLogo";
import { DashWrap, JoinArrowLink, WonkyTitle } from "@/components/decor";
import { IconArrowRight } from "@/components/icons";
import { achievements, competing, meetings, officers, seasonHighlights } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are, our achievements, and our officers!",
  ...pageSeo("/about"),
};

// A distinct sticker color per role, keyed by both full role and director shortRole.
const ROLE_TAB: Record<string, string> = {
  President: "bg-spartan-orange text-ink",
  "Vice President": "bg-tsa-blue text-cream",
  Secretary: "bg-tsa-red text-white",
  Treasurer: "bg-locker text-ink",
  Reporter: "bg-soft-blue-deep text-ink",
  UTE: "bg-tsa-blue-deep text-cream",
  NQE: "bg-tsa-red-deep text-white",
};
const DEFAULT_TAB = "bg-tsa-blue text-cream";

export default function AboutPage() {
  const exec = officers.filter((o) => o.group === "exec");
  const directors = officers.filter((o) => o.group === "directors");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="sr-only">About SLHS TSA</h1>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ---------------------- leadership column ---------------------- */}
        <section
          aria-labelledby="leadership-h"
          className="min-w-0 lg:sticky lg:top-24 lg:self-start"
        >
          <h2
            id="leadership-h"
            className="-rotate-1 font-hand text-3xl font-bold text-muted-ink"
          >
            the people running the show ↓
          </h2>

          {/* text roster — the photos & bios live on /officers */}
          <div className="edge-paper mt-5 border-[3px] border-ink/85 bg-card shadow-paper">
            <ul className="divide-y divide-dashed divide-ink/15">
              {exec.map((officer, i) => (
                <li key={officer.name}>
                  <Link
                    href="/officers"
                    className="group flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-cream/70"
                  >
                    <span className="min-w-0 font-display text-lg font-bold text-ink group-hover:text-tsa-blue">
                      {officer.name}
                    </span>
                    <span
                      className={`edge-sketch shrink-0 whitespace-nowrap border-2 border-ink px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wide shadow-[1.5px_1.5px_0_0_rgb(37_50_68_/_0.5)] ${
                        ROLE_TAB[officer.role] ?? DEFAULT_TAB
                      } ${i % 2 === 0 ? "-rotate-2" : "rotate-2"}`}
                    >
                      {officer.role === "President" ? "★ President" : officer.role}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="border-y-2 border-dashed border-ink/25 bg-cream/50 px-5 py-2 text-center font-hand text-xl font-semibold text-muted-ink">
              …and the UTE &amp; NQE directors
            </p>

            <ul className="divide-y divide-dashed divide-ink/15">
              {directors.map((officer, i) => (
                <li key={officer.name}>
                  <Link
                    href="/officers"
                    className="group flex items-center justify-between gap-3 px-5 py-2.5 transition hover:bg-cream/70"
                  >
                    <span className="min-w-0 font-display text-base font-bold text-ink group-hover:text-tsa-blue">
                      {officer.name}
                    </span>
                    <span
                      className={`edge-sketch shrink-0 whitespace-nowrap border-2 border-ink px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide shadow-[1.5px_1.5px_0_0_rgb(37_50_68_/_0.5)] ${
                        ROLE_TAB[officer.shortRole] ?? DEFAULT_TAB
                      } ${i % 2 === 0 ? "-rotate-2" : "rotate-2"}`}
                    >
                      {officer.shortRole}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/officers"
              className="btn-marker edge-sketch inline-block bg-tsa-blue px-6 py-2.5 font-display text-lg font-bold text-cream"
            >
              Meet the Officers
              <IconArrowRight className="ml-2 inline-block align-[-3px]" aria-hidden="true" />
            </Link>
            <p className="mt-2 font-hand text-lg text-muted-ink">
              see everyone with their photos →
            </p>
          </div>
        </section>

        {/* ------------------------ brag column ------------------------ */}
        <section aria-labelledby="about-title" className="min-w-0">
          <div className="text-center">
            <DashWrap>
              <WonkyTitle
                text="SLHS TSA"
                outline
                logoWord="TSA"
                className="text-[2rem] leading-none sm:text-[2.6rem]"
              />
            </DashWrap>
          </div>
          <p id="about-title" className="sr-only">
            About the chapter
          </p>

          <p className="mt-6 text-lg font-semibold leading-relaxed text-ink/90">
            We&apos;re the Technology Student Association chapter at Seven Lakes, a
            STEM club where students design, build, code, and compete. We focus on
            helping our members work on projects to submit at our Regional, State,
            and National conferences. Officers and experienced members play a key
            role in helping new members learn how to successfully prepare entries
            and place well in their competitive events.
          </p>

          {/* achievements */}
          <div className="edge-paper relative mt-8 border-[3px] border-ink/85 bg-card p-6 shadow-paper sm:p-8">
            <span aria-hidden="true" className="tape -top-3 left-8 rotate-[-5deg]" />
            <span aria-hidden="true" className="tape -top-3 right-8 rotate-[4deg]" />

            <p className="-rotate-1 font-hand text-2xl font-semibold text-tsa-red">
              bragging about our achievements :)
            </p>

            <ul className="mt-5 space-y-4">
              {achievements.map((a, i) => (
                <li key={a.text} className="flex items-baseline gap-4">
                  <span
                    className={`w-20 shrink-0 text-right font-display text-4xl font-black ${
                      i % 2 === 0 ? "text-tsa-blue" : "text-tsa-red"
                    }`}
                  >
                    {a.stat}
                  </span>
                  <span className="text-[17px] font-semibold leading-snug text-ink/90">
                    {a.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* this past season's headline placements */}
            <div className="mt-7 border-t-2 border-dashed border-ink/20 pt-5">
              <p className="-rotate-1 font-hand text-2xl font-semibold text-tsa-blue">
                this past season ({seasonHighlights.season})
              </p>

              <div className="mt-3 space-y-3">
                {/* Nationals */}
                <div className="edge-paper-sm border-2 border-ink/15 bg-cream p-4">
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-lg font-black text-ink">Nationals</span>
                    <span className="font-hand text-base font-semibold text-muted-ink">
                      {seasonHighlights.nationals.qualifiers} national qualifiers
                    </span>
                  </p>
                  <ul className="mt-2 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
                    {seasonHighlights.nationals.placements.map((p) => (
                      <li
                        key={p.event}
                        className="flex items-baseline gap-2 text-[15px] font-semibold text-ink/90"
                      >
                        <span className="w-9 shrink-0 font-display font-black text-tsa-red">
                          {p.place}
                        </span>
                        <span>{p.event}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* State */}
                <div className="edge-paper-sm border-2 border-ink/15 bg-cream p-4">
                  <p className="font-display text-lg font-black text-ink">State</p>
                  <ul className="mt-2 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
                    {seasonHighlights.state.placements.map((p) => (
                      <li
                        key={p.event}
                        className="flex items-baseline gap-2 text-[15px] font-semibold text-ink/90"
                      >
                        <span className="w-9 shrink-0 font-display font-black text-tsa-blue">
                          {p.place}
                        </span>
                        <span>{p.event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <figure className="mx-auto mt-7 max-w-[22rem] rotate-[1.2deg] border-2 border-ink/15 bg-white p-2 pb-1 shadow-paper">
              <span className="relative block h-52 w-full overflow-hidden bg-cream sm:h-56">
                <Image
                  src="/gallery/nationals.webp"
                  alt="SLHS TSA national qualifiers in blue blazers at the national conference"
                  fill
                  sizes="(min-width: 640px) 22rem, 90vw"
                  className="object-cover"
                />
              </span>
              <figcaption className="py-1 text-center font-hand text-lg text-muted-ink">
                our national qualifiers at Nats 2026!
              </figcaption>
            </figure>
          </div>

          {/* meetings */}
          <div className="edge-paper mt-6 flex flex-wrap items-center justify-between gap-4 border-2 border-ink/80 bg-cream p-5">
            <div>
              <h2 className="font-display text-xl font-black text-tsa-blue">When we meet</h2>
              <p className="mt-1 max-w-md font-semibold text-ink/90">{meetings.blurb}</p>
            </div>
            <Link
              href="/calendar"
              className="btn-marker edge-sketch bg-card px-4 py-2 font-bold"
            >
              See the calendar
              <IconArrowRight className="ml-1.5 inline-block align-[-3px]" aria-hidden="true" />
            </Link>
          </div>

          {/* competing 101 */}
          <div
            id="competing"
            className="edge-paper relative mt-6 scroll-mt-24 border-2 border-ink/80 bg-card p-5 sm:p-6"
          >
            {/* Texas TSA runs our Regionals & State circuit — sticker of honor */}
            <StickerLogo
              src="/logos/texas-tsa.png"
              alt="Texas TSA logo"
              href="https://www.texastsa.org/"
              width={72}
              height={72}
              tilt={7}
              className="absolute -top-6 right-4"
            />
            <h2 className="font-display text-xl font-black text-tsa-blue">Competing 101</h2>
            <ul className="mt-3 space-y-2.5">
              {competing.points.map((p) => (
                <li key={p.title} className="text-[15px] leading-snug">
                  <span className="font-extrabold text-ink">{p.title}:</span>{" "}
                  <span className="font-semibold text-ink/85">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col items-center border-t-2 border-dashed border-ink/15 pt-8">
            <p className="rotate-1 pb-1 pr-9 font-hand text-2xl font-semibold text-muted-ink">
              sound fun?
            </p>
            <JoinArrowLink />
          </div>
        </section>
      </div>
    </div>
  );
}
