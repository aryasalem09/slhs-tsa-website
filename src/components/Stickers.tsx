import type { CSSProperties } from "react";
import { STICKER_ART } from "./stickers-art";

/**
 * Little hand-drawn cartoon stickers that pop out around a photo's edges —
 * the gallery easter egg. Purely decorative; parent must be `relative`.
 * Names map to art in stickers-art.ts.
 */
const SLOTS: CSSProperties[] = [
  { top: "-18px", left: "5%", "--rot": "-14deg" } as CSSProperties,
  { top: "-16px", right: "7%", "--rot": "11deg" } as CSSProperties,
  { bottom: "-22px", left: "-10px", "--rot": "9deg" } as CSSProperties,
  { bottom: "-20px", right: "-8px", "--rot": "-12deg" } as CSSProperties,
  { top: "34%", left: "-18px", "--rot": "-18deg" } as CSSProperties,
  { top: "45%", right: "-18px", "--rot": "16deg" } as CSSProperties,
];

const SIZES = {
  md: "h-11 w-11 sm:h-14 sm:w-14",
  sm: "h-9 w-9",
};

export default function Stickers({
  names,
  size = "md",
}: {
  names?: string[];
  size?: keyof typeof SIZES;
}) {
  if (!names || names.length === 0) return null;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {names.slice(0, SLOTS.length).map((name, i) => {
        const art = Object.hasOwn(STICKER_ART, name) ? STICKER_ART[name] : null;
        if (!art) return null;
        return (
          <svg
            key={`${name}-${i}`}
            viewBox="0 0 48 48"
            className={`sticker-pop absolute ${SIZES[size]} [filter:drop-shadow(0_0_1.5px_white)_drop-shadow(0_0_1.5px_white)_drop-shadow(1px_2px_2px_rgb(37_50_68_/_0.35))]`}
            style={{ ...SLOTS[i], animationDelay: `${140 + i * 90}ms` }}
            dangerouslySetInnerHTML={{ __html: art }}
          />
        );
      })}
    </span>
  );
}
