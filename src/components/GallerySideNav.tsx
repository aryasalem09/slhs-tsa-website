"use client";

import { useEffect, useState } from "react";

export type GalleryNavGroup = {
  /** Season label above a batch of album links; null for the loose top items. */
  label: string | null;
  items: { id: string; label: string }[];
};

/**
 * A sticky side rail that jumps to each photo section and highlights the
 * one you're looking at. Desktop-only — phones just scroll the wall.
 */
export default function GallerySideNav({ groups }: { groups: GalleryNavGroup[] }) {
  const ids = groups.flatMap((g) => g.items.map((i) => i.id));
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    // Whichever section is highest while still in the top half of the viewport wins.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  function jump(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move focus for keyboard users without another jump.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav
      aria-label="Jump to a photo section"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] shrink-0 self-start overflow-y-auto lg:block lg:w-44 xl:w-48"
    >
      <p className="mb-2 font-hand text-xl font-bold text-tsa-blue">jump to…</p>
      <ul className="space-y-3 border-l-2 border-ink/15 pl-3">
        {groups.map((group, gi) => (
          <li key={group.label ?? `top-${gi}`}>
            {group.label && (
              <p className="mb-1 font-display text-xs font-black uppercase tracking-wide text-muted-ink">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => jump(e, item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`-ml-3 block border-l-2 py-1 pl-3 text-sm font-bold transition-colors ${
                        isActive
                          ? "border-tsa-red text-tsa-red"
                          : "border-transparent text-ink/70 hover:text-tsa-blue"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
