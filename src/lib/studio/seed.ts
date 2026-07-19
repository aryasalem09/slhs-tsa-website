import {
  achievements,
  ceg,
  competing,
  meetingSlides,
  meetings,
  metaDescription,
  moreNav,
  nav,
  officers,
  seasonHighlights,
  site,
  stackCards,
  whatIsTsa,
} from "@/content/site";
import { scrapbook, seasons } from "@/content/gallery";
import { STUDIO_DOCUMENT_VERSION, type StudioDocument, type StudioThemePreset } from "./types";

const themePresets: StudioThemePreset[] = [
  { id: "slhs-blue", label: "SLHS scrapbook", tokens: { primary: "#005eab", accent: "#ef3224", surface: "#faf6ed", ink: "#253244" } },
  { id: "midnight", label: "Midnight tech", tokens: { primary: "#173f73", accent: "#ef5b45", surface: "#f4f7fb", ink: "#152238" } },
  { id: "sunset", label: "Spartan sunset", tokens: { primary: "#6d2858", accent: "#e94f37", surface: "#fff8f0", ink: "#2e1730" } },
];

const page = (route: string, title: string, description: string, sections: Record<string, unknown>) => ({ route, title, description, sections });

/** Canonical starter content. It intentionally mirrors all current content modules. */
export function createSeedDocument(): StudioDocument {
  return {
    version: STUDIO_DOCUMENT_VERSION,
    site: { ...site, metaDescription },
    navigation: { primary: nav, more: moreNav },
    pages: {
      home: page("/", "Home", metaDescription, { whatIsTsa, achievements, seasonHighlights, stackCards, socials: site.socials }),
      about: page("/about", "About", "About SLHS TSA", { whatIsTsa, achievements, seasonHighlights, competing, meetings }),
      officers: page("/officers", "Officers", "Meet the SLHS TSA officers", { officers }),
      join: page("/join", "Join", "Join SLHS TSA", { links: { registrationForm: site.links.registrationForm, payNGo: site.links.payNGo }, socials: site.socials, meetings }),
      ceg: page("/ceg", "CEG", "Competitive Events Guide and museum", { ceg, competing, museum: { shortForm: site.links.museumFormShort } }),
      slides: page("/slides", "Slides", "Meeting slide decks", { meetingSlides }),
      calendar: page("/calendar", "Calendar", "Chapter calendar", { calendarEmbedSrc: site.links.calendarEmbedSrc, meetings }),
      gallery: page("/gallery", "Gallery", "Competition, conference, and chapter photos", { scrapbook, seasons }),
      contact: page("/contact", "Contact", "Contact SLHS TSA", { email: site.email, address: site.address, socials: site.socials, directions: site.links.mapsDirections }),
      museum: page("/museum", "Museum", "Redirects to CEG", { redirectTo: "/ceg" }),
    },
    theme: { activePreset: "slhs-blue", presets: themePresets },
    updatedAt: new Date(0).toISOString(),
  };
}

export const studioSeedDocument = createSeedDocument();
