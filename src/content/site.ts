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
};

export type StackCard = {
  label: string;
  photo: string;
  alt: string;
  /** Easter egg: named cartoon stickers (see stickers-art.ts) that pop out on click. */
  stickers?: string[];
};

export type SearchEntry = {
  label: string;
  href: string;
  hint: string;
  keywords: string[];
  external?: boolean;
};

export const site = {
  name: "SLHS TSA",
  fullName: "Seven Lakes High School Technology Student Association",
  school: "Seven Lakes High School",
  address: "9251 S Fry Rd, Katy, TX 77494",
  email: "sltechnologystudentassociation@gmail.com",

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
  },
} as const;

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "CEG", href: "/ceg" },
  { label: "TSA Museum", href: "/museum" },
  { label: "Slides", href: "/slides" },
  { label: "Calendar", href: "/calendar" },
];

export const whatIsTsa =
  "The Technology Student Association is a national org of 300,000+ students who compete in everything from engineering and coding to film, fashion, and flight. SLHS TSA is Seven Lakes' chapter — one of the strongest in Texas.";

// TODO(content): fill in the real numbers
export const achievements = [
  { stat: "XX", text: "unique national top-ten placements" },
  { stat: "XX", text: "unique state top-ten placements" },
  { stat: "XX", text: "unique individual national qualifiers" },
  { stat: "XX", text: "place School Award at State, out of 125 high schools" },
];

export const meetings = {
  blurb: "The 26–27 meeting schedule is TBD.",
  note: "We'll announce it on Remind & Discord — dates will land on the calendar.",
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

export const competing = {
  points: [
    {
      title: "Static events",
      text: "mostly completed before the conference — you build, write, or film ahead of time (think Webmaster or Engineering Design).",
    },
    {
      title: "Non-static events",
      text: "mostly completed at the conference — on-site challenges and presentations (think Technology Bowl or Extemporaneous Speech).",
    },
    {
      title: "Our advice",
      text: "pick a mix of 2–3 events so your season has both a long-term project and some conference-day fun.",
    },
    {
      title: "Levels",
      text: "Regionals (February) → State (April) → Nationals (late June). Place well at one and you advance to the next.",
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
  },
  {
    name: "Niyatee Dalvi",
    role: "Vice President",
    shortRole: "VP",
    group: "exec",
    photo: "/officers/niyatee-dalvi.webp",
    alt: "Niyatee Dalvi, SLHS TSA Vice President",
  },
  {
    name: "Arya Salem",
    role: "Secretary",
    shortRole: "Sec",
    group: "exec",
    photo: "/officers/arya-salem.webp",
    alt: "Arya Salem, SLHS TSA Secretary",
  },
  {
    name: "Sanvi Singh",
    role: "Secretary",
    shortRole: "Sec",
    group: "exec",
    photo: "/officers/sanvi-singh.webp",
    alt: "Sanvi Singh, SLHS TSA Secretary",
  },
  {
    name: "Azaan Noman",
    role: "Treasurer",
    shortRole: "Treas",
    group: "exec",
    photo: "/officers/azaan-noman.webp",
    alt: "Azaan Noman, SLHS TSA Treasurer",
  },
  {
    name: "Rianna Ganta",
    role: "Reporter",
    shortRole: "Reporter",
    group: "exec",
    photo: "/officers/rianna-ganta.webp",
    alt: "Rianna Ganta, SLHS TSA Reporter",
  },
  {
    name: "Shaarika Ganti",
    role: "UTE Director",
    shortRole: "UTE",
    group: "directors",
    photo: "/officers/shaarika-ganti.webp",
    alt: "Shaarika Ganti, SLHS TSA UTE Director",
  },
  {
    name: "Alice Jin",
    role: "UTE Director",
    shortRole: "UTE",
    group: "directors",
    photo: "/officers/alice-jin.webp",
    alt: "Alice Jin, SLHS TSA UTE Director",
  },
  {
    name: "Kelly Zheng",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/kelly-zheng.webp",
    alt: "Kelly Zheng, SLHS TSA NQE Director",
  },
  {
    name: "Bella Xiang",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/bella-xiang.webp",
    alt: "Bella Xiang, SLHS TSA NQE Director",
  },
  {
    name: "Elizabeth Hu",
    role: "NQE Director",
    shortRole: "NQE",
    group: "directors",
    photo: "/officers/elizabeth-hu.webp",
    alt: "Elizabeth Hu, SLHS TSA NQE Director",
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

export const searchIndex: SearchEntry[] = [
  { label: "Home", href: "/", hint: "Start here", keywords: ["home", "main", "start"] },
  {
    label: "About SLHS TSA",
    href: "/about",
    hint: "Achievements, meetings, leadership",
    keywords: ["about", "achievements", "awards", "meetings", "chapter"],
  },
  {
    label: "Gallery",
    href: "/gallery",
    hint: "The scrapbook — photos by season",
    keywords: ["gallery", "photos", "pictures", "scrapbook", "memories", "24-25", "25-26"],
  },
  {
    label: "Meeting Slides",
    href: "/slides",
    hint: "Every meeting's deck, any time",
    keywords: ["slides", "meeting slides", "presentations", "canva", "decks", "recap"],
  },
  {
    label: "Officers",
    href: "/officers",
    hint: "Meet the 26–27 officer team",
    keywords: ["officers", "president", "vice president", "secretary", "treasurer", "reporter", "ute", "nqe", "leadership", "team"],
  },
  {
    label: "How to Join",
    href: "/join",
    hint: "Form, dues, Remind & Discord",
    keywords: ["join", "sign up", "register", "membership", "dues", "pay n go", "form"],
  },
  {
    label: "Calendar",
    href: "/calendar",
    hint: "Meetings, deadlines, socials, trips",
    keywords: ["calendar", "dates", "events", "meetings", "deadlines", "schedule"],
  },
  {
    label: "Contact Us",
    href: "/contact",
    hint: "Email the chapter",
    keywords: ["contact", "email", "message", "reach", "question", "help"],
  },
  {
    label: "CEG Navigation",
    href: "/ceg",
    hint: "Competitive Events Guide (under construction)",
    keywords: ["ceg", "competitive events guide", "events", "rules", "rubric"],
  },
  {
    label: "TSA Museum",
    href: "/museum",
    hint: "Chapter archive (under construction)",
    keywords: ["museum", "archive", "history", "photos", "gallery"],
  },
  {
    label: "Competing 101",
    href: "/about#competing",
    hint: "Static vs non-static, levels",
    keywords: ["static", "non-static", "regionals", "state", "nationals", "competitions"],
  },
  {
    label: "Instagram",
    href: site.socials.instagram,
    hint: "@slhs.tsa",
    keywords: ["instagram", "insta", "social", "photos"],
    external: true,
  },
  {
    label: "Discord",
    href: site.socials.discord,
    hint: "Chapter server",
    keywords: ["discord", "chat", "server", "social"],
    external: true,
  },
  {
    label: "Remind",
    href: site.socials.remind,
    hint: "@slhstsa26 announcements",
    keywords: ["remind", "announcements", "notifications", "text"],
    external: true,
  },
  {
    label: "Official TSA website",
    href: site.links.tsaOfficial,
    hint: "tsaweb.org",
    keywords: ["tsa", "national", "official", "tsaweb"],
    external: true,
  },
  {
    label: "Pay N' Go (dues)",
    href: site.links.payNGo,
    hint: "Katy ISD payment portal",
    keywords: ["pay", "dues", "payngo", "pay n go", "membership fee"],
    external: true,
  },
];
