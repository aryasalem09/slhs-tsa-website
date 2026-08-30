"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { IconExternal, IconSearch } from "@/components/icons";
import {
  museumEvents,
  uteMuseumEvents,
  type MuseumEvent,
  type MuseumExample,
} from "@/content/museum";

type LinkValue =
  | string
  | {
      href?: string;
      url?: string;
      label?: string;
      title?: string;
    };

function eventMatchesQuery(event: MuseumEvent, query: string) {
  const terms = query.trim().toLocaleLowerCase();
  return !terms || [event.title, event.description, ...event.details].join(" ").toLocaleLowerCase().includes(terms);
}

function coalesceExamples(examples: MuseumExample[]) {
  const output: MuseumExample[] = [];
  const seenHrefs = new Set<string>();
  const contextualLabel = /\b(?:for|of|from|source for)\s+(?:the\s+)?above\b|above\^/i;

  for (const item of examples) {
    const links = item.links.filter((resource) => {
      if (seenHrefs.has(resource.href)) return false;
      seenHrefs.add(resource.href);
      return true;
    });
    if (links.length === 0 && !item.note) continue;

    if (contextualLabel.test(item.label) && output.length > 0) {
      const previous = output[output.length - 1];
      output[output.length - 1] = { ...previous, links: [...previous.links, ...links] };
      continue;
    }
    output.push({ ...item, links });
  }

  return output;
}

type CollectionId = "nqe" | "ute";

const museumCollections = [
  {
    id: "nqe" as const,
    shortLabel: "NQE",
    label: "National Qualifying Events",
    eventLabel: "NQE competitive event",
    examplesHeading: "Placed submissions",
    emptyExamples: "No placed submissions have been documented for this event yet.",
    events: museumEvents,
  },
  {
    id: "ute" as const,
    shortLabel: "UTE",
    label: "Unique to Texas Events",
    eventLabel: "UTE competitive event",
    examplesHeading: "Chapter examples",
    emptyExamples: "No privacy-safe chapter example is available for this event yet.",
    events: uteMuseumEvents,
  },
];

function readableLink(value: LinkValue, index: number) {
  if (typeof value === "string") {
    return { href: value, label: `Resource ${index + 1}` };
  }

  const href = value.href ?? value.url;
  return href
    ? { href, label: value.label ?? value.title ?? `Resource ${index + 1}` }
    : null;
}

function ArtifactLinks({ links }: { links: MuseumExample["links"] }) {
  const items = (links as LinkValue[])
    .map(readableLink)
    .filter((item): item is { href: string; label: string } => item !== null);

  if (!items.length) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Submission artifacts">
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="edge-paper-sm inline-flex items-center gap-1.5 border-2 border-ink/55 bg-card px-2.5 py-1 text-sm font-extrabold text-tsa-blue transition hover:-translate-y-0.5 hover:border-tsa-blue hover:bg-cream"
          >
            {item.label}
            <IconExternal aria-hidden="true" className="text-xs" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function EventButton({
  event,
  selected,
  onSelect,
}: {
  event: MuseumEvent;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`edge-paper-sm w-full border-2 px-3 py-2 text-left text-sm font-extrabold leading-snug transition-colors ${
        selected
          ? "border-ink bg-tsa-blue text-card shadow-[2px_2px_0_0_rgb(37_50_68_/_0.65)]"
          : "border-transparent text-ink hover:border-ink/25 hover:bg-cream"
      }`}
    >
      {event.title}
    </button>
  );
}

