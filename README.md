# SLHS TSA Website
The official website for the Seven Lakes High School Technology Student Association!

## Stack
- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS v4 (design tokens live in `src/app/globals.css`)
- `motion` for the officer-card tilt (adapted from ReactBits — see
  `src/components/reactbits/`, license included there)

## Developing

```bash
npm install
npm run dev        # http://127.0.0.1:3000
npm run dev:network # optional: expose port 3000 to your local network
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

`npm run dev` always uses port 3000. If it reports `EADDRINUSE`, a local server
is already using that port; reuse the open preview or stop that process before
starting another copy.

## Editing content
All portraits and photos and logos are in `public/`

Check **`src/content/site.ts`** to edit:
- Nav
- Socials
- Officer Roster
- Achievements
- Meeting Info
- Join Steps
- Meeting Slide

Gallery albums live in **`src/content/gallery.ts`**.

__Python scripts for the assets are in `scripts/`.__

# Meeting Slide Procedure 
After each meeting, add the deck link to `meetingSlides` in
`src/content/site.ts` and it appears on the Slides page.

## Still to do
- `XX` placeholders in `src/content/site.ts`
- Set the 26–27 meeting schedule (currently TBD).
- Swap in the 26–27 registration form URL when sign-ups open
  (`registrationForm` in `src/content/site.ts`).
- Confirm the 26–27 Remind class code (currently `@slhstsa26`).
- Build the CEG Navigation page (August).
- Fill the TSA Museum with the 2022 Drive archive.
