"use client";

import { useState } from "react";
import { WonkyTitle } from "@/components/decor";
import { IconArrowRight, IconExternal, IconSearch } from "@/components/icons";
import { site, type CegDeck } from "@/content/site";

/** Turn a Canva share link into its embeddable form. */
function toEmbedUrl(url: string) {
  const base = url.split("?")[0].replace(/\/$/, "");
  return `${base}${base.endsWith("/view") ? "" : "/view"}?embed`;
}

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

/** The ◄ / ► buttons flanking the slideshow, like the boxes in the sketch. */
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

/**
 * The combined CEG + Museum layout from the planning sketch: an events
 * sidebar (search + one entry per event, "add your project" at the bottom)
 * driving a main panel whose slideshow you page through with side arrows.
 */
export default function CegExplorer({
  master,
  events,
}: {
  master: CegDeck;
  events: CegDeck[];
}) {
  const decks = [master, ...events];
  const [selected, setSelected] = useState<CegDeck>(master);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? events.filter((e) => e.name.toLowerCase().includes(q))
    : events;
  const embedUrl = selected.canvaUrl ? toEmbedUrl(selected.canvaUrl) : null;

  const idx = decks.findIndex((d) => d.name === selected.name);
  const canPage = decks.length > 1;
  const page = (delta: number) =>
    setSelected(decks[(idx + delta + decks.length) % decks.length]);

  return (
    <>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start">
        {/* ------------------------- events sidebar ------------------------- */}
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
                <>
                  {[0, 1, 2].map((i) => (
                    <li
                      key={i}
                      aria-hidden="true"
                      className={`rounded-xl border-2 border-dashed border-ink/20 px-3.5 py-2 font-hand text-lg text-ink/25 ${
                        i === 1 ? "rotate-[0.6deg]" : "-rotate-[0.5deg]"
                      }`}
                    >
                      ???
                    </li>
                  ))}
                  <li className="px-1.5 pt-2 font-hand text-lg font-semibold leading-snug text-muted-ink">
                    will update when TSA releases the 26-27 events!
                  </li>
                </>
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

            {/* "Add Your Project" at the bottom of the sidebar, like the sketch */}
            <a
              href={site.links.museumFormShort}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-tsa-blue px-3.5 py-2.5 text-center font-display text-[15px] font-bold text-card shadow-[2px_2px_0_0_rgb(37_50_68_/_0.7)] transition hover:bg-tsa-blue/90"
            >
              Add your project
              <IconExternal aria-hidden="true" />
            </a>
          </div>
        </aside>

        {/* --------------------------- deck panel --------------------------- */}
        <section aria-live="polite" className="min-w-0">
          <div key={selected.name} className="fade-in">
            <WonkyTitle
              text={selected.name.toUpperCase()}
              outline
              className="text-[1.6rem] leading-none sm:text-[2.1rem]"
            />

            {/* slideshow flanked by prev/next arrows, per the sketch */}
            <div className="mt-6 flex items-center gap-2 sm:gap-4">
              <DeckArrow dir="prev" onClick={() => page(-1)} disabled={!canPage} />

              <div className="edge-paper min-w-0 flex-1 overflow-hidden border-[3px] border-ink/85 bg-card shadow-paper">
                {embedUrl ? (
                  <div className="relative aspect-video w-full bg-paper">
                    <iframe
                      src={embedUrl}
                      title={`${selected.name} slideshow`}
                      loading="lazy"
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

      {/* ------------------ the museum submit box, centered ------------------ */}
      <section
        id="museum"
        aria-label="TSA Museum submissions"
        className="mt-16 flex scroll-mt-24 justify-center"
      >
        <div className="edge-paper relative w-full max-w-xl rotate-[-0.3deg] border-2 border-ink/85 bg-card p-6 text-center shadow-paper sm:p-8">
          <span aria-hidden="true" className="tape -top-3 left-1/2 w-16 -translate-x-1/2 rotate-[-3deg]" />
          <p className="font-hand text-3xl font-bold text-ink">Add your project!</p>
          <p className="mx-auto mt-2 max-w-md font-semibold text-ink/80">
            Competed before? Add your work to the chapter archive and browse
            past submissions.
          </p>
          <a
            href={site.links.museumFormShort}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-marker edge-sketch mt-5 inline-flex items-center gap-2.5 bg-tsa-blue px-5 py-2.5 font-display text-base font-bold text-card"
          >
            Submit a project
            <IconExternal aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
