"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { StackCard } from "@/content/site";
import Stickers from "@/components/Stickers";
import { IconArrowRight } from "@/components/icons";

const TILTS = ["-rotate-[3.5deg]", "rotate-[2.5deg]", "-rotate-[2.5deg]", "rotate-[3deg]"];
const TAB_TOPS = ["top-5", "top-9", "top-6", "top-10"];

/**
 * The stack of tilted paper photo cards from the planning sketch.
 * Hover straightens a card; click/tap brings it to the front.
 */
export default function PhotoStack({ cards }: { cards: StackCard[] }) {
  const [front, setFront] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center">
      {cards.map((card, i) => {
        const isFront = front === i;
        return (
          <button
            key={card.label}
            type="button"
            onClick={() => setFront(isFront ? null : i)}
            aria-pressed={isFront}
            aria-label={`${card.label} — bring photo to front`}
            className={`group relative w-[85%] max-w-[19.5rem] border-2 border-ink/85 bg-card p-2 pb-1.5 text-left shadow-paper transition-all duration-200 edge-paper-sm hover:z-20 hover:rotate-0 hover:shadow-lift ${TILTS[i % TILTS.length]} ${i === 0 ? "" : "-mt-8"} ${isFront ? "z-30 rotate-0 scale-[1.04] shadow-lift" : ""}`}
            style={{ zIndex: isFront ? 30 : i + 1 }}
          >
            <span
              aria-hidden="true"
              className={`edge-sketch absolute -right-3.5 ${TAB_TOPS[i % TAB_TOPS.length]} h-6 w-9 border-2 border-ink/70 bg-spartan-orange shadow-[2px_2px_0_0_rgb(37_50_68_/_0.35)]`}
            />
            <span className="relative block aspect-[5/3] w-full overflow-hidden rounded-[6px] border border-ink/20 bg-cream">
              <Image
                src={card.photo}
                alt={card.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 24rem, 88vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              <span className="edge-sketch absolute left-2 top-2 border border-ink/40 bg-cream/95 px-2.5 py-0.5 font-hand text-lg font-semibold leading-tight text-ink shadow-[1px_2px_3px_rgb(37_50_68_/_0.25)]">
                {card.label}
              </span>
            </span>
            {/* easter egg: stickers pop out when the card is brought to front */}
            {isFront && <Stickers names={card.stickers} size="sm" />}
          </button>
        );
      })}

      {/* The smaller bottom card, per the planning note — opens the full gallery. */}
      <Link
        href="/gallery"
        className="edge-paper-sm group relative z-10 -mt-6 block w-[62%] max-w-[15rem] rotate-[-2deg] border-2 border-ink/85 bg-card px-4 py-3 text-center shadow-paper transition hover:rotate-0 hover:shadow-lift"
      >
        <p className="font-display text-lg font-black uppercase tracking-wide text-tsa-blue">
          Our Gallery
          <IconArrowRight
            className="ml-1.5 inline-block align-[-3px] text-base transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </p>
        <p className="font-hand text-lg leading-tight text-muted-ink">
          Seven Lakes High School
        </p>
      </Link>
    </div>
  );
}
