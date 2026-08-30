"use client";

import { useEffect } from "react";

/**
 * A tiny burst of hand-drawn sparkles wherever you tap — touch devices only,
 * skipped entirely when the user prefers reduced motion.
 */
const COLORS = ["#005eab", "#ef3224", "#f68428"];
const STAR =
  "M6 0 L7.4 4.3 L12 6 L7.4 7.7 L6 12 L4.6 7.7 L0 6 L4.6 4.3 Z";

export default function TapSparkles() {
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!coarse || reduce) return;

    let live = 0;

    function burst(e: PointerEvent) {
      if (e.pointerType !== "touch" || live > 2) return;
      live++;

      const holder = document.createElement("div");
      holder.setAttribute("aria-hidden", "true");
      holder.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:90;pointer-events:none;`;

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.6;
        const dist = 26 + Math.random() * 22;
        const size = 7 + Math.random() * 6;
        const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        el.setAttribute("viewBox", "0 0 12 12");
        el.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;animation:tap-sparkle 0.55s ease-out forwards;animation-delay:${i * 18}ms;opacity:0;`;
        el.innerHTML = `<path d="${STAR}" fill="${COLORS[i % COLORS.length]}"/>`;
        holder.appendChild(el);
      }

      document.body.appendChild(holder);
      window.setTimeout(() => {
        holder.remove();
        live--;
      }, 750);
    }

    window.addEventListener("pointerdown", burst, { passive: true });
    return () => window.removeEventListener("pointerdown", burst);
  }, []);

  return null;
}
