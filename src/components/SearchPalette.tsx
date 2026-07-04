"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex, type SearchEntry } from "@/content/site";
import { IconExternal, IconSearch } from "@/components/icons";

const LIST_ID = "site-search-listbox";

function score(entry: SearchEntry, q: string): number {
  const label = entry.label.toLowerCase();
  if (label.startsWith(q)) return 4;
  if (label.includes(q)) return 3;
  if (entry.keywords.some((k) => k.startsWith(q) || k.includes(q))) return 2;
  if (entry.hint.toLowerCase().includes(q)) return 1;
  return 0;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  // Reset the query on the way out so every open starts fresh.
  function close() {
    setQuery("");
    setActive(0);
    onClose();
  }

  // Global ⌘K / Ctrl+K toggle, Escape to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else onOpen();
      } else if (e.key === "Escape" && open) {
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onOpen, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.filter(() => true).slice(0, 9);
    return searchIndex
      .map((entry) => ({ entry, s: score(entry, q) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ entry }) => entry)
      .slice(0, 8);
  }, [query]);

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

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/45"
        aria-hidden="true"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="edge-paper relative mx-auto mt-[12vh] w-[min(92vw,34rem)] border-2 border-ink bg-card shadow-lift"
      >
        <span
          aria-hidden="true"
          className="tape left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg]"
        />
        <div className="flex items-center gap-2.5 border-b-2 border-ink/10 px-4 py-3">
          <IconSearch className="shrink-0 text-xl text-muted-ink" aria-hidden="true" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={LIST_ID}
            aria-activedescendant={results.length ? `search-opt-${active}` : undefined}
            aria-label="Search pages and links"
            className="w-full bg-transparent text-lg font-semibold outline-none placeholder:font-normal placeholder:text-muted-ink/70"
            placeholder="Where to? Try “join” or “calendar”…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
          />
        </div>

        <ul id={LIST_ID} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
          {results.map((r, i) => (
            <li
              key={`${r.href}-${r.label}`}
              id={`search-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(r)}
              className={`edge-paper-sm flex cursor-pointer items-baseline justify-between gap-3 border-2 px-3.5 py-2.5 ${
                i === active
                  ? "border-ink bg-cream"
                  : "border-transparent hover:bg-cream/60"
              }`}
            >
              <span className="font-bold">
                {r.label}
                {r.external && (
                  <IconExternal
                    className="ml-1.5 inline-block align-[-2px] text-sm text-muted-ink"
                    aria-label="(opens in a new tab)"
                  />
                )}
              </span>
              <span className="truncate text-sm text-muted-ink">{r.hint}</span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-8 text-center font-hand text-2xl text-muted-ink">
              nothing here… try “join”, “events”, or “museum”
            </li>
          )}
        </ul>

        <div className="flex gap-4 border-t-2 border-ink/10 px-4 py-2 text-xs font-semibold text-muted-ink">
          <span>
            <kbd className="rounded border border-ink/20 bg-cream px-1">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded border border-ink/20 bg-cream px-1">↵</kbd> open
          </span>
          <span>
            <kbd className="rounded border border-ink/20 bg-cream px-1">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