/** A searchable, evidence-led archive of SLHS TSA competitive event work. */
export default function MuseumArchive({ museumFormUrl }: { museumFormUrl: string }) {
  const [activeCollectionId, setActiveCollectionId] = useState<CollectionId>("nqe");
  const [query, setQuery] = useState("");
  const [selectedTitle, setSelectedTitle] = useState(() => museumEvents[0]?.title ?? "");

  const activeCollection =
    museumCollections.find((collection) => collection.id === activeCollectionId) ?? museumCollections[0];
  const activeEvents = activeCollection.events;

  const filteredEvents = useMemo(() => {
    return activeEvents.filter((event) => eventMatchesQuery(event, query));
  }, [activeEvents, query]);

  const selectedEvent =
    activeEvents.find((event) => event.title === selectedTitle) ?? activeEvents[0];
  const documentedSubmissions = coalesceExamples(selectedEvent?.examples ?? []);

  function selectCollection(collectionId: CollectionId) {
    const nextCollection =
      museumCollections.find((collection) => collection.id === collectionId) ?? museumCollections[0];
    setActiveCollectionId(nextCollection.id);
    setQuery("");
    setSelectedTitle(nextCollection.events[0]?.title ?? "");
  }

  function handleCollectionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % museumCollections.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + museumCollections.length) % museumCollections.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = museumCollections.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextCollection = museumCollections[nextIndex];
    selectCollection(nextCollection.id);
    document.getElementById(`museum-${nextCollection.id}-tab`)?.focus();
  }

  if (!selectedEvent) {
    return (
      <section className="edge-paper border-2 border-ink/70 bg-card p-6 shadow-paper" aria-label="Event museum">
        <p className="font-hand text-2xl font-bold text-muted-ink">
          The archive is being prepared from documented chapter records.
        </p>
      </section>
    );
  }

  return (
    <section id="museum" aria-labelledby="museum-heading" className="scroll-mt-24">
      <div className="edge-paper relative overflow-hidden border-[3px] border-ink/85 bg-card p-5 shadow-paper sm:p-7">
        <span aria-hidden="true" className="tape -top-2 right-7 rotate-3" />
        <h2 id="museum-heading" className="font-display text-3xl font-black leading-none text-tsa-blue sm:text-4xl">
          Event museum
        </h2>
        <p className="mt-3 max-w-3xl text-base font-semibold leading-relaxed text-muted-ink">
          Browse National Qualifying Events and Unique to Texas Events, then open documented examples.
        </p>
        <div role="tablist" aria-label="Event divisions" className="mt-5 flex flex-wrap gap-2">
          {museumCollections.map((collection, index) => {
            const active = collection.id === activeCollection.id;
            return (
              <button
                key={collection.id}
                id={`museum-${collection.id}-tab`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`museum-${collection.id}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => selectCollection(collection.id)}
                onKeyDown={(event) => handleCollectionKeyDown(event, index)}
                className={`edge-paper-sm border-2 px-4 py-2 text-left transition ${
                  active
                    ? "border-ink bg-tsa-blue text-card shadow-[2px_2px_0_0_rgb(37_50_68_/_0.6)]"
                    : "border-ink/30 bg-cream text-ink hover:border-tsa-blue"
                }`}
              >
                <span className="block font-display text-lg font-black leading-none">{collection.shortLabel}</span>
                <span className={`mt-0.5 block text-xs font-bold ${active ? "text-card/80" : "text-muted-ink"}`}>
                  {collection.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`museum-${activeCollection.id}-panel`}
        role="tabpanel"
        aria-labelledby={`museum-${activeCollection.id}-tab`}
        className="mt-8 grid gap-6 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:items-start"
      >
        <aside className="min-w-0 lg:sticky lg:top-24" aria-label="Browse competitive events">
          <div className="edge-paper border-2 border-ink/85 bg-card p-4 shadow-paper">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl font-black text-ink">Explore events</h3>
              <span className="font-hand text-lg font-bold text-tsa-red">{activeEvents.length}</span>
            </div>
            <label className="relative mt-3 block">
              <span className="sr-only">Search museum events</span>
              <IconSearch aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-ink" />
              <input
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  if (nextQuery.trim()) {
                    const firstMatch = activeEvents.find((item) => eventMatchesQuery(item, nextQuery));
                    if (firstMatch) setSelectedTitle(firstMatch.title);
                  }
                }}
                placeholder={`Search ${activeCollection.shortLabel} events…`}
                className="w-full rounded-full border-2 border-ink/30 bg-paper py-2 pl-9 pr-3 text-sm font-semibold outline-none placeholder:text-muted-ink focus:border-tsa-blue"
              />
            </label>

            <div className="mt-3 max-h-[19rem] overflow-x-auto pb-1 lg:max-h-[calc(100vh-15rem)] lg:overflow-y-auto">
              {filteredEvents.length ? (
                <ul className="flex min-w-max gap-1.5 lg:min-w-0 lg:flex-col" aria-label="Filtered events">
                  {filteredEvents.map((event) => (
                    <li key={event.title} className="w-44 shrink-0 lg:w-auto">
                      <EventButton event={event} selected={event.title === selectedEvent.title} onSelect={() => setSelectedTitle(event.title)} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-1 py-3 font-hand text-xl font-semibold text-muted-ink">
                  No documented event matches that search. Try a different event name.
                </p>
              )}
            </div>
          </div>
        </aside>

        <div aria-live="polite" className="min-w-0">
          <article className="edge-paper border-[3px] border-ink/85 bg-card p-5 shadow-paper sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-hand text-xl font-bold text-tsa-red">{activeCollection.eventLabel}</p>
                <h3 className="font-display text-3xl font-black leading-tight text-tsa-blue sm:text-4xl">{selectedEvent.title}</h3>
              </div>
            </div>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-ink/85">
              {selectedEvent.description}
            </p>
            {selectedEvent.details.length > 0 && (
              <ul className="mt-4 grid gap-2 text-sm font-semibold leading-relaxed text-muted-ink">
                {selectedEvent.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span aria-hidden="true" className="text-tsa-red">●</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <section aria-labelledby="examples-heading" className="edge-paper mt-6 border-2 border-ink/80 bg-cream p-5 shadow-paper sm:p-7">
            <h3 id="examples-heading" className="font-display text-2xl font-black text-tsa-blue sm:text-3xl">{activeCollection.examplesHeading}</h3>
            {documentedSubmissions.length ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {documentedSubmissions.map((example, index) => (
                  <li key={`${example.label}-${index}`} className="edge-paper-sm border-2 border-ink/25 bg-card p-4">
                    <h4 className="font-display text-lg font-black text-ink">{example.label}</h4>
                    {example.note && <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-ink">{example.note}</p>}
                    <ArtifactLinks links={example.links} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-xl font-hand text-2xl font-bold leading-snug text-muted-ink">
                {activeCollection.emptyExamples}
              </p>
            )}
          </section>
        </div>
      </div>

      <section aria-label="Museum submission" className="mt-10 flex justify-center">
        <div className="edge-paper relative w-full max-w-2xl rotate-[-0.25deg] border-[3px] border-ink/85 bg-card p-6 text-center shadow-paper sm:p-8">
          <span aria-hidden="true" className="tape -top-3 left-1/2 w-20 -translate-x-1/2 rotate-[-2deg]" />
          <h3 className="font-hand text-3xl font-bold text-tsa-red">Have documented work to add?</h3>
          <p className="mx-auto mt-2 max-w-xl font-semibold leading-relaxed text-muted-ink">
            Send your verified project or placement information so future competitors can learn from it.
          </p>
          <a href={museumFormUrl} target="_blank" rel="noopener noreferrer" className="btn-marker edge-sketch mt-5 inline-flex items-center gap-2 bg-tsa-blue px-5 py-2.5 font-display text-base font-bold text-card">
            Submit to the museum
            <IconExternal aria-hidden="true" />
          </a>
        </div>
      </section>
    </section>
  );
}
