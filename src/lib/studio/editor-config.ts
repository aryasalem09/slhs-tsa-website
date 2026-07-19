import type { StudioPage } from "./types";
import { isSafeInternalHref } from "../urls";

export type StudioEditorPath = ReadonlyArray<string | number>;

export const STUDIO_PAGE_ORDER = [
  "home",
  "about",
  "officers",
  "join",
  "ceg",
  "slides",
  "calendar",
  "gallery",
  "contact",
] as const;

const SECTION_ORDER: Record<string, readonly string[]> = {
  home: ["whatIsTsa", "stackCards", "achievements", "seasonHighlights", "socials"],
  about: ["achievements", "seasonHighlights", "meetings", "competing"],
  officers: ["officers"],
  join: ["links", "socials", "meetings"],
  ceg: ["ceg", "museum"],
  slides: ["meetingSlides"],
  calendar: ["calendarEmbedSrc", "meetings"],
  gallery: ["scrapbook", "seasons"],
  contact: ["email", "address", "socials", "directions"],
};

const SECTION_LABELS: Record<string, Record<string, string>> = {
  home: {
    whatIsTsa: "About TSA",
    stackCards: "Homepage photos",
    achievements: "Achievement numbers",
    seasonHighlights: "Season highlights",
    socials: "Social links",
  },
  about: {
    achievements: "Achievement numbers",
    seasonHighlights: "Season highlights",
    meetings: "Meeting details",
    competing: "Competing 101",
  },
  officers: { officers: "Officer profiles" },
  join: {
    links: "Registration & dues",
    socials: "Remind, Discord & Instagram",
    meetings: "Meeting message",
  },
  ceg: {
    ceg: "CEG slide decks",
    museum: "Museum submission",
  },
  slides: { meetingSlides: "Meeting slides" },
  calendar: {
    calendarEmbedSrc: "Chapter calendar",
    meetings: "Meeting message",
  },
  gallery: {
    scrapbook: "Loose photos",
    seasons: "Photos by season",
  },
  contact: {
    email: "Contact email",
    address: "School address",
    socials: "Social links",
    directions: "Directions link",
  },
};

const FIELD_LABELS: Record<string, string> = {
  alt: "Image description",
  blurb: "Message shown on the page",
  calendarEmbedSrc: "Google Calendar embed link",
  canvaUrl: "Canva slideshow link",
  href: "Link",
  master: "Master CEG slideshow",
  payNGo: "Pay N' Go link",
  photo: "Photo",
  registrationForm: "Registration form link",
  shortForm: "Museum submission form",
  src: "Image",
};

const OBJECT_FIELD_ALLOWLISTS: Record<string, ReadonlySet<string>> = {
  "pages.join.sections.links": new Set(["registrationForm", "payNGo"]),
  "pages.ceg.sections.museum": new Set(["shortForm"]),
};

const OBJECT_FIELD_ORDERS: Record<string, readonly string[]> = {
  "pages.join.sections.links": ["registrationForm", "payNGo"],
  "pages.ceg.sections.museum": ["shortForm"],
};

const SECTION_HELP: Record<string, Record<string, string>> = {
  join: {
    links: "These are the only two links used by the registration and dues steps on the Join page.",
    socials: "Update the three places new members use to stay connected.",
    meetings: "This short message appears beneath the How to Join heading.",
  },
  ceg: {
    ceg: "Open a slideshow to change its name or Canva link. The master guide appears before the individual event guides.",
    museum: "This link powers the Submit a project button in the Museum section of the CEG page.",
  },
  gallery: {
    scrapbook: "These loose photos appear at the top of the Gallery. Open a photo to change its image, description, or caption.",
    seasons: "Open a school year, then an album, then a photo. Each card shows what is inside before you open it.",
  },
};

const COLLECTION_HINTS: Record<string, string> = {
  scrapbook: "Open a photo to edit it. New photos are added to the bottom of this loose-photo group.",
  seasons: "Open a school year to manage its albums.",
  albums: "Open an album to manage its photos.",
  photos: "Open a photo to edit its image and description.",
  events: "Open a slideshow to edit its event name or Canva link.",
  officers: "Open an officer to edit their profile.",
};

export function studioPageEntries(pages: Record<string, StudioPage>) {
  return Object.entries(pages)
    .filter(([key]) => key !== "museum")
    .sort(([left], [right]) => rank(STUDIO_PAGE_ORDER, left) - rank(STUDIO_PAGE_ORDER, right) || left.localeCompare(right));
}

