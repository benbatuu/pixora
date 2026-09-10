import { SITE_SETTINGS } from "@/app/data/site";
import type { SiteChromeLocale, SiteSettings } from "@/lib/admin/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";

export type ResolvedChrome = Required<
  Pick<
    SiteChromeLocale,
    | "footerTagline"
    | "footerQuickLinksTitle"
    | "footerContactTitle"
    | "footerAddress"
    | "footerMapsUrl"
    | "copyrightName"
    | "offcanvasLabel"
    | "offcanvasTitle"
    | "offcanvasEmail"
    | "offcanvasPhone"
    | "offcanvasMeta"
    | "languageLabel"
  >
>;

/**
 * Resolved per-locale chrome for Footer / Header offcanvas.
 * Prefer chrome[locale] → chrome[default] → top-level settings → UI dict → SITE_SETTINGS.
 * Pure — safe on client and server.
 */
export function getChrome(settings: SiteSettings, locale: string): ResolvedChrome {
  const ui = getUi(locale);
  const chrome = settings.chrome ?? SITE_SETTINGS.chrome ?? {};
  const forLocale = chrome[locale] ?? {};
  const forDefault = chrome[DEFAULT_LOCALE] ?? {};

  const pick = <K extends keyof SiteChromeLocale>(
    key: K,
    ...fallbacks: Array<string | undefined>
  ): string => {
    for (const v of [forLocale[key], forDefault[key], ...fallbacks]) {
      if (typeof v === "string" && v.length > 0) return v;
    }
    return "";
  };

  return {
    footerTagline: pick(
      "footerTagline",
      settings.footerTagline,
      SITE_SETTINGS.footerTagline,
    ),
    footerQuickLinksTitle: pick("footerQuickLinksTitle", ui.quickLinks),
    footerContactTitle: pick("footerContactTitle", ui.contact),
    footerAddress: pick(
      "footerAddress",
      settings.footerAddress,
      SITE_SETTINGS.footerAddress,
      settings.address,
    ),
    footerMapsUrl: pick("footerMapsUrl", "https://www.google.com/maps/"),
    copyrightName: pick(
      "copyrightName",
      settings.copyrightName,
      SITE_SETTINGS.copyrightName,
      "Pixora.Studio",
    ),
    offcanvasLabel: pick("offcanvasLabel", ui.studio),
    offcanvasTitle: pick(
      "offcanvasTitle",
      settings.offcanvasTitle,
      SITE_SETTINGS.offcanvasTitle,
    ),
    offcanvasEmail: pick(
      "offcanvasEmail",
      settings.offcanvasEmail,
      settings.email,
      SITE_SETTINGS.offcanvasEmail,
    ),
    offcanvasPhone: pick(
      "offcanvasPhone",
      settings.offcanvasPhone,
      settings.phone,
      SITE_SETTINGS.offcanvasPhone,
    ),
    offcanvasMeta: pick(
      "offcanvasMeta",
      settings.offcanvasMeta,
      SITE_SETTINGS.offcanvasMeta,
    ),
    languageLabel: pick("languageLabel", ui.language),
  };
}
