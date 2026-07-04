import Link from "next/link";
import SpartanSurprise from "@/components/SpartanSurprise";
import { nav, site } from "@/content/site";
import {
  IconDiscord,
  IconExternal,
  IconInstagram,
  IconMail,
  IconPin,
  IconRemind,
} from "@/components/icons";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t-[3px] border-tsa-blue/70 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 -rotate-1">
            {/* looks like a logo, is actually the easter egg */}
            <SpartanSurprise imageSize={36} />
            <span className="font-display text-xl font-black tracking-tight">
              <span className="text-spartan-orange">SLHS</span>{" "}
              <span className="text-tsa-blue">TSA</span>
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-ink">
            {site.fullName}
          </p>
          <p className="mt-3 flex items-start gap-2 text-sm text-muted-ink">
            <IconPin className="mt-0.5 shrink-0 text-base" aria-hidden="true" />
            <span>
              {site.school}
              <br />
              {site.address}
            </span>
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-hand text-2xl font-bold text-tsa-blue">Pages</h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-tsa-red hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/officers" className="hover:text-tsa-red hover:underline">
                Officers
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-tsa-red hover:underline">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/join" className="hover:text-tsa-red hover:underline">
                How to Join
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-hand text-2xl font-bold text-tsa-blue">Say hi</h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold">
            <li>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"
              >
                <IconInstagram aria-hidden="true" /> Instagram
              </a>
            </li>
            <li>
              <a
                href={site.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"
              >
                <IconDiscord aria-hidden="true" /> Discord
              </a>
            </li>
            <li>
              <a
                href={site.socials.remind}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"
              >
                <IconRemind aria-hidden="true" /> Remind
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 hover:text-tsa-red hover:underline"
              >
                <IconMail aria-hidden="true" className="shrink-0" /> Contact us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-hand text-2xl font-bold text-tsa-blue">TSA</h2>
          <ul className="mt-2 space-y-1.5 text-[15px] font-semibold">
            <li>
              <a
                href={site.links.tsaOfficial}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-tsa-red hover:underline"
              >
                Official TSA website <IconExternal aria-hidden="true" className="text-sm" />
              </a>
            </li>
            <li>
              <Link href="/about#competing" className="hover:text-tsa-red hover:underline">
                Competing 101
              </Link>
            </li>
            <li>
              <Link href="/ceg" className="hover:text-tsa-red hover:underline">
                CEG Navigation
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-ink/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-sm font-semibold text-muted-ink">
          Built with care by the SLHS TSA officer team. Go Spartans!
        </p>
      </div>
    </footer>
  );
}
