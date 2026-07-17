"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useId, useState } from "react";
import type { Officer } from "@/content/site";

/** The blue lanyard strap + clip that hangs above a badge. */
function Lanyard() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 44 60"
      className="absolute -top-9 left-1/2 z-10 h-14 w-auto -translate-x-1/2"
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

const cardFace =
  "edge-paper-sm absolute inset-0 [backface-visibility:hidden] border-2 border-ink/25 bg-gradient-to-br from-[#fffdf4] to-[#f6ecd4] shadow-paper";

const HOBBY_SLOTS: CSSProperties[] = [
  { left: "-18px", top: "17%", "--rot": "-11deg" } as CSSProperties,
  { right: "-18px", top: "29%", "--rot": "12deg" } as CSSProperties,
  { bottom: "-16px", left: "14%", "--rot": "8deg" } as CSSProperties,
  { bottom: "-18px", right: "13%", "--rot": "-9deg" } as CSSProperties,
  { right: "-19px", bottom: "18%", "--rot": "15deg" } as CSSProperties,
];

/** Playful, purely decorative hobby cues inspired by the gallery stickers. */
function HobbyDoodles({ emojis }: { emojis: string[] }) {
  if (emojis.length === 0) return null;

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 select-none">
      {emojis.slice(0, HOBBY_SLOTS.length).map((emoji, i) => (
        <span
          key={`${emoji}-${i}`}
          className="officer-hobby-sticker sticker-pop absolute grid h-10 w-10 place-items-center rounded-full border-2 border-ink/20 bg-card text-2xl shadow-paper sm:h-11 sm:w-11 sm:text-[1.65rem]"
          style={{ ...HOBBY_SLOTS[i], animationDelay: `${120 + i * 90}ms` }}
        >
          {emoji}
        </span>
      ))}
    </span>
  );
}

function GradeBurst({ grade }: { grade: Officer["grade"] }) {
  if (!grade) return null;

  return (
    <div className="grade-burst grid h-[4.25rem] w-[4.25rem] shrink-0 -rotate-6 place-items-center bg-spartan-orange px-1 text-center text-ink drop-shadow-[2px_3px_0_rgb(37_50_68_/_0.22)]">
      <span className="leading-none">
        <span className="block text-[8px] font-black uppercase tracking-[0.16em]">Grade</span>
        {grade === "Sophomore" ? (
          <span className="mt-0.5 block text-[10px] font-black uppercase leading-[0.8] tracking-[0.06em]">
            <span className="sr-only">Sophomore</span>
            <span aria-hidden="true" className="block">
              Sopho
            </span>
            <span aria-hidden="true" className="block">
              more
            </span>
          </span>
        ) : (
          <span className="mt-0.5 block text-[11px] font-black uppercase tracking-wide">
            {grade}
          </span>
        )}
      </span>
    </div>
  );
}

/** Front of the badge: photo, role, name, barcode — the ID-card look. */
function BadgeFront({ officer, hidden }: { officer: Officer; hidden: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className={`${cardFace} grid grid-cols-[42%_1fr] items-center gap-4 p-4 sm:p-5`}
    >
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
  );
}

/** Back of the badge: structured officer details (or a friendly placeholder). */
function BadgeBack({
  officer,
  hidden,
  id,
}: {
  officer: Officer;
  hidden: boolean;
  id: string;
}) {
  const hasDetails = Boolean(
    officer.grade || officer.hobbies.length || officer.favoriteArtists.length,
  );

  return (
    <div
      id={id}
      aria-hidden={hidden}
      className={`${cardFace} flex flex-col [transform:rotateY(180deg)] p-5 sm:p-6`}
    >
      <div className="flex min-h-0 gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl font-black leading-none text-tsa-blue sm:text-2xl">
            {officer.name}
          </p>
          <p className="mt-1 font-display text-base font-semibold italic text-tsa-red sm:text-lg">
            {officer.role}
          </p>
        </div>
        <GradeBurst grade={officer.grade} />
      </div>

      {hasDetails ? (
        <div className="mt-2 min-h-0 border-t-2 border-dashed border-tsa-red/35 pt-2 text-[12px] font-semibold leading-snug text-ink/90 sm:text-[13px]">
          {officer.hobbies.length > 0 && (
            <p>
              <span className="font-black uppercase tracking-wider text-tsa-blue">Hobbies: </span>
              {officer.hobbies.join(", ")}
            </p>
          )}
          {officer.favoriteArtists.length > 0 && (
            <p className={officer.hobbies.length > 0 ? "mt-1.5" : undefined}>
              <span className="font-black uppercase tracking-wider text-tsa-blue">
                Favorite artists:{" "}
              </span>
              {officer.favoriteArtists.join(", ")}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 font-hand text-xl font-semibold text-muted-ink">
          a little bio, coming soon!
        </p>
      )}

      <p className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-ink sm:text-xs">
        ← tap to flip back
      </p>
    </div>
  );
}

/**
 * The officer ID badge, rebuilt as a flip card: the front is the badge, and
 * clicking (or Enter/Space) flips it to a back face with the officer's bio.
 */
export default function OfficerCard({
  officer,
  tilt = 0,
}: {
  officer: Officer;
  tilt?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const backId = useId();

  return (
    <article
      className="relative mx-auto mt-8 w-full max-w-[24rem]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <Lanyard />
      <div className="relative [perspective:1400px]">
        <HobbyDoodles emojis={officer.hobbyEmojis} />
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          aria-pressed={flipped}
          aria-label={
            flipped
              ? `${officer.name}, ${officer.role}. Flip card back to the badge`
              : `${officer.name}, ${officer.role}. Flip card to read their bio`
          }
          aria-describedby={flipped ? backId : undefined}
          className="group block w-full rounded-[0.75rem] text-left transition-transform duration-200 hover:-translate-y-1"
        >
          {/* aspect box keeps front and back the same height while they stack;
              the faces must be DIRECT children of the preserve-3d layer or
              backface-visibility can't hide the reverse side */}
          <div className="relative aspect-[4/3] sm:aspect-[7/5]">
            <div
              className="absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]"
              style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              <BadgeFront officer={officer} hidden={flipped} />
              <BadgeBack officer={officer} hidden={!flipped} id={backId} />
            </div>
          </div>
        </button>
      </div>
    </article>
  );
}
