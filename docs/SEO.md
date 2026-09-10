# SEO, GEO & LLM settings

Production canonical: **https://getpixoria.com** (`seo.canonicalBaseUrl` / `NEXT_PUBLIC_SITE_URL`).

Admin UI: **SEO & AI** → `/admin/seo` (ADMIN only). Data: `Setting.key = "site"` nested `seo` / `geo` / `llm`.

## SEO tab

- Global title, description, `%s | Pixora` template, keywords, canonical base URL (no trailing slash)
- Open Graph / Twitter, robots index/follow, Google & Bing verification
- Per-page overrides (`home`, `about`, `services`, `projects`, `blog`, `contact`, `not-found`):
  - Shared `noindex`
  - Per-locale copy under `pages[key].i18n[locale]` (`title`, `subtitle`, `description`, `ogImageUrl`)
  - Legacy top-level `title` / `subtitle` / `description` / `ogImageUrl` = EN fallback (kept in sync with `i18n.en`)
  - Admin chrome-tab preview shows resolved document title + subtitle (or studio name)

`resolvePageSeo(page, locale)` merges `i18n[locale]` → `i18n.en` → legacy fields.  
`buildPageMetadata(settings, pageKey, { path, locale })` uses the request locale; titles containing `|` (or empty template) become absolute; otherwise the root `titleTemplate` applies. Canonical paths are locale-prefixed for non-default locales.

Applied via `buildRootMetadata` / `buildPageMetadata` in `lib/seo/metadata.ts`. Blog posts use translation `seoTitle` / `seoDescription` when set; projects fall back to title / about.

## GEO tab

When `geo.enabled`, public layout emits JSON-LD (`WebSite` + `Organization` | `LocalBusiness` | `ProfessionalService`) with address, `geo` coordinates, `knowsLanguage`, `sameAs` from socials, and logo from brand. Root metadata also outputs `geo.region` / `geo.placename` / `geo.position` / `ICBM` when set.

Blog posts add `BlogPosting` + `FAQPage` JSON-LD (from `app/data/blog-articles.ts`) and Open Graph `article` type.

## LLM tab

- `llm.enabled` gates `/llms.txt`
- Empty `llmsTxt` → auto markdown from summary + key URLs
- `allowTraining: false` blocks training-oriented bots (GPTBot, Google-Extended) in robots unless overridden; ChatGPT-User stays allow by default
- Per-bot allow/block: GPTBot, ChatGPT-User, Google-Extended, ClaudeBot, PerplexityBot, Bytespider, Anthropic-AI

## Public routes

| Path | Source |
|------|--------|
| `/robots.txt` | `app/robots.ts` |
| `/sitemap.xml` | `app/sitemap.ts` |
| `/llms.txt` | `app/llms.txt/route.ts` |

Settings PUT revalidates `/`, main pages, `/robots.txt`, `/sitemap.xml`, `/llms.txt`.

## Blog (6 posts, EN / TR / RU)

Source of truth: `app/data/blog-articles.ts` (seed + DB-empty fallback). Slugs:

- `/blog/brand-systems-that-scale`
- `/blog/motion-graphics-that-clarify`
- `/blog/ux-writing-meets-visual-design`
- `/blog/design-studio-website-that-converts`
- `/blog/ai-tools-in-creative-workflows`
- `/blog/from-identity-to-launch`

Locale URLs: `/tr/blog/...`, `/ru/blog/...`. Re-seed with `pnpm db:seed` after copy changes.
