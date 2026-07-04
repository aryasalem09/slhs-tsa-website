"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryPhoto } from "@/content/gallery";
import { IconArrowRight, IconX } from "@/components/icons";
import { useOverlay } from "@/lib/useOverlay";

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-[1.5deg]", "rotate-[1.5deg]"];

/**
 * A masonry wall of polaroids with a keyboard-friendly lightbox.
 * Hover straightens a photo; click opens it big with prev/next.
 */
export default function PhotoWall({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const isTop = useOverlay(openIndex !== null, panelRef);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null ? i : (i + dir + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (!isTop()) return; // another overlay (e.g. search) is above us
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : photos[openIndex];

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 [column-fill:balance]">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`View photo: ${photo.caption ?? photo.alt}`}
            className={`group mb-4 block w-full break-inside-avoid border-2 border-ink/15 bg-white p-2 ${photo.caption ? "pb-1" : "pb-2"} text-left shadow-paper transition-all duration-200 hover:z-10 hover:rotate-0 hover:shadow-lift focus-visible:rotate-0 ${TILTS[i % TILTS.length]}`}
          >
            <span className="relative block w-full overflow-hidden bg-cream">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.w ?? 800}
                height={photo.h ?? 600}
                sizes="(min-width: 640px) 30vw, 45vw"
                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </span>
            {photo.caption && (
              <span className="block px-1 py-1.5 text-center font-hand text-lg leading-tight text-ink/85">
                {photo.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {current &&
        createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption ?? current.alt}
        >
          <div
            className="absolute inset-0 bg-ink/80"
            aria-hidden="true"
            onClick={close}
          />

          <figure
            ref={panelRef}
            tabIndex={-1}
            className="relative max-h-full w-full max-w-4xl rotate-[-0.4deg] border-2 border-ink/20 bg-white p-2.5 pb-2 shadow-lift outline-none sm:p-3"
          >
            <div className="relative max-h-[74vh] overflow-hidden bg-cream">
              <Image
                src={current.src}
                alt={current.alt}
                width={current.w ?? 1600}
                height={current.h ?? 1200}
                sizes="(min-width: 1024px) 56rem, 92vw"
                className="mx-auto h-auto max-h-[74vh] w-auto max-w-full object-contain"
                priority
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-1 pt-2">
              <span className="font-hand text-xl leading-tight text-ink/85 sm:text-2xl">
                {current.caption ?? current.alt}
              </span>
              <span className="shrink-0 text-sm font-bold text-muted-ink">
                {(openIndex ?? 0) + 1} / {photos.length}
              </span>
            </figcaption>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-card p-2.5 text-xl shadow-paper transition hover:scale-110 sm:-left-5"
                >
                  <IconArrowRight className="rotate-180" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-card p-2.5 text-xl shadow-paper transition hover:scale-110 sm:-right-5"
                >
                  <IconArrowRight aria-hidden="true" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={close}
              aria-label="Close photo"
              className="absolute -right-3 -top-3 rounded-full border-2 border-ink bg-tsa-red p-2 text-lg text-white shadow-paper transition hover:rotate-90"
            >
              <IconX aria-hidden="true" />
            </button>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}
