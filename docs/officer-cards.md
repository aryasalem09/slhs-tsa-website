# officer cards

## where to edit

edit the officer data in `src/content/site.ts` under `officers`. do not edit `src/components/OfficerCard.tsx` to change one person's information; that file controls the shared card design.

## each officer card

each officer is one item with these fields:

```ts
{
  name: "First Last",
  role: "President",
  shortRole: "Prez",
  group: "exec",
  photo: "/officers/first-last.webp",
  alt: "First Last, SLHS TSA President",
  grade: "Senior",
  hobbies: ["Robotics", "Drawing"],
  favoriteArtists: ["Artist Name"],
}
```

`name`, `role`, `shortRole`, `photo`, and `alt` cannot be blank. `group` must be `exec` or `directors`. `grade` can be blank, `Sophomore`, `Junior`, or `Senior`. `hobbies` and `favoriteArtists` are lists, even when there is only one item.

## front and back

the front shows the photo, `role`, and `name`. the back shows the same name and role, then the grade sticker, hobbies, and favorite artists. leave `grade`, `hobbies`, and `favoriteArtists` empty only when that officer has not approved a bio yet. a blank grade means no grade sticker.

use a clear `alt` description that names the officer and role. do not use the filename as the description.

## photos and ordering

add an approved portrait under `public/officers/` and use its website path, such as `/officers/first-last.webp`. keep the image as a portrait; the card crops it to a 4:5 image area.

the array order is the public order within each section. the page separates the list into:

- `exec`: executive board
- `directors` with `shortRole: "UTE"`: UTE directors
- `directors` with `shortRole: "NQE"`: NQE directors

keep directors alphabetical within the same role. each card gets a stable anchor from the name, such as `#officer-arya-salem`, so change a name only when the public name itself changes.

## privacy and checks

only publish names, portraits, grades, hobbies, and favorite artists that the officer has approved for the public site. do not add personal contact details, home addresses, student ids, schedules, or private social links.

before committing, check the approved photo and alt text, confirm the intended executive, UTE, and NQE order, flip each changed card on `/officers`, and run `npm test`, `npm run lint`, and `npm run typecheck`.
