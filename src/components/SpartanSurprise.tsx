"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ParticleLogo from "@/components/ParticleLogo";
import { IconX } from "@/components/icons";
import { useOverlay } from "@/lib/useOverlay";

/**
 * The easter egg: an innocent-looking Spartan mark that, when clicked,
 * reveals the interactive particle Spartan in a little pop-up gallery frame.
 */
export default function SpartanSurprise({
  triggerClassName = "",
  imageSize = 36,
}: {
  triggerClassName?: string;
  imageSize?: number;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isTop = useOverlay(open, panelRef);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isTop()) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="A little surprise"
        title="psst… click me"
        className={`transition-transform duration-300 hover:rotate-[14deg] hover:scale-110 ${triggerClassName}`}
      >
        <Image
          src="/logos/spartan-mark-512.png"
          alt=""
          width={imageSize}
          height={imageSize}
          className="object-contain"
          style={{ width: imageSize, height: imageSize }}
        />
      </button>

      {/* Portal: the trigger often sits inside transformed containers, which
          would otherwise hijack position:fixed. */}
      {open &&
        createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Our Spartan, made of dots"
        >
          <div
            className="absolute inset-0 bg-ink/75"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            tabIndex={-1}
            className="edge-paper relative w-full max-w-2xl border-[3px] border-ink bg-card p-5 shadow-lift outline-none sm:p-7"
          >
            <span aria-hidden="true" className="tape -top-3 left-10 rotate-[-5deg]" />
            <p className="-rotate-1 font-hand text-3xl font-bold text-tsa-red">
              you found him!
            </p>
            <ParticleLogo
              src="/logos/spartan-tsa-colors.png"
              className="mt-3"
              label="Interactive Spartan logo made of dots. Move your cursor through it and click to scatter."
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -right-3 -top-3 rounded-full border-2 border-ink bg-tsa-red p-2 text-lg text-white shadow-paper transition hover:rotate-90"
            >
              <IconX aria-hidden="true" />
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
