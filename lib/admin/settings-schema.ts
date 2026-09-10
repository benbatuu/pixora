
import { z } from "zod";

const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const seoPageLocaleSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

const seoPageOverrideSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  ogImageUrl: z.string().optional(),
  noindex: z.boolean().optional(),
  i18n: z.record(z.string(), seoPageLocaleSchema).optional(),
});

const seoSchema = z.object({
  defaultTitle: z.string().min(1),
  defaultDescription: z.string().min(1),
  titleTemplate: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  canonicalBaseUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  ogType: z.string().optional(),
  twitterCard: z.enum(["summary", "summary_large_image"]).optional(),
  twitterHandle: z.string().optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
  googleSiteVerification: z.string().optional(),
  bingSiteVerification: z.string().optional(),
  pages: z.record(z.string(), seoPageOverrideSchema).optional(),
});

const geoSchema = z
  .object({
    enabled: z.boolean().optional(),
    placename: z.string().optional(),
    region: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    icbm: z.string().optional(),
    organizationType: z
      .enum(["Organization", "LocalBusiness", "ProfessionalService"])
      .optional(),
    legalName: z.string().optional(),
    streetAddress: z.string().optional(),
    addressLocality: z.string().optional(),
    addressRegion: z.string().optional(),
    postalCode: z.string().optional(),
    addressCountry: z.string().optional(),
    areaServed: z.array(z.string()).optional(),
    priceRange: z.string().optional(),
    openingHours: z.array(z.string()).optional(),
  })
  .partial();

const llmBotRule = z.enum(["allow", "block"]);

const llmSchema = z
  .object({
    enabled: z.boolean().optional(),
    title: z.string().optional(),
    summary: z.string().optional(),
    llmsTxt: z.string().optional(),
    contactEmail: z.string().optional(),
    allowTraining: z.boolean().optional(),
    robots: z
      .object({
        gptBot: llmBotRule.optional(),
        chatGptUser: llmBotRule.optional(),
        googleExtended: llmBotRule.optional(),
        claudeBot: llmBotRule.optional(),
        perplexityBot: llmBotRule.optional(),
        bytespider: llmBotRule.optional(),
        anthropicAi: llmBotRule.optional(),
      })
      .partial()
      .optional(),
  })
  .partial();


const chromeLocaleSchema = z
  .object({
    footerTagline: z.string().optional(),
    footerQuickLinksTitle: z.string().optional(),
    footerContactTitle: z.string().optional(),
    footerAddress: z.string().optional(),
    footerMapsUrl: z.string().optional(),
    copyrightName: z.string().optional(),
    offcanvasLabel: z.string().optional(),
    offcanvasTitle: z.string().optional(),
    offcanvasEmail: z.string().optional(),
    offcanvasPhone: z.string().optional(),
    offcanvasMeta: z.string().optional(),
    languageLabel: z.string().optional(),
  })
  .partial();

const contactFormFieldSchema = z
  .object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
  })
  .partial();

const contactFormLocaleSchema = z
  .object({
    submitLabel: z.string().optional(),
    successTitle: z.string().optional(),
    successBody: z.string().optional(),
    sendAnother: z.string().optional(),
    fields: z
      .object({
        email: contactFormFieldSchema.optional(),
        name: contactFormFieldSchema.optional(),
        phone: contactFormFieldSchema.optional(),
        company: contactFormFieldSchema.optional(),
        budget: contactFormFieldSchema.optional(),
        message: contactFormFieldSchema.optional(),
      })
      .partial()
      .optional(),
  })
  .partial();

export const siteSettingsSchema = z.object({
  studioName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  socials: z.array(socialLinkSchema),
  seo: seoSchema,
  geo: geoSchema.optional(),
  llm: llmSchema.optional(),
  brand: z.object({
    logoLightUrl: z.string().min(1),
    logoDarkUrl: z.string().optional(),
    logoAlt: z.string().min(1),
    faviconUrl: z.string().optional(),
  }),
  headerSocials: z.array(socialLinkSchema).optional(),
  footerTagline: z.string().optional(),
  footerContactEmail: z.string().optional(),
  footerContactPhone: z.string().optional(),
  footerAddress: z.string().optional(),
  offcanvasTitle: z.string().optional(),
  offcanvasEmail: z.string().optional(),
  offcanvasPhone: z.string().optional(),
  offcanvasMeta: z.string().optional(),
  copyrightName: z.string().optional(),
  chrome: z.record(z.string(), chromeLocaleSchema).optional(),
  contactForm: z.record(z.string(), contactFormLocaleSchema).optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const SITE_SETTING_KEY = "site";

export const SEO_PAGE_KEYS = [
  "home",
  "about",
  "services",
  "projects",
  "blog",
  "contact",
  "not-found",
] as const;

export type SeoPageKey = (typeof SEO_PAGE_KEYS)[number];
