import Link from "next/link";
import ParticleLogo from "@/components/ParticleLogo";
import { WonkyTitle } from "@/components/decor";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-14 text-center">
      <WonkyTitle text="404" outline className="text-[3rem] leading-none" />
      <p className="mt-4 font-hand text-3xl font-bold text-muted-ink">
        this page scattered… the Spartan&apos;s fine though.
      </p>
      <ParticleLogo
        src="/logos/spartan-tsa-colors.png"
        className="mt-6"
        label="Interactive Spartan logo made of dots"
      />
      <Link
        href="/"
        className="btn-marker edge-sketch mt-8 inline-block bg-tsa-blue px-6 py-2.5 font-display text-lg font-bold text-cream"
      >
        Take me home
      </Link>
    </div>
  );
}
