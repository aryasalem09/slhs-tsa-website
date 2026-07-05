import type { Metadata } from "next";
import PhotoWall from "@/components/PhotoWall";
import { DashWrap, WonkyTitle } from "@/components/decor";
import { IconExternal } from "@/components/icons";
import { scrapbook, seasons } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Chapter photos from conferences, socials, and trips, season by season.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10">
      <div className="text-center">
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

      {/* the loose pile */}
      <section aria-labelledby="scrapbook-h" className="mt-10">
        <h2
          id="scrapbook-h"
          className="squiggle-underline inline-block font-display text-2xl font-black"
        >
          Greatest hits
        </h2>
        <div className="mt-6">
          <PhotoWall photos={scrapbook} />
        </div>
      </section>

      {/* season shelves */}
      {seasons.map((season) => (
        <section
          key={season.id}
          aria-labelledby={`season-${season.id}`}
          className="mt-16"
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2
              id={`season-${season.id}`}
              className="squiggle-underline inline-block font-display text-2xl font-black"
            >
              {season.title}
            </h2>
            {season.note && (
              <p className="-rotate-1 font-hand text-xl text-muted-ink">
                {season.note}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-10">
            {season.albums.map((album) => (
              <div key={album.title}>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h3 className="edge-sketch inline-block -rotate-1 border-2 border-ink bg-tsa-blue px-4 py-1 font-display text-lg font-bold text-cream shadow-[2px_2px_0_0_rgb(37_50_68_/_0.5)]">
                    {album.title}
                  </h3>
                  {album.externalLink && album.photos.length > 0 && (
                    <a
                      href={album.externalLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-tsa-blue underline decoration-dashed underline-offset-4 hover:text-tsa-red"
                    >
                      {album.externalLink.label}
                      <IconExternal aria-hidden="true" />
                    </a>
                  )}
                </div>

                {album.photos.length === 0 && album.externalLink ? (
                  <a
                    href={album.externalLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="edge-paper group flex max-w-md rotate-[-0.5deg] items-center gap-4 border-2 border-ink/80 bg-card p-5 shadow-paper transition hover:-translate-y-1 hover:shadow-lift"
                  >
                    <span className="font-hand text-3xl" aria-hidden="true">
                      📸
                    </span>
                    <span>
                      <span className="block font-bold text-tsa-blue group-hover:text-tsa-red">
                        This album lives on Google Photos
                        <IconExternal className="ml-1.5 inline-block align-[-2px]" aria-hidden="true" />
                      </span>
                      <span className="block text-sm font-semibold text-muted-ink">
                        All the {album.title} photos, full quality.
                      </span>
                    </span>
                  </a>
                ) : album.comingSoon || album.photos.length === 0 ? (
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
  );
}
