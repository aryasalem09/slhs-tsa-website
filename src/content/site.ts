/**
 * Central content config for the SLHS TSA site.
 * Copy lives here so pages stay lean and edits stay easy.
 */

export type NavItem = { label: string; href: string };

export type Officer = {
  name: string;
  role: string;
  shortRole: string;
  group: "exec" | "directors";
  photo: string;
  alt: string;
  /**
   * Shown on the back of the officer card when it flips.
   * Fill each one in below (leave "" to show a friendly placeholder).
   * A sentence or two is plenty: favorite event, grade, a fun fact.
   */
  bio: string;
};

export type StackCard = {
  label: string;
  photo: string;
  alt: string;
  /** Easter egg: named cartoon stickers (see stickers-art.ts) that pop out on click. */
  stickers?: string[];
};

export const site = {
  name: "SLHS TSA",
  fullName: "Seven Lakes High School Technology Student Association",
  school: "Seven Lakes High School",
  address: "9251 S Fry Rd, Katy, TX 77494",
  email: "sltechnologystudentassociation@gmail.com",
  url: "https://slhstsa.vercel.app",

  socials: {
    instagram: "https://www.instagram.com/slhs.tsa/",
    discord: "https://discord.gg/64C4qZgmV",
    // TODO(content): new remind class code
    remind: "https://www.remind.com/join/slhstsa26",
  },

  links: {
    tsaOfficial: "https://tsaweb.org/",
    // Katy ISD "A+ Pay N' Go" webstore (RevTrak).
    payNGo: "https://katyisd.revtrak.net/",
    // TODO(content): swap in the new registration form URL next year
    // The 25-26 form is closed: https://docs.google.com/forms/d/e/1FAIpQLSetwcN1dc2PUCb37QvF0NOotmqfw2I8ycfgL_4vBxpO7eNtNg/viewform
    registrationForm: null as string | null,
    calendarEmbedSrc:
      "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&showPrint=0&src=c2x0ZWNobm9sb2d5c3R1ZGVudGFzc29jaWF0aW9uQGdtYWlsLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039be5&color=%230b8043",
    // TSA Museum submission form — members submit past projects to add to the archive.
    museumFormShort: "https://forms.gle/E7dVCxpyeFhdbadD9",
    museumFormEmbed:
      "https://docs.google.com/forms/d/e/1FAIpQLSfMQG7z7jOqYlKjiWgcaL_-v84BlRcSLxznyUaAvAS5eDibYw/viewform?embedded=true",
  },
} as const;

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "CEG", href: "/ceg" },
  { label: "Slides", href: "/slides" },
  { label: "Calendar", href: "/calendar" },
];

/** Extra destinations tucked under the header's "More" menu. */
export const moreNav: NavItem[] = [
  { label: "Gallery", href: "/gallery" },
  { label: "Contact us", href: "/contact" },
];

export const whatIsTsa =
  "TSA is the club for people who like to build and create things. Every year, 300,000+ students across the country compete in engineering, coding, video, CAD, and design, Seven Lakes being one of the biggest, most-awarded chapters in Texas. We build, compete, and travel from Regionals to State all the way to Nationals (to win!).";

// Short, search-result-friendly summary (~150 chars) for the default meta description.
export const metaDescription =
  "SLHS TSA is one of Texas's biggest, most-awarded Technology Student Association chapters — students compete in engineering, coding, CAD, and design.";

// Career-spanning totals across every SLHS TSA season.
export const achievements = [
  { stat: "12+", text: "unique national top-ten placements" },
  { stat: "25+", text: "unique state top-ten placements" },
  { stat: "50+", text: "unique individual national qualifiers" },
  { stat: "2nd", text: "place School Award at State, out of 125 high schools" },
];

/** This past season's headline placements (2025-26). */
export const seasonHighlights = {
  season: "2025-26",
  nationals: {
    qualifiers: 14,
    placements: [
      { place: "4th", event: "Video Game Design" },
      { place: "10th", event: "Chapter Team" },
    ],
  },
  state: {
    placements: [
      { place: "2nd", event: "CAD – Engineering" },
      { place: "4th", event: "Geospatial Technology" },
      { place: "4th", event: "Video Game Design" },
      { place: "5th", event: "Prepared Presentation" },
      { place: "5th", event: "Technology Bowl" },
      { place: "6th", event: "Forensic Science" },
      { place: "7th", event: "Chapter Team" },
    ],
  },
};

export const meetings = {
  blurb: "The 26-27 meeting schedule is TBD.",
};

/**
 * Meeting slide decks
 * Add an entry after each meeting, e.g.:
 * { date: "Sep 4, 2026", title: "Kickoff — welcome to TSA!", url: "https://www.canva.com/design/...", platform: "canva" }
 */
export type SlideDeck = {
  date: string;
  title: string;
  url: string;
  platform: "canva" | "google";
};

export const meetingSlides: SlideDeck[] = [];

/**
 * CEG Navigation decks. One master deck walks the whole Competitive Events
 * Guide; each event gets its own deck as they're made.
 * ▸ To add a deck: paste its Canva share link into `canvaUrl`
 *   (looks like "https://www.canva.com/design/XXXX/YYYY/view").
 *   The page turns it into an embed automatically.
 * ▸ To add an event: append { name: "Animation", canvaUrl: null } to
 *   `events` once TSA releases the 26-27 event list.
 */
