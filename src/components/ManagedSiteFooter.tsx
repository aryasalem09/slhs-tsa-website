"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SpartanSurprise from "@/components/SpartanSurprise";
import { nav, moreNav, site, type NavItem } from "@/content/site";
import type { StudioDocument } from "@/lib/studio/types";
import { isSafeInternalHref } from "@/lib/urls";
import {
  IconDiscord,
  IconExternal,
  IconInstagram,
  IconMail,
  IconPin,
  IconRemind,
} from "@/components/icons";

type SiteInfo = Record<string, unknown>;

function isNavItem(value: unknown): value is NavItem {
  return Boolean(value && typeof value === "object" && typeof (value as NavItem).label === "string" && isSafeInternalHref((value as NavItem).href));
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function email(value: unknown, fallback: string) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : fallback;
}

function externalUrl(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

export default function ManagedSiteFooter({ navigation, siteInfo }: {
  navigation?: { primary?: unknown[]; more?: unknown[] };
  siteInfo?: SiteInfo;
}) {
  const [draftDocument, setDraftDocument] = useState<StudioDocument | null>(null);

  useEffect(() => {
    const receiveDraft = (event: Event) => {
      const candidate = asRecord((event as CustomEvent<unknown>).detail);
      if (!candidate) return;
      setDraftDocument(candidate as StudioDocument);
    };
    window.addEventListener("studio:draft-document", receiveDraft);
    return () => window.removeEventListener("studio:draft-document", receiveDraft);
  }, []);

  const activeNavigation = draftDocument?.navigation ?? navigation;
  const activeSiteInfo = draftDocument?.site ?? siteInfo;
  const primary = Array.isArray(activeNavigation?.primary) && activeNavigation.primary.every(isNavItem) ? activeNavigation.primary : nav;
  const secondary = Array.isArray(activeNavigation?.more) && activeNavigation.more.every(isNavItem) ? activeNavigation.more : moreNav;
  const footerLinks = [...primary, ...secondary].filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index);
  const socials = asRecord(activeSiteInfo?.socials) ?? {};
  const links = asRecord(activeSiteInfo?.links) ?? {};
  const name = text(activeSiteInfo?.name, site.name);
  const fullName = text(activeSiteInfo?.fullName, site.fullName);
  const school = text(activeSiteInfo?.school, site.school);
  const address = text(activeSiteInfo?.address, site.address);
  const contactEmail = email(activeSiteInfo?.email, site.email);
  const directions = externalUrl(links.mapsDirections, site.links.mapsDirections);
  const instagram = externalUrl(socials.instagram, site.socials.instagram);
  const discord = externalUrl(socials.discord, site.socials.discord);
  const remind = externalUrl(socials.remind, site.socials.remind);
  const official = externalUrl(links.tsaOfficial, site.links.tsaOfficial);

  return (
    <footer data-studio-id="site.footer" className="mt-20 border-t-[3px] border-tsa-blue/70 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 -rotate-1">
            <SpartanSurprise imageSize={36} />
            <span className="flex items-center gap-1.5">
              <span className="font-display text-xl font-black leading-none tracking-tight text-spartan-orange">SLHS</span>
              <Image src="/logos/tsa-mark.png" alt="TSA" width={42} height={27} className="h-[28px] w-auto" />
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-ink">{fullName}</p>
          <a href={directions} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${school}, ${address}, in Google Maps (opens in a new tab)`} className="mt-3 flex w-fit items-start gap-2 rounded-sm text-sm text-muted-ink transition-colors hover:text-tsa-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tsa-blue">
            <IconPin className="mt-0.5 shrink-0 text-base" aria-hidden="true" />
            <span>{school}<br />{address}</span>
          </a>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-hand text-2xl font-bold text-tsa-blue">Pages</h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold">
            {footerLinks.map((item) => <li key={item.href}><Link href={item.href} className="hover:text-tsa-red hover:underline">{item.label}</Link></li>)}
            {!footerLinks.some((item) => item.href === "/officers") ? <li><Link href="/officers" className="hover:text-tsa-red hover:underline">Officers</Link></li> : null}
            {!footerLinks.some((item) => item.href === "/join") ? <li><Link href="/join" className="hover:text-tsa-red hover:underline">How to Join</Link></li> : null}
          </ul>
        </nav>

        <div>
          <h2 className="font-hand text-2xl font-bold text-tsa-blue">Say hi</h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold">
            <li><a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"><IconInstagram aria-hidden="true" /> Instagram</a></li>
            <li><a href={discord} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"><IconDiscord aria-hidden="true" /> Discord</a></li>
            <li><a href={remind} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"><IconRemind aria-hidden="true" /> Remind</a></li>
            <li><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"><IconMail aria-hidden="true" className="shrink-0" /> Email {name}</a></li>
          </ul>
        </div>

        <div>
          <h2 className="font-hand text-2xl font-bold text-tsa-blue">TSA</h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold">
            <li><a href={official} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-tsa-red hover:underline">Official TSA website <IconExternal aria-hidden="true" className="text-sm" /></a></li>
            <li><Link href="/about#competing" className="hover:text-tsa-red hover:underline">Competing 101</Link></li>
            <li><Link href="/ceg" className="hover:text-tsa-red hover:underline">CEG Navigation</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-ink/10"><p className="mx-auto max-w-6xl px-4 py-4 text-center text-sm font-semibold text-muted-ink">Made by the SLHS TSA officer team. Go Spartans!</p></div>
    </footer>
  );
}
