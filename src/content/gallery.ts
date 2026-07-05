/**
 * Gallery content: the scrapbook pile up top, plus per-season albums.
 * Photos are curated picks from the chapter's Google Photos albums.
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
  /** Easter egg: named cartoon stickers (see stickers-art.ts) that pop out in the lightbox. */
  stickers?: string[];
};

export type Album = {
  title: string;
  photos: GalleryPhoto[];
};

export type Season = {
  id: string;
  title: string;
  note?: string;
  albums: Album[];
};

/** The loose pile at the top of the gallery */
export const scrapbook: GalleryPhoto[] = [
  {
    src: "/gallery/25-26/state26-02-marquee.webp",
    alt: "Members in conference dress standing on both sides of the giant light-up TSA 2026 marquee letters with red, white and blue balloon garland at the Fort Worth Convention Center",
    caption: "State 2026!",
    w: 1600,
    h: 1200,
    stickers: ["star", "balloon", "trophy"],
  },
  {
    src: "/gallery/chapter-team.webp",
    alt: "The full SLHS TSA chapter posing on the gym bleachers",
    caption: "the entire chapter",
    w: 1600,
    h: 1067,
    stickers: ["confetti", "heart-blue", "heart-orange"],
  },
  {
    src: "/gallery/nationals.webp",
    alt: "SLHS TSA nationals team in blue blazers at the national conference",
    caption: "blazers on at Nationals",
    w: 1600,
    h: 1205,
    stickers: ["trophy", "firework", "shades"],
  },
  {
    src: "/gallery/nationals-mascot.webp",
    alt: "SLHS TSA members posing with Lex the longhorn plush at the Gaylord National atrium",
    caption: "nats with Lex!",
    w: 1179,
    h: 884,
    stickers: ["longhorn", "heart-orange", "confetti"],
  },
  {
    src: "/gallery/zoo-trip.webp",
    alt: "Members in front of the bamboo forest on the chapter zoo trip",
    caption: "bamboo forest at the zoo",
    w: 1536,
    h: 2048,
    stickers: ["bamboo", "panda", "bamboo"],
  },
  {
    src: "/gallery/zoo-gift-shop.webp",
    alt: "Members wearing panda headbands at the zoo gift shop",
    caption: "panda headbands!",
    w: 1600,
    h: 1200,
    stickers: ["panda", "panda", "bamboo", "panda"],
  },
  {
    src: "/gallery/social-dinner.webp",
    alt: "Members and advisor giving thumbs-up at a restaurant social",
    caption: "nats dinner at outback!",
    w: 1600,
    h: 1205,
    stickers: ["burger", "fries", "smiley"],
  },
];

/** Per-album sticker themes for the archive easter eggs. */
const ALBUM_STICKERS: Record<string, string[]> = {
  Regionals: ["flag", "wrench", "pencil"],
  State: ["star", "trophy", "balloon"],
  Socials: ["pumpkin", "candy", "gingerbread"],
  Events: ["wrench", "ruler", "gear"],
};

/** 24-25 albums, shown State → Regionals → Socials → Events (manifest: gallery-24-25.json). */
const ARCHIVE_ORDER = ["State", "Regionals", "Socials", "Events"];
const archiveAlbums: Album[] = archive.albums
  .map((album) => ({
    title: album.title,
    photos: album.photos.map((photo) => ({
      src: `/gallery/24-25/${photo.file}`,
      alt: photo.desc,
      w: photo.w,
      h: photo.h,
      stickers: ALBUM_STICKERS[album.title],
    })),
  }))
  .sort((a, b) => ARCHIVE_ORDER.indexOf(a.title) - ARCHIVE_ORDER.indexOf(b.title));

// The State-Champion banner photo (from the old site's home page) belongs
// with the 24-25 State album now that the scrapbook features State 2026.
archiveAlbums
  .find((album) => album.title === "State")
  ?.photos.push({
    src: "/gallery/state-champs.webp",
    alt: "The full SLHS TSA chapter under a balloon arch at Texas TSA State 2025, holding two State Champion banners",
    w: 1040,
    h: 585,
    stickers: ALBUM_STICKERS.State,
  });

const STATE26_STICKERS = ["star", "balloon", "confetti"];
const NATS26_STICKERS = ["trophy", "firework", "paper-plane"];

