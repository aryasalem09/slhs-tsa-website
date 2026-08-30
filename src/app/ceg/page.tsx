import { createPageMetadata } from "@/lib/seo";
import CegExplorer from "@/components/CegExplorer";
import InspirationBubble from "@/components/InspirationBubble";
import MuseumArchive from "@/components/MuseumArchive";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { ceg, site } from "@/content/site";
import { museumEvents, uteMuseumEvents } from "@/content/museum";

export const metadata = createPageMetadata({
  path: "/ceg",
  title: "TSA Competitive Events Guide & Event Museum",
  description: "Explore TSA National Qualifying Events and Unique to Texas Events with official descriptions and anonymous student submission examples.",
});

export default function CegPage() {
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
      <h1 className="sr-only">CEG Navigation and TSA Museum</h1>
      <div className="relative">
        <div className="text-center">
          <DashWrap>
            <WonkyTitle text="CEG NAVIGATION" outline className="text-[1.8rem] leading-none sm:text-[2.4rem]" />
          </DashWrap>
          <p className="mt-3 -rotate-1 font-hand text-xl font-semibold text-muted-ink">
            your map through the Competitive Events Guide
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <InspirationBubble />
        </div>
      </div>

      <CegExplorer master={ceg.master} events={ceg.events} museumFormUrl={site.links.museumFormShort} />
      <div className="mt-20 pb-8">
        <MuseumArchive museumFormUrl={site.links.museumFormShort} />
      </div>
    </div>
  );
}
