import type { Metadata } from "next";
import Link from "next/link";
import OfficerCard from "@/components/OfficerCard";
import { DashWrap, JoinArrowLink, WonkyTitle } from "@/components/decor";
import { IconArrowRight } from "@/components/icons";
import { officers } from "@/content/site";

export const metadata: Metadata = {
  title: "Officers",
  description: "Meet the 2026–27 SLHS TSA officer team.",
};

const TILTS = [-1.2, 0.9, -0.8, 1.1, -1, 0.8];

export default function OfficersPage() {
  const exec = officers.filter((o) => o.group === "exec");
  const directors = officers.filter((o) => o.group === "directors");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="text-center">
        <h1 className="sr-only">Meet the officers</h1>
        <DashWrap>
          <WonkyTitle
            text="MEET THE OFFICERS"
            outline
            className="text-[1.7rem] leading-none sm:text-[2.4rem]"
          />
        </DashWrap>
        <p className="mt-4 font-hand text-2xl font-semibold text-muted-ink">
          the 26–27 crew, on their official badges
        </p>
      </div>

      <section
        aria-labelledby="exec-h"
        className="locker-wall edge-paper mt-10 border-[3px] border-ink/85 px-5 pb-10 pt-6 shadow-paper sm:px-8"
      >
        <h2 id="exec-h" className="-rotate-1 font-hand text-3xl font-bold text-tsa-blue">
          Executive board
        </h2>
        <ul className="mt-2 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {exec.map((officer, i) => (
            <li key={officer.name}>
              <OfficerCard officer={officer} tilt={TILTS[i % TILTS.length]} />
            </li>
          ))}
        </ul>

        <h2 className="mt-14 rotate-1 font-hand text-3xl font-bold text-tsa-blue">
          UTE &amp; NQE directors
        </h2>
        <ul className="mt-2 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {directors.map((officer, i) => (
            <li key={officer.name}>
              <OfficerCard officer={officer} tilt={TILTS[(i + 3) % TILTS.length]} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 font-bold text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          <IconArrowRight className="rotate-180" aria-hidden="true" />
          Back to About
        </Link>
        <div className="flex flex-col items-center">
          <p className="rotate-1 pb-1 font-hand text-xl font-semibold text-muted-ink">
            wanna be on this wall someday?
          </p>
          <JoinArrowLink />
        </div>
      </div>
    </div>
  );
}
