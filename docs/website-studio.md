# Canvas Studio operations guide

Canvas Studio is the signed-in, no-code editor for the SLHS TSA website. It
stores one private draft and one public published document in Supabase. Until
Supabase is configured and a document is published, the public pages use the
repository seed content. Open the editor at `/studio/login`.

## What members can edit

The editor exposes the safe, content-driven parts of the site: page text and
links, repeatable lists and cards, images, navigation, site details, and theme
colors. List controls (add, duplicate, move, and remove), undo/redo, device
preview, the review checklist, publishing, and revision restore are functional.

Studio documents are a versioned contract (`version: 1`) shared by the editor
and public renderer. Public routes and React page templates remain code-owned.
Adding a new route, template field, or document version requires a code and
validation-schema change. Always inspect the draft preview before publishing.

## Environment variables

Create `.env.local` with these exact names:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
# Legacy projects may use SUPABASE_SERVICE_ROLE_KEY instead.
```

Put development values in `.env.local`, which is ignored by Git. The secret
key is server-only: never prefix it with `NEXT_PUBLIC_`, expose it in browser
code, paste it into documentation, or commit it.

## Local Supabase

The repository includes `supabase/config.toml` and a tracked Studio migration.
From the repository root:

```powershell
npx supabase start
npx supabase db reset
```

`start` reports the local API URL and keys. Put the API URL, publishable key,
and server-only secret key in `.env.local`, then run `npm run dev`. `db reset`
reapplies the tracked migrations and deletes local database data; never use it
for a hosted project or local data that must be retained.

## Hosted Supabase

Create or select the intended Supabase project, obtain its project URL,
publishable key, and server-only secret key, then authenticate and link the
repository before applying the tracked migration:

```powershell
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Replace `<project-ref>` with the real project reference and verify the linked
project before `db push`. The migration creates the Studio tables, row-level
security policies, database functions, revision history, audit trail, and the
private `studio-media` bucket.

## Provision users

After applying the migration, provide `NEXT_PUBLIC_SUPABASE_URL` and
`SUPABASE_SECRET_KEY` in the shell and run:

```powershell
node scripts/create-studio-user.mjs <username> admin <display name>
```

The command prompts for a hidden password of 12--256 characters. For a
noninteractive job, provide it in `STUDIO_USER_PASSWORD` for that process only.
Do not put a password on the command line. The script also supports `publisher`
and `editor`. Usernames must be 3--64 lowercase characters from `a-z`, `0-9`,
`.`, `_`, and `-`; a display name is required. If profile creation fails, the
script rolls the newly created auth user back.

| Role | Permissions |
| --- | --- |
| `editor` | Sign in, read Studio content, save drafts, and upload media. |
| `publisher` | Editor permissions plus publish and revision restore. |
| `admin` | Publisher permissions plus database-level audit-event access. |

There is no `viewer` Studio role. Public visitors can read only the current
published document and media referenced by that published document.

## Editorial workflow

1. Sign in at `/studio/login`. A first save materializes the seed document as a
   private draft.
2. Edit through the inspector. Changes autosave after a short delay; wait for
   **All changes saved**. If Studio reports a conflict, reload and reconcile the
   newer draft instead of overwriting it.
3. Check the real page in desktop, tablet, and mobile preview. Draft content is
   kept out of the normal public site and published SEO metadata.
4. Open **Review & publish**. Resolve blocking structure, link, or image-label
   issues. Only a publisher or administrator can confirm publication.
5. Publishing copies the draft to the public document, creates an immutable
   revision, and revalidates the supported public paths.
6. To roll back, open **Version history**, restore a revision to a new draft,
   inspect it, and publish that draft. Restore never changes the live site by
   itself.

## Media privacy

Use JPEG, PNG, or WebP files smaller than 8 MB. Studio strips image metadata,
limits pixel dimensions, converts uploads to WebP, and stores them in the
private `studio-media` bucket under the signed-in user's ID. A Studio media URL
is served publicly only while it is referenced by the current published
document. Upload only approved, privacy-safe student and officer imagery.

## Vercel and validation

Set all three environment variables for each intended Vercel environment using
the hosted Supabase values. The URL and publishable key may reach the browser;
the secret key must remain server-only. Redeploy through the project's normal
workflow after changing variables. This guide does not deploy the site.

Before release, run:

```powershell
npm run lint
npm run typecheck
npm run build
```

## Backup and troubleshooting

- Keep revision history and use the organization's approved Supabase backup
  process before a meaningful release. Revisions protect Studio documents, not
  the entire database or storage bucket.
- "Studio is not configured" means the URL or publishable key is absent. Login
  and provisioning also require the secret key.
- A login failure usually means the username/profile was not provisioned or the
  password is invalid. The provisioning script refuses duplicate usernames.
- A 409 save conflict means another save changed the draft first. Reload before
  retrying so a newer draft is not overwritten.
- Media upload failures can indicate an unsupported type, an input over 8 MB,
  excessive pixel dimensions, image-processing failure, or unavailable storage.
- If public pages show seed content, confirm the hosted environment is
  configured and a publisher/admin has published a draft.
