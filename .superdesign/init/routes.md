# Routes (public site today)

| Path | File | Content |
|------|------|---------|
| `/` | `app/(site)/page.tsx` | Home: HeroCollage, TagMarquee, Banner, About, Services, Projects, Awards |
| `/about` | `app/(site)/about/page.tsx` | AboutPageContent |
| `/services` | `app/(site)/services/page.tsx` | ServicesPageContent |
| `/projects` | `app/(site)/projects/page.tsx` | ProjectsPageContent |
| `/projects/[slug]` | `app/(site)/projects/[slug]/page.tsx` | ProjectDetailContent + `app/data/projects.ts` |
| `/blog` | `app/(site)/blog/page.tsx` | BlogPageContent |
| `/blog/[slug]` | `app/(site)/blog/[slug]/page.tsx` | BlogDetailContent + `app/data/blog.ts` |
| `/contact` | `app/(site)/contact/page.tsx` | ContactPageContent |

## Planned Admin (not built yet)
| Path | Purpose |
|------|---------|
| `/admin` | Dashboard overview |
| `/admin/login` | Auth |
| `/admin/pages` | Editable page sections (Home/About/Services/Contact) |
| `/admin/projects` | Projects CRUD |
| `/admin/blog` | Blog posts CRUD |
| `/admin/media` | Media library |
| `/admin/settings` | Site settings: nav, footer, contact, socials, SEO |
| `/admin/messages` | Contact form inquiries (optional) |
