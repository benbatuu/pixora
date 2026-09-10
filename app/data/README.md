# app/data — seed + content fallbacks only

These modules provide **defaults** for `pnpm db:seed` and for `lib/content/*` when the DB has no rows.

Do **not** import them for live admin counts or inbox. Public pages should load via content getters (`getHomeContent`, `getAboutContent`, `getServicesContent`, `getContactContent`, `getNotFoundContent`, `getSiteSettings`).

| File | Purpose |
|------|---------|
| `site.ts` | Global brand / contact / SEO settings |
| `home.ts` | Home section defaults |
| `about.ts` | About page defaults |
| `services.ts` | Services page defaults |
| `contact.ts` | Contact page defaults |
| `not-found.ts` | 404 page defaults |
| `projects.ts` / `blog.ts` / `messages.ts` | Seed stubs for those entities |

See `docs/CONTENT_MODEL.md` for section type mapping.
