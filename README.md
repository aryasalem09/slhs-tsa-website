# SLHS TSA Website

The website for the Seven Lakes High School Technology Student Association —
built to feel like a cozy school scrapbook: paper textures, hand-drawn borders,
polaroids, ID-card officers, and an interactive particle Spartan.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS v4 (design tokens live in `src/app/globals.css`)
- `motion` for the officer-card tilt (adapted from ReactBits — see
  `src/components/reactbits/`, license included there)

## Developing

```bash
npm install
npm run dev        # local dev server
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## Editing content

Almost everything editable lives in **`src/content/site.ts`**: nav, socials,
officer roster, achievements, meeting info, join steps, meeting-slide decks,
and external links. Gallery albums live in **`src/content/gallery.ts`**.
Change them there and every page updates.

Officer portraits are in `public/officers/`, gallery photos in
`public/gallery/` (the 24–25 Wix migration under `public/gallery/24-25/`),
and logos (including the TSA-recolored Spartan) in `public/logos/`. The
Python scripts used to extract/optimize assets are in `scripts/`.

After each meeting, add the deck link to `meetingSlides` in
`src/content/site.ts` and it appears on the Slides page.

There's also an easter egg — click the Spartan in the footer.

## Still to do

- Fill in the real achievement numbers (currently `XX` placeholders in
  `src/content/site.ts`).
- Set the 26–27 meeting schedule (currently TBD).
- Swap in the 26–27 registration form URL when sign-ups open
  (`registrationForm` in `src/content/site.ts`).
- Confirm the 26–27 Remind class code (currently `@slhstsa26`).
- Add 25–26 State & Nationals photos to `src/content/gallery.ts`.
- Build the CEG Navigation page (August).
- Fill the TSA Museum with the 2022 Drive archive.
