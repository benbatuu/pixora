import { z } from "zod";
import { CONTACT_DEFAULTS } from "@/app/data/contact";
import { HOME_DEFAULTS } from "@/app/data/home";
import { ABOUT_DEFAULTS } from "@/app/data/about";
import { SERVICES_DEFAULTS } from "@/app/data/services";
import { NOT_FOUND_DEFAULTS } from "@/app/data/not-found";

/** Shared section type ids used in PageSection.type */
export const SECTION_TYPE_IDS = [
  // contact
  "contact_hero",
  "contact_inquiries",
  "contact_offices",
  "contact_socials",
  // generic (legacy)
  "hero",
  "faq",
  // home
  "home_hero",
  "home_marquee",
  "home_banner",
  "home_about",
  "home_services",
  "home_featured",
  "home_awards",
  // about
  "about_hero",
  "about_stats",
  "about_solutions",
  "about_team",
  "about_awards",
  "about_marquee",
  // services
  "services_hero",
  "services_marquee",
  "services_cards",
  "services_capsules",
  "services_steps",
  "services_faq",
  "services_brands",
  "services_testimonials",
  // not-found
  "not_found_hero",
  "not_found_links",
] as const;

export type SectionTypeId = (typeof SECTION_TYPE_IDS)[number];

export const contactHeroSchema = z.object({
  title: z.string(),
});

export const contactInquiriesSchema = z.object({
  items: z.array(
    z.object({
      label: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      lines: z.array(z.string()).optional(),
    }),
  ),
});

export const contactOfficesSchema = z.object({
  heading: z.string().optional(),
  offices: z.array(
    z.object({
      city: z.string(),
      lines: z.array(z.string()),
      phone: z.string(),
      email: z.string(),
    }),
  ),
});

export const contactSocialsSchema = z.object({
  items: z.array(z.string()),
});

export const heroSchema = z.object({
  title: z.string().default(""),
  subtitle: z.string().optional(),
});

export const faqSchema = z.object({
  items: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .default([]),
});

const homeHeroItemSchema = z.object({
  src: z.string(),
  title: z.string(),
  subtitle: z.string(),
  col: z.string(),
  justify: z.enum(["start", "end"]),
  pad: z.string().optional(),
});

export const homeHeroSchema = z.object({
  items: z.array(homeHeroItemSchema),
  defaultActive: z.number().optional(),
  ctaHref: z.string().optional(),
  ctaLabel: z.string().optional(),
  bottomLeft: z.string().optional(),
  bottomRight: z.string().optional(),
  bottomTagline: z.string().optional(),
});

export const homeMarqueeSchema = z.object({
  tags: z.array(z.string()),
});

export const homeBannerSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
});

export const homeAboutSchema = z.object({
  line1Bold: z.string(),
  line1Accent: z.string(),
  designLabel: z.string(),
  gifUrl: z.string(),
  studioLabel: z.string(),
  aboutCtaLabel: z.string(),
  aboutCtaHref: z.string(),
  fromLabel: z.string(),
});

export const homeServicesSchema = z.object({
  subtitle: z.string().optional(),
  heading: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      image: z.string(),
    }),
  ),
});

export const homeFeaturedSchema = z.object({
  title: z.string(),
  viewAllLabel: z.string(),
  viewAllHref: z.string(),
  limit: z.number().optional(),
});

export const homeAwardsSchema = z.object({
  subtitle: z.string().optional(),
  title: z.string().optional(),
  subtitle2: z.string().optional(),
  items: z.array(
    z.object({
      index: z.string(),
      name: z.string(),
      org: z.string(),
      year: z.string(),
      icon: z.string(),
    }),
  ),
});

