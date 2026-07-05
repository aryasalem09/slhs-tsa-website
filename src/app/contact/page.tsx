import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { IconDiscord, IconInstagram, IconPin } from "@/components/icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SLHS TSA by email, Discord, or Instagram.",
  ...pageSeo("/contact"),
};

export default function ContactPage() {
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

      <div className="edge-paper relative mt-10 border-[3px] border-ink/85 bg-card p-6 shadow-paper sm:p-8">
        <span aria-hidden="true" className="tape -top-3 left-10 rotate-[-5deg]" />
        <span aria-hidden="true" className="tape -top-3 right-10 rotate-[4deg]" />
        <ContactForm />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] font-semibold text-muted-ink">
        <a
          href={site.socials.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          <IconDiscord aria-hidden="true" /> Faster answers on Discord
        </a>
        <a
          href={site.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          <IconInstagram aria-hidden="true" /> @slhs.tsa
        </a>
        <span className="inline-flex items-center gap-2">
          <IconPin aria-hidden="true" />
          {site.school} · {site.address}
        </span>
      </div>
    </div>
  );
}
