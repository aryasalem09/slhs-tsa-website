import type { Metadata } from "next";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import Link from "next/link";
import OfficerCard from "@/components/OfficerCard";
import { DashWrap, JoinArrowLink, WonkyTitle } from "@/components/decor";
import { IconArrowRight } from "@/components/icons";
import { officers, type Officer } from "@/content/site";
import { officerAnchorId } from "@/lib/officerAnchors";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";
import { isSafeImageSrc } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({
    pageKey: "officers",
    route: "/officers",
    fallbackTitle: "Officers",
    fallbackDescription: "Meet the 2026-27 student officers and directors leading the Seven Lakes High School Technology Student Association in Katy, Texas.",
  });
}

const TILTS = [-1.2, 0.9, -0.8, 1.1, -1, 0.8];

type SearchParams = Promise<{ studio?: string; draft?: string }>;

function isOfficer(value: unknown): value is Officer {
  return Boolean(
    value && typeof value === "object" &&
    typeof (value as Officer).name === "string" && (value as Officer).name.trim() &&
    typeof (value as Officer).role === "string" && (value as Officer).role.trim() &&
    typeof (value as Officer).shortRole === "string" && (value as Officer).shortRole.trim() &&
    ((value as Officer).group === "exec" || (value as Officer).group === "directors") &&
    isSafeImageSrc((value as Officer).photo) &&
    typeof (value as Officer).alt === "string" && (value as Officer).alt.trim() &&
    ((value as Officer).grade === "" || ["Sophomore", "Junior", "Senior"].includes((value as Officer).grade)) &&
    Array.isArray((value as Officer).hobbies) && Array.isArray((value as Officer).favoriteArtists),
  );
}

export default async function OfficersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const document = await getDocumentForRender({ draftPreview: params.studio === "1" || params.draft === "1" });
  const sections = getPageSections<{ officers?: unknown }>(document, "officers");
  const visibleOfficers = Array.isArray(sections?.officers) && sections.officers.every(isOfficer)
    ? sections.officers
    : officers;
  const exec = visibleOfficers.filter((o) => o.group === "exec");
  const ute = visibleOfficers.filter((o) => o.shortRole === "UTE");
  const nqe = visibleOfficers.filter((o) => o.shortRole === "NQE");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="text-center" data-studio-id="officers.heading">
        <h1 className="sr-only">Meet the officers</h1>
        <DashWrap>
          <WonkyTitle
            text="MEET THE OFFICERS"
            outline
            className="text-[1.3rem] leading-none sm:text-[2.4rem]"
          />
        </DashWrap>
        <p className="mt-3 -rotate-1 font-hand text-xl font-semibold text-muted-ink">
          tap or click a card to flip it over!
        </p>
      </div>

      <section
        data-studio-id="officers.collection"
        aria-labelledby="exec-h"
        className="locker-wall edge-paper mt-10 border-[3px] border-ink/85 px-5 pb-10 pt-6 shadow-paper sm:px-8"
      >
        <h2 id="exec-h" className="-rotate-1 font-hand text-3xl font-bold text-tsa-blue">
          Executive board
        </h2>
        <ul className="mt-2 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {exec.map((officer, i) => (
            <li
              key={officer.name}
              id={officerAnchorId(officer)}
              data-studio-id={`officers.items.${officer.name}`}
              className="scroll-mt-28 rounded-xl transition-colors target:bg-tsa-blue/10 target:ring-4 target:ring-tsa-blue/50 target:ring-offset-4 target:ring-offset-cream"
            >
              <OfficerCard
                officer={officer}
                tilt={TILTS[i % TILTS.length]}
                preload={i < 3}
              />
            </li>
          ))}
        </ul>

        <h2 className="mt-14 rotate-1 font-hand text-3xl font-bold text-tsa-blue">
          UTE directors
        </h2>
        <ul className="mt-2 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {ute.map((officer, i) => (
            <li
              key={officer.name}
              id={officerAnchorId(officer)}
              data-studio-id={`officers.items.${officer.name}`}
              className="scroll-mt-28 rounded-xl transition-colors target:bg-tsa-blue/10 target:ring-4 target:ring-tsa-blue/50 target:ring-offset-4 target:ring-offset-cream"
            >
              <OfficerCard officer={officer} tilt={TILTS[(i + 3) % TILTS.length]} />
            </li>
          ))}
        </ul>

        <h2 className="mt-14 -rotate-1 font-hand text-3xl font-bold text-tsa-blue">
          NQE directors
        </h2>
        <ul className="mt-2 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {nqe.map((officer, i) => (
            <li
              key={officer.name}
              id={officerAnchorId(officer)}
              data-studio-id={`officers.items.${officer.name}`}
              className="scroll-mt-28 rounded-xl transition-colors target:bg-tsa-blue/10 target:ring-4 target:ring-tsa-blue/50 target:ring-offset-4 target:ring-offset-cream"
            >
              <OfficerCard officer={officer} tilt={TILTS[(i + 1) % TILTS.length]} />
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
          <p className="rotate-1 pb-1 pr-9 font-hand text-xl font-semibold text-muted-ink">
            wanna be on this wall someday?
          </p>
          <JoinArrowLink />
        </div>
      </div>
    </div>
  );
}
