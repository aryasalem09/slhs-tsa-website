import Image from "next/image";
import Link from "next/link";

/**
 * Hand-lettered heading: each letter gets a tiny fixed tilt so the title
 * looks written, not typeset. Screen readers get the plain string.
 * Pass `logoWord` (e.g. "TSA") to swap that word for the real TSA mark.
 */
const ROTS = [-2.4, 1.8, -1.1, 2.3, -1.7, 1.3, -2.1, 2.0, -1.4, 1.6];
const DYS = [0, 1.5, -1, 0.5, -1.5, 1, -0.5, 1.5, -1, 0.5];

function WonkyChar({ ch, i, outline }: { ch: string; i: number; outline: boolean }) {
  if (ch === " ") return <span className="inline-block w-[0.45em]" />;
  return (
    <span
      className="inline-block font-display font-black"
      style={{
        transform: `rotate(${ROTS[i % ROTS.length]}deg) translateY(${DYS[i % DYS.length]}px)`,
        ...(outline
          ? {
              color: "var(--color-card)",
              WebkitTextStroke: "2px var(--color-tsa-blue)",
              textShadow: "3px 3px 0 rgb(37 50 68 / 0.14)",
            }
          : {}),
      }}
    >
      {ch}
    </span>
  );
}

export function WonkyTitle({
  text,
  outline = false,
  logoWord,
  className = "",
}: {
  text: string;
  outline?: boolean;
  logoWord?: string;
  className?: string;
}) {
  // Split the string around the logo word so it can be swapped for the mark.
  const segments = logoWord
    ? text.split(new RegExp(`(${logoWord})`, "g"))
    : [text];
  let key = 0;
  let charIdx = 0;

  return (
    <span aria-label={text} role="heading" aria-level={2} className={className}>
      <span aria-hidden="true" className="inline-block whitespace-pre-wrap">
        {segments.map((seg) => {
          if (logoWord && seg === logoWord) {
            return (
              <Image
                key={key++}
                src="/logos/tsa-mark.png"
                alt=""
                width={128}
                height={81}
                // sits on the title baseline, sized to the letters, matching tilt + shadow
                className="mx-[0.08em] inline-block h-[0.92em] w-auto -rotate-2 align-[-0.16em] drop-shadow-[3px_3px_0_rgb(37_50_68_/_0.14)]"
              />
            );
          }
          return seg
            .split("")
            .map((ch) => <WonkyChar key={key++} ch={ch} i={charIdx++} outline={outline} />);
        })}
      </span>
    </span>
  );
}

/**
 * The chunky hand-drawn arrow from the sketch, pointing at /join.
 * The label lives inside the SVG so it always sits centered in the shaft.
 */
export function JoinArrowLink({
  label = "Join!",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href="/join"
      aria-label="How to join SLHS TSA"
      className={`group inline-block transition-transform hover:-rotate-1 ${className}`}
    >
      <svg
        viewBox="0 0 150 70"
        className="h-auto w-44 drop-shadow-[3px_4px_0_rgb(37_50_68_/_0.22)] transition-transform group-hover:translate-x-1.5"
        aria-hidden="true"
      >
        <path
          d="M6 24.5 L86.5 23.6 L84.8 10.2 L144 35.2 L85.6 60.8 L87.2 47.2 L6.8 48.2 Z"
          fill="var(--color-tsa-blue)"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <text
          x="46"
          y="42"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="var(--color-card)"
          className="font-hand"
          transform="rotate(-1.2 46 36)"
        >
          {label}
        </text>
      </svg>
    </Link>
  );
}

/** Vertical loop-de-loop divider, straight off the sketch. Decorative only. */
export function CoilDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`w-[26px] shrink-0 self-stretch ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='44' viewBox='0 0 26 44'%3E%3Cpath d='M13 0c13 6.5 13 15.5 0 22-13 6.5-13 15.5 0 22' fill='none' stroke='%23005eab' stroke-width='2.4' stroke-linecap='round' opacity='0.55'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat-y",
        backgroundPosition: "center top",
      }}
    />
  );
}

/** Small dashed flourish around section titles, e.g. — WHAT IS TSA? — */
export function DashWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span aria-hidden="true" className="h-[3px] w-7 rounded-full bg-tsa-blue/70" />
      {children}
      <span aria-hidden="true" className="h-[3px] w-7 rounded-full bg-tsa-blue/70" />
    </span>
  );
}
