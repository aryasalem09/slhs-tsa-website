/**
 * Gallery content: the scrapbook pile (photos from the planning doc / current
 * site), plus per-season albums. 24–25 is migrated from the old Wix gallery;
 * 25–26 is scaffolded and waiting on photos.
 */

import archive from "./gallery-24-25.json";

export type GalleryPhoto = {
  src: string;
  alt: string;
  /** Short handwritten caption under the polaroid; omit to keep the wall quiet. */
  caption?: string;
  /** Intrinsic pixel size — keeps the masonry from shifting as images load. */
  w?: number;
  h?: number;
};

export type Album = {
  title: string;
  photos: GalleryPhoto[];
  /** Optional "see the full album" external link (e.g. Google Photos). */
  externalLink?: { label: string; href: string };
  comingSoon?: boolean;
};

export type Season = {
  id: string;
  title: string;
  note?: string;
  albums: Album[];
};

/** The loose pile at the top of the gallery — greatest hits. */
export const scrapbook: GalleryPhoto[] = [
  {
    src: "/gallery/state-champs.webp",
    alt: "The full SLHS TSA chapter under a balloon arch at Texas TSA State 2025, holding two State Champion banners",
    caption: "State 2025 — we brought home banners",
    w: 1040,
    h: 585,
  },
  {
    src: "/gallery/chapter-team.webp",
    alt: "The full SLHS TSA chapter posing on the gym bleachers",
    caption: "the whole chapter, one gym",
    w: 1600,
    h: 1067,
  },
  {
    src: "/gallery/nationals.webp",
    alt: "SLHS TSA nationals team in blue blazers at the national conference",
    caption: "blazers on — Nationals",
    w: 1600,
    h: 1205,
  },
  {
    src: "/gallery/nationals-mascot.webp",
    alt: "SLHS TSA members posing with Lex the longhorn plush at the Gaylord National atrium",
    caption: "Nats with Lex!",
    w: 1179,
    h: 884,
  },
  {
    src: "/gallery/zoo-trip.webp",
    alt: "Members in front of the bamboo forest on the chapter zoo trip",
    caption: "zoo trip — bamboo forest",
    w: 1536,
    h: 2048,
  },
  {
    src: "/gallery/zoo-gift-shop.webp",
    alt: "Members wearing panda headbands at the zoo gift shop",
    caption: "panda headbands, obviously",
    w: 1600,
    h: 1200,
  },
  {
    src: "/gallery/social-dinner.webp",
    alt: "Members and advisor giving thumbs-up at a restaurant social",
    caption: "post-conference dinner",
    w: 1600,
    h: 1205,
  },
];

/** Albums migrated from the old Wix gallery (manifest: gallery-24-25.json). */
const archiveAlbums: Album[] = archive.albums.map((album) => ({
  title: album.title,
  photos: album.photos.map((photo) => ({
    src: `/gallery/24-25/${photo.file}`,
    alt: photo.desc,
    w: photo.w,
    h: photo.h,
  })),
  externalLink:
    "externalLink" in album && album.externalLink
      ? { label: "See the full album on Google Photos", href: album.externalLink }
      : undefined,
}));

export const seasons: Season[] = [
  {
    id: "25-26",
    title: "25–26 season",
    note: "photos coming soon — this shelf is reserved!",
    albums: [
      // TODO(content): drop the 25-26 State photos in public/gallery/25-26/ and list them here.
      { title: "State", photos: [], comingSoon: true },
      // TODO(content): same for Nationals.
      { title: "Nationals", photos: [], comingSoon: true },
    ],
  },
  {
    id: "24-25",
    title: "24–25 season",
    note: "migrated from our old site",
    albums: archiveAlbums,
  },
];
