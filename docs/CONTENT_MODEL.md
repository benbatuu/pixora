# Pixora Content Model

Public marketing copy is CMS-driven via Prisma `Page` / `PageSection` / `PageSectionTranslation` and `Setting` (`key: "site"`). Defaults live in `app/data/*` and are used only when DB is empty.

## Site settings (`Setting.key = "site"`)

| Field | UI | Used by |
|-------|----|---------|
| `studioName`, `email`, `phone`, `address`, `socials`, `seo` | Ayarlar | Footer, SEO, offcanvas |
| `brand.logoLightUrl`, `logoDarkUrl?`, `logoAlt`, `faviconUrl?` | Ayarlar → Marka / Logo | Header, AdminSidebar |
| `headerSocials?` | (JSON / socials) | Header offcanvas icons |
| `footerTagline`, `footerContactEmail`, `footerContactPhone`, `footerAddress` | Ayarlar (legacy / EN fallback) | Footer |
| `offcanvasTitle`, `offcanvasEmail`, `offcanvasPhone`, `offcanvasMeta` | Ayarlar (legacy fallback) | Header offcanvas |
| `chrome[locale].*` | **Bileşenler** (`/admin/components`) | Footer + Header offcanvas per-locale copy |
| `contactForm[locale].*` | **Bileşenler → İletişim formu** | Contact form placeholders / submit / success |

**Bileşenler** = footer / offcanvas per-locale chrome (`SiteSettings.chrome`) + contact form (`SiteSettings.contactForm`). Prefer `chrome[locale]` over top-level fields; `getChrome(settings, locale)` in `lib/content/chrome.ts`. Contact page prefers `contactForm[locale]` over `lib/i18n/ui` dict.

Public API: `GET /api/public/site` → `{ settings, locales }`


### SEO / GEO / LLM (`seo`, `geo`, `llm`)

Admin: **SEO & AI** (`/admin/seo`) — ADMIN only. Tabs: SEO | GEO | LLM. Saved via `PUT /api/admin/settings` on the same `site` blob.

| Nested | Purpose | Public |
|--------|---------|--------|
| `seo` | Titles, description, template, keywords, canonical base, OG/Twitter, robots, verification, per-page overrides | Root + page `generateMetadata`, favicon from `brand.faviconUrl` |
| `geo` | LocalBusiness / Organization JSON-LD (coords, address, areaServed) | `(site)/layout` → `JsonLd` |
| `llm` | `llms.txt` body + AI bot allow/block | `/llms.txt`, `/robots.txt` |

Public endpoints:

- `/robots.txt` — `app/robots.ts` (index + LLM user-agents)
- `/sitemap.xml` — `app/sitemap.ts` (static + published projects/posts; uses `seo.canonicalBaseUrl`)
- `/llms.txt` — `app/llms.txt/route.ts` (404 if `llm.enabled === false`)

Defaults live in `app/data/site.ts`. `mergeSettings` deep-merges `seo` / `geo` / `llm` so older DB rows still load.

## Page sections

Admin: **Sayfalar → [page]** (`PageSectionsEditor`). Complex payloads edit as JSON + locale tabs. Registry: `lib/content/section-types.ts`.

### `home`

| sectionKey | type | UI |
|------------|------|----|
| `hero` | `home_hero` | HeroCollage items + bottom tagline |
| `marquee` | `home_marquee` | TagMarquee tags |
| `banner` | `home_banner` | Banner image |
| `about` | `home_about` | Home About block |
| `services` | `home_services` | Home Services list |
| `featured` | `home_featured` | “Featured work” heading / CTA |
| `awards` | `home_awards` | Home Awards list |

### `about`

| sectionKey | type | UI |
|------------|------|----|
| `hero` | `about_hero` | Title, intro, banner, video, approach copy |
| `stats` | `about_stats` | Counters |
| `marquee` | `about_marquee` | Marquee text |
| `solutions` | `about_solutions` | Solutions list |
| `team` | `about_team` | Team cards |
| `awards` | `about_awards` | Awards list |

### `services`

| sectionKey | type | UI |
|------------|------|----|
| `hero` | `services_hero` | Hero title, intro, video, headings |
| `marquee` | `services_marquee` | Red marquee strings |
| `cards` | `services_cards` | Service cards |
| `capsules` | `services_capsules` | Physics capsules |
| `testimonials` | `services_testimonials` | Testimonials |
| `brands` | `services_brands` | Brand logos |
| `steps` | `services_steps` | Process steps |
| `faq` | `services_faq` | FAQ accordion |

### `contact`

| sectionKey | type | UI |
|------------|------|----|
| `hero` | `contact_hero` | Title |
| `inquiries` | `contact_inquiries` | Inquiry columns |
| `offices` | `contact_offices` | Offices |
| `socials` | `contact_socials` | Social labels |


### `not-found`

| sectionKey | type | UI |
|------------|------|----|
| `hero` | `not_found_hero` | 404 code, title, description, CTAs, background/align, optional image |
| `links` | `not_found_links` | Quick links under the hero |

Public: root `app/not-found.tsx` (+ `(site)/not-found.tsx`); robots noindex.

Public API: `GET /api/public/pages/[key]?locale=` → `{ key, path, locale, sections }` (published only)

## Content getters

- `lib/content/settings.ts` → `getSiteSettings()`
- `lib/content/pages.ts` → `getHomeContent`, `getAboutContent`, `getServicesContent`, `getContactContent`, `getNotFoundContent`, `getPageSections`

## Intentional non-CMS

- Layout / GSAP / Framer / Swiper animation code
- Social icon SVG paths in Header/Footer (labels/hrefs from settings)
- Projects & blog lists (own Prisma models)


## AuditLog

Admin mutations write best-effort rows via `lib/admin/audit.ts`. UI: `/admin/audit` (ADMIN). Filter by `entityType`.

## Translation coverage

`GET /api/admin/i18n/coverage` — per active locale % of projects/posts/page sections/nav translations vs default-locale baseline. Shown on `/admin/locales`.

## Media seed

`prisma/seed.ts` inserts `MediaAsset` for key `/assets/img/{hero,logo,team,brand,...}` so Medya library is not empty after seed.

## Dynamic pages

Published `Page.key` without a dedicated `(site)` route is available at `/p/[pageKey]`.
