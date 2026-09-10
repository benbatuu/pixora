import { cache } from "react";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import {
  COOKIE_NAME,
  DEFAULT_LOCALE,
  LOCALE_HEADER,
  type PublicLocale,
} from "./config";

export type { PublicLocale };

const FALLBACK_LOCALES: PublicLocale[] = [
  { code: "en", name: "English", isDefault: true },
];

export const listActiveLocales = cache(async (): Promise<PublicLocale[]> => {
  try {
    const rows = await prisma.locale.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
      select: { code: true, name: true, isDefault: true },
    });
    if (rows.length === 0) return FALLBACK_LOCALES;
    return rows;
  } catch (e) {
    console.error("[i18n.listActiveLocales]", e);
    return FALLBACK_LOCALES;
  }
});

export const getDefaultLocaleCode = cache(async (): Promise<string> => {
  const locales = await listActiveLocales();
  return locales.find((l) => l.isDefault)?.code ?? DEFAULT_LOCALE;
});

/**
 * Resolve request locale from proxy header → cookie → default.
 * Validates against active Locales in DB (fallback `en`).
 * Cached per-request so layout / page / metadata share one resolve.
 */
export const getRequestLocale = cache(async (): Promise<string> => {
  const h = await headers();
  const fromHeader = h.get(LOCALE_HEADER)?.trim().toLowerCase();
  const jar = await cookies();
  const fromCookie = jar.get(COOKIE_NAME)?.value?.trim().toLowerCase();

  const active = await listActiveLocales();
  const defaultCode =
    active.find((l) => l.isDefault)?.code ?? DEFAULT_LOCALE;
  const candidate = fromHeader || fromCookie || defaultCode;

  const codes = new Set(active.map((l) => l.code));
  if (codes.has(candidate)) return candidate;
  return defaultCode;
});
