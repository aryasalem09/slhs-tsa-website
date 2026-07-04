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
            className={`wood-grain group relative w-[85%] max-w-[19.5rem] border-2 border-ink/85 p-2.5 text-left shadow-paper transition-all duration-200 edge-paper-sm hover:z-20 hover:rotate-0 hover:shadow-lift ${TILTS[i % TILTS.length]} ${i === 0 ? "" : "-mt-8"} ${isFront ? "z-30 rotate-0 scale-[1.04] shadow-lift" : ""}`}
            style={{ zIndex: isFront ? 30 : i + 1 }}
          >
            <span
              aria-hidden="true"
              className={`edge-sketch absolute -right-3.5 ${TAB_TOPS[i % TAB_TOPS.length]} h-6 w-9 border-2 border-ink/70 bg-spartan-orange shadow-[2px_2px_0_0_rgb(37_50_68_/_0.35)]`}
            />
            <span className="relative block aspect-[5/3] w-full overflow-hidden rounded-[4px] border-2 border-[#2e1c0b]/80 bg-cream shadow-[inset_0_1px_5px_rgb(20_12_4_/_0.55)]">
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

      {/* The hanging wooden gallery sign from the sketch — opens the full gallery. */}
      <div className="relative z-0 -mt-2 w-[85%] max-w-[19.5rem]">
        {/* ropes tucked under the card above, meeting the sign's screws */}
        <div
          aria-hidden="true"
          className="mx-auto flex w-[70%] max-w-[15rem] justify-between px-3.5"
        >
          <span className="h-8 w-1.5 rounded-b-sm bg-gradient-to-b from-[#5a3a1a] to-[#8a6134]" />
          <span className="h-8 w-1.5 rounded-b-sm bg-gradient-to-b from-[#5a3a1a] to-[#8a6134]" />
        </div>
        <Link
          href="/gallery"
          className="wood-grain edge-paper-sm group relative -mt-px mx-auto block w-[70%] max-w-[15rem] origin-top rotate-[-1.5deg] border-2 border-ink/85 px-4 py-3 text-center shadow-paper transition-transform duration-300 hover:rotate-[1.5deg] hover:shadow-lift"
        >
          {/* rope holes where the ropes attach */}
          <span aria-hidden="true" className="absolute left-4 top-1.5 h-1.5 w-1.5 rounded-full bg-[#241608] shadow-[0_1px_0_rgb(214_172_116_/_0.35)]" />
          <span aria-hidden="true" className="absolute right-4 top-1.5 h-1.5 w-1.5 rounded-full bg-[#241608] shadow-[0_1px_0_rgb(214_172_116_/_0.35)]" />
          {/* stacked "our / GALLERY" like the sketch, routed-lettering style */}
          <p className="leading-none text-[#f2e3c4] [text-shadow:0_1px_2px_rgb(20_12_4_/_0.75)]">
            <span className="block font-hand text-lg font-semibold lowercase leading-none">
              our
            </span>
            <span className="font-display text-lg font-black uppercase tracking-wide">
              Gallery
              <IconArrowRight
                className="ml-1.5 inline-block align-[-3px] text-base transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </p>
          <p className="mt-1.5 font-hand text-lg font-semibold leading-tight text-[#e3cda2]">
            Seven Lakes High School
          </p>
        </Link>
      </div>
    </div>
  );
}
