type SchoolMapProps = {
  directionsHref: string;
};

const schoolMapEmbedSrc =
  "https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sSeven+Lakes+High+School,+9251+S+Fry+Rd,+Katy,+TX+77494";

/** A progressively loaded map with a useful directions fallback. */
export default function SchoolMap({ directionsHref }: SchoolMapProps) {
  return (
    <section
      aria-labelledby="school-map-heading"
      className="edge-paper mt-8 border-2 border-ink/80 bg-card p-4 shadow-paper sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="school-map-heading" className="font-display text-xl font-black text-tsa-blue">
          Find Seven Lakes High School
        </h2>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          Get directions ↗
        </a>
      </div>
      <p id="school-map-description" className="mt-1 text-sm font-semibold text-muted-ink">
        9251 S Fry Rd, Katy, TX 77494
      </p>
      <iframe
        title="Map showing Seven Lakes High School in Katy, Texas"
        src={schoolMapEmbedSrc}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin"
        aria-describedby="school-map-description"
        className="mt-4 h-[22rem] w-full rounded border-2 border-ink/20 bg-cream sm:h-[26rem]"
      />
      <p className="mt-3 text-sm text-muted-ink">
        Can&apos;t use the map?{" "}
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
        >
          Open directions in Google Maps
        </a>
        .
      </p>
    </section>
  );
}
