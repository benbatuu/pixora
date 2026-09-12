import type { Metadata } from "next";
import Link from "next/link";
import HeroCollage from "../components/HeroCollage";
import TagMarquee from "../components/TagMarquee";
import Banner from "../components/Banner";
import About from "../components/About";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Awards from "../components/Awards";
import { listProjects } from "@/lib/content/projects";
import { getHomeContent } from "@/lib/content/pages";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { getSiteSettings } from "@/lib/content/settings";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getUi } from "@/lib/i18n/ui";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getRequestLocale(),
  ]);
  return buildPageMetadata(settings, "home", { path: "/", locale });
}

export default async function HomePage() {
  // getRequestLocale is React.cache()'d per request (also used in generateMetadata).
  const locale = await getRequestLocale();
  const [projects, content] = await Promise.all([
    listProjects({ publishedOnly: true, locale }),
    getHomeContent(locale),
  ]);
  const ui = getUi(locale);

  return (
    <>
      <HeroCollage
        items={content.hero.items}
        defaultActive={content.hero.defaultActive}
        ctaHref={content.hero.ctaHref}
        bottomLeft={content.hero.bottomLeft}
        bottomRight={content.hero.bottomRight}
        bottomTagline={content.hero.bottomTagline}
      />
      <TagMarquee tags={content.marquee.tags} />
      <Banner src={content.banner.src} alt={content.banner.alt} />
      <About {...content.about} />
      <Services
        items={content.services.items}
        subtitle={content.services.header.subtitle}
        heading={content.services.header.heading}
      />
      <section className="w-full py-2 md:py-10 px-4 ">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-thunder text-[clamp(40px,7vw,96px)] leading-none text-[var(--px-black)]">
            {content.featured.title}
          </h2>
          <Link
            href={content.featured.viewAllHref}
            className="inline-flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-wide text-[var(--px-red)] underline-offset-4 hover:underline"
          >
            {content.featured.viewAllLabel}
          </Link>
        </div>
      </section>
      <Projects projects={projects} limit={content.featured.limit ?? 3} />
      <Awards
        items={content.awards.items}
        subtitle={content.awards.header.subtitle}
        title={content.awards.header.title}
        subtitle2={content.awards.header.subtitle2}
        awardCol={ui.awardCol}
        nominationCol={ui.nominationCol}
        yearCol={ui.yearCol}
      />
    </>
  );
}
