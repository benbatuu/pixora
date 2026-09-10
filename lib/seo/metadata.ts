import type { Metadata } from "next";
import type {
  SiteSettings,
  SeoPageOverride,
  SeoPageLocaleCopy,
} from "@/lib/admin/types";
import { DEFAULT_LOCALE, PREFIX_LOCALES } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export function getCanonicalBase(settings: SiteSettings): string {
  const raw = settings.seo.canonicalBaseUrl?.trim() ?? "";
  if (!raw) return "";
  return stripTrailingSlash(raw);
}

export function absoluteUrl(settings: SiteSettings, path: string): string | undefined {
  const base = getCanonicalBase(settings);
  if (!base) return undefined;
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function ogLocaleCode(locale: string): string {
  if (locale === "tr") return "tr_TR";
  if (locale === "ru") return "ru_RU";
  return "en_US";
}

/** hreflang map for an unprefixed path (`/about`, `/blog/slug`). */
export function languageAlternateUrls(
  settings: SiteSettings,
  path: string,
  defaultLocale: string = DEFAULT_LOCALE,
): Record<string, string> | undefined {
  const languages: Record<string, string> = {};
  for (const code of PREFIX_LOCALES) {
    const url = absoluteUrl(settings, localizedPath(path, code, defaultLocale));
    if (url) languages[code] = url;
  }
  const xDefault = absoluteUrl(
    settings,
    localizedPath(path, defaultLocale, defaultLocale),
  );
  if (xDefault) languages["x-default"] = xDefault;
  return Object.keys(languages).length ? languages : undefined;
}

export type ResolvedPageSeo = SeoPageLocaleCopy & {
  noindex?: boolean;
};

/**
 * Merge page SEO: i18n[locale] over i18n[fallbackLocale] over legacy top-level fields.
 * `noindex` is always page-level (shared).
 */
export function resolvePageSeo(
  page: SeoPageOverride | undefined,
  locale: string,
  fallbackLocale: string = DEFAULT_LOCALE,
): ResolvedPageSeo {
  const p = page ?? {};
  const fromFallback = p.i18n?.[fallbackLocale] ?? {};
  const fromLocale = p.i18n?.[locale] ?? {};

  const pick = (
    key: keyof SeoPageLocaleCopy,
  ): string | undefined => {
    const local = fromLocale[key]?.trim();
    if (local) return fromLocale[key];
    if (locale !== fallbackLocale) {
      const fb = fromFallback[key]?.trim();
      if (fb) return fromFallback[key];
    }
    const legacy = p[key];
    return typeof legacy === "string" ? legacy : undefined;
  };

  return {
    title: pick("title"),
    subtitle: pick("subtitle"),
    description: pick("description"),
    ogImageUrl: pick("ogImageUrl"),
    noindex: p.noindex,
  };
}

/**
 * Browser-tab document title: absolute when title already looks full (contains `|`)
 * or when titleTemplate is empty; otherwise apply `%s` template.
 */
export function formatDocumentTitle(
  title: string | undefined,
  titleTemplate: string | undefined,
  fallback: string,
): string {
  const t = title?.trim();
  if (!t) return fallback;
  const template = titleTemplate?.trim() ?? "";
  if (t.includes("|") || !template) return t;
  if (template.includes("%s")) return template.replace("%s", t);
  return `${t} ${template}`.trim();
}

function metadataTitle(
  title: string | undefined,
  titleTemplate: string | undefined,
): Metadata["title"] {
  const t = title?.trim();
  if (!t) return undefined;
  const template = titleTemplate?.trim() ?? "";
  if (t.includes("|") || !template) {
    return { absolute: t };
  }
  return t;
}

export function buildRootMetadata(settings: SiteSettings): Metadata {
  const seo = settings.seo;
  const base = getCanonicalBase(settings);
  const robotsIndex = seo.robotsIndex !== false;
  const robotsFollow = seo.robotsFollow !== false;
  const verification: Metadata["verification"] = {};
  if (seo.googleSiteVerification) {
    verification.google = seo.googleSiteVerification;
  }
  if (seo.bingSiteVerification) {
    verification.other = {
      ...(verification.other as Record<string, string> | undefined),
      "msvalidate.01": seo.bingSiteVerification,
    };
  }

  const icons = settings.brand.faviconUrl
    ? { icon: settings.brand.faviconUrl }
    : undefined;

  return {
    metadataBase: base ? new URL(base) : undefined,
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate?.trim() || "%s | Pixora",
    },
    description: seo.defaultDescription,
    keywords: seo.keywords?.length ? seo.keywords : undefined,
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
    },
    openGraph: {
      type: (seo.ogType as "website") || "website",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      url: base || undefined,
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
      siteName: settings.studioName,
    },
    twitter: {
      card: seo.twitterCard ?? "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
      site: seo.twitterHandle || undefined,
      creator: seo.twitterHandle || undefined,
    },
    verification: Object.keys(verification).length ? verification : undefined,
    icons,
    other: geoOther(settings),
  };
}

