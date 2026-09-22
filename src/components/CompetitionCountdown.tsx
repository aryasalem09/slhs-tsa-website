"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { competitionDates } from "@/content/competitions";
import { getCountdown } from "@/lib/countdown";

export default function CompetitionCountdown() {
  // Identical server and initial client output avoids clock hydration mismatches.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const firstTick = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section aria-label="Competition countdowns" className="my-12">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl font-black">Next stop: competition!</h2>
        <Link href="/calendar" className="font-hand text-xl font-bold text-tsa-blue underline underline-offset-4">mark your calendar ↗</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {competitionDates.map((event, index) => {
          const remaining = now === null ? null : getCountdown(event.start, event.end, now);
          const status = remaining?.status;
          const blue = index === 0;
          return (
            <article key={event.id} className={`edge-paper relative border-[3px] border-ink/85 p-4 shadow-paper sm:p-7 ${blue ? "bg-soft-blue/25" : "bg-spartan-orange/15"}`}>
              <span aria-hidden="true" className="tape -top-3 left-8 rotate-[-5deg]" />
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-black">{event.name}</h3>
                <span aria-hidden="true" className="text-3xl motion-safe:transition-transform motion-safe:hover:rotate-12">{blue ? "🚀" : "🏆"}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-muted-ink">{event.dateLabel}</p>
              {status === "live" || status === "complete" ? (
                <p role="status" className="my-6 font-hand text-3xl font-bold text-tsa-blue">
                  {status === "live" ? "It's go time. Let's go, Spartans!" : "That's a wrap. Way to go, Spartans!"}
                </p>
              ) : (
                <div role="timer" aria-label={`Time until ${event.name}`} className="mt-5 grid grid-cols-5 gap-1.5 sm:gap-2">
                  {(["months", "days", "hours", "minutes", "seconds"] as const).map((unit) => (
                    <div key={unit} className="rounded-lg border-2 border-ink/20 bg-card px-1 py-3 text-center shadow-sm">
                      <span className="block font-display text-xl font-black tabular-nums min-[380px]:text-2xl sm:text-3xl">{remaining ? String(remaining[unit]).padStart(2, "0") : "—"}</span>
                      <span className="mt-1 block text-[9px] font-extrabold uppercase sm:text-[10px] lg:text-xs"><span aria-hidden="true">{{ months: "mos", days: "days", hours: "hrs", minutes: "min", seconds: "sec" }[unit]}</span><span className="sr-only">{unit}</span></span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
