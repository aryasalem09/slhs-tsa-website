import type { Metadata } from "next";
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
  IconRemind,
} from "@/components/icons";
import { achievements, metaDescription, seasonHighlights, site, stackCards, whatIsTsa } from "@/content/site";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({ path: "/", description: metaDescription });
}

export default function HomePage() {
  const siteName = site.name;
  const siteFullName = site.fullName;
  const siteUrl = site.url.replace(/\/$/, "");
  const siteDescription = metaDescription;
  const officialTsa = site.links.tsaOfficial;
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: siteName, alternateName: siteFullName, description: siteDescription, publisher: { "@id": `${siteUrl}/#organization` } },
      {
        "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteFullName, alternateName: siteName, url: siteUrl,
        logo: `${siteUrl}/logos/spartan-mark-512.png`, description: siteDescription,
        sameAs: [site.socials.instagram],
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "9251 S Fry Rd",
          addressLocality: "Katy",
          addressRegion: "TX",
          postalCode: "77494",
          addressCountry: "US",
        },
        parentOrganization: { "@type": "Organization", "@id": "https://tsaweb.org/#organization", name: "Technology Student Association", url: officialTsa },
      },
    ],
  };
  const socials = site.socials;

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

      <section
        aria-label="Welcome"
        className="edge-paper flex flex-col overflow-hidden border-[3px] border-ink/85 bg-cream shadow-lift lg:flex-row"
      >
        <div className="pencil-blue relative order-2 p-6 pb-10 sm:p-8 lg:order-none lg:w-[46%]">
          <p className="-rotate-2 pb-4 font-hand text-2xl font-semibold text-ink/85">
            random pictures of us! ↓
          </p>
          <div>
            <PhotoStack cards={stackCards} />
          </div>
        </div>

        <CoilDivider className="hidden bg-cream lg:block" />

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

          <div className="mt-9 hidden w-64 self-center sm:block sm:w-72 lg:w-80">
            <ParticleLogo
              src="/logos/tsa-mark-particles.png"
              aspect={0.64}
              label="The TSA logo drawn in dots. Move your cursor through it or give it a tap."
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-links-h" className="mt-16">
        <h2
          id="quick-links-h"
          className="squiggle-underline inline-block font-display text-3xl font-black"
        >
          Where to next?
        </h2>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      <section aria-labelledby="achievements-h" className="mt-16">
        <h2 id="achievements-h" className="squiggle-underline inline-block font-display text-3xl font-black">A season to remember</h2>
        <div className="edge-paper mt-7 border-[3px] border-ink/85 bg-card p-6 shadow-paper sm:p-8">
          <ul className="grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement, index) => (
              <li key={`${achievement.stat}-${achievement.text}`} className="flex items-baseline gap-3">
                <span className={`font-display text-4xl font-black ${index % 2 ? "text-tsa-red" : "text-tsa-blue"}`}>{achievement.stat}</span>
                <span className="font-semibold text-ink/90">{achievement.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 border-t-2 border-dashed border-ink/20 pt-5">
            <p className="font-hand text-2xl font-semibold text-tsa-blue">{seasonHighlights.season} highlights</p>
            <p className="mt-2 font-semibold text-ink/90">{seasonHighlights.nationals.qualifiers} national qualifiers · {seasonHighlights.nationals.placements.map((item) => `${item.place} ${item.event}`).join(" · ")}</p>
            <p className="mt-2 text-sm font-semibold text-muted-ink">State: {seasonHighlights.state.placements.map((item) => `${item.place} ${item.event}`).join(" · ")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-h" className="mt-16">
        <div className="edge-paper border-[3px] border-ink/85 bg-tsa-blue px-5 py-6 text-cream shadow-paper sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 lg:flex-row lg:justify-center lg:gap-8">
            <h2 id="contact-h" className="-rotate-2 shrink-0 font-hand text-3xl font-bold lg:border-r-2 lg:border-cream/40 lg:pr-8">
              <Link href="/contact" className="underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
                Contact us!
              </Link>
            </h2>
            <nav aria-label="Contact and social links" className="grid w-full max-w-2xl gap-2 sm:grid-cols-3">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cream/35 bg-cream/10 px-4 py-2.5 font-semibold transition hover:bg-cream/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <IconMail aria-hidden="true" className="text-lg" />
                Send us a message
              </Link>
              <a
                href={socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cream/35 bg-cream/10 px-4 py-2.5 font-semibold transition hover:bg-cream/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <IconDiscord aria-hidden="true" className="text-lg" />
                Discord
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cream/35 bg-cream/10 px-4 py-2.5 font-semibold transition hover:bg-cream/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <IconInstagram aria-hidden="true" className="text-lg" />
                Instagram
              </a>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
