import type { CSSProperties } from "react";

/**
 * Little cartoon stickers that pop out around a photo's edges — the gallery
 * easter egg. Purely decorative; parent must be `relative`.
 */
const SLOTS: CSSProperties[] = [
  { top: "-18px", left: "5%", "--rot": "-14deg" } as CSSProperties,
  { top: "-16px", right: "7%", "--rot": "11deg" } as CSSProperties,
  { bottom: "-22px", left: "-10px", "--rot": "9deg" } as CSSProperties,
  { bottom: "-20px", right: "-8px", "--rot": "-12deg" } as CSSProperties,
  { top: "34%", left: "-18px", "--rot": "-18deg" } as CSSProperties,
  { top: "45%", right: "-18px", "--rot": "16deg" } as CSSProperties,
];

export default function Stickers({
  emojis,
  size = "text-3xl sm:text-4xl",
}: {
  emojis?: string[];
  size?: string;
}) {
  if (!emojis || emojis.length === 0) return null;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {emojis.slice(0, SLOTS.length).map((emoji, i) => (
        <span
          key={i}
          className={`sticker-pop absolute ${size} drop-shadow-[1px_2px_2px_rgb(37_50_68_/_0.3)]`}
          style={{ ...SLOTS[i], animationDelay: `${140 + i * 90}ms` }}
        >
          {emoji}
        </span>
      ))}
    </span>
  );
}
