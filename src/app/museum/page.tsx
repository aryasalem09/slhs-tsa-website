import { createPageMetadata } from "@/lib/seo";
import MuseumArchive from "@/components/MuseumArchive";
import { site } from "@/content/site";
import { museumEvents, uteMuseumEvents } from "@/content/museum";

export const metadata = createPageMetadata({
  path: "/museum",
  title: "TSA Events Museum",
  description: "Explore TSA National Qualifying Events and Unique to Texas Events with official descriptions and anonymous student submission examples.",
});

export default function MuseumPage() {
  const allMuseumEvents = [...museumEvents, ...uteMuseumEvents];
  const museumStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TSA National Qualifying and Unique to Texas Events",
    numberOfItems: allMuseumEvents.length,
    itemListElement: allMuseumEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: event.title,
        description: event.description,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(museumStructuredData).replace(/</g, "\\u003c") }}
      />
      <div className="pb-8">
        <MuseumArchive museumFormUrl={site.links.museumFormShort} />
      </div>
    </div>
  );
}