export const aboutHeroSchema = z.object({
  title: z.string(),
  label: z.string(),
  intro: z.string(),
  introAccentWords: z.array(z.string()).optional(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  bannerUrl: z.string(),
  bannerAlt: z.string().optional(),
  lead: z.string(),
  leadAccent: z.string(),
  videoUrl: z.string(),
  approachTitle: z.string(),
  approachBody: z.string(),
  portfolioLabel: z.string(),
  portfolioHref: z.string(),
  solutionsHeading: z.string().optional(),
  teamHeading: z.string().optional(),
  teamTitle: z.string().optional(),
  discoverAllLabel: z.string().optional(),
  awardsHeading: z.string().optional(),
  awardsTitle: z.string().optional(),
  solutionsServicesLabel: z.string().optional(),
  solutionsInfoLabel: z.string().optional(),
});

export const aboutStatsSchema = z.object({
  items: z.array(
    z.object({
      value: z.string(),
      suffix: z.string(),
      label: z.string(),
    }),
  ),
});

export const aboutSolutionsSchema = z.object({
  heading: z.string().optional(),
  items: z.array(
    z.object({
      num: z.string(),
      title: z.string(),
      body: z.string(),
    }),
  ),
});

export const aboutTeamSchema = z.object({
  heading: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      image: z.string(),
    }),
  ),
});

export const aboutAwardsSchema = z.object({
  heading: z.string().optional(),
  items: z.array(
    z.object({
      index: z.string(),
      name: z.string(),
      org: z.string(),
      year: z.string(),
      icon: z.string(),
    }),
  ),
});

export const aboutMarqueeSchema = z.object({
  text: z.string(),
});

export const servicesHeroSchema = z.object({
  titleLine1: z.string(),
  titleAccent: z.string(),
  videoUrl: z.string(),
  shapeUrl: z.string().optional(),
  introTitle: z.string(),
  introBody: z.string(),
  introCtaLabel: z.string(),
  introCtaHref: z.string(),
  capsulesSubtitle: z.string().optional(),
  capsulesTitle: z.string().optional(),
  faqSubtitle: z.string().optional(),
  faqTitle: z.string().optional(),
  brandsHeading: z.string().optional(),
  testimonialsHeading: z.string().optional(),
  ctaLabel: z.string().optional(),
});

export const servicesMarqueeSchema = z.object({
  tags: z.array(z.string()),
});

export const servicesCardsSchema = z.object({
  viewDetailsLabel: z.string().optional(),
  items: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
      icon: z.string(),
      viewDetailsLabel: z.string().optional(),
    }),
  ),
});

export const servicesCapsulesSchema = z.object({
  subtitle: z.string().optional(),
  title: z.string().optional(),
  items: z.array(
    z.object({
      label: z.string(),
      bg: z.string().optional(),
      size: z.number().optional(),
    }),
  ),
});

export const servicesStepsSchema = z.object({
  stepsEyebrow: z.string().optional(),
  stepsTitle: z.string().optional(),
  stepsSubtitle: z.string().optional(),
  stepLabel: z.string().optional(),
  items: z.array(
    z.object({
      num: z.string(),
      title: z.array(z.string()),
      bodyLines: z.array(z.string()),
      bg: z.string(),
    }),
  ),
});

export const servicesFaqSchema = z.object({
  subtitle: z.string().optional(),
  title: z.string().optional(),
  items: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
});

export const servicesBrandsSchema = z.object({
  urls: z.array(z.string()),
});

export const servicesTestimonialsSchema = z.object({
  items: z.array(
    z.object({
      body: z.string(),
      name: z.string(),
      role: z.string(),
    }),
  ),
});

export const notFoundHeroSchema = z.object({
  code: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  imageUrl: z.string().optional(),
  background: z.enum(["light", "dark", "red"]).optional(),
  align: z.enum(["center", "left"]).optional(),
  showCode: z.boolean().optional(),
});

export const notFoundLinksSchema = z.object({
  links: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
    }),
  ),
});

