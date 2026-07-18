"use client";

import { useId, useRef, useState } from "react";

/**
 * Sixteen sparks on evenly-spaced angles, precomputed once so there's no
 * randomness (and no hydration mismatch). Colors cycle the TSA palette.
 */
const COLORS = ["var(--color-tsa-blue)", "var(--color-tsa-red)", "var(--color-spartan-orange)"];
const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 60 + (i % 3) * 14;
  return {
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist),
    color: COLORS[i % COLORS.length],
    spin: (i % 2 === 0 ? 1 : -1) * 220,
    star: i % 2 === 0,
  };
});

function Burst() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className={`spark-fly absolute left-1/2 top-1/2 block ${
            s.star ? "h-2.5 w-2.5" : "h-2 w-2 rounded-full"
          }`}
          style={{
            backgroundColor: s.color,
            clipPath: s.star
              ? "polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%)"
              : undefined,
            ["--dx" as string]: `${s.dx}px`,
            ["--dy" as string]: `${s.dy}px`,
            ["--spin" as string]: `${s.spin}deg`,
          }}
        />
      ))}
      <span
        className="kaboom-word absolute left-1/2 top-1/2 whitespace-nowrap font-display text-2xl font-black italic text-tsa-red sm:text-3xl"
        style={{ WebkitTextStroke: "1.5px var(--color-ink)" }}
      >
        KABOOM!
      </span>
    </span>
  );
}

/**
 * A floating "take inspiration, don't copy!" reminder. It bobs gently, and a
 * click sets off a comic spark burst while toggling the full plagiarism note.
 * On desktop the note also appears on hover.
 */
export default function InspirationBubble({ className = "" }: { className?: string }) {
  const noteId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [bursts, setBursts] = useState<number[]>([]);
  const show = open || hovered || focused;

  function boom() {
    setOpen((o) => !o);
    const id = bursts.length ? bursts[bursts.length - 1] + 1 : 1;
    setBursts((b) => [...b, id]);
    window.setTimeout(() => {
      setBursts((b) => b.filter((x) => x !== id));
    }, 750);
  }

  return (
    <div className={`group flex w-fit flex-col items-center ${className}`}>
      <div
        className="animate-float-bob pb-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setOpen(false);
          setFocused(false);
          buttonRef.current?.blur();
        }}
      >
        <div className="relative w-fit">
          <button
            ref={buttonRef}
            type="button"
            onClick={boom}
            onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
            onBlur={() => {
              setFocused(false);
              setOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                buttonRef.current?.blur();
              }
            }}
            aria-controls={noteId}
            aria-expanded={show}
            className="relative -rotate-2 rounded-[1.6rem] border-2 border-ink bg-[#fff7df] px-4 py-2 font-hand text-lg font-bold text-ink shadow-paper transition-transform duration-150 hover:-rotate-1 hover:scale-[1.06] active:scale-95"
          >
            Take <span className="text-tsa-red">inspiration</span>, don&apos;t copy!
            {bursts.map((id) => (
              <Burst key={id} />
            ))}
          </button>

          {/* the little trailing thought-bubble dots */}
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-8 h-2.5 w-2.5 rounded-full border-2 border-ink bg-[#fff7df]"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-3.5 left-5 h-1.5 w-1.5 rounded-full border-2 border-ink bg-[#fff7df]"
          />
        </div>
      </div>

      {/* full note: on hover (desktop) or after a tap (open) */}
      {show && (
        <div
          id={noteId}
          role="note"
          className="inspiration-note edge-paper relative w-[17rem] -rotate-1 border-2 border-ink/80 bg-[#fff0a8] px-5 pb-4 pt-5 text-left text-sm text-ink shadow-lift"
        >
          <span aria-hidden="true" className="tape -top-3 left-1/2 h-5 w-20 -translate-x-1/2 rotate-2" />
          <p className="font-display text-base font-black text-tsa-blue-deep">
            Make it yours! <span aria-hidden="true">✦</span>
          </p>
          <p className="mt-1 font-semibold leading-snug">
            Use these past projects to get inspired, then make your project completely your own.
          </p>
          <p className="mt-2 border-t border-dashed border-ink/30 pt-2 font-bold text-tsa-red-deep">
            If you copy someone else&apos;s work, your entry could be disqualified.
          </p>
        </div>
      )}
    </div>
  );
}