export type CegDeck = { name: string; canvaUrl: string | null };

export const ceg = {
  master: { name: "CEG", canvaUrl: null } as CegDeck,
  events: [] as CegDeck[],
};

export const competing = {
  points: [
    {
      title: "Static events",
      text: "you do most of the work before the conference and submit it. Think Webmaster or Engineering Design.",
    },
    {
      title: "Non-static events",
      text: "these happen live at the conference, like Technology Bowl or Extemporaneous Speech.",
    },
    {
      title: "Our advice",
      text: "pick 2 or 3 events and mix both kinds.",
    },
    {
      title: "Levels",
      text: "Regionals in February, State in April, Nationals in late June. Place well and you move on to the next one.",
    },
  ],
};

/**
 * Officer bios: the `bio` string shows on the BACK of each officer's card
 * (tap a badge on the Officers page and it flips over).
 * ▸ To add one, type your blurb between the quotes on the `bio:` line
 *   (e.g. bio: "Senior. Loves CAD and robotics. 3rd year in TSA.").
 * ▸ Leave it "" and the back shows a little "coming soon" note instead.
 */
export const officers: Officer[] = [
  {
    name: "Vitor Jones Anicio",
    role: "President",
    shortRole: "Prez",
    group: "exec",
    photo: "/officers/vitor-jones-anicio.webp",
    alt: "Vitor Jones Anicio, SLHS TSA President",
    bio: "",
  },
  {
    name: "Niyatee Dalvi",
    role: "Vice President",
    shortRole: "VP",
    group: "exec",
    photo: "/officers/niyatee-dalvi.webp",
    alt: "Niyatee Dalvi, SLHS TSA Vice President",
    bio: "",
  },
  {
    name: "Arya Salem",
    role: "Secretary",
    shortRole: "Sec",
    group: "exec",
    photo: "/officers/arya-salem.webp",
    alt: "Arya Salem, SLHS TSA Secretary",
    bio: "",
  },
  {
    name: "Sanvi Singh",
    role: "Secretary",
    shortRole: "Sec",
    group: "exec",
    photo: "/officers/sanvi-singh.webp",
    alt: "Sanvi Singh, SLHS TSA Secretary",
    bio: "",
  },
  {
    name: "Azaan Noman",
    role: "Treasurer",
    shortRole: "Treas",
    group: "exec",
    photo: "/officers/azaan-noman.webp",
    alt: "Azaan Noman, SLHS TSA Treasurer",
    bio: "",
  },
  {
    name: "Rianna Ganta",
    role: "Reporter",
    shortRole: "Reporter",
    group: "exec",
    photo: "/officers/rianna-ganta.webp",
    alt: "Rianna Ganta, SLHS TSA Reporter",
    bio: "",
  },
  // Directors are listed alphabetically within each role.
  {
    name: "Alice Jin",
    role: "UTE Director",
    shortRole: "UTE",
    group: "directors",
    photo: "/officers/alice-jin.webp",
    alt: "Alice Jin, SLHS TSA UTE Director",
    bio: "",
  },
  {
    name: "Shaarika Ganti",
    role: "UTE Director",
    shortRole: "UTE",
    group: "directors",
    photo: "/officers/shaarika-ganti.webp",
    alt: "Shaarika Ganti, SLHS TSA UTE Director",
    bio: "",
  },
  {
    name: "Bella Xiang",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/bella-xiang.webp",
    alt: "Bella Xiang, SLHS TSA NQE Director",
    bio: "",
  },
  {
    name: "Elizabeth Hu",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/elizabeth-hu.webp",
    alt: "Elizabeth Hu, SLHS TSA NQE Director",
    bio: "",
  },
  {
    name: "Kelly Zheng",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/kelly-zheng.webp",
    alt: "Kelly Zheng, SLHS TSA NQE Director",
    bio: "",
  },
];

/** The tilted photo cards stacked on the homepage hero, top to bottom. */
export const stackCards: StackCard[] = [
  {
    label: "Nats 2026",
    photo: "/gallery/nationals.webp",
    alt: "SLHS TSA national qualifiers in blue blazers at the national conference",
    stickers: ["trophy", "firework", "shades"],
  },
  {
    label: "Nats with Lex!",
    photo: "/gallery/nationals-mascot.webp",
    alt: "SLHS TSA members posing with Lex the longhorn plush at the Gaylord National atrium",
    stickers: ["longhorn", "heart-orange", "confetti"],
  },
  {
    label: "Zoo picture",
    photo: "/gallery/zoo-gift-shop.webp",
    alt: "Members wearing panda headbands at the zoo gift shop on the chapter zoo trip",
    stickers: ["panda", "panda", "bamboo", "panda"],
  },
  {
    label: "Full chapter gym pic",
    photo: "/gallery/chapter-team.webp",
    alt: "The full SLHS TSA chapter posing on the gym bleachers",
    stickers: ["confetti", "heart-blue", "heart-orange"],
  },
];