export const seasons: Season[] = [
  {
    id: "25-26",
    title: "25-26 season",
    albums: [
      {
        title: "Nationals",
        photos: [
          {
            src: "/gallery/25-26/nats26-10-blazer-lineup.webp",
            alt: "Six SLHS TSA members in navy competition blazers lined up together in the hotel lobby at the 2026 National TSA Conference",
            w: 856,
            h: 642,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-08-full-delegation.webp",
            alt: "The full SLHS TSA delegation in blue competition shirts gathered in the convention center hallway",
            w: 1600,
            h: 1205,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-13-peace-signs.webp",
            alt: "SLHS TSA members in navy competition blazers throwing peace signs in a blue-lit ballroom foyer at the 2026 National TSA Conference",
            w: 1693,
            h: 1275,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-01-airport-sendoff.webp",
            alt: "SLHS TSA members with their luggage at the airport check-in, ready to fly to the 2026 National TSA Conference",
            w: 1600,
            h: 1205,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-02-gaylord-teamwork.webp",
            alt: "Members in competition attire prepping at a table in the Gaylord National atrium during the national conference",
            w: 1600,
            h: 2125,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-04-capitol-sightseeing.webp",
            alt: "Members pose at the James A. Garfield Monument with the U.S. Capitol dome behind them",
            w: 1600,
            h: 2125,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-11-garden-group.webp",
            alt: "The SLHS TSA delegation gathered together by blooming flowers and greenery on a sightseeing day at the 2026 National TSA Conference",
            w: 1600,
            h: 1205,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-06-national-harbor.webp",
            alt: "Members in official dress pose on the mosaic steps at National Harbor in the evening sun",
            w: 1600,
            h: 1205,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-09-night-selfie.webp",
            alt: "SLHS TSA members leaning in for a group selfie outdoors at dusk at the 2026 National TSA Conference",
            w: 1600,
            h: 1200,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-14-session-selfie.webp",
            alt: "SLHS TSA members leaning in for a tilted group selfie during an evening session at the 2026 National TSA Conference, stage lights and confetti behind them",
            w: 956,
            h: 1275,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-12-team-dinner.webp",
            alt: "The whole SLHS TSA delegation packed into a big restaurant booth for a team dinner at the 2026 National TSA Conference",
            w: 1600,
            h: 1205,
            stickers: NATS26_STICKERS,
          },
          {
            src: "/gallery/25-26/nats26-07-awards-stage.webp",
            alt: "SLHS finalists give thumbs-up on the awards stage at the National TSA Conference",
            w: 1600,
            h: 900,
            stickers: NATS26_STICKERS,
          },
        ],
      },
      {
        title: "State",
        photos: [
          {
            src: "/gallery/25-26/state26-01-bus-selfie.webp",
            alt: "SLHS TSA members packed across charter bus seats flashing peace signs on the ride to the 2026 Texas TSA State Conference",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-09-delegation-marquee.webp",
            alt: "The full SLHS TSA delegation in navy conference blazers posing in front of the giant light-up TSA 2026 marquee letters at the Texas TSA State Conference",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-02-marquee.webp",
            alt: "Members standing on both sides of the giant light-up TSA 2026 marquee letters with balloon garland at the Fort Worth Convention Center",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-03-lobby-selfie.webp",
            alt: "Group selfie of members in navy blazers with blue Texas TSA lanyards and state conference badges inside the convention center",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-10-convention-group.webp",
            alt: "SLHS TSA members in official conference dress gathered for a group photo inside the Fort Worth Convention Center at the 2026 Texas TSA State Conference",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-04-mirror-selfie.webp",
            alt: "Four members in navy conference blazers with lanyards taking a hotel-room mirror selfie before competition day",
            w: 1600,
            h: 2134,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-05-store-run.webp",
            alt: "Six members in conference attire making playful faces on a snack run during a break at State",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-06-downtown-dinner.webp",
            alt: "Members gathered for a group selfie by a colorful plate-mosaic wall at a downtown Fort Worth restaurant",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-11-night-social.webp",
            alt: "SLHS TSA members flashing peace signs on a night out during the 2026 Texas TSA State Conference",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-07-hotel-lobby.webp",
            alt: "Six members winding down together on a bench in the hotel lobby at night",
            w: 1600,
            h: 2134,
            stickers: STATE26_STICKERS,
          },
          {
            src: "/gallery/25-26/state26-08-awards-stage.webp",
            alt: "SLHS TSA competitors lined up on the awards stage behind lit TSA letters at the 2026 Texas TSA State Conference",
            w: 1600,
            h: 1200,
            stickers: STATE26_STICKERS,
          },
        ],
      },
    ],
  },
  {
    id: "24-25",
    title: "24-25 season",
    albums: archiveAlbums,
  },
];