export type ContactHeroPayload = z.infer<typeof contactHeroSchema>;
export type ContactInquiriesPayload = z.infer<typeof contactInquiriesSchema>;
export type ContactOfficesPayload = z.infer<typeof contactOfficesSchema>;
export type ContactSocialsPayload = z.infer<typeof contactSocialsSchema>;
export type HeroPayload = z.infer<typeof heroSchema>;
export type FaqPayload = z.infer<typeof faqSchema>;
export type HomeHeroPayload = z.infer<typeof homeHeroSchema>;
export type HomeMarqueePayload = z.infer<typeof homeMarqueeSchema>;
export type HomeBannerPayload = z.infer<typeof homeBannerSchema>;
export type HomeAboutPayload = z.infer<typeof homeAboutSchema>;
export type HomeServicesPayload = z.infer<typeof homeServicesSchema>;
export type HomeFeaturedPayload = z.infer<typeof homeFeaturedSchema>;
export type HomeAwardsPayload = z.infer<typeof homeAwardsSchema>;
export type AboutHeroPayload = z.infer<typeof aboutHeroSchema>;
export type AboutStatsPayload = z.infer<typeof aboutStatsSchema>;
export type AboutSolutionsPayload = z.infer<typeof aboutSolutionsSchema>;
export type AboutTeamPayload = z.infer<typeof aboutTeamSchema>;
export type AboutAwardsPayload = z.infer<typeof aboutAwardsSchema>;
export type AboutMarqueePayload = z.infer<typeof aboutMarqueeSchema>;
export type ServicesHeroPayload = z.infer<typeof servicesHeroSchema>;
export type ServicesMarqueePayload = z.infer<typeof servicesMarqueeSchema>;
export type ServicesCardsPayload = z.infer<typeof servicesCardsSchema>;
export type ServicesCapsulesPayload = z.infer<typeof servicesCapsulesSchema>;
export type ServicesStepsPayload = z.infer<typeof servicesStepsSchema>;
export type ServicesFaqPayload = z.infer<typeof servicesFaqSchema>;
export type ServicesBrandsPayload = z.infer<typeof servicesBrandsSchema>;
export type ServicesTestimonialsPayload = z.infer<typeof servicesTestimonialsSchema>;
export type NotFoundHeroPayload = z.infer<typeof notFoundHeroSchema>;
export type NotFoundLinksPayload = z.infer<typeof notFoundLinksSchema>;

export type SectionRegistryEntry = {
  type: SectionTypeId;
  label: string;
  schema: z.ZodType<unknown>;
  defaultPayload: unknown;
};

