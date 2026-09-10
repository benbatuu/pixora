import { prisma } from "@/lib/db/prisma";
import { SITE_SETTINGS } from "@/app/data/site";
import type {
  SiteChromeLocale,
  SiteContactFormLocale,
  SiteSettings,
} from "@/lib/admin/types";
import { SITE_SETTING_KEY } from "@/lib/admin/settings-schema";

export { getChrome, type ResolvedChrome } from "./chrome";

function mergeChrome(
  base?: Record<string, SiteChromeLocale>,
  override?: Record<string, SiteChromeLocale>,
): Record<string, SiteChromeLocale> | undefined {
  if (!base && !override) return undefined;
  const keys = new Set([
    ...Object.keys(base ?? {}),
    ...Object.keys(override ?? {}),
  ]);
  const out: Record<string, SiteChromeLocale> = {};
  for (const key of keys) {
    out[key] = { ...(base?.[key] ?? {}), ...(override?.[key] ?? {}) };
  }
  return out;
}

function mergeContactForm(
  base?: Record<string, SiteContactFormLocale>,
  override?: Record<string, SiteContactFormLocale>,
): Record<string, SiteContactFormLocale> | undefined {
  if (!base && !override) return undefined;
  const keys = new Set([
    ...Object.keys(base ?? {}),
    ...Object.keys(override ?? {}),
  ]);
  const out: Record<string, SiteContactFormLocale> = {};
  for (const key of keys) {
    const b = base?.[key];
    const o = override?.[key];
    out[key] = {
      ...(b ?? {}),
      ...(o ?? {}),
      fields: {
        ...(b?.fields ?? {}),
        ...(o?.fields ?? {}),
        email: { ...(b?.fields?.email ?? {}), ...(o?.fields?.email ?? {}) },
        name: { ...(b?.fields?.name ?? {}), ...(o?.fields?.name ?? {}) },
        phone: { ...(b?.fields?.phone ?? {}), ...(o?.fields?.phone ?? {}) },
        company: { ...(b?.fields?.company ?? {}), ...(o?.fields?.company ?? {}) },
        budget: { ...(b?.fields?.budget ?? {}), ...(o?.fields?.budget ?? {}) },
        message: { ...(b?.fields?.message ?? {}), ...(o?.fields?.message ?? {}) },
      },
    };
  }
  return out;
}

function mergeSettings(raw: unknown): SiteSettings {
  const base = SITE_SETTINGS;
  if (!raw || typeof raw !== "object") return base;
  const v = raw as Partial<SiteSettings>;
  return {
    ...base,
    ...v,
    socials: Array.isArray(v.socials) ? v.socials : base.socials,
    seo: {
      ...base.seo,
      ...(v.seo ?? {}),
      keywords: v.seo?.keywords ?? base.seo.keywords,
      pages: { ...(base.seo.pages ?? {}), ...(v.seo?.pages ?? {}) },
    },
    geo: { ...(base.geo ?? {}), ...(v.geo ?? {}) },
    llm: {
      ...(base.llm ?? {}),
      ...(v.llm ?? {}),
      robots: {
        ...(base.llm?.robots ?? {}),
        ...(v.llm?.robots ?? {}),
      },
    },
    brand: { ...base.brand, ...(v.brand ?? {}) },
    headerSocials: v.headerSocials ?? base.headerSocials,
    chrome: mergeChrome(base.chrome, v.chrome) ?? base.chrome,
    contactForm:
      mergeContactForm(base.contactForm, v.contactForm) ?? base.contactForm,
  };
}

function applyEnvCanonical(settings: SiteSettings): SiteSettings {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ?? "";
  const current = settings.seo?.canonicalBaseUrl?.trim() ?? "";
  if (current || !envUrl) return settings;
  return {
    ...settings,
    seo: {
      ...settings.seo,
      canonicalBaseUrl: envUrl,
    },
  };
}

/** Public/admin read of global site settings (DB → seed defaults → env fallback). */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.setting.findUnique({
      where: { key: SITE_SETTING_KEY },
    });
    return applyEnvCanonical(mergeSettings(row?.value));
  } catch (e) {
    console.error("[content.getSiteSettings]", e);
    return applyEnvCanonical(SITE_SETTINGS);
  }
}
