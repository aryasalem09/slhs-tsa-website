"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Coordinates stacked overlays (search palette, lightbox, easter egg) so they
 * don't fight over the page:
 * - refcounted body scroll lock (closing one overlay can't unlock another's)
 * - an overlay stack, so key handlers can act only when they're on top
 * - focus management: moves focus into the panel on open (honoring a
 *   [data-autofocus] element), traps Tab inside it, and restores focus to
 *   the trigger on close
 *
 * Returns an `isTop()` predicate for gating global key handlers.
 */

const stack: symbol[] = [];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function useOverlay(
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
) {
  const [token] = useState(() => Symbol("overlay"));

  useEffect(() => {
    if (!open) return;

    stack.push(token);
    if (stack.length === 1) document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;

    const t = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target =
        panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
      target.focus();
    }, 10);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || stack[stack.length - 1] !== token) return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.getClientRects().length > 0);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);
      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown, true);
      const i = stack.indexOf(token);
      if (i !== -1) stack.splice(i, 1);
      if (stack.length === 0) document.body.style.overflow = "";
      prevFocus?.focus?.();
    };
    // panelRef is a stable ref object; token never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return () => open && stack[stack.length - 1] === token;
}
