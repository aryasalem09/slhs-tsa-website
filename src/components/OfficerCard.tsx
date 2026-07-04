import Image from "next/image";
import type { Officer } from "@/content/site";
import TiltedCard from "@/components/reactbits/TiltedCard";

/**
 * A polished, responsive rebuild of the "26-27 Officer Post" ID-card design:
 * cream badge, red script role, blue name, barcode, lanyard clip — plus a
 * gentle 3D tilt on pointer hover.
 */
export default function OfficerCard({
  officer,
  tilt = 0,
}: {
  officer: Officer;
  tilt?: number;
}) {
  return (
    <TiltedCard className="h-full" rotateAmplitude={9} scaleOnHover={1.045}>
      <article
        className="relative mx-auto mt-8 w-full max-w-[24rem]"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {/* lanyard strap + clip */}
        <svg
          aria-hidden="true"
          viewBox="0 0 44 60"
          className="absolute -top-9 left-1/2 h-14 w-auto -translate-x-1/2"
        >
          <rect x="17" y="0" width="10" height="26" rx="3" fill="var(--color-tsa-blue)" />
          <rect
            x="10"
            y="22"
            width="24"
            height="20"
            rx="5"
            fill="#f1e8d8"
            stroke="rgb(37 50 68 / 0.35)"
            strokeWidth="2"
          />
          <rect x="17" y="28" width="10" height="6" rx="2.5" fill="#b9a28e" />
        </svg>

        <div className="edge-paper-sm grid grid-cols-[42%_1fr] items-center gap-4 border-2 border-ink/25 bg-gradient-to-br from-[#fffdf4] to-[#f6ecd4] p-4 shadow-paper sm:p-5">
          <div className="-rotate-1 border-[5px] border-white bg-white shadow-[0_2px_8px_rgb(37_50_68_/_0.25)]">
            <div className="relative aspect-[4/5] overflow-hidden border border-tsa-red-deep/50">
              <Image
                src={officer.photo}
                alt={officer.alt}
                fill
                sizes="(min-width: 640px) 10rem, 38vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-display text-[1.6rem] font-semibold italic leading-[1.02] text-tsa-red">
              {officer.role}
            </p>
            <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-tsa-blue/80">
              Name:
            </p>
            <h3 className="text-lg font-extrabold uppercase leading-tight tracking-wide text-tsa-blue">
              {officer.name}
            </h3>
            <div className="barcode mt-3.5 h-8 w-full max-w-[9.5rem]" aria-hidden="true" />
          </div>
        </div>
      </article>
    </TiltedCard>
  );
}
