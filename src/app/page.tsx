import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
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
  IconMail,
  IconPin,
  IconRemind,
} from "@/components/icons";
import { site, stackCards, whatIsTsa } from "@/content/site";

export const metadata: Metadata = {
  ...pageSeo("/"),
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      alternateName: site.fullName,
      publisher: { "@id": `${site.url}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.fullName,
      alternateName: site.name,
      url: site.url,
      logo: `${site.url}/logos/spartan-mark-512.png`,
      email: site.email,
      sameAs: [site.socials.instagram],
      address: {
        "@type": "PostalAddress",
        streetAddress: "9251 S Fry Rd",
        addressLocality: "Katy",
        addressRegion: "TX",
        postalCode: "77494",
        addressCountry: "US",
      },
      parentOrganization: {
        "@type": "Organization",
        "@id": "https://tsaweb.org/#organization",
        name: "Technology Student Association",
        url: site.links.tsaOfficial,
      },
    },
  ],
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className="sr-only">
        SLHS TSA, the Seven Lakes High School Technology Student Association
      </h1>

      {/* ------------------------------- hero ------------------------------- */}
      <section
        aria-label="Welcome"
        className="edge-paper flex flex-col overflow-hidden border-[3px] border-ink/85 bg-cream shadow-lift lg:flex-row"
      >
        {/* Left: blue panel with the stacked photo cards */}
        <div className="pencil-blue relative order-2 p-6 pb-10 sm:p-8 lg:order-none lg:w-[46%]">
          <p className="-rotate-2 pb-4 font-hand text-2xl font-semibold text-ink/85">
            random pictures of us! ↓
          </p>
          <PhotoStack cards={stackCards} />
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

          <p className="mt-6 max-w-prose text-lg font-semibold leading-relaxed text-ink/90">
            {whatIsTsa}
          </p>
          <p className="mt-2 text-[15px] font-semibold text-muted-ink">
            Curious about the national org?{" "}
            <a
              href={site.links.tsaOfficial}
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
                  href={site.socials.instagram}
                  label="insta"
                  external
                  tilt={-2}
                >
                  <IconInstagram aria-hidden="true" />
                </SocialTile>
                <SocialTile
                  href={site.socials.discord}
                  label="Discord"
                  external
                  tilt={1.5}
                >
                  <IconDiscord aria-hidden="true" />
                </SocialTile>
                <SocialTile
                  href={site.socials.remind}
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
      <section aria-labelledby="quick-links-h" className="mt-16">
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
            href={site.links.tsaOfficial}
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

      {/* ------------------------------ contact ------------------------------ */}
      <section aria-labelledby="contact-h" className="mt-16">
        <div className="edge-paper flex flex-wrap items-center gap-x-10 gap-y-3 border-[3px] border-ink/85 bg-tsa-blue px-6 py-5 text-cream shadow-paper">
          <h2 id="contact-h" className="-rotate-2 font-hand text-3xl font-bold">
            <Link href="/contact" className="underline-offset-4 hover:underline">
              Contact us!
            </Link>
          </h2>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-w-0 max-w-full items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            <IconMail aria-hidden="true" className="shrink-0 text-lg" />
            <span className="min-w-0 break-all">{site.email}</span>
          </a>
          <a
            href={site.socials.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            <IconDiscord aria-hidden="true" className="text-lg" />
            Discord
          </a>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            <IconInstagram aria-hidden="true" className="text-lg" />
            Instagram
          </a>
          <span className="inline-flex items-center gap-2 font-semibold text-cream/95">
            <IconPin aria-hidden="true" className="text-lg" />
            {site.school} · {site.address}
          </span>
        </div>
      </section>
    </div>
  );
}
