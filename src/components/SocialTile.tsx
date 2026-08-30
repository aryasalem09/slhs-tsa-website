import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Square social button with a handwritten label tag beneath,
 * matching the little squares in the homepage sketch.
 */
export default function SocialTile({
  href,
  label,
  external = false,
  tilt = 0,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  tilt?: number;
  children: ReactNode;
}) {
  const inner = (
    <span
      className="flex flex-col items-center gap-1.5"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span className="edge-paper-sm flex h-20 w-20 items-center justify-center border-2 border-ink bg-tsa-blue text-[2.4rem] text-cream shadow-[3px_3px_0_0_rgb(37_50_68_/_0.85)] transition-transform group-hover:-translate-y-1 group-hover:rotate-2">
        {children}
      </span>
      <span className="edge-sketch border border-ink/30 bg-cream px-2.5 py-0.5 font-hand text-lg font-semibold leading-none text-ink">
        {label}
      </span>
    </span>
  );

  const cls = "group inline-block focus-visible:outline-dashed";

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} aria-label={label} className={cls}>
      {inner}
    </Link>
  );
}
