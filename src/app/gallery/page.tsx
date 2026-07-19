import type { Metadata } from "next";
import { getStudioPageMetadata } from "@/lib/studio/metadata";
import PhotoWall from "@/components/PhotoWall";
import GallerySideNav, { type GalleryNavGroup } from "@/components/GallerySideNav";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { scrapbook, seasons, type GalleryPhoto, type Season } from "@/content/gallery";
import { getDocumentForRender, getPageSections } from "@/lib/studio/render";
import { isSafeImageSrc } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  return getStudioPageMetadata({
    pageKey: "gallery",
    route: "/gallery",
    fallbackTitle: "Gallery",
    fallbackDescription: "Explore photos from SLHS TSA competitions, conferences, chapter socials, and trips at Seven Lakes High School in Katy, Texas.",
  });
}

const SCRAPBOOK_ID = "gallery-us";
const albumId = (seasonId: string, title: string) =>
  `gallery-${seasonId}-${title.toLowerCase().replace(/\s+/g, "-")}`;

type SearchParams = Promise<{ studio?: string; draft?: string }>;

function isGalleryPhoto(value: unknown): value is GalleryPhoto {
  return Boolean(value && typeof value === "object" && isSafeImageSrc((value as GalleryPhoto).src) && typeof (value as GalleryPhoto).alt === "string" && (value as GalleryPhoto).alt.trim());
}

function isSeason(value: unknown): value is Season {
  return Boolean(value && typeof value === "object" && typeof (value as Season).id === "string" && (value as Season).id.trim() && typeof (value as Season).title === "string" && (value as Season).title.trim() && Array.isArray((value as Season).albums) && (value as Season).albums.every((album) => typeof album?.title === "string" && album.title.trim() && Array.isArray(album.photos) && album.photos.every(isGalleryPhoto)));
}

export default async function GalleryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const document = await getDocumentForRender({ draftPreview: params.studio === "1" || params.draft === "1" });
  const sections = getPageSections<{ scrapbook?: unknown; seasons?: unknown }>(document, "gallery");
  const visibleScrapbook = Array.isArray(sections?.scrapbook) && sections.scrapbook.every(isGalleryPhoto) ? sections.scrapbook : scrapbook;
  const visibleSeasons = Array.isArray(sections?.seasons) && sections.seasons.every(isSeason) ? sections.seasons : seasons;
  const navGroups: GalleryNavGroup[] = [
    { label: null, items: [{ id: SCRAPBOOK_ID, label: "Us!" }] },
    ...visibleSeasons.map((season) => ({
      label: season.title,
      items: season.albums.map((album) => ({
        id: albumId(season.id, album.title),
        label: album.title,
      })),
    })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 xl:max-w-7xl">
      <div className="text-center" data-studio-id="gallery.heading">
        <h1 className="sr-only">Gallery</h1>
        <DashWrap>
          <WonkyTitle
            text="OUR GALLERY"
            outline
            className="text-[1.9rem] leading-none sm:text-[2.5rem]"
          />
        </DashWrap>
        <p className="mt-4 font-hand text-2xl font-semibold text-muted-ink">
          click any photo to see it big!
        </p>
      </div>

      <div className="mt-10 lg:flex lg:gap-10">
        <div className="min-w-0 flex-1">
          {/* the loose pile */}
          <section
            data-studio-id="gallery.scrapbook"
            id={SCRAPBOOK_ID}
            aria-labelledby="scrapbook-h"
            className="scroll-mt-24 outline-none"
          >
            <h2
              id="scrapbook-h"
              className="squiggle-underline inline-block font-display text-2xl font-black"
            >
              Us!
            </h2>
            <div className="mt-6">
              <PhotoWall photos={visibleScrapbook} />
            </div>
          </section>

          {/* season shelves */}
          {visibleSeasons.map((season) => (
            <section
              key={season.id}
              data-studio-id={`gallery.seasons.${season.id}`}
              aria-labelledby={`season-${season.id}`}
              className="mt-16"
            >
              <h2
                id={`season-${season.id}`}
                className="squiggle-underline inline-block font-display text-2xl font-black"
              >
                {season.title}
              </h2>

              <div className="mt-6 space-y-10">
                {season.albums.map((album) => (
                  <div
                    key={album.title}
                    id={albumId(season.id, album.title)}
                    data-studio-id={`gallery.seasons.${season.id}.albums.${album.title}`}
                    className="scroll-mt-24 outline-none"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <h3 className="edge-sketch inline-block -rotate-1 border-2 border-ink bg-tsa-blue px-4 py-1 font-display text-lg font-bold text-cream shadow-[2px_2px_0_0_rgb(37_50_68_/_0.5)]">
                        {album.title}
                      </h3>
                    </div>

                    {album.photos.length === 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            aria-hidden={i > 0}
                            className={`flex h-36 w-44 items-center justify-center border-2 border-dashed border-ink/30 bg-card/60 p-2 ${
                              i === 0 ? "-rotate-2" : i === 1 ? "rotate-1" : "-rotate-1 hidden sm:flex"
                            }`}
                          >
                            {i === 0 ? (
                              <p className="text-center font-hand text-xl leading-tight text-muted-ink">
                                photos
                                <br />
                                coming soon!
                              </p>
                            ) : (
                              <span className="font-hand text-3xl text-ink/20">?</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <PhotoWall photos={album.photos} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <GallerySideNav groups={navGroups} />
      </div>
    </div>
  );
}
