"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { searchIndex, type SearchEntry } from "@/content/site";
import { IconArrowRight, IconExternal, IconSearch, IconX } from "@/components/icons";
import { useOverlay } from "@/lib/useOverlay";

const LIST_ID = "site-search-listbox";

function score(entry: SearchEntry, q: string): number {
  const label = entry.label.toLowerCase();
  if (label.startsWith(q)) return 4;
  if (label.includes(q)) return 3;
  if (entry.keywords.some((k) => k.startsWith(q) || k.includes(q))) return 2;
  if (entry.hint.toLowerCase().includes(q)) return 1;
  return 0;
}

/** Underline the matched part of a label so results explain themselves. */
function Highlight({ label, query }: { label: string; query: string }) {
  const q = query.trim().toLowerCase();
  const idx = q ? label.toLowerCase().indexOf(q) : -1;
  if (idx === -1) return <>{label}</>;
  return (
    <>
      {label.slice(0, idx)}
      <span className="text-tsa-blue underline decoration-tsa-blue/50 decoration-2 underline-offset-2">
        {label.slice(idx, idx + q.length)}
      </span>
      {label.slice(idx + q.length)}
    </>
  );
}

export default function SearchPalette({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const isTop = useOverlay(open, panelRef);

  // Reset the query on the way out so every open starts fresh.
  function close() {
    setQuery("");
    setActive(0);
    onClose();
  }

  // Global ⌘K / Ctrl+K toggle, Escape to close (only when topmost overlay).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else onOpen();
      } else if (e.key === "Escape" && open && isTop()) {
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onOpen, onClose]);

  // Keep the active option visible while arrowing through the list.
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`search-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, query]);

  // Flat, ordered result list; pages before external links when browsing.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [
        ...searchIndex.filter((e) => !e.external),
        ...searchIndex.filter((e) => e.external),
      ];
    }
    return searchIndex
      .map((entry) => ({ entry, s: score(entry, q) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ entry }) => entry)
      .slice(0, 8);
  }, [query]);

  const browsing = query.trim() === "";
  const firstExternalIdx = results.findIndex((r) => r.external);

  function choose(entry: SearchEntry | undefined) {
    if (!entry) return;
    if (entry.external) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(entry.href);
    }
    close();
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    }
  }

  if (!open) return null;

  function renderRow(r: SearchEntry, i: number) {
    const isActive = i === active;
    return (
      <li
        key={`${r.href}-${r.label}`}
        id={`search-opt-${i}`}
        role="option"
        aria-selected={isActive}
        onMouseEnter={() => setActive(i)}
        onClick={() => choose(r)}
        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
          isActive ? "bg-cream" : ""
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm ${
            isActive ? "bg-tsa-blue text-cream" : "bg-ink/[0.06] text-muted-ink"
          }`}
          aria-hidden="true"
        >
          {r.external ? <IconExternal /> : <IconArrowRight />}
        </span>
        <span className="min-w-0 flex-1 truncate font-bold text-ink">
          <Highlight label={r.label} query={query} />
        </span>
        <span className="hidden shrink-0 text-sm font-semibold text-muted-ink sm:block">
          {r.hint}
        </span>
      </li>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="relative mx-auto mt-[11vh] w-[min(94vw,35rem)] overflow-hidden rounded-2xl border border-ink/15 bg-card shadow-lift"
      >
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3.5">
          <IconSearch className="shrink-0 text-xl text-muted-ink/70" aria-hidden="true" />
          <input
            data-autofocus
            role="combobox"
            aria-expanded="true"
            aria-controls={LIST_ID}
            aria-activedescendant={results.length ? `search-opt-${active}` : undefined}
            aria-label="Search pages and links"
            className="w-full bg-transparent text-lg font-semibold outline-none placeholder:font-normal placeholder:text-muted-ink/90"
            placeholder="Search pages and links…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
          />
          <kbd className="hidden shrink-0 rounded-md bg-ink/[0.06] px-1.5 py-0.5 text-[11px] font-bold text-muted-ink sm:block">
            esc
          </kbd>
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="shrink-0 rounded-md p-1 text-lg text-muted-ink hover:bg-cream hover:text-ink sm:hidden"
          >
            <IconX aria-hidden="true" />
          </button>
        </div>

        <ul
          id={LIST_ID}
          role="listbox"
          aria-label="Results"
          className="max-h-[19rem] overflow-y-auto p-2"
        >
          {results.map((r, i) => (
            <Fragment key={`${r.href}-${r.label}`}>
              {browsing && i === 0 && (
                <li
                  role="presentation"
                  className="px-3 pb-1 pt-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-ink"
                >
                  Pages
                </li>
              )}
              {browsing && i === firstExternalIdx && (
                <li
                  role="presentation"
                  className="px-3 pb-1 pt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-ink"
                >
                  Elsewhere
                </li>
              )}
              {renderRow(r, i)}
            </Fragment>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-8 text-center font-semibold text-muted-ink">
              No matches. Try{" "}
              <button
                type="button"
                className="font-bold text-tsa-blue underline underline-offset-2"
                onClick={() => setQuery("join")}
              >
                join
              </button>{" "}
              or{" "}
              <button
                type="button"
                className="font-bold text-tsa-blue underline underline-offset-2"
                onClick={() => setQuery("gallery")}
              >
                gallery
              </button>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-4 border-t border-ink/10 bg-cream/50 px-4 py-2 text-[11px] font-semibold text-muted-ink">
          <span>
            <kbd className="rounded bg-ink/[0.07] px-1 py-0.5 font-bold">↑↓</kbd> to browse
          </span>
          <span>
            <kbd className="rounded bg-ink/[0.07] px-1 py-0.5 font-bold">↵</kbd> to open
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
