import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import StickerLogo from "@/components/StickerLogo";
import { DashWrap, JoinArrowLink, WonkyTitle } from "@/components/decor";
import { IconArrowRight } from "@/components/icons";
import { achievements, competing, meetings, officers } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are, what we've won, and who runs SLHS TSA.",
  ...pageSeo("/about"),
};

const POLAROID_TILTS = [
  "-rotate-2",
  "rotate-[1.5deg]",
  "rotate-2",
  "-rotate-1",
  "rotate-1",
  "-rotate-[1.5deg]",
];

export default function AboutPage() {
  const exec = officers.filter((o) => o.group === "exec");
  const directors = officers.filter((o) => o.group === "directors");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="sr-only">About SLHS TSA</h1>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ---------------------- leadership column ---------------------- */}
        <section aria-labelledby="leadership-h" className="min-w-0">
          <h2
            id="leadership-h"
            className="-rotate-1 font-hand text-3xl font-bold text-muted-ink"
          >
            the people running the show ↓
          </h2>

          <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-2">
            {exec.map((officer, i) => (
              <li key={officer.name} className={POLAROID_TILTS[i % POLAROID_TILTS.length]}>
                <Link
                  href="/officers"
                  className="group block border-2 border-ink/15 bg-white p-2 pb-1 shadow-paper transition hover:-translate-y-1 hover:rotate-0 hover:shadow-lift"
                >
                  <span className="relative block aspect-square overflow-hidden bg-cream">
                    <Image
                      src={officer.photo}
                      alt={officer.alt}
                      fill
                      sizes="(min-width: 640px) 12rem, 44vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="block py-1 text-center font-hand text-xl font-semibold text-ink">
                    {officer.role === "President" ? "★ President" : officer.role}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* directors, framed like the little group picture in the sketch */}
          <div className="edge-paper mt-7 rotate-[0.6deg] border-[3px] border-tsa-blue/80 bg-card p-4 shadow-paper">
            <p className="text-center font-hand text-2xl font-semibold text-ink">
              …and the UTE &amp; NQE directors
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2.5">
              {directors.map((officer) => (
                <li key={officer.name}>
                  <Link
                    href="/officers"
                    className="flex items-center gap-2 rounded-full border-2 border-ink/25 bg-cream py-1 pl-1 pr-3 text-sm font-bold transition hover:border-ink hover:bg-white"
                  >
                    <span className="relative block h-9 w-9 overflow-hidden rounded-full border border-ink/20">
                      <Image
                        src={officer.photo}
                        alt=""
                        fill
                        sizes="2.25rem"
                        className="object-cover"
                      />
                    </span>
                    {officer.name.split(" ")[0]}
                    <span className="font-hand text-base text-muted-ink">
                      {officer.shortRole}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 text-center">
            <Link
              href="/officers"
              className="btn-marker edge-sketch inline-block bg-tsa-blue px-6 py-2.5 font-display text-lg font-bold text-cream"
            >
              Meet the Officers
              <IconArrowRight className="ml-2 inline-block align-[-3px]" aria-hidden="true" />
            </Link>
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

          {/* achievements */}
          <div className="edge-paper relative mt-8 border-[3px] border-ink/85 bg-card p-6 shadow-paper sm:p-8">
            <span aria-hidden="true" className="tape -top-3 left-8 rotate-[-5deg]" />
            <span aria-hidden="true" className="tape -top-3 right-8 rotate-[4deg]" />

            <p className="-rotate-1 font-hand text-2xl font-semibold text-tsa-red">
              bragging about our achievements :)
            </p>

            {/* the numbers are getting a refresh, so they stay hazy for now */}
            <div className="relative mt-5">
              <ul className="select-none space-y-4 opacity-50 blur-[7px]" aria-hidden="true">
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
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-shimmer -rotate-2 font-hand text-4xl font-bold sm:text-5xl">
                  <span className="sr-only">our achievement numbers are </span>
                  updating soon…
                </p>
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

          <div className="mt-8 flex justify-end">
            <div className="flex flex-col items-center">
              <p className="rotate-1 pb-1 pr-9 font-hand text-xl font-semibold text-muted-ink">
                sound fun?
              </p>
              <JoinArrowLink />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
