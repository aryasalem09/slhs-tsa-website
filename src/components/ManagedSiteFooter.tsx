import Image from "next/image";
import Link from "next/link";
import SpartanSurprise from "@/components/SpartanSurprise";
import { nav, moreNav, site } from "@/content/site";
import {
  IconDiscord,
  IconExternal,
  IconInstagram,
  IconMail,
  IconRemind,
} from "@/components/icons";

export default function ManagedSiteFooter() {
  const primary = nav;
  const secondary = moreNav;
  const footerLinks = [...primary, ...secondary].filter((item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index);
  const { name, fullName, school, address, email: contactEmail, socials, links } = site;
  const directions = links.mapsDirections;
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${school}, ${address}`)}&output=embed`;
  const { instagram, discord, remind } = socials;
  const official = links.tsaOfficial;

  return (
    <footer className="mt-20 border-t-[3px] border-tsa-blue/70 bg-cream">
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[minmax(17rem,1.4fr)_minmax(8rem,.75fr)_minmax(10.5rem,.95fr)_minmax(10rem,.9fr)] lg:px-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2.5 -rotate-1">
            <SpartanSurprise imageSize={36} />
            <span className="flex items-center gap-1.5">
              <span className="font-display text-xl font-black leading-none tracking-tight text-spartan-orange">SLHS</span>
              <Image src="/logos/tsa-mark.png" alt="TSA" width={42} height={27} className="h-[28px] w-auto" />
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-ink">{fullName}</p>
          <div className="mt-3 overflow-hidden rounded-lg border border-ink/15 bg-white shadow-sm">
            <iframe
              title={`Map of ${school}`}
              src={mapEmbedSrc}
              className="h-52 w-full border-0 sm:h-56"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex rounded-sm text-sm font-semibold text-muted-ink transition-colors hover:text-tsa-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tsa-blue">
            Get directions
            <span className="sr-only"> in Google Maps (opens in a new tab)</span>
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
      <div className="border-t-2 border-ink/10"><p className="mx-auto flex max-w-7xl items-center justify-center gap-1.5 px-4 py-4 text-center text-sm font-semibold text-muted-ink">Made with <span aria-hidden="true">❤️</span><span className="sr-only">love</span> by the SLHS TSA officer team.</p></div>
    </footer>
  );
}