export const SECTION_REGISTRY: Record<SectionTypeId, SectionRegistryEntry> = {
  contact_hero: {
    type: "contact_hero",
    label: "Contact hero",
    schema: contactHeroSchema,
    defaultPayload: { title: CONTACT_DEFAULTS.title } satisfies ContactHeroPayload,
  },
  contact_inquiries: {
    type: "contact_inquiries",
    label: "İletişim bilgileri",
    schema: contactInquiriesSchema,
    defaultPayload: {
      items: CONTACT_DEFAULTS.inquiries,
    } satisfies ContactInquiriesPayload,
  },
  contact_offices: {
    type: "contact_offices",
    label: "Ofisler",
    schema: contactOfficesSchema,
    defaultPayload: {
      heading: CONTACT_DEFAULTS.officesHeading,
      offices: CONTACT_DEFAULTS.offices,
    } satisfies ContactOfficesPayload,
  },
  contact_socials: {
    type: "contact_socials",
    label: "Sosyal",
    schema: contactSocialsSchema,
    defaultPayload: {
      items: [...CONTACT_DEFAULTS.socials],
    } satisfies ContactSocialsPayload,
  },
  hero: {
    type: "hero",
    label: "Hero (genel)",
    schema: heroSchema,
    defaultPayload: { title: "", subtitle: "" } satisfies HeroPayload,
  },
  faq: {
    type: "faq",
    label: "SSS / FAQ (genel)",
    schema: faqSchema,
    defaultPayload: { items: [] } satisfies FaqPayload,
  },
  home_hero: {
    type: "home_hero",
    label: "Ana sayfa — Hero collage",
    schema: homeHeroSchema,
    defaultPayload: HOME_DEFAULTS.hero satisfies HomeHeroPayload,
  },
  home_marquee: {
    type: "home_marquee",
    label: "Ana sayfa — Marquee",
    schema: homeMarqueeSchema,
    defaultPayload: HOME_DEFAULTS.marquee satisfies HomeMarqueePayload,
  },
  home_banner: {
    type: "home_banner",
    label: "Ana sayfa — Banner",
    schema: homeBannerSchema,
    defaultPayload: HOME_DEFAULTS.banner satisfies HomeBannerPayload,
  },
  home_about: {
    type: "home_about",
    label: "Ana sayfa — About",
    schema: homeAboutSchema,
    defaultPayload: HOME_DEFAULTS.about satisfies HomeAboutPayload,
  },
  home_services: {
    type: "home_services",
    label: "Ana sayfa — Services",
    schema: homeServicesSchema,
    defaultPayload: {
      subtitle: HOME_DEFAULTS.services.header.subtitle,
      heading: HOME_DEFAULTS.services.header.heading,
      items: HOME_DEFAULTS.services.items,
    } satisfies HomeServicesPayload,
  },
  home_featured: {
    type: "home_featured",
    label: "Ana sayfa — Featured",
    schema: homeFeaturedSchema,
    defaultPayload: HOME_DEFAULTS.featured satisfies HomeFeaturedPayload,
  },
  home_awards: {
    type: "home_awards",
    label: "Ana sayfa — Awards",
    schema: homeAwardsSchema,
    defaultPayload: {
      subtitle: HOME_DEFAULTS.awards.header.subtitle,
      title: HOME_DEFAULTS.awards.header.title,
      subtitle2: HOME_DEFAULTS.awards.header.subtitle2,
      items: HOME_DEFAULTS.awards.items,
    } satisfies HomeAwardsPayload,
  },
  about_hero: {
    type: "about_hero",
    label: "Hakkımızda — Hero / intro",
    schema: aboutHeroSchema,
    defaultPayload: ABOUT_DEFAULTS.hero satisfies AboutHeroPayload,
  },
  about_stats: {
    type: "about_stats",
    label: "Hakkımızda — Stats",
    schema: aboutStatsSchema,
    defaultPayload: { items: ABOUT_DEFAULTS.stats } satisfies AboutStatsPayload,
  },
  about_solutions: {
    type: "about_solutions",
    label: "Hakkımızda — Solutions",
    schema: aboutSolutionsSchema,
    defaultPayload: {
      heading: ABOUT_DEFAULTS.hero.solutionsHeading,
      items: ABOUT_DEFAULTS.solutions,
    } satisfies AboutSolutionsPayload,
  },
  about_team: {
    type: "about_team",
    label: "Hakkımızda — Team",
    schema: aboutTeamSchema,
    defaultPayload: {
      heading: ABOUT_DEFAULTS.hero.teamHeading,
      items: ABOUT_DEFAULTS.team,
    } satisfies AboutTeamPayload,
  },
  about_awards: {
    type: "about_awards",
    label: "Hakkımızda — Awards",
    schema: aboutAwardsSchema,
    defaultPayload: {
      heading: ABOUT_DEFAULTS.hero.awardsHeading,
      items: ABOUT_DEFAULTS.awards,
    } satisfies AboutAwardsPayload,
  },
  about_marquee: {
    type: "about_marquee",
    label: "Hakkımızda — Marquee",
    schema: aboutMarqueeSchema,
    defaultPayload: ABOUT_DEFAULTS.marquee satisfies AboutMarqueePayload,
  },
  services_hero: {
    type: "services_hero",
    label: "Hizmetler — Hero / intro",
    schema: servicesHeroSchema,
    defaultPayload: SERVICES_DEFAULTS.hero satisfies ServicesHeroPayload,
  },
  services_marquee: {
    type: "services_marquee",
    label: "Hizmetler — Marquee",
    schema: servicesMarqueeSchema,
    defaultPayload: SERVICES_DEFAULTS.marquee satisfies ServicesMarqueePayload,
  },
  services_cards: {
    type: "services_cards",
    label: "Hizmetler — Cards",
    schema: servicesCardsSchema,
    defaultPayload: {
      viewDetailsLabel: SERVICES_DEFAULTS.viewDetailsLabel,
      items: SERVICES_DEFAULTS.cards,
    } satisfies ServicesCardsPayload,
  },
  services_capsules: {
    type: "services_capsules",
    label: "Hizmetler — Capsules",
    schema: servicesCapsulesSchema,
    defaultPayload: {
      subtitle: SERVICES_DEFAULTS.hero.capsulesSubtitle,
      title: SERVICES_DEFAULTS.hero.capsulesTitle,
      items: SERVICES_DEFAULTS.capsules,
    } satisfies ServicesCapsulesPayload,
  },
  services_steps: {
    type: "services_steps",
    label: "Hizmetler — Steps",
    schema: servicesStepsSchema,
    defaultPayload: {
      stepsEyebrow: SERVICES_DEFAULTS.stepsMeta?.eyebrow,
      stepsTitle: SERVICES_DEFAULTS.stepsMeta?.title,
      stepsSubtitle: SERVICES_DEFAULTS.stepsMeta?.subtitle,
      stepLabel: SERVICES_DEFAULTS.stepsMeta?.stepLabel,
      items: SERVICES_DEFAULTS.steps,
    } satisfies ServicesStepsPayload,
  },
  services_faq: {
    type: "services_faq",
    label: "Hizmetler — FAQ",
    schema: servicesFaqSchema,
    defaultPayload: {
      subtitle: SERVICES_DEFAULTS.hero.faqSubtitle,
      title: SERVICES_DEFAULTS.hero.faqTitle,
      items: SERVICES_DEFAULTS.faqs,
    } satisfies ServicesFaqPayload,
  },
  services_brands: {
    type: "services_brands",
    label: "Hizmetler — Brands",
    schema: servicesBrandsSchema,
    defaultPayload: { urls: SERVICES_DEFAULTS.brands } satisfies ServicesBrandsPayload,
  },
  services_testimonials: {
    type: "services_testimonials",
    label: "Hizmetler — Testimonials",
    schema: servicesTestimonialsSchema,
    defaultPayload: {
      items: SERVICES_DEFAULTS.testimonials,
    } satisfies ServicesTestimonialsPayload,
  },
  not_found_hero: {
    type: "not_found_hero",
    label: "404 — Hero",
    schema: notFoundHeroSchema,
    defaultPayload: NOT_FOUND_DEFAULTS.hero satisfies NotFoundHeroPayload,
  },
  not_found_links: {
    type: "not_found_links",
    label: "404 — Hızlı linkler",
    schema: notFoundLinksSchema,
    defaultPayload: {
      links: NOT_FOUND_DEFAULTS.links,
    } satisfies NotFoundLinksPayload,
  },
};

