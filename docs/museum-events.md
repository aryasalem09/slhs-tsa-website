# museum events

## where to edit

the event museum on `/ceg` reads from `src/content/museum.ts`.

- `museumEvents` is the NQE list.
- `uteMuseumEvents` is the UTE list.

## event shape

every event has this shape:

```ts
{
  title: "Event name",
  description: "Short event description.",
  details: [],
  examples: [
    {
      label: "Nationals 2026 Fourth Place",
      links: [{ label: "Project artifact", href: "https://example.com/project" }],
    },
  ],
}
```

keep `details` empty unless the component and tests are intentionally updated together. the order of each array is the visible order in its NQE or UTE tab.

## adding an NQE event or artifact

add an NQE event to `museumEvents` only with its official name and overview. use a unique title. every example label must state a placement, such as `Nationals 2026 Fourth Place`. every link must use the literal label `Project artifact` and a public HTTP(S) artifact URL. do not add generic resources, guides, prompts, portfolios, or unplaced work. do not reuse an artifact under another NQE event.

the tests require exactly 40 distinct NQE events and validate the official description digest. if official descriptions change, update the data and test expectation together after checking the source.

## adding a UTE event or example

add UTE content to `uteMuseumEvents`. use an approved local anonymized PDF whenever possible:

```ts
{ label: "View submission", href: "/museum/ute/yearbook-layout.pdf" }
```

place the matching file at `public/museum/ute/yearbook-layout.pdf`. local filenames must use lowercase letters, numbers, and hyphens followed by `.pdf`. approved YouTube links are also supported when they do not identify the submitter. do not add Google Drive or Google Docs links.

remove names, school ids, email addresses, social handles, file-owner information, and identifying metadata before publishing a UTE artifact. use labels such as `Anonymous 2026 submission`; do not include contributor attribution.

## checks

confirm every artifact opens without a login. for NQE, verify the placement label and `Project artifact` link label. for UTE, confirm the visible file and URL contain no submitter attribution. run `npm test`, `npm run lint`, and `npm run typecheck`, then open `/ceg`, switch both tabs, and test the changed link.