function geoOther(settings: SiteSettings): Metadata["other"] {
  const geo = settings.geo;
  if (!geo?.enabled) return undefined;
  const other: Record<string, string> = {};
  if (geo.region) other["geo.region"] = geo.region;
  if (geo.placename) other["geo.placename"] = geo.placename;
  if (typeof geo.latitude === "number" && typeof geo.longitude === "number") {
    other["geo.position"] = `${geo.latitude};${geo.longitude}`;
  }
  if (geo.icbm) other.ICBM = geo.icbm;
  else if (typeof geo.latitude === "number" && typeof geo.longitude === "number") {
    other.ICBM = `${geo.latitude}, ${geo.longitude}`;
  }
  return Object.keys(other).length ? other : undefined;
}

export function buildPageMetadata(
  settings: SiteSettings,
  pageKey: string,
  opts?: {
    path?: string;
    title?: string;
    description?: string;
    ogImageUrl?: string;
    locale?: string;
    fallbackLocale?: string;
    ogType?: "website" | "article";
  },
): Metadata {
  const locale = opts?.locale ?? DEFAULT_LOCALE;
  const fallbackLocale = opts?.fallbackLocale ?? DEFAULT_LOCALE;
  const page: SeoPageOverride = settings.seo.pages?.[pageKey] ?? {};
  const resolved = resolvePageSeo(page, locale, fallbackLocale);

  const title = opts?.title ?? resolved.title;
  const description =
    opts?.description ??
    resolved.description ??
    settings.seo.defaultDescription;
  const ogImage =
    opts?.ogImageUrl ?? resolved.ogImageUrl ?? settings.seo.ogImageUrl;
  const noindex = resolved.noindex === true;
  const rawPath = opts?.path ?? (pageKey === "home" ? "/" : `/${pageKey}`);
  const path = localizedPath(rawPath, locale, fallbackLocale);
  const canonical = absoluteUrl(settings, path);

  const titleMeta = metadataTitle(title, settings.seo.titleTemplate);
  const languages = languageAlternateUrls(settings, rawPath, fallbackLocale);

  return {
    title: titleMeta,
    description,
    alternates: canonical
      ? { canonical, languages }
      : languages
        ? { languages }
        : undefined,
    robots: noindex
      ? { index: false, follow: settings.seo.robotsFollow !== false }
      : undefined,
    openGraph: {
      title: title ?? settings.seo.defaultTitle,
      description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: opts?.ogType ?? ((settings.seo.ogType as "website") || "website"),
      locale: ogLocaleCode(locale),
      alternateLocale: PREFIX_LOCALES.filter((c) => c !== locale).map(ogLocaleCode),
    },
    twitter: {
      card: settings.seo.twitterCard ?? "summary_large_image",
      title: title ?? settings.seo.defaultTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