export function isSectionTypeId(value: string): value is SectionTypeId {
  return (SECTION_TYPE_IDS as readonly string[]).includes(value);
}

export function getSectionEntry(type: string): SectionRegistryEntry | null {
  if (!isSectionTypeId(type)) return null;
  return SECTION_REGISTRY[type];
}

export function validateSectionPayload(
  type: string,
  payload: unknown,
): { ok: true; data: unknown } | { ok: false; error: z.ZodError } {
  const entry = getSectionEntry(type);
  if (!entry) {
    return {
      ok: false,
      error: new z.ZodError([
        {
          code: "custom",
          path: ["type"],
          message: `Bilinmeyen section tipi: ${type}`,
        },
      ]),
    };
  }
  const parsed = entry.schema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: parsed.error };
  return { ok: true, data: parsed.data };
}

export type SectionDef = {
  sectionKey: string;
  type: SectionTypeId;
  sortOrder: number;
  payload: unknown;
};

/** Default section definitions for seed / empty pages */
export const CONTACT_SECTION_DEFS: SectionDef[] = [
  {
    sectionKey: "hero",
    type: "contact_hero",
    sortOrder: 0,
    payload: SECTION_REGISTRY.contact_hero.defaultPayload,
  },
  {
    sectionKey: "inquiries",
    type: "contact_inquiries",
    sortOrder: 1,
    payload: SECTION_REGISTRY.contact_inquiries.defaultPayload,
  },
  {
    sectionKey: "offices",
    type: "contact_offices",
    sortOrder: 2,
    payload: SECTION_REGISTRY.contact_offices.defaultPayload,
  },
  {
    sectionKey: "socials",
    type: "contact_socials",
    sortOrder: 3,
    payload: SECTION_REGISTRY.contact_socials.defaultPayload,
  },
];

