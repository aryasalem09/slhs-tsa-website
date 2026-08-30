import Image from "next/image";

/**
 * A die-cut sticker slapped on the page: white backing, slight tilt,
 * straightens and lifts on hover. Links out to the org it belongs to.
 */
export default function StickerLogo({
  src,
  alt,
  href,
  width = 120,
  height = 70,
  tilt = 5,
  label,
  className = "",
}: {
  src: string;
  alt: string;
  href: string;
  width?: number;
  height?: number;
  tilt?: number;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex flex-col items-center gap-1 ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span className="block rounded-xl border border-ink/15 bg-white p-2 shadow-paper transition-all duration-200 group-hover:-rotate-3 group-hover:scale-110 group-hover:shadow-lift">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain"
        />
      </span>
      {label && (
        <span className="font-hand text-lg font-semibold leading-none text-muted-ink transition-colors group-hover:text-tsa-red">
          {label}
        </span>
      )}
    </a>
  );
}
