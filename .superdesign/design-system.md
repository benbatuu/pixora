# Pixora Design System — Admin Panel Extension

## Product
**Pixora** is a design studio marketing site (Next.js App Router, Tailwind v4). The **Admin Panel** lets Batuhan manage the entire public site content end-to-end: pages, projects, blog, media, contact info, nav/footer, and SEO — without editing code.

## Brand (hard constraints)
- Primary accent: `#e11010` (never orange)
- Black: `#0a0a0a`, elevated surfaces `#1e1e1e` / `#111214`
- Body text: `#6d6868`
- Background: `#ffffff` / soft gray panels `#f7f7f7`
- Fonts: **Inter** for all admin UI chrome, forms, tables; **Thunder** only for rare large section titles (optional)
- Radius: pills `rounded-full` for primary buttons; cards `rounded-2xl`; inputs `rounded-xl`
- Density: tighter than marketing site; comfortable SaaS spacing (16–24px gaps)
- No glassmorphism overload; clean, professional, high-contrast

## Admin information architecture
1. **Dashboard** — KPIs (projects, posts, messages), recent activity, quick actions
2. **Sayfalar (Pages)** — section editors for Home / About / Services / Contact (hero copy, CTAs, stats, FAQ, offices)
3. **Projeler (Projects)** — list + create/edit (title, slug, tags, cover, gallery, case study fields)
4. **Blog** — list + create/edit (title, slug, category, cover, body, publish state)
5. **Medya** — upload grid, search, replace, delete
6. **Mesajlar** — contact form inbox
7. **Ayarlar** — studio contact, social links, navigation labels, SEO defaults, logo

## Admin shell layout
- Left **sidebar** (~260px): Pixora wordmark/logo, nav groups, collapse on mobile
- **Top bar**: breadcrumb, global search, “View site” link, user avatar
- **Main**: white content area on `#f7f7f7` canvas
- Primary CTA: black or red filled pill buttons with white text
- Secondary: ghost / outline
- Tables: zebra-light, row hover, status badges (Published / Draft)
- Forms: labeled fields, helper text in body gray, sticky save bar on edit screens

## Language
Admin UI copy in **Turkish** (user preference). Content fields remain English (site is EN).

## Out of scope for first design set
- Full auth provider screens beyond a clean login
- Complex role permissions UI
- Analytics deep-dive charts (simple sparklines OK on dashboard)
