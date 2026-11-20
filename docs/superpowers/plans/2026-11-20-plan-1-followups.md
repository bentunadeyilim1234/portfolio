# Plan 1: Notes Carried Into Later Plans

These are the small items deferred while Plan 1 was being built. None of them blocks a merge. The "Plan" column says where each should be handled.

## Rules for Plan 2 and later

| Note | Plan |
|---|---|
| `.env.local` was pulled from **production**, so local `npm run dev` writes go to the live Neon DB. Open a Neon dev branch before starting Plan 2. | 2 |
| Every server action / route handler must call `requireAdmin()`; hiding the UI is not enough. Wrap `getSession` in `cache()`. | 2 |
| Pass `token: process.env.BLOB_READ_WRITE_TOKEN` explicitly on Blob uploads, otherwise the local `VERCEL_OIDC_TOKEN` hijacks auth and the upload fails. | 3, 4 |
| Admin input must only accept images on the pinned Blob host (`next/image` 500s on other hosts). | 3, 4 |
| Slugs must not contain `.` (a slug ending in `.word` falls outside the proxy and gets the plain 404). | 3, 4 |
| Validate block `size` on write (`sizeClass` returns undefined for an invalid value). | 2 |
| `BlockGrid` registry renderers must stay synchronous, use no hooks, and return `null` directly when there's nothing to show. | 2, 6 |
| The icon picker should list `Object.keys(icons)` (lucide has no aliases: `Home` → falls back to `Circle`). | 2 |
| `markdown.css` is only loaded by the site layout; the admin preview must import it too. | 4 |
| If `rehype-raw`/`allowDangerousHtml` is ever enabled, restore the sanitize `clobberPrefix`. | 4 |
| Island bar: once Plan 5/6 add the guestbook tab and coffee button, the width on narrow screens needs rechecking (horizontal scroll is in place; an edge fade/affordance is missing). | 5, 6 |
| The two root layouts (site/admin) repeat ~15 lines (fonts, tier script, ThemeProvider); extract a shared shell before Plan 2 touches both. | 2 |

## Small debt (whenever convenient)

- Auth: logging in again doesn't revoke the previous session; expired sessions are never purged; scrypt doesn't take a `maxmem` parameter (must be added in the same change if N is ever raised above 16384).
- LangToggle: on the EN page the accessible name "Switch language to Türkçe" doesn't contain the visible "TR" (WCAG 2.5.3) → "… (TR)".
- Cookie name `lang` is repeated as a literal in proxy and LangToggle; could become a single `LANG_COOKIE` constant.
- Refract tier on mid-range phones (8 cores / 4 GB) needs a real-device check; add a `(pointer: coarse)` guard if needed.
- Island bar: droplet shadow is clipped inside the scroll area; resizing mid-slide skips the animation; refraction map may flash for one frame when regenerated on resize.
- Without JS, the 404 page's server output is empty (Next 16 behaviour; status code is correct).
- Each 404 request makes one Neon query (`force-dynamic` + layout settings).
- Medium card may clip the badge on 320px screens.
- Post `limit` is applied after fetching; no tiebreak for equal `position`.
- Tests: ip test mutates env; password edge cases are thin; gallery test is brittle; no tests for placeholder/badge/blog page.
- `npm audit`: 4 high-severity zod findings coming via `@vercel/blob` (look at in Plan 3).
- Markdown tables are `display:block` (can weaken table semantics for screen readers).
