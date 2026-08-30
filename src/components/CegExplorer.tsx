"use client";

import { useState } from "react";
import { WonkyTitle } from "@/components/decor";
import { IconArrowRight, IconExternal, IconSearch } from "@/components/icons";
import { site, type CegDeck } from "@/content/site";
import { toCanvaEmbedUrl } from "@/lib/canva";

function DeckButton({
  deck,
  selected,
  onSelect,
}: {
  deck: CegDeck;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`w-full rounded-xl px-3.5 py-2 text-left text-[15px] font-bold transition-colors ${
        selected
          ? "border-2 border-ink bg-white shadow-[2px_2px_0_0_rgb(37_50_68_/_0.85)]"
          : "border-2 border-transparent hover:bg-cream"
      }`}
    >
      {deck.name}
    </button>
  );
}

function DeckArrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous slideshow" : "Next slideshow"}
      className="grid h-11 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink bg-card text-xl text-ink shadow-[2px_2px_0_0_rgb(37_50_68_/_0.7)] transition hover:bg-cream disabled:cursor-default disabled:border-ink/20 disabled:text-ink/25 disabled:shadow-none sm:h-14 sm:w-11"
    >
      <IconArrowRight aria-hidden="true" className={dir === "prev" ? "rotate-180" : ""} />
    </button>
  );
}

export default function CegExplorer({
  master,
  events,
  museumFormUrl = site.links.museumFormShort,
}: {
  master: CegDeck;
  events: CegDeck[];
  museumFormUrl?: string;
}) {
  const decks = [master, ...events];
  const [selected, setSelected] = useState<CegDeck>(master);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? events.filter((e) => e.name.toLowerCase().includes(q))
    : events;
  const embedUrl = selected.canvaUrl ? toCanvaEmbedUrl(selected.canvaUrl) : null;

  const idx = decks.findIndex((d) => d.name === selected.name);
  const canPage = decks.length > 1;
  const page = (delta: number) =>
    setSelected(decks[(idx + delta + decks.length) % decks.length]);

  return (
    <>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <div className="edge-paper flex flex-col border-2 border-ink/85 bg-card p-4 shadow-paper">
            <p className="font-display text-lg font-black">Events overview</p>

            <label className="relative mt-2.5 block">
              <span className="sr-only">Search events</span>
              <IconSearch
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-ink"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search events…"
                className="w-full rounded-full border-2 border-ink/25 bg-paper py-1.5 pl-9 pr-3 text-sm font-semibold outline-none placeholder:text-muted-ink/90 focus:border-ink/60"
              />
            </label>

            <ul className="mt-3 space-y-1">
              <li>
                <DeckButton
                  deck={master}
                  selected={selected.name === master.name}
                  onSelect={() => setSelected(master)}
                />
              </li>

              <li aria-hidden="true" className="px-1 py-1.5">
                <div className="h-0.5 w-full rounded-full bg-ink/10" />
              </li>

              {events.length === 0 ? (
                <li className="edge-paper-sm border-2 border-dashed border-ink/20 bg-paper/60 px-3.5 py-3 font-hand text-lg font-semibold leading-snug text-muted-ink">
                  Event slides will appear here as the chapter guides are published.
                </li>
              ) : filtered.length === 0 ? (
                <li className="px-1.5 py-2 font-hand text-lg text-muted-ink">
                  no matches. try another name!
                </li>
              ) : (
                filtered.map((deck) => (
                  <li key={deck.name}>
                    <DeckButton
                      deck={deck}
                      selected={selected.name === deck.name}
                      onSelect={() => setSelected(deck)}
                    />
                  </li>
                ))
              )}
            </ul>

            <a
              href={museumFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-tsa-blue px-3.5 py-2.5 text-center font-display text-[15px] font-bold text-card shadow-[2px_2px_0_0_rgb(37_50_68_/_0.7)] transition hover:bg-tsa-blue/90"
            >
              Add your project
              <IconExternal aria-hidden="true" />
            </a>
          </div>
        </aside>

        <section aria-live="polite" className="min-w-0">
          <div key={selected.name} className="fade-in">
            <WonkyTitle
              text={selected.name.toUpperCase()}
              outline
              className="text-[1.6rem] leading-none sm:text-[2.1rem]"
            />

            <div className="mt-6 flex items-center gap-2 sm:gap-4">
              <DeckArrow dir="prev" onClick={() => page(-1)} disabled={!canPage} />

              <div className="edge-paper min-w-0 flex-1 overflow-hidden border-[3px] border-ink/85 bg-card shadow-paper">
                {embedUrl ? (
                  <div className="relative aspect-video w-full bg-paper">
                    <iframe
                      src={embedUrl}
                      title={`${selected.name} slideshow`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-paper/70 px-6 text-center">
                    <p className="font-hand text-2xl font-bold text-muted-ink sm:text-3xl">
                      slideshow…
                    </p>
                  </div>
                )}
              </div>

              <DeckArrow dir="next" onClick={() => page(1)} disabled={!canPage} />
            </div>
          </div>
        </section>
      </div>

    </>
  );
}
