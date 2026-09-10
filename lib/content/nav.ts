import { prisma } from "@/lib/db/prisma";
import type { NavLocation } from "@prisma/client";
import { pickTranslation } from "@/lib/i18n/pick-translation";
import { getDefaultLocaleCode } from "@/lib/i18n/get-locale";
import {
  FALLBACK_NAV,
  type NavItemPublic,
} from "@/lib/content/nav-data";

export type { NavItemPublic };
export { FALLBACK_NAV };

const LOCATION_MAP: Record<string, NavLocation> = {
  HEADER: "HEADER",
  FOOTER: "FOOTER",
  OFFCANVAS: "OFFCANVAS",
  header: "HEADER",
  footer: "FOOTER",
  offcanvas: "OFFCANVAS",
};

export async function getNavItems(
  location: string = "HEADER",
  locale = "en",
): Promise<NavItemPublic[]> {
  const loc = LOCATION_MAP[location] ?? "HEADER";
  try {
    const defaultLocale = await getDefaultLocaleCode();
    const rows = await prisma.navItem.findMany({
      where: { location: loc, parentId: null },
      orderBy: { sortOrder: "asc" },
      include: {
        translations: { include: { locale: true } },
      },
    });
    if (rows.length === 0) {
      return FALLBACK_NAV.map((n) => ({ ...n }));
    }
    return rows.map((row) => {
      const tr = pickTranslation(row.translations, locale, defaultLocale);
      const fallback =
        FALLBACK_NAV.find((f) => f.href === row.href)?.label ?? row.href;
      return {
        href: row.href,
        label: tr?.label?.trim() || fallback,
      };
    });
  } catch (e) {
    console.error("[content.getNavItems]", e);
    return FALLBACK_NAV.map((n) => ({ ...n }));
  }
}
