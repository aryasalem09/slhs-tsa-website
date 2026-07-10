"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Officer } from "@/content/site";
import TiltedCard from "@/components/reactbits/TiltedCard";
import { IconX } from "@/components/icons";
import { useOverlay } from "@/lib/useOverlay";

/** The blue lanyard strap + clip that hangs above a badge. */
function Lanyard({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 44 60"
      className={`absolute -top-9 left-1/2 h-14 w-auto -translate-x-1/2 ${className}`}
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
  );
}

/** The cream ID badge itself, in regular or blown-up size. */
function Badge({ officer, large = false }: { officer: Officer; large?: boolean }) {
  const NameTag = large ? "p" : "h3";
  return (
    <div
      className={`edge-paper-sm grid grid-cols-[42%_1fr] items-center border-2 border-ink/25 bg-gradient-to-br from-[#fffdf4] to-[#f6ecd4] shadow-paper ${
        large ? "gap-5 p-6 sm:gap-7 sm:p-8" : "gap-4 p-4 sm:p-5"
      }`}
    >
      <div className="-rotate-1 border-[5px] border-white bg-white shadow-[0_2px_8px_rgb(37_50_68_/_0.25)]">
        <div className="relative aspect-[4/5] overflow-hidden border border-tsa-red-deep/50">
          <Image
            src={officer.photo}
            alt={officer.alt}
            fill
            sizes={large ? "(min-width: 640px) 14rem, 38vw" : "(min-width: 640px) 10rem, 38vw"}
            className="object-cover"
          />
        </div>
      </div>

      <div className="min-w-0">
        <p
          className={`font-display font-semibold italic leading-[1.02] text-tsa-red ${
            large ? "text-[2.1rem] sm:text-[2.6rem]" : "text-[1.6rem]"
          }`}
        >
          {officer.role}
        </p>
        <p
          className={`font-extrabold uppercase tracking-[0.22em] text-tsa-blue/80 ${
            large ? "mt-4 text-xs" : "mt-3 text-[10px]"
          }`}
        >
          Name:
        </p>
        <NameTag
          className={`font-extrabold uppercase leading-tight tracking-wide text-tsa-blue ${
            large ? "text-xl sm:text-2xl" : "text-lg"
          }`}
        >
          {officer.name}
        </NameTag>
        <div
          className={`barcode w-full ${large ? "mt-5 h-10 max-w-[13rem]" : "mt-3.5 h-8 max-w-[9.5rem]"}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/**
 * A polished, responsive rebuild of the "26-27 Officer Post" ID-card design,
 * with a gentle 3D tilt on hover. Click a badge to expand it full-screen and
 * read the officer's bio (add the copy in `officer.bio` — see content/site.ts).
 */
export default function OfficerCard({
  officer,
  tilt = 0,
}: {
  officer: Officer;
  tilt?: number;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isTop = useOverlay(open, panelRef);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isTop()) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <TiltedCard className="h-full" rotateAmplitude={9} scaleOnHover={1.045}>
        <article
          className="relative mx-auto mt-8 w-full max-w-[24rem]"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          <Lanyard />
          <Badge officer={officer} />
          {/* stretched button: the whole badge opens the close-up */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`See ${officer.name}'s badge up close`}
            className="edge-paper-sm absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tsa-blue"
          />
        </article>
      </TiltedCard>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label={`${officer.name}, ${officer.role}`}
          >
            <div className="fade-in fixed inset-0 bg-ink/75" aria-hidden="true" />
            <div
              className="absolute inset-0 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
              }}
            >
              <div
                className="flex min-h-full items-center justify-center p-4 sm:p-8"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setOpen(false);
                }}
              >
                <div
                  ref={panelRef}
                  tabIndex={-1}
                  className="officer-pop relative w-full max-w-xl rotate-[-0.6deg] outline-none"
                >
                  <Lanyard className="!-top-11 h-16" />
                  <Badge officer={officer} large />

                  {/* Officer bio — blank for now. Add the text in officer.bio (content/site.ts). */}
                  <div className="edge-paper-sm mt-3 min-h-[5.5rem] rotate-[0.5deg] border-2 border-ink/25 bg-[#fffdf4] p-5 shadow-paper sm:mt-4 sm:min-h-[6.5rem] sm:p-6">
                    {officer.bio ? (
                      <p className="font-hand text-xl leading-snug text-ink/85 sm:text-2xl">
                        {officer.bio}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    data-autofocus
                    className="absolute -right-3 -top-3 rounded-full border-2 border-ink bg-tsa-red p-2 text-lg text-white shadow-paper transition hover:rotate-90"
                  >
                    <IconX aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
