import type { Metadata } from "next";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import ContactForm from "@/components/ContactForm";
import SchoolMap from "@/components/SchoolMap";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { IconDiscord, IconInstagram, IconPin } from "@/components/icons";
import { site } from "@/content/site";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({
    pageKey: "contact",
    route: "/contact",
    fallbackTitle: "Contact Us",
    fallbackDescription: "Have a question about SLHS TSA? Reach us by email, Discord, or Instagram and we'll get back to you.",
  });
}

type ContactSections = { email?: unknown; address?: unknown; socials?: unknown; directions?: unknown };
type PageProps = { searchParams: Promise<{ studio?: string; draft?: string }> };

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
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

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function ContactPage({ searchParams }: PageProps) {
  const preview = await searchParams;
  const document = await getDocumentForRender({ draftPreview: preview.studio === "1" || preview.draft === "1" });
  const sections = getPageSections<ContactSections>(document, "contact");
  const socials = asRecord(sections?.socials);
  const email = isEmail(sections?.email) ? sections.email : site.email;
  const address = typeof sections?.address === "string" ? sections.address : site.address;
  const discord = safeExternalHref(socials?.discord, site.socials.discord);
  const instagram = safeExternalHref(socials?.instagram, site.socials.instagram);
  const directions = safeExternalHref(sections?.directions, site.links.mapsDirections);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <div className="text-center">
        <h1 className="sr-only">Contact us</h1>
        <DashWrap>
          <WonkyTitle
            text="CONTACT US"
            outline
            className="text-[1.9rem] leading-none sm:text-[2.5rem]"
          />
        </DashWrap>
        <p className="mx-auto mt-4 max-w-md font-hand text-2xl font-semibold leading-snug text-muted-ink">
          questions, ideas, or just want to say hi? drop us a note
        </p>
      </div>

      <div data-studio-id="contact.form" className="edge-paper relative mt-10 border-[3px] border-ink/85 bg-card p-6 shadow-paper sm:p-8">
        <span aria-hidden="true" className="tape -top-3 left-10 rotate-[-5deg]" />
        <span aria-hidden="true" className="tape -top-3 right-10 rotate-[4deg]" />
        <ContactForm email={email} />
      </div>

      <div
        data-studio-id="contact.details"
        data-studio-email={email}
        data-studio-directions={directions}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] font-semibold text-muted-ink"
      >
        <a
          href={discord}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          <IconDiscord aria-hidden="true" /> Faster answers on Discord
        </a>
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          <IconInstagram aria-hidden="true" /> @slhs.tsa
        </a>
        <span className="inline-flex items-center gap-2">
          <IconPin aria-hidden="true" />
          {site.school} · {address}
        </span>
      </div>

      <SchoolMap directionsHref={directions} />
    </div>
  );
}
