import type { SiteSettings } from "@/lib/admin/types";
import { absoluteUrl, getCanonicalBase } from "./metadata";

export function buildSiteJsonLd(settings: SiteSettings): Record<string, unknown>[] {
  const base = getCanonicalBase(settings);
  const sameAs = settings.socials
    .map((s) => s.href)
    .filter((h) => h && h !== "#" && /^https?:\/\//i.test(h));

  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.studioName,
    description: settings.seo.defaultDescription,
    ...(base ? { url: base } : {}),
  };

  const nodes: Record<string, unknown>[] = [website];

  if (settings.geo?.enabled) {
    const geo = settings.geo;
    const orgType = geo.organizationType ?? "Organization";
    const org: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": orgType,
      name: geo.legalName || settings.studioName,
      legalName: geo.legalName || settings.studioName,
      email: settings.email,
      telephone: settings.phone,
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
