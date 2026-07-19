import type { Metadata } from "next";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import Link from "next/link";
import ParticleLogo from "@/components/ParticleLogo";
import PhotoStack from "@/components/PhotoStack";
import SocialTile from "@/components/SocialTile";
import { CoilDivider, DashWrap, JoinArrowLink, WonkyTitle } from "@/components/decor";
import {
  IconArrowRight,
  IconDiscord,
  IconExternal,
  IconInstagram,
  IconPin,
  IconRemind,
} from "@/components/icons";
import { achievements, seasonHighlights, site, stackCards, whatIsTsa } from "@/content/site";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({ pageKey: "home", route: "/", genericTitles: ["home"], useSiteDescription: true });
}

type HomeSections = {
  whatIsTsa?: unknown;
  stackCards?: unknown;
  achievements?: unknown;
  seasonHighlights?: unknown;
  socials?: unknown;
};

type PageProps = { searchParams: Promise<{ studio?: string; draft?: string }> };

function isDraftPreview(searchParams: { studio?: string; draft?: string }) {
  return searchParams.studio === "1" || searchParams.draft === "1";
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function safeExternalHref(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function validAchievements(value: unknown) {
  if (!Array.isArray(value)) return achievements;
  const items = value.flatMap((achievement) => {
    const item = asRecord(achievement);
    return typeof item?.stat === "string" && item.stat.trim() && typeof item.text === "string" && item.text.trim()
      ? [{ stat: item.stat.trim(), text: item.text.trim() }]
      : [];
  });
  return items.length === value.length ? items : achievements;
}

function validStackCards(value: unknown) {
  if (!Array.isArray(value)) return stackCards;
  const cards = value.flatMap((card) => {
    const item = asRecord(card);
    return typeof item?.label === "string" && item.label.trim() && typeof item.photo === "string" && item.photo.startsWith("/") && typeof item.alt === "string" && item.alt.trim()
      ? [{ label: item.label.trim(), photo: item.photo, alt: item.alt.trim(), stickers: Array.isArray(item.stickers) && item.stickers.every((sticker) => typeof sticker === "string") ? item.stickers : undefined }]
      : [];
  });
  return cards.length === value.length ? cards : stackCards;
}

function placements(value: unknown, fallback: readonly { place: string; event: string }[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.flatMap((placement) => {
    const item = asRecord(placement);
    return typeof item?.place === "string" && item.place.trim() && typeof item.event === "string" && item.event.trim()
      ? [{ place: item.place.trim(), event: item.event.trim() }]
      : [];
  });
  return items.length === value.length ? items : fallback;
}

export default async function HomePage({ searchParams }: PageProps) {
  const document = await getDocumentForRender({ draftPreview: isDraftPreview(await searchParams) });
  const sections = getPageSections<HomeSections>(document, "home");
  const siteInfo = asRecord(document.site) ?? {};
  const siteSocials = asRecord(siteInfo.socials) ?? {};
  const siteLinks = asRecord(siteInfo.links) ?? {};
  const studioSocials = asRecord(sections?.socials);
  const homeWhatIsTsa = typeof sections?.whatIsTsa === "string" ? sections.whatIsTsa : whatIsTsa;
  const homeStackCards = validStackCards(sections?.stackCards);
  const homeAchievements = validAchievements(sections?.achievements);
  const studioHighlights = asRecord(sections?.seasonHighlights);
  const nationals = asRecord(studioHighlights?.nationals);
  const state = asRecord(studioHighlights?.state);
  const homeHighlights = {
    season: text(studioHighlights?.season, seasonHighlights.season),
    nationals: {
      qualifiers: typeof nationals?.qualifiers === "number" && Number.isFinite(nationals.qualifiers) ? nationals.qualifiers : seasonHighlights.nationals.qualifiers,
      placements: placements(nationals?.placements, seasonHighlights.nationals.placements),
    },
    state: { placements: placements(state?.placements, seasonHighlights.state.placements) },
  };
  const siteName = text(siteInfo.name, site.name);
  const siteFullName = text(siteInfo.fullName, site.fullName);
  const siteUrl = safeExternalHref(siteInfo.url, site.url).replace(/\/$/, "");
  const siteSchool = text(siteInfo.school, site.school);
  const siteAddress = text(siteInfo.address, site.address);
  const siteDescription = text(siteInfo.metaDescription, "SLHS TSA is the Technology Student Association chapter at Seven Lakes High School in Katy, Texas.");
  const officialTsa = safeExternalHref(siteLinks.tsaOfficial, site.links.tsaOfficial);
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: siteName, alternateName: siteFullName, description: siteDescription, publisher: { "@id": `${siteUrl}/#organization` } },
      {
        "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteFullName, alternateName: siteName, url: siteUrl,
        logo: `${siteUrl}/logos/spartan-mark-512.png`, description: siteDescription,
        sameAs: [safeExternalHref(siteSocials.instagram, site.socials.instagram)],
        address: { "@type": "PostalAddress", streetAddress: siteAddress, addressCountry: "US" },
        parentOrganization: { "@type": "Organization", "@id": "https://tsaweb.org/#organization", name: "Technology Student Association", url: officialTsa },
      },
    ],
  };
  const socials = {
    instagram: safeExternalHref(studioSocials?.instagram, site.socials.instagram),
    discord: safeExternalHref(studioSocials?.discord, site.socials.discord),
    remind: safeExternalHref(studioSocials?.remind, site.socials.remind),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className="sr-only">
        {siteName}, {siteFullName}
      </h1>

      {/* ------------------------------- hero ------------------------------- */}
      <section
        data-studio-id="home.hero"
        aria-label="Welcome"
        className="edge-paper flex flex-col overflow-hidden border-[3px] border-ink/85 bg-cream shadow-lift lg:flex-row"
      >
        {/* Left: blue panel with the stacked photo cards */}
        <div className="pencil-blue relative order-2 p-6 pb-10 sm:p-8 lg:order-none lg:w-[46%]">
          <p className="-rotate-2 pb-4 font-hand text-2xl font-semibold text-ink/85">
            random pictures of us! ↓
          </p>
          <div data-studio-id="home.photoStack">
            <PhotoStack cards={homeStackCards} />
          </div>
        </div>

        <CoilDivider className="hidden bg-cream lg:block" />

        {/* Right: warm panel — what is TSA */}
        <div className="relative order-1 flex flex-1 flex-col bg-cream p-6 sm:p-10 lg:order-none lg:justify-center">
          <DashWrap>
            <WonkyTitle
              text="WHAT IS TSA?"
              outline
              logoWord="TSA"
              className="text-[1.9rem] leading-none sm:text-[2.5rem] lg:text-[2.1rem] xl:text-[2.5rem]"
            />
          </DashWrap>

          <p data-studio-id="home.whatIsTsa" className="mt-6 max-w-prose text-lg font-semibold leading-relaxed text-ink/90">
            {homeWhatIsTsa}
          </p>
          <p className="mt-2 text-[15px] font-semibold text-muted-ink">
            Curious about the national org?{" "}
            <a
              href={officialTsa}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
            >
              tsaweb.org
              <IconExternal className="ml-1 inline-block align-[-2px] text-sm" aria-label="(opens in a new tab)" />
            </a>
          </p>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-8">
            <div>
              <p className="-rotate-1 font-hand text-2xl font-semibold text-muted-ink">
                find us here ↓
              </p>
              <div className="mt-3 flex gap-5">
                <SocialTile
                  href={socials.instagram}
                  label="insta"
                  external
                  tilt={-2}
                >
                  <IconInstagram aria-hidden="true" />
                </SocialTile>
                <SocialTile
                  href={socials.discord}
                  label="Discord"
                  external
                  tilt={1.5}
                >
                  <IconDiscord aria-hidden="true" />
                </SocialTile>
                <SocialTile
                  href={socials.remind}
                  label="Remind"
                  external
                  tilt={-1}
                >
                  <IconRemind aria-hidden="true" />
                </SocialTile>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="rotate-1 pb-1 pr-9 font-hand text-xl font-semibold text-muted-ink">
                new here?
              </p>
              <JoinArrowLink />
            </div>
          </div>

          {/* the TSA logo, drawn in living dots */}
          <div className="mt-9 hidden w-64 self-center sm:block sm:w-72 lg:w-80">
            <ParticleLogo
              src="/logos/tsa-mark-particles.png"
              aspect={0.64}
              label="The TSA logo drawn in dots. Move your cursor through it or give it a tap."
            />
          </div>
        </div>
      </section>

      {/* ---------------------------- quick links ---------------------------- */}
      <section data-studio-id="home.highlights" aria-labelledby="quick-links-h" className="mt-16">
        <h2
          id="quick-links-h"
          className="squiggle-underline inline-block font-display text-3xl font-black"
        >
          Where to next?
        </h2>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* CEG — emphasized, per the planning doc */}
          <Link
            href="/ceg"
            className="edge-paper group relative block rotate-[-0.4deg] border-[3px] border-ink bg-tsa-blue p-6 text-cream shadow-paper transition hover:-translate-y-1 hover:shadow-lift sm:col-span-2"
          >
            <span
              aria-hidden="true"
              className="edge-sketch absolute -top-3.5 right-6 rotate-2 border-2 border-ink bg-spartan-orange px-3 py-0.5 font-hand text-lg font-bold text-ink shadow-[2px_2px_0_0_rgb(37_50_68_/_0.5)]"
            >
              under construction!
            </span>
            <p className="font-hand text-2xl text-cream/85">competing this year? start here</p>
            <p className="mt-1 font-display text-3xl font-black tracking-tight">
              CEG Navigation
              <IconArrowRight
                className="ml-2 inline-block align-[-3px] transition-transform group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </p>
            <p className="mt-3 max-w-lg font-semibold text-cream/90">
              Everything you need to compete, all in one place. Coming this August.
            </p>
          </Link>

          <Link
            href="/join"
            className="edge-paper group block rotate-[0.5deg] border-2 border-ink bg-card p-5 shadow-paper transition hover:-translate-y-1 hover:shadow-lift"
          >
            <p className="font-display text-xl font-black text-tsa-blue">
              How to Join
              <IconArrowRight
                className="ml-1.5 inline-block align-[-3px] text-base transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </p>
            <p className="mt-2 text-[15px] font-semibold text-muted-ink">
              Three easy steps: registration form, dues, Remind &amp; Discord.
            </p>
          </Link>

          <Link
            href="/ceg#museum"
            className="edge-paper group relative block rotate-[-0.6deg] border-2 border-ink bg-card p-5 shadow-paper transition hover:-translate-y-1 hover:shadow-lift"
          >
            <span
              aria-hidden="true"
              className="edge-sketch absolute -top-3 right-4 rotate-3 border-2 border-ink bg-spartan-orange px-2.5 py-0.5 font-hand text-sm font-bold text-ink shadow-[2px_2px_0_0_rgb(37_50_68_/_0.35)]"
            >
              soon!
            </span>
            <p className="font-display text-xl font-black text-tsa-blue">
              TSA Museum
              <IconArrowRight
                className="ml-1.5 inline-block align-[-3px] text-base transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </p>
            <p className="mt-2 text-[15px] font-semibold text-muted-ink">
              Old photos, trophies, and chapter memories.
            </p>
          </Link>

          <a
            href={officialTsa}
            target="_blank"
            rel="noopener noreferrer"
            className="edge-paper group block rotate-[0.4deg] border-2 border-ink bg-card p-5 shadow-paper transition hover:-translate-y-1 hover:shadow-lift"
          >
            <p className="font-display text-xl font-black text-tsa-blue">
              Official TSA
              <IconExternal
                className="ml-1.5 inline-block align-[-2px] text-base"
                aria-label="(opens in a new tab)"
              />
            </p>
            <p className="mt-2 text-[15px] font-semibold text-muted-ink">
              The national Technology Student Association.
            </p>
          </a>
        </div>
      </section>

      <section data-studio-id="home.achievements" aria-labelledby="achievements-h" className="mt-16">
        <h2 id="achievements-h" className="squiggle-underline inline-block font-display text-3xl font-black">A season to remember</h2>
        <div className="edge-paper mt-7 border-[3px] border-ink/85 bg-card p-6 shadow-paper sm:p-8">
          <ul className="grid gap-4 sm:grid-cols-2">
            {homeAchievements.map((achievement, index) => (
              <li key={`${achievement.stat}-${achievement.text}`} className="flex items-baseline gap-3">
                <span className={`font-display text-4xl font-black ${index % 2 ? "text-tsa-red" : "text-tsa-blue"}`}>{achievement.stat}</span>
                <span className="font-semibold text-ink/90">{achievement.text}</span>
              </li>
            ))}
          </ul>
          <div data-studio-id="home.seasonHighlights" className="mt-7 border-t-2 border-dashed border-ink/20 pt-5">
            <p className="font-hand text-2xl font-semibold text-tsa-blue">{homeHighlights.season} highlights</p>
            <p className="mt-2 font-semibold text-ink/90">{homeHighlights.nationals.qualifiers} national qualifiers · {homeHighlights.nationals.placements.map((item) => `${item.place} ${item.event}`).join(" · ")}</p>
            <p className="mt-2 text-sm font-semibold text-muted-ink">State: {homeHighlights.state.placements.map((item) => `${item.place} ${item.event}`).join(" · ")}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------ contact ------------------------------ */}
      <section data-studio-id="home.socials" aria-labelledby="contact-h" className="mt-16">
        <div className="edge-paper flex flex-wrap items-center gap-x-10 gap-y-3 border-[3px] border-ink/85 bg-tsa-blue px-6 py-5 text-cream shadow-paper">
          <h2 id="contact-h" className="-rotate-2 font-hand text-3xl font-bold">
            <Link href="/contact" className="underline-offset-4 hover:underline">
              Contact us!
            </Link>
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            Send us a message
            <IconArrowRight aria-hidden="true" className="text-lg" />
          </Link>
          <a
            href={socials.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            <IconDiscord aria-hidden="true" className="text-lg" />
            Discord
          </a>
          <a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            <IconInstagram aria-hidden="true" className="text-lg" />
            Instagram
          </a>
          <span className="inline-flex items-center gap-2 font-semibold text-cream/95">
            <IconPin aria-hidden="true" className="text-lg" />
            {siteSchool} · {siteAddress}
          </span>
        </div>
      </section>
    </div>
  );
}
