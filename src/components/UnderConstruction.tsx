import { DashWrap, WonkyTitle } from "@/components/decor";

/** Minimal cozy shell for pages that aren't built yet. */
export default function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 text-center">
      <DashWrap>
        <WonkyTitle text={title} outline className="text-[1.8rem] leading-none sm:text-[2.4rem]" />
      </DashWrap>

      <div className="edge-paper relative mx-auto mt-10 max-w-xl rotate-[-0.5deg] border-[3px] border-ink/85 bg-card pb-8 shadow-paper">
        <div
          aria-hidden="true"
          className="h-4 w-full rounded-t-[inherit] border-b-2 border-ink/70"
          style={{
            background:
              "repeating-linear-gradient(45deg, var(--color-spartan-orange) 0 14px, var(--color-ink) 14px 28px)",
          }}
        />
        <p className="mt-7 px-6 font-hand text-3xl font-bold text-ink">
          under construction right now!
        </p>

        {/* little construction crew doodles */}
        <svg
          aria-hidden="true"
          viewBox="0 0 64 60"
          className="absolute -bottom-7 -left-7 w-16 rotate-[-8deg] drop-shadow-[1px_2px_2px_rgb(37_50_68_/_0.25)]"
        >
          <path d="M32 6 L46 44 H18 z" fill="#f68428" stroke="#253244" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M25 25 h14 M22 34 h20" stroke="#f2e3c4" strokeWidth="5" />
          <path d="M32 6 L46 44 H18 z" fill="none" stroke="#253244" strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="8" y="44" width="48" height="8" rx="3" fill="#f68428" stroke="#253244" strokeWidth="2.4" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 64 64"
          className="absolute -right-6 -top-8 w-14 rotate-[10deg] drop-shadow-[1px_2px_2px_rgb(37_50_68_/_0.25)]"
        >
          <g transform="rotate(-32 32 32)">
            <rect x="28.5" y="24" width="7" height="32" rx="3" fill="#c99860" stroke="#253244" strokeWidth="2.4" />
            <rect x="14" y="10" width="36" height="14" rx="4" fill="#b9c4cf" stroke="#253244" strokeWidth="2.4" />
          </g>
          <path d="M50 50 l0 7 M46.5 53.5 l7 0" stroke="#253244" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
