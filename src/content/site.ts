export type NavItem = { label: string; href: string };

export type Officer = {
  name: string;
  role: string;
  shortRole: string;
  group: "exec" | "directors";
  photo: string;
  alt: string;
  grade: "" | "Sophomore" | "Junior" | "Senior";
  hobbies: string[];
  favoriteArtists: string[];
};

export type StackCard = {
  label: string;
  photo: string;
  alt: string;
  /** easter egg sticker identifiers displayed when the card is selected. */
  stickers?: string[];
};

export const site = {
  name: "SLHS TSA",
  fullName: "Seven Lakes High School Technology Student Association",
  school: "Seven Lakes High School",
  address: "9251 S Fry Rd, Katy, TX 77494",
  email: "sltechnologystudentassociation@gmail.com",
  url: "https://www.slhstsa.org",

  socials: {
    instagram: "https://www.instagram.com/slhs.tsa/",
    discord: "https://discord.gg/SfUX5YwBxK",
    remind: "https://www.remind.com/join/7lakestsa",
  },

  links: {
    tsaOfficial: "https://tsaweb.org/",
    mapsDirections:
      "https://www.google.com/maps/dir/?api=1&destination=Seven+Lakes+High+School%2C+9251+S+Fry+Rd%2C+Katy%2C+TX+77494",
    payNGo: "https://katyisd.revtrak.net/",
    registrationForm: "https://forms.gle/EDFKiCRnekHmHfC98",
    calendarEmbedSrc:
      "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&showPrint=0&src=c2x0ZWNobm9sb2d5c3R1ZGVudGFzc29jaWF0aW9uQGdtYWlsLmNvbQ&src=ODA0NGU4MjVlZjNkMjFlZjdmMDRlNDA0NzcxMTRmZmMwMzYyMzNiZjIyNGE3YTc3NDIyZjIzNGU5ZTViYjNjZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Mjk0MDZhM2VhOGNjZTIxZjJhMjk0NmNmZDVmYTRjYThjNDA1YTY1MjNmYjljZjY0ZTQ5NmEzMDE2NzRjYzE2M0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NTAxNzFmZjM3MzdkZTQ5ZTY3N2JiYTkxMWY3NGRiMmViYjMzMWQ0YjQ4OTc0OTkxODFlMDg5ODE1NWM4YzZlMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YjQ0YWQ3ZDc3Y2ViNDhmMGZkNDE5OGY4ZDZkZTdiMDBmNWE5MzU5YzE5MDg3MzI2NmIyYjhiZWYzOWFhZmNhNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23fea3c4&color=%23fffcbf&color=%239cf09a&color=%237cbbf7&color=%237986cb&color=%23bcbebd",
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

export const moreNav: NavItem[] = [
  { label: "Gallery", href: "/gallery" },
  { label: "Contact us", href: "/contact" },
];

export const whatIsTsa =
  "TSA is the club for people who like to build and create things. Every year, 300,000+ students across the country compete in engineering, coding, video, CAD, and design, Seven Lakes being one of the biggest, most-awarded chapters in Texas. We build, compete, and travel from Regionals to State all the way to Nationals (to win!).";

export const metaDescription =
  "SLHS TSA is the Technology Student Association chapter at Seven Lakes High School in Katy, Texas.";

export const achievements = [
  { stat: "12+", text: "unique national top-ten placements" },
  { stat: "25+", text: "unique state top-ten placements" },
  { stat: "50+", text: "unique individual national qualifiers" },
  { stat: "2nd", text: "place School Award at State, out of 125 high schools" },
];

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

/** blocks the previously published placeholder from rendering. */
export function isStaleMeetingScheduleBlurb(value: string) {
  return /meeting\s+schedule\s+is\s+tbd\b/i.test(value.replace(/\s+/g, " "));
}

export type SlideDeck = {
  date: string;
  title: string;
  url: string;
  platform: "canva" | "google";
};

export const meetingSlides: SlideDeck[] = [
  {
    date: "August 27, 2026",
    title: "introductory meeting",
    url: "https://www.canva.com/design/DAHRvc4owNM/znsxsExX82lm7o90carAEA/view",
    platform: "canva",
  },
];

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

export const officers: Officer[] = [
  {
    name: "Vitor Jones Anicio",
    role: "President",
    shortRole: "Prez",
    group: "exec",
    photo: "/officers/vitor-jones-anicio.webp",
    alt: "Vitor Jones Anicio, SLHS TSA President",
    grade: "Senior",
    hobbies: ["Acting", "D&D"],
    favoriteArtists: ["The Beatles", "INOHA", "Gorillaz"],
  },
  {
    name: "Niyatee Dalvi",
    role: "Vice President",
    shortRole: "VP",
    group: "exec",
    photo: "/officers/niyatee-dalvi.webp",
    alt: "Niyatee Dalvi, SLHS TSA Vice President",
    grade: "",
    hobbies: [],
    favoriteArtists: [],
  },
  {
    name: "Arya Salem",
    role: "Secretary",
    shortRole: "Sec",
    group: "exec",
    photo: "/officers/arya-salem.webp",
    alt: "Arya Salem, SLHS TSA Secretary",
    grade: "Senior",
    hobbies: ["Valorant", "Rock Climbing"],
    favoriteArtists: ["The Weeknd", "Dhruv", "wave to earth"],
  },
  {
    name: "Sanvi Singh",
    role: "Secretary",
    shortRole: "Sec",
    group: "exec",
    photo: "/officers/sanvi-singh.webp",
    alt: "Sanvi Singh, SLHS TSA Secretary",
    grade: "Junior",
    hobbies: ["Writing", "Listening to Music", "Playing Video Games"],
    favoriteArtists: ["PinkPantheress", "Arctic Monkeys", "Tory Lanez"],
  },
  {
    name: "Azaan Noman",
    role: "Treasurer",
    shortRole: "Treas",
    group: "exec",
    photo: "/officers/azaan-noman.webp",
    alt: "Azaan Noman, SLHS TSA Treasurer",
    grade: "Junior",
    hobbies: ["Rock Climbing", "Burning Tokens"],
    favoriteArtists: ["Ariana Grande", "The Weeknd", "Charlie Puth"],
  },
  {
    name: "Rianna Ganta",
    role: "Reporter",
    shortRole: "Reporter",
    group: "exec",
    photo: "/officers/rianna-ganta.webp",
    alt: "Rianna Ganta, SLHS TSA Reporter",
    grade: "Sophomore",
    hobbies: [],
    favoriteArtists: ["Malcolm Todd", "Steve Lacy", "Kevin Abstract", "Men I Trust", "Lucaa"],
  },
  {
    name: "Alice Jin",
    role: "UTE Director",
    shortRole: "UTE",
    group: "directors",
    photo: "/officers/alice-jin.webp",
    alt: "Alice Jin, SLHS TSA UTE Director",
    grade: "Sophomore",
    hobbies: ["Doomscrolling", "Walking Around", "Listening to Music"],
    favoriteArtists: ["Conan Gray", "Secret Garden", "Olivia Rodrigo" ],
  },
  {
    name: "Shaarika Ganti",
    role: "UTE Director",
    shortRole: "UTE",
    group: "directors",
    photo: "/officers/shaarika-ganti.webp",
    alt: "Shaarika Ganti, SLHS TSA UTE Director",
    grade: "Senior",
    hobbies: ["Reading", "Dancing"],
    favoriteArtists: ["Tate McRae", "Chase Atlantic", "Taylor Swift", "Ariana Grande" ],
  },
  {
    name: "Bella Xiang",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/bella-xiang.webp",
    alt: "Bella Xiang, SLHS TSA NQE Director",
    grade: "Sophomore",
    hobbies: ["Art", "Dance", "Baking", "Crochet", "Music", "Deltarune"],
    favoriteArtists: ["Lorde", "Laufey", "beabadoobee"],
  },
  {
    name: "Elizabeth Hu",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/elizabeth-hu.webp",
    alt: "Elizabeth Hu, SLHS TSA NQE Director",
    grade: "Sophomore",
    hobbies: ["Reading", "Crochet", "Crafting", "Listening to Music", "Ceramics"],
    favoriteArtists: ["Olivia Rodrigo", "Stray Kids", "Hannah Bahng"],
  },
  {
    name: "Kelly Zheng",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/kelly-zheng.webp",
    alt: "Kelly Zheng, SLHS TSA NQE Director",
    grade: "Sophomore",
    hobbies: ["Minecraft", "Making Cards", "Playing Viola"],
    favoriteArtists: ["Dhruv", "Taylor Swift", "Lana Del Rey"],
  },
];

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
