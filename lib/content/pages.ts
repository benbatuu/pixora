import { prisma } from "@/lib/db/prisma";
import {
  CONTACT_DEFAULTS,
  type ContactContent,
  type ContactInquiry,
  type ContactOffice,
} from "@/app/data/contact";
import { HOME_DEFAULTS, type HomeContent } from "@/app/data/home";
import { ABOUT_DEFAULTS, type AboutContent } from "@/app/data/about";
import { SERVICES_DEFAULTS, type ServicesContent } from "@/app/data/services";
import { NOT_FOUND_DEFAULTS, type NotFoundContent } from "@/app/data/not-found";
import {
  sectionDefsForPage,
  type ContactHeroPayload,
  type ContactInquiriesPayload,
  type ContactOfficesPayload,
  type ContactSocialsPayload,
  type HomeHeroPayload,
  type HomeMarqueePayload,
  type HomeBannerPayload,
  type HomeAboutPayload,
  type HomeServicesPayload,
  type HomeFeaturedPayload,
  type HomeAwardsPayload,
  type AboutHeroPayload,
  type AboutStatsPayload,
  type AboutSolutionsPayload,
  type AboutTeamPayload,
  type AboutAwardsPayload,
  type AboutMarqueePayload,
  type ServicesHeroPayload,
  type ServicesMarqueePayload,
  type ServicesCardsPayload,
  type ServicesCapsulesPayload,
  type ServicesStepsPayload,
  type ServicesFaqPayload,
  type ServicesBrandsPayload,
  type ServicesTestimonialsPayload,
  type NotFoundHeroPayload,
  type NotFoundLinksPayload,
} from "@/lib/content/section-types";
import { pickTranslation } from "@/lib/i18n/pick-translation";
import { getDefaultLocaleCode } from "@/lib/i18n/get-locale";

export type PageSectionsMap = Record<string, unknown>;

/**
 * Load section payloads for a page key + locale.
 * Prefer requested locale → default locale → first available → stub defaults.
 */
export async function getPageSections(
  pageKey: string,
  locale = "en",
): Promise<PageSectionsMap> {
  try {
    const defaultLocale = await getDefaultLocaleCode();
    const page = await prisma.page.findUnique({
      where: { key: pageKey },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
          include: {
            translations: { include: { locale: true } },
          },
        },
      },
    });

    if (!page || page.sections.length === 0) {
      return defaultSectionsForPage(pageKey);
    }

    const map: PageSectionsMap = {};
    for (const section of page.sections) {
      const tr = pickTranslation(
        section.translations,
        locale,
        defaultLocale,
      );
      if (tr?.payload != null) {
        map[section.sectionKey] = tr.payload;
      }
    }

    if (Object.keys(map).length === 0) {
      return defaultSectionsForPage(pageKey);
    }
    return map;
  } catch (e) {
    console.error("[content.getPageSections]", e);
    return defaultSectionsForPage(pageKey);
  }
}

function defaultSectionsForPage(pageKey: string): PageSectionsMap {
  const map: PageSectionsMap = {};
  for (const def of sectionDefsForPage(pageKey)) {
    map[def.sectionKey] = def.payload;
  }
  return map;
}

/** Resolve Contact UI props from section map (with hardcoded fallbacks). */
export async function getContactContent(locale = "en"): Promise<ContactContent> {
  const sections = await getPageSections("contact", locale);

  const hero = sections.hero as ContactHeroPayload | undefined;
  const inquiries = sections.inquiries as ContactInquiriesPayload | undefined;
  const offices = sections.offices as ContactOfficesPayload | undefined;
  const socials = sections.socials as ContactSocialsPayload | undefined;

  return {
    title: hero?.title ?? CONTACT_DEFAULTS.title,
    officesHeading: offices?.heading ?? CONTACT_DEFAULTS.officesHeading,
    inquiries: (inquiries?.items as ContactInquiry[] | undefined) ?? CONTACT_DEFAULTS.inquiries,
    offices: (offices?.offices as ContactOffice[] | undefined) ?? CONTACT_DEFAULTS.offices,
    socials: socials?.items ?? CONTACT_DEFAULTS.socials,
  };
}

