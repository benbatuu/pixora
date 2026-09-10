/** Public-site i18n constants (cookie + optional path prefix). */
export const COOKIE_NAME = "pixora_locale";
export const LOCALE_HEADER = "x-pixora-locale";

/** Fallback when DB unavailable / before seed. */
export const DEFAULT_LOCALE = "en";

/** Known prefix codes used by proxy rewrite (keep in sync with seed). */
export const PREFIX_LOCALES = ["en", "tr", "ru"] as const;

export type PrefixLocale = (typeof PREFIX_LOCALES)[number];

export function isPrefixLocale(code: string): code is PrefixLocale {
  return (PREFIX_LOCALES as readonly string[]).includes(code);
}

export type PublicLocale = {
  code: string;
  name: string;
  isDefault: boolean;
};
