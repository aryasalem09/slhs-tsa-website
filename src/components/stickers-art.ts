/**
 * Hand-drawn cartoon sticker art for the gallery easter eggs.
 * Each entry is the inner markup of a 48x48 SVG — ink outlines, flat TSA-ish
 * fills, drawn to feel like the site's pencil-and-paper doodles.
 */

const INK = "#253244";
const BLUE = "#005eab";
const RED = "#ef3224";
const ORANGE = "#f68428";
const CREAM = "#f2e3c4";
const YELLOW = "#f6c453";
const GREEN = "#4a9b58";
const BROWN = "#c47b3d";
const BROWN_DARK = "#a05a28";
const GRAY = "#b9c4cf";

const S = `stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

export const STICKER_ART: Record<string, string> = {
  panda: `
    <circle cx="13" cy="13" r="6" fill="${INK}"/>
    <circle cx="35" cy="13" r="6" fill="${INK}"/>
    <circle cx="24" cy="26" r="15" fill="white" ${S}/>
    <ellipse cx="17.5" cy="23.5" rx="4.2" ry="5.4" fill="${INK}" transform="rotate(-14 17.5 23.5)"/>
    <ellipse cx="30.5" cy="23.5" rx="4.2" ry="5.4" fill="${INK}" transform="rotate(14 30.5 23.5)"/>
    <circle cx="18.4" cy="22.6" r="1.5" fill="white"/>
    <circle cx="29.6" cy="22.6" r="1.5" fill="white"/>
    <ellipse cx="24" cy="30" rx="2.4" ry="1.8" fill="${INK}"/>
    <path d="M20.5 34 q3.5 2.8 7 0" fill="none" ${S}/>`,

  bamboo: `
    <path d="M28 16 q9 -7 15 -5 q-4 8 -13 8" fill="${GREEN}" ${S}/>
    <path d="M20 26 q-10 -5 -15 -1 q5 7 13 5" fill="${GREEN}" ${S}/>
    <rect x="20.5" y="6" width="7" height="10.5" rx="3" fill="${GREEN}" ${S}/>
    <rect x="20.5" y="18.5" width="7" height="10.5" rx="3" fill="${GREEN}" ${S}/>
    <rect x="20.5" y="31" width="7" height="11" rx="3" fill="${GREEN}" ${S}/>`,

  star: `
    <path d="M24 5 L29.2 17.4 L42.6 18.5 L32.4 27.3 L35.5 40.4 L24 33.4 L12.5 40.4 L15.6 27.3 L5.4 18.5 L18.8 17.4 Z" fill="${YELLOW}" ${S}/>
    <circle cx="20" cy="23" r="1.4" fill="${INK}"/>
    <circle cx="28" cy="23" r="1.4" fill="${INK}"/>
    <path d="M20.5 27.5 q3.5 2.6 7 0" fill="none" ${S}/>`,

  trophy: `
    <path d="M13 8 h22 v9 c0 7.5 -5 12 -11 12 s-11 -4.5 -11 -12 z" fill="${YELLOW}" ${S}/>
    <path d="M13 11 c-6 0 -6 9 1 10" fill="none" ${S}/>
    <path d="M35 11 c6 0 6 9 -1 10" fill="none" ${S}/>
    <rect x="21" y="29" width="6" height="5" fill="${YELLOW}" ${S}/>
    <rect x="15" y="34" width="18" height="6" rx="2" fill="${ORANGE}" ${S}/>
    <path d="M20 13 l1.6 3.4 3.6 .4 -2.7 2.4 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.7 -2.4 3.6 -.4 z" fill="white" stroke="none"/>`,

  balloon: `
    <ellipse cx="24" cy="18" rx="11.5" ry="13.5" fill="${RED}" ${S}/>
    <ellipse cx="19.5" cy="13" rx="3" ry="4" fill="white" stroke="none" opacity="0.55" transform="rotate(-18 19.5 13)"/>
    <path d="M21.5 31.5 L24 34.5 L26.5 31.5 Z" fill="${RED}" ${S}/>
    <path d="M24 34.5 q-4 4 0 6 q4 2 1.5 5" fill="none" ${S}/>`,

  longhorn: `
    <path d="M11 17 C4 16 3 9 8 7 c3.5 -1.4 7 1.5 8 6" fill="${CREAM}" ${S}/>
    <path d="M37 17 C44 16 45 9 40 7 c-3.5 -1.4 -7 1.5 -8 6" fill="${CREAM}" ${S}/>
    <ellipse cx="24" cy="26" rx="12.5" ry="12" fill="${BROWN}" ${S}/>
    <path d="M14 20 q4 -7 10 -6 q7 -1 10 6 q-2 4 -5 4.5 q-5 -2.5 -10 0 q-3 -.5 -5 -4.5" fill="${BROWN_DARK}" ${S}/>
    <ellipse cx="24" cy="32.5" rx="7" ry="4.8" fill="${CREAM}" ${S}/>
    <circle cx="21" cy="32.5" r="1.3" fill="${INK}"/>
    <circle cx="27" cy="32.5" r="1.3" fill="${INK}"/>`,

  confetti: `
    <path d="M9 39 q4 -10 1 -22" fill="none" stroke="${RED}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M22 41 q1 -12 8 -24" fill="none" stroke="${BLUE}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M36 38 q4 -9 1 -17" fill="none" stroke="${ORANGE}" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="14" cy="10" r="2.4" fill="${BLUE}"/>
    <circle cx="27" cy="7" r="2.4" fill="${ORANGE}"/>
    <circle cx="39" cy="13" r="2.4" fill="${RED}"/>
    <path d="M20 16 l3 -3 M33 22 l3 -3" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,

  "heart-blue": `
    <path d="M24 41 C10 31 5 22 9 14.5 C12 9 19 8.5 24 15 C29 8.5 36 9 39 14.5 C43 22 38 31 24 41 Z" fill="${BLUE}" ${S}/>
    <path d="M14 16 q2 -3.5 6 -3" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>`,

  "heart-orange": `
    <path d="M24 41 C10 31 5 22 9 14.5 C12 9 19 8.5 24 15 C29 8.5 36 9 39 14.5 C43 22 38 31 24 41 Z" fill="${ORANGE}" ${S}/>
    <path d="M14 16 q2 -3.5 6 -3" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>`,

  flag: `
    <path d="M14 6 v36" ${S}/>
    <path d="M14 8 h24 l-4 6 4 6 h-24 z" fill="white" ${S}/>
    <rect x="14" y="8" width="6" height="6" fill="${INK}"/>
    <rect x="26" y="8" width="6" height="6" fill="${INK}"/>
    <rect x="20" y="14" width="6" height="6" fill="${INK}"/>
    <rect x="32" y="14" width="4.5" height="6" fill="${INK}"/>
    <circle cx="14" cy="6" r="2" fill="${RED}" ${S}/>`,

  wrench: `
    <path d="M39 9 a9 9 0 0 1 -10 14.5 L18 35 a5 5 0 1 1 -7 -7 L22.5 16.5 A9 9 0 0 1 37 6.5 l-6 6 1.5 4 4 1.5 z" fill="${GRAY}" ${S}/>
    <circle cx="14.5" cy="31.5" r="2" fill="white" ${S}/>`,

  pencil: `
    <polygon points="8 40 12.5 28.5 19.5 35.5" fill="${CREAM}" ${S}/>
    <polygon points="12.5 28.5 30 11 37 18 19.5 35.5" fill="${BLUE}" ${S}/>
    <polygon points="30 11 34 7 41 14 37 18" fill="${ORANGE}" ${S}/>
    <polygon points="8 40 10.5 33.8 14.2 37.5" fill="${INK}" stroke="none"/>`,

  pumpkin: `
    <path d="M22 10 q-2 -4 2 -6 q3 3 2 6" fill="none" stroke="${GREEN}" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="24" cy="27" rx="17" ry="14" fill="${ORANGE}" ${S}/>
    <path d="M17 13.8 q-5 6 -5 13 q0 7 5 12.5 M31 13.8 q5 6 5 13 q0 7 -5 12.5" fill="none" stroke="${BROWN_DARK}" stroke-width="1.8" opacity="0.6"/>
    <path d="M15 22 l3.5 5 h-7 z" fill="${INK}"/>
    <path d="M33 22 l3.5 5 h-7 z" fill="${INK}"/>
    <path d="M14 31 l3 3 3 -3 3 3 3 -3 3 3 3 -3 3 3 2 -2" fill="none" ${S}/>`,

  candy: `
    <path d="M12 17 L4 12 q3 5 2 12 q1 7 -2 12 L12 31 z" fill="${RED}" ${S}/>
    <path d="M36 17 L44 12 q-3 5 -2 12 q-1 7 2 12 L36 31 z" fill="${RED}" ${S}/>
    <circle cx="24" cy="24" r="10" fill="white" ${S}/>
    <path d="M18 16.5 q8 2 6 15 M24 14.5 q6 5 2 18" fill="none" stroke="${RED}" stroke-width="2.4" stroke-linecap="round"/>`,

  gingerbread: `
    <path d="M10 22 L24 8 L38 22 z" fill="${BROWN}" ${S}/>
    <path d="M10 22 q3 3 7 0 q3 3 7 0 q3 3 7 0 q3 3 7 0" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <rect x="12" y="24" width="24" height="17" fill="${BROWN_DARK}" ${S}/>
    <rect x="20.5" y="30" width="7" height="11" rx="3.5" fill="${RED}" ${S}/>
    <circle cx="15.5" cy="28" r="1.8" fill="${YELLOW}"/>
    <circle cx="32.5" cy="28" r="1.8" fill="${GREEN}"/>
    <circle cx="15.5" cy="36" r="1.8" fill="white"/>
    <circle cx="32.5" cy="36" r="1.8" fill="${BLUE}"/>`,

  firework: `
    <circle cx="24" cy="24" r="3.4" fill="${YELLOW}" ${S}/>
    <path d="M24 14 v-7 M24 34 v7 M14 24 h-7 M34 24 h7" stroke="${RED}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M16.9 16.9 l-5 -5 M31.1 31.1 l5 5 M16.9 31.1 l-5 5 M31.1 16.9 l5 -5" stroke="${BLUE}" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="24" cy="4.5" r="1.7" fill="${RED}"/>
    <circle cx="43.5" cy="24" r="1.7" fill="${RED}"/>
    <circle cx="9.5" cy="9.5" r="1.7" fill="${BLUE}"/>
    <circle cx="38.5" cy="38.5" r="1.7" fill="${BLUE}"/>`,

  shades: `
    <path d="M5 15 q19 -4 38 0" fill="none" ${S}/>
    <path d="M7 15 h15 v5 q0 8 -7.5 8 q-7.5 0 -7.5 -8 z" fill="${INK}" ${S}/>
    <path d="M26 15 h15 v5 q0 8 -7.5 8 q-7.5 0 -7.5 -8 z" fill="${INK}" ${S}/>
    <path d="M22 17.5 q2 -1.5 4 0" fill="none" ${S}/>
    <path d="M10.5 18.5 q1.5 -2 4 -1.5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>`,

  burger: `
    <path d="M9 21 q0 -12 15 -12 q15 0 15 12 z" fill="${YELLOW}" ${S}/>
    <path d="M9 24 q5 5 10 0 q5 5 10 0 q5 5 10 0" fill="none" stroke="${GREEN}" stroke-width="3.4" stroke-linecap="round"/>
    <rect x="9" y="28" width="30" height="5.5" rx="2.75" fill="${BROWN_DARK}" ${S}/>
    <path d="M10 36 h28 q0 6 -6 6 h-16 q-6 0 -6 -6 z" fill="${YELLOW}" ${S}/>
    <circle cx="18" cy="14" r="1" fill="${INK}"/>
    <circle cx="25" cy="12.5" r="1" fill="${INK}"/>
    <circle cx="31" cy="15" r="1" fill="${INK}"/>`,

  fries: `
    <rect x="17.5" y="6" width="4.5" height="18" rx="2" fill="${YELLOW}" ${S}/>
    <rect x="23.5" y="4" width="4.5" height="18" rx="2" fill="${YELLOW}" ${S}/>
    <rect x="29.5" y="7" width="4.5" height="16" rx="2" fill="${YELLOW}" ${S}/>
    <rect x="12.5" y="9" width="4.5" height="15" rx="2" fill="${YELLOW}" ${S}/>
    <path d="M11 20 h26 l-3.5 22 h-19 z" fill="${RED}" ${S}/>
    <path d="M15 26 q9 4 18 0" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round"/>`,

  smiley: `
    <circle cx="24" cy="24" r="17" fill="${YELLOW}" ${S}/>
    <circle cx="18" cy="20" r="2" fill="${INK}"/>
    <circle cx="30" cy="20" r="2" fill="${INK}"/>
    <path d="M15.5 28 q8.5 8 17 0" fill="none" ${S}/>`,

  "paper-plane": `
    <path d="M6 22 L42 9 L30 40 L23 29 Z" fill="${CREAM}" ${S}/>
    <path d="M42 9 L23 29 L23 37 L27 32" fill="white" ${S}/>
    <path d="M12 34 q-4 2 -7 1 M16 39 q-3 3 -7 3" fill="none" stroke="${BLUE}" stroke-width="2" stroke-linecap="round"/>`,

  ruler: `
    <g transform="rotate(-20 24 32)">
      <rect x="4" y="26" width="40" height="12" rx="2" fill="${YELLOW}" ${S}/>
      <path d="M11 26 v4 M17 26 v4 M23 26 v7 M29 26 v4 M35 26 v4"
        stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
    </g>`,

  gear: `
    <path d="M21.5 6 h5 l1 4.5 4 1.6 4 -2.5 3.5 3.5 -2.5 4 1.6 4 4.5 1 v5 l-4.5 1 -1.6 4 2.5 4 -3.5 3.5 -4 -2.5 -4 1.6 -1 4.5 h-5 l-1 -4.5 -4 -1.6 -4 2.5 -3.5 -3.5 2.5 -4 -1.6 -4 -4.5 -1 v-5 l4.5 -1 1.6 -4 -2.5 -4 3.5 -3.5 4 2.5 4 -1.6 z" fill="${GRAY}" ${S}/>
    <circle cx="24" cy="24" r="6" fill="white" ${S}/>`,
};

/** Wrap a sticker's inner art in a standalone SVG string (for tooling). */
export function stickerSvg(name: string): string | null {
  const art = Object.hasOwn(STICKER_ART, name) ? STICKER_ART[name] : null;
  if (!art) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${art}</svg>`;
}
