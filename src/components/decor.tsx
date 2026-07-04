import Link from "next/link";

/**
 * Hand-lettered heading: each letter gets a tiny fixed tilt so the title
 * looks written, not typeset. Screen readers get the plain string.
 */
const ROTS = [-2.4, 1.8, -1.1, 2.3, -1.7, 1.3, -2.1, 2.0, -1.4, 1.6];
const DYS = [0, 1.5, -1, 0.5, -1.5, 1, -0.5, 1.5, -1, 0.5];

export function WonkyTitle({
  text,
  outline = false,
  className = "",
}: {
  text: string;
  outline?: boolean;
  className?: string;
}) {
  return (
    <span aria-label={text} role="heading" aria-level={2} className={className}>
      <span aria-hidden="true" className="inline-block whitespace-pre-wrap">
        {text.split("").map((ch, i) =>
          ch === " " ? (
            <span key={i} className="inline-block w-[0.45em]" />
          ) : (
            <span
              key={i}
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
          ),
        )}
      </span>
    </span>
  );
}

/** The chunky hand-drawn arrow from the sketch, pointing at /join. */
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
      className={`group relative inline-block transition-transform hover:-rotate-1 ${className}`}
    >
      <svg
        viewBox="0 0 150 66"
        className="h-auto w-40 drop-shadow-[3px_4px_0_rgb(37_50_68_/_0.22)] transition-transform group-hover:translate-x-1.5"
        aria-hidden="true"
      >
        <path
          d="M7 25.5 88 22.8l-2.6-13.6L143 32.6 87.4 58.4l2-13.9-81.6 2.2Z"
          fill="var(--color-tsa-blue)"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 font-hand text-[1.65rem] font-bold text-card">
        {label}
      </span>
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
