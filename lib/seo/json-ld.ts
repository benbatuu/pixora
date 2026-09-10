import type { SiteSettings } from "@/lib/admin/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";
import { absoluteUrl, getCanonicalBase } from "./metadata";

function studioId(base: string) {
  return `${base}#studio`;
}

export function buildSiteJsonLd(settings: SiteSettings): Record<string, unknown>[] {
  const base = getCanonicalBase(settings);
  const sameAs = settings.socials
    .map((s) => s.href)
    .filter((h) => h && h !== "#" && /^https?:\/\//i.test(h));

  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.studioName,
    alternateName: ["Pixora", "getpixoria"],
    description: settings.seo.defaultDescription,
    inLanguage: ["en", "tr", "ru"],
    ...(base ? { url: base, publisher: { "@id": studioId(base) } } : {}),
  };

  const nodes: Record<string, unknown>[] = [website];

  if (settings.geo?.enabled) {
    const geo = settings.geo;
    const orgType = geo.organizationType ?? "Organization";
    const org: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": orgType,
      ...(base ? { "@id": studioId(base) } : {}),
      name: geo.legalName || settings.studioName,
      legalName: geo.legalName || settings.studioName,
      description: settings.seo.defaultDescription,
      email: settings.email,
      telephone: settings.phone,
      knowsLanguage: ["en", "tr", "ru"],
      ...(base ? { url: base } : {}),
      ...(settings.brand.logoLightUrl
        ? {
            logo: absoluteUrl(settings, settings.brand.logoLightUrl) ?? settings.brand.logoLightUrl,
            image: absoluteUrl(settings, settings.brand.logoLightUrl) ?? settings.brand.logoLightUrl,
          }
        : {}),
      ...(sameAs.length ? { sameAs } : {}),
      ...(geo.priceRange ? { priceRange: geo.priceRange } : {}),
      ...(geo.areaServed?.length ? { areaServed: geo.areaServed } : {}),
      ...(geo.openingHours?.length ? { openingHours: geo.openingHours } : {}),
      ...(settings.seo.keywords?.length ? { knowsAbout: settings.seo.keywords } : {}),
    };

    const hasAddress =
      geo.streetAddress ||
      geo.addressLocality ||
      geo.addressRegion ||
      geo.postalCode ||
      geo.addressCountry ||
      settings.address;

    if (hasAddress) {
      org.address = {
        "@type": "PostalAddress",
        streetAddress: geo.streetAddress || undefined,
        addressLocality: geo.addressLocality || settings.address || undefined,
        addressRegion: geo.addressRegion || undefined,
        postalCode: geo.postalCode || undefined,
        addressCountry: geo.addressCountry || undefined,
      };
    }

    if (typeof geo.latitude === "number" && typeof geo.longitude === "number") {
      org.geo = {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      };
    }

    nodes.push(org);
  }

  return nodes;
}

export function jsonLdScriptContents(node: Record<string, unknown>): string {
  return JSON.stringify(node).replace(/</g, "\\u003c");
}

function schemaLanguage(locale: string): string {
  if (locale === "tr") return "tr-TR";
  if (locale === "ru") return "ru-RU";
  return "en-US";
}

export function buildArticleJsonLd(
  settings: SiteSettings,
  opts: {
    title: string;
    description: string;
    path: string;
    image?: string;
    datePublished?: string;
    authorName?: string;
    locale?: string;
    keywords?: string[];
    faqs?: { q: string; a: string }[];
  },
): Record<string, unknown>[] {
  const locale = opts.locale ?? DEFAULT_LOCALE;
  const locPath = localizedPath(opts.path, locale);
  const url = absoluteUrl(settings, locPath);
  const base = getCanonicalBase(settings);
  const image = opts.image
    ? (absoluteUrl(settings, opts.image) ?? opts.image)
    : undefined;

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    inLanguage: schemaLanguage(locale),
    ...(url ? { url, mainEntityOfPage: { "@type": "WebPage", "@id": url } } : {}),
    ...(image ? { image } : {}),
    ...(opts.datePublished
      ? { datePublished: opts.datePublished, dateModified: opts.datePublished }
      : {}),
    author: {
      "@type": "Organization",
      name: opts.authorName || settings.studioName,
      ...(base ? { url: base } : {}),
    },
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(", ") } : {}),
    ...(base
      ? { publisher: { "@id": studioId(base) }, isPartOf: { "@id": base } }
      : { publisher: { "@type": "Organization", name: settings.studioName } }),
  };

  const nodes: Record<string, unknown>[] = [article];
  if (opts.faqs?.length) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: schemaLanguage(locale),
      mainEntity: opts.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    });
  }
  return nodes;
}

export function buildBreadcrumbJsonLd(
  settings: SiteSettings,
  items: { name: string; path: string }[],
  locale: string = DEFAULT_LOCALE,
): Record<string, unknown>[] {
  const list = items
    .map((item, index) => {
      const url = absoluteUrl(settings, localizedPath(item.path, locale));
      if (!url) return null;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: url,
      };
    })
    .filter(Boolean);

  if (list.length === 0) return [];

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: list,
    },
  ];
}