export async function getHomeContent(locale = "en"): Promise<HomeContent> {
  const sections = await getPageSections("home", locale);
  const hero = sections.hero as HomeHeroPayload | undefined;
  const marquee = sections.marquee as HomeMarqueePayload | undefined;
  const banner = sections.banner as HomeBannerPayload | undefined;
  const about = sections.about as HomeAboutPayload | undefined;
  const services = sections.services as HomeServicesPayload | undefined;
  const featured = sections.featured as HomeFeaturedPayload | undefined;
  const awards = sections.awards as HomeAwardsPayload | undefined;

  return {
    hero: {
      ...HOME_DEFAULTS.hero,
      ...hero,
      items: hero?.items?.length ? hero.items : HOME_DEFAULTS.hero.items,
    },
    marquee: {
      tags: marquee?.tags?.length ? marquee.tags : HOME_DEFAULTS.marquee.tags,
    },
    banner: {
      ...HOME_DEFAULTS.banner,
      ...banner,
    },
    about: {
      ...HOME_DEFAULTS.about,
      ...about,
    },
    services: {
      header: {
        subtitle: services?.subtitle ?? HOME_DEFAULTS.services.header.subtitle,
        heading: services?.heading ?? HOME_DEFAULTS.services.header.heading,
      },
      items: services?.items?.length
        ? services.items
        : HOME_DEFAULTS.services.items,
    },
    featured: {
      ...HOME_DEFAULTS.featured,
      ...featured,
    },
    awards: {
      header: {
        subtitle: awards?.subtitle ?? HOME_DEFAULTS.awards.header.subtitle,
        title: awards?.title ?? HOME_DEFAULTS.awards.header.title,
        subtitle2: awards?.subtitle2 ?? HOME_DEFAULTS.awards.header.subtitle2,
      },
      items: awards?.items?.length ? awards.items : HOME_DEFAULTS.awards.items,
    },
  };
}

export async function getAboutContent(locale = "en"): Promise<AboutContent> {
  const sections = await getPageSections("about", locale);
  const hero = sections.hero as AboutHeroPayload | undefined;
  const stats = sections.stats as AboutStatsPayload | undefined;
  const solutions = sections.solutions as AboutSolutionsPayload | undefined;
  const team = sections.team as AboutTeamPayload | undefined;
  const awards = sections.awards as AboutAwardsPayload | undefined;
  const marquee = sections.marquee as AboutMarqueePayload | undefined;

  return {
    hero: {
      ...ABOUT_DEFAULTS.hero,
      ...hero,
      solutionsHeading:
        solutions?.heading ??
        hero?.solutionsHeading ??
        ABOUT_DEFAULTS.hero.solutionsHeading,
      teamHeading: team?.heading ?? hero?.teamHeading ?? ABOUT_DEFAULTS.hero.teamHeading,
      teamTitle: hero?.teamTitle ?? ABOUT_DEFAULTS.hero.teamTitle,
      discoverAllLabel:
        hero?.discoverAllLabel ?? ABOUT_DEFAULTS.hero.discoverAllLabel,
      awardsHeading:
        awards?.heading ?? hero?.awardsHeading ?? ABOUT_DEFAULTS.hero.awardsHeading,
      awardsTitle: hero?.awardsTitle ?? ABOUT_DEFAULTS.hero.awardsTitle,
      solutionsServicesLabel:
        hero?.solutionsServicesLabel ?? ABOUT_DEFAULTS.hero.solutionsServicesLabel,
      solutionsInfoLabel:
        hero?.solutionsInfoLabel ?? ABOUT_DEFAULTS.hero.solutionsInfoLabel,
    },
    stats: stats?.items?.length ? stats.items : ABOUT_DEFAULTS.stats,
    solutions: solutions?.items?.length
      ? solutions.items
      : ABOUT_DEFAULTS.solutions,
    team: team?.items?.length ? team.items : ABOUT_DEFAULTS.team,
    awards: awards?.items?.length ? awards.items : ABOUT_DEFAULTS.awards,
    marquee: {
      text: marquee?.text ?? ABOUT_DEFAULTS.marquee.text,
    },
  };
}

