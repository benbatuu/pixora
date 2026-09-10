# Page dependency trees (public)

## / (Home)
Entry: `app/(site)/page.tsx`
Dependencies:
- `app/components/HeroCollage.tsx`
- `app/components/TagMarquee.tsx`
- `app/components/Banner.tsx`
- `app/components/About.tsx`
- `app/components/Services.tsx`
- `app/components/Projects.tsx`
- `app/components/Awards.tsx`
- via SiteChrome: Header, Footer, PageTransition, BackToTop

## /projects
Entry: `app/(site)/projects/page.tsx`
- `app/components/pages/ProjectsPageContent.tsx`
- `app/data/projects.ts`

## /blog
Entry: `app/(site)/blog/page.tsx`
- `app/components/pages/BlogPageContent.tsx`
- `app/data/blog.ts`

## /contact
Entry: `app/(site)/contact/page.tsx`
- `app/components/pages/ContactPageContent.tsx`

## Admin
Not implemented — new target. Will introduce admin shell + CMS screens.
