import { DashWrap, WonkyTitle } from "@/components/decor";

/** Minimal cozy shell for pages that aren't built yet. */
export default function UnderConstruction({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
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
        <p className="mx-auto mt-3 max-w-sm px-6 font-semibold text-muted-ink">
          {message}
        </p>
      </div>
    </div>
  );
}