export async function getServicesContent(
  locale = "en",
): Promise<ServicesContent> {
  const sections = await getPageSections("services", locale);
  const hero = sections.hero as ServicesHeroPayload | undefined;
  const marquee = sections.marquee as ServicesMarqueePayload | undefined;
  const cards = sections.cards as ServicesCardsPayload | undefined;
  const capsules = sections.capsules as ServicesCapsulesPayload | undefined;
  const steps = sections.steps as ServicesStepsPayload | undefined;
  const faq = sections.faq as ServicesFaqPayload | undefined;
  const brands = sections.brands as ServicesBrandsPayload | undefined;
  const testimonials =
    sections.testimonials as ServicesTestimonialsPayload | undefined;

  return {
    hero: {
      ...SERVICES_DEFAULTS.hero,
      ...hero,
      capsulesSubtitle:
        capsules?.subtitle ??
        hero?.capsulesSubtitle ??
        SERVICES_DEFAULTS.hero.capsulesSubtitle,
      capsulesTitle:
        capsules?.title ??
        hero?.capsulesTitle ??
        SERVICES_DEFAULTS.hero.capsulesTitle,
      faqSubtitle:
        faq?.subtitle ?? hero?.faqSubtitle ?? SERVICES_DEFAULTS.hero.faqSubtitle,
      faqTitle: faq?.title ?? hero?.faqTitle ?? SERVICES_DEFAULTS.hero.faqTitle,
    },
    marquee: {
      tags: marquee?.tags?.length
        ? marquee.tags
        : SERVICES_DEFAULTS.marquee.tags,
    },
    cards: cards?.items?.length ? cards.items : SERVICES_DEFAULTS.cards,
    viewDetailsLabel:
      cards?.viewDetailsLabel ?? SERVICES_DEFAULTS.viewDetailsLabel,
    capsules: capsules?.items?.length
      ? capsules.items
      : SERVICES_DEFAULTS.capsules,
    steps: steps?.items?.length ? steps.items : SERVICES_DEFAULTS.steps,
    stepsMeta: {
      eyebrow:
        steps?.stepsEyebrow ?? SERVICES_DEFAULTS.stepsMeta?.eyebrow,
      title: steps?.stepsTitle ?? SERVICES_DEFAULTS.stepsMeta?.title,
      subtitle:
        steps?.stepsSubtitle ?? SERVICES_DEFAULTS.stepsMeta?.subtitle,
      stepLabel:
        steps?.stepLabel ?? SERVICES_DEFAULTS.stepsMeta?.stepLabel,
    },
    faqs: faq?.items?.length ? faq.items : SERVICES_DEFAULTS.faqs,
    brands: brands?.urls?.length ? brands.urls : SERVICES_DEFAULTS.brands,
    testimonials: testimonials?.items?.length
      ? testimonials.items
      : SERVICES_DEFAULTS.testimonials,
  };
}


export async function getNotFoundContent(
  locale = "en",
): Promise<NotFoundContent> {
  const sections = await getPageSections("not-found", locale);
  const hero = sections.hero as NotFoundHeroPayload | undefined;
  const links = sections.links as NotFoundLinksPayload | undefined;

  return {
    hero: {
      ...NOT_FOUND_DEFAULTS.hero,
      ...hero,
    },
    links: links?.links?.length ? links.links : NOT_FOUND_DEFAULTS.links,
  };
}

export function publicPathForPageKey(key: string): string {
  switch (key) {
    case "home":
      return "/";
    case "about":
      return "/about";
    case "services":
      return "/services";
    case "contact":
      return "/contact";
    case "not-found":
      return "404";
    default:
      return `/p/${key}`;
  }
}

export type OrderedPageSection = {
  sectionKey: string;
  type: string;
  sortOrder: number;
  payload: unknown;
};

/** Ordered sections with type — for generic /p/[pageKey] renderer. */
export async function listOrderedPageSections(
  pageKey: string,
  locale = "en",
): Promise<OrderedPageSection[]> {
  try {
    const defaultLocale = await getDefaultLocaleCode();
    const page = await prisma.page.findUnique({
      where: { key: pageKey },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
          include: {
            translations: { include: { locale: true } },
          },
        },
      },
    });
    if (!page || page.sections.length === 0) {
      return sectionDefsForPage(pageKey).map((def, i) => ({
        sectionKey: def.sectionKey,
        type: def.type,
        sortOrder: i,
        payload: def.payload,
      }));
    }
    return page.sections.map((section) => {
      const tr = pickTranslation(
        section.translations,
        locale,
        defaultLocale,
      );
      return {
        sectionKey: section.sectionKey,
        type: section.type,
        sortOrder: section.sortOrder,
        payload: tr?.payload ?? {},
      };
    });
  } catch (e) {
    console.error("[content.listOrderedPageSections]", e);
    return sectionDefsForPage(pageKey).map((def, i) => ({
      sectionKey: def.sectionKey,
      type: def.type,
      sortOrder: i,
      payload: def.payload,
    }));
  }
}
