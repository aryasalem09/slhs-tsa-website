"use client";

import { useState } from "react";
import { IconExternal } from "@/components/icons";
import { toCanvaEmbedUrl } from "@/lib/canva";
import type { SlideDeck } from "@/content/site";

function DeckSelector({
  deck,
  selected,
  onSelect,
}: {
  deck: SlideDeck;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`edge-paper w-full border-2 p-4 text-left transition sm:p-5 ${
        selected
          ? "border-ink bg-tsa-blue text-card shadow-paper"
          : "border-ink/70 bg-card text-ink hover:-translate-y-0.5 hover:shadow-lift"
      }`}
    >
      <span className={`block font-hand text-lg font-bold ${selected ? "text-card" : "text-tsa-red"}`}>
        {deck.date}
      </span>
      <span className="mt-1 block font-display text-base font-black leading-snug">{deck.title}</span>
    </button>
  );
}

export default function MeetingSlides({ decks }: { decks: SlideDeck[] }) {
  const [selectedUrl, setSelectedUrl] = useState(decks[0]?.url ?? "");
  const selected = decks.find((deck) => deck.url === selectedUrl) ?? decks[0];
  const embedUrl = selected?.platform === "canva" ? toCanvaEmbedUrl(selected.url) : null;

  if (!selected) return null;

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <h2 className="sr-only">Choose a meeting</h2>
        <div className="edge-paper border-2 border-ink/80 bg-cream/50 p-3 shadow-paper">
          <p className="px-2 pb-2 font-hand text-xl font-bold text-ink">pick a meeting</p>
          <div className="max-h-[18rem] space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-10rem)]">
            {decks.map((deck) => (
              <DeckSelector
                key={deck.url}
                deck={deck}
                selected={deck.url === selected.url}
                onSelect={() => setSelectedUrl(deck.url)}
              />
            ))}
          </div>
        </div>
      </div>

      <article aria-live="polite" className="min-w-0">
        <div className="edge-paper border-[3px] border-ink/85 bg-card p-4 shadow-paper sm:p-6">
          <p className="font-hand text-lg font-bold text-tsa-red">{selected.date}</p>
          <h2 className="mt-1 font-display text-xl font-black text-tsa-blue sm:text-2xl">{selected.title}</h2>
          {embedUrl ? (
            <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-lg border-2 border-ink/25 bg-paper">
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={`${selected.title} presentation`}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            <div className="mt-5 flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-ink/30 bg-paper p-6 text-center font-semibold text-muted-ink">
              This presentation opens on {selected.platform === "google" ? "Google Slides" : "Canva"}.
            </div>
          )}
          <a
            href={selected.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-bold text-tsa-blue underline decoration-2 underline-offset-4 transition hover:text-tsa-red"
          >
            Open this presentation in {selected.platform === "canva" ? "Canva" : "Google Slides"}
            <IconExternal aria-hidden="true" />
          </a>
        </div>
      </article>
    </section>
  );
}