export function studioSectionEntries(pageKey: string, sections: Record<string, unknown>) {
  const order = SECTION_ORDER[pageKey] ?? [];
  return Object.entries(sections)
    .filter(([key]) => !(pageKey === "ceg" && key === "competing") && !(pageKey === "about" && key === "whatIsTsa"))
    .sort(([left], [right]) => rank(order, left) - rank(order, right) || left.localeCompare(right));
}

export function studioPageLabel(pageKey: string, fallback: string) {
  return pageKey === "ceg" ? "CEG + Museum" : fallback;
}

export function studioSectionLabel(pageKey: string, sectionKey: string) {
  return SECTION_LABELS[pageKey]?.[sectionKey] ?? humanize(sectionKey);
}

export function studioFieldLabel(path: StudioEditorPath, fallback: string) {
  const key = String(path.at(-1) ?? "");
  return FIELD_LABELS[key] ?? fallback;
}

export function studioSectionHelp(pageKey: string, sectionKey: string | undefined) {
  if (sectionKey && SECTION_HELP[pageKey]?.[sectionKey]) return SECTION_HELP[pageKey][sectionKey];
  return "Edit the fields below and watch the real page update in the preview.";
}

export function studioCollectionHint(path: StudioEditorPath) {
  return COLLECTION_HINTS[String(path.at(-1) ?? "").toLowerCase()];
}

export function editorPathKey(path: StudioEditorPath) {
  return path.map(String).join(".");
}

export function visibleEditorObjectEntries(path: StudioEditorPath, value: Record<string, unknown>) {
  const pathKey = editorPathKey(path);
  const allowed = OBJECT_FIELD_ALLOWLISTS[pathKey];
  const order = OBJECT_FIELD_ORDERS[pathKey] ?? [];
  const entries = Object.entries(value).filter(([key]) => (!allowed || allowed.has(key)) && isUsefulEditorField(path, key));
  return order.length ? entries.sort(([left], [right]) => rank(order, left) - rank(order, right) || left.localeCompare(right)) : entries;
}

export function isStudioReviewPathRelevant(path: StudioEditorPath) {
  if (pathStartsWith(path, ["pages", "ceg", "sections", "competing"])) return false;
  if (path.length < 1) return true;
  const parentPath = path.slice(0, -1);
  const key = String(path.at(-1));
  if (/^(id|slug)$/i.test(key)) return false;
  const allowed = OBJECT_FIELD_ALLOWLISTS[editorPathKey(parentPath)];
  if (allowed && !allowed.has(key)) return false;
  if (pathStartsWith(parentPath, ["pages", "gallery"]) && /^(w|h|stickers|note)$/i.test(key)) return false;
  return true;
}

export function isStudioLinkField(key: string) {
  const linkWords = new Set(["url", "href", "link", "src", "embed", "directions", "website", "official", "form", "photo", "image", "portrait", "cover", "instagram", "discord", "remind"]);
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return words.some((word) => linkWords.has(word)) || /^payn?go$/.test(key.replace(/[^a-z0-9]/gi, "").toLowerCase());
}

export function isValidStudioLink(key: string, value: string) {
  if (/^canvaUrl$/i.test(key)) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "www.canva.com" && url.pathname.startsWith("/design/");
    } catch {
      return false;
    }
  }
  if (isSafeInternalHref(value) || /^#[^\u0000-\u001f\u007f]*$/.test(value) || /^(mailto:|tel:)/i.test(value)) return true;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return true;
  } catch {
    return false;
  }
}

function isUsefulEditorField(parentPath: StudioEditorPath, key: string) {
  const allowed = OBJECT_FIELD_ALLOWLISTS[editorPathKey(parentPath)];
  if (allowed && !allowed.has(key)) return false;
  if (/^(id|slug)$/i.test(key)) return false;
  if (pathStartsWith(parentPath, ["pages", "gallery"]) && /^(w|h|stickers|note)$/i.test(key)) return false;
  return true;
}

function pathStartsWith(path: StudioEditorPath, prefix: StudioEditorPath) {
  return prefix.every((part, index) => path[index] === part);
}

function rank(order: readonly string[], value: string) {
  const index = order.indexOf(value);
  return index < 0 ? Number.MAX_SAFE_INTEGER : index;
}

function humanize(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