export const HOME_SECTION_DEFS: SectionDef[] = [
  { sectionKey: "hero", type: "home_hero", sortOrder: 0, payload: SECTION_REGISTRY.home_hero.defaultPayload },
  { sectionKey: "marquee", type: "home_marquee", sortOrder: 1, payload: SECTION_REGISTRY.home_marquee.defaultPayload },
  { sectionKey: "banner", type: "home_banner", sortOrder: 2, payload: SECTION_REGISTRY.home_banner.defaultPayload },
  { sectionKey: "about", type: "home_about", sortOrder: 3, payload: SECTION_REGISTRY.home_about.defaultPayload },
  { sectionKey: "services", type: "home_services", sortOrder: 4, payload: SECTION_REGISTRY.home_services.defaultPayload },
  { sectionKey: "featured", type: "home_featured", sortOrder: 5, payload: SECTION_REGISTRY.home_featured.defaultPayload },
  { sectionKey: "awards", type: "home_awards", sortOrder: 6, payload: SECTION_REGISTRY.home_awards.defaultPayload },
];

export const ABOUT_SECTION_DEFS: SectionDef[] = [
  { sectionKey: "hero", type: "about_hero", sortOrder: 0, payload: SECTION_REGISTRY.about_hero.defaultPayload },
  { sectionKey: "stats", type: "about_stats", sortOrder: 1, payload: SECTION_REGISTRY.about_stats.defaultPayload },
  { sectionKey: "marquee", type: "about_marquee", sortOrder: 2, payload: SECTION_REGISTRY.about_marquee.defaultPayload },
  { sectionKey: "solutions", type: "about_solutions", sortOrder: 3, payload: SECTION_REGISTRY.about_solutions.defaultPayload },
  { sectionKey: "team", type: "about_team", sortOrder: 4, payload: SECTION_REGISTRY.about_team.defaultPayload },
  { sectionKey: "awards", type: "about_awards", sortOrder: 5, payload: SECTION_REGISTRY.about_awards.defaultPayload },
];

export const SERVICES_SECTION_DEFS: SectionDef[] = [
  { sectionKey: "hero", type: "services_hero", sortOrder: 0, payload: SECTION_REGISTRY.services_hero.defaultPayload },
  { sectionKey: "marquee", type: "services_marquee", sortOrder: 1, payload: SECTION_REGISTRY.services_marquee.defaultPayload },
  { sectionKey: "cards", type: "services_cards", sortOrder: 2, payload: SECTION_REGISTRY.services_cards.defaultPayload },
  { sectionKey: "capsules", type: "services_capsules", sortOrder: 3, payload: SECTION_REGISTRY.services_capsules.defaultPayload },
  { sectionKey: "testimonials", type: "services_testimonials", sortOrder: 4, payload: SECTION_REGISTRY.services_testimonials.defaultPayload },
  { sectionKey: "brands", type: "services_brands", sortOrder: 5, payload: SECTION_REGISTRY.services_brands.defaultPayload },
  { sectionKey: "steps", type: "services_steps", sortOrder: 6, payload: SECTION_REGISTRY.services_steps.defaultPayload },
  { sectionKey: "faq", type: "services_faq", sortOrder: 7, payload: SECTION_REGISTRY.services_faq.defaultPayload },
];


export const NOT_FOUND_SECTION_DEFS: SectionDef[] = [
  { sectionKey: "hero", type: "not_found_hero", sortOrder: 0, payload: SECTION_REGISTRY.not_found_hero.defaultPayload },
  { sectionKey: "links", type: "not_found_links", sortOrder: 1, payload: SECTION_REGISTRY.not_found_links.defaultPayload },
];

export function sectionDefsForPage(pageKey: string): SectionDef[] {
  switch (pageKey) {
    case "home":
      return HOME_SECTION_DEFS;
    case "about":
      return ABOUT_SECTION_DEFS;
    case "services":
      return SERVICES_SECTION_DEFS;
    case "contact":
      return CONTACT_SECTION_DEFS;
    case "not-found":
      return NOT_FOUND_SECTION_DEFS;
    default:
      return [];
  }
}
