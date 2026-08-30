# officer list

## where to edit

the officer list in `src/content/site.ts` under `officers` powers the cards at `/officers`. edit that array directly. the public page is `src/app/officers/page.tsx`.

## adding an officer

add one complete item:

```ts
{
  name: "First Last",
  role: "NQE Director",
  shortRole: "NQE",
  group: "directors",
  photo: "/officers/first-last.webp",
  alt: "First Last, SLHS TSA NQE Director",
  grade: "Junior",
  hobbies: [],
  favoriteArtists: [],
}
```

use `group: "exec"` for the executive board and `group: "directors"` for directors. UTE and NQE placement is decided by `shortRole`, not `role`: use `UTE` or `NQE` exactly.

## order and grades

the public page preserves the array order within each section. keep directors alphabetical within each role and use consistent role wording, such as `UTE Director` or `NQE Director`.

allowed grades are `Sophomore`, `Junior`, and `Senior`, or an empty string when no grade should appear. hobbies and favorite artists must be lists, not one comma-separated value.

## privacy and checks

treat this as public student content. get approval before publishing a name, portrait, grade, hobbies, or favorite artists. do not add personal email addresses, phone numbers, home addresses, student ids, class schedules, or unapproved social accounts.

before committing, confirm all required fields, group and short role values, card order, and portrait alt text. open `/officers` and check each changed card on desktop and mobile, then run `npm test`, `npm run lint`, and `npm run typecheck`.
