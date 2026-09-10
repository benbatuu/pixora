/** Admin CMS domain types — extend as persistence lands. */

/** Dynamic CMS page key (Prisma Page.key). Seed defaults: home|about|services|contact */
export type AdminPageKey = string;

export type PublishStatus = "draft" | "published" | "archived";

export type AdminNavItem = {
  href: string;
  label: string;
  /** lucide icon name key */
  icon: string;
  /** Optional sidebar badge source */
  badgeKey?: "messages";
  /** Hide from EDITOR role */
  adminOnly?: boolean;
};

export type SeoPageLocaleCopy = {
  title?: string;
  subtitle?: string;
  description?: string;
  ogImageUrl?: string;
};

export type SeoPageOverride = {
  /** Legacy EN fallback (kept in sync with i18n.en). */
  title?: string;
  subtitle?: string;
  description?: string;
  ogImageUrl?: string;
  /** Page-level; shared across locales. */
  noindex?: boolean;
  /** locale code → copy */
  i18n?: Record<string, SeoPageLocaleCopy>;
};

export type SiteSeoSettings = {
  defaultTitle: string;
  defaultDescription: string;
  titleTemplate?: string;
  keywords?: string[];
  canonicalBaseUrl?: string;
  ogImageUrl?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterHandle?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  pages?: Record<string, SeoPageOverride>;
};

export type SiteGeoSettings = {
  enabled?: boolean;
  placename?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  icbm?: string;
  organizationType?: "Organization" | "LocalBusiness" | "ProfessionalService";
  legalName?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  areaServed?: string[];
  priceRange?: string;
  openingHours?: string[];
};

export type LlmBotRule = "allow" | "block";

export type SiteLlmSettings = {
  enabled?: boolean;
  title?: string;
  summary?: string;
  llmsTxt?: string;
  contactEmail?: string;
  allowTraining?: boolean;
  robots?: {
    gptBot?: LlmBotRule;
    chatGptUser?: LlmBotRule;
    googleExtended?: LlmBotRule;
    claudeBot?: LlmBotRule;
    perplexityBot?: LlmBotRule;
    bytespider?: LlmBotRule;
    anthropicAi?: LlmBotRule;
  };
};

/** Per-locale contact form chrome (Setting.site.contactForm). */
export type SiteContactFormField = {
  label?: string;
  placeholder?: string;
};

export type SiteContactFormLocale = {
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  sendAnother?: string;
  fields?: {
    email?: SiteContactFormField;
    name?: SiteContactFormField;
    phone?: SiteContactFormField;
    company?: SiteContactFormField;
    budget?: SiteContactFormField;
    message?: SiteContactFormField;
  };
};

/** Per-locale footer / header offcanvas copy (Setting.site.chrome). */
export type SiteChromeLocale = {
  footerTagline?: string;
  footerQuickLinksTitle?: string;
  footerContactTitle?: string;
  footerAddress?: string;
  footerMapsUrl?: string;
  copyrightName?: string;
  offcanvasLabel?: string;
  offcanvasTitle?: string;
  offcanvasEmail?: string;
  offcanvasPhone?: string;
  offcanvasMeta?: string;
  languageLabel?: string;
};

export type SiteSettings = {
  studioName: string;
  email: string;
  phone: string;
  address: string;
  socials: { label: string; href: string }[];
  seo: SiteSeoSettings;
  geo?: SiteGeoSettings;
  llm?: SiteLlmSettings;
  brand: {
    logoLightUrl: string;
    logoDarkUrl?: string;
    logoAlt: string;
    faviconUrl?: string;
  };
  headerSocials?: { label: string; href: string }[];
  footerTagline?: string;
  footerContactEmail?: string;
  footerContactPhone?: string;
  footerAddress?: string;
  offcanvasTitle?: string;
  offcanvasEmail?: string;
  offcanvasPhone?: string;
  offcanvasMeta?: string;
  copyrightName?: string;
  /** Per-locale chrome; prefer over top-level footer/offcanvas fields. */
  chrome?: Record<string, SiteChromeLocale>;
  /** Per-locale contact form labels / placeholders / success copy. */
  contactForm?: Record<string, SiteContactFormLocale>;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type MediaAsset = {
  id: string;
  path: string;
  name: string;
  mime: string;
  bytes: number;
  uploadedAt: string;
};
