import { DEFAULT_LOCALE, isPrefixLocale } from "./config";

/** Strip leading `/en`, `/tr`, or `/ru` (and trailing slash quirks). */
export function stripLocalePrefix(pathname: string): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = clean.split("/");
  if (parts.length >= 2 && isPrefixLocale(parts[1])) {
    const rest = "/" + parts.slice(2).join("/");
    if (rest === "/" || rest === "") return "/";
    return rest.replace(/\/+$/, "") || "/";
  }
  return clean === "" ? "/" : clean;
}

/**
 * Prefix href for non-default locales: `/tr/about`.
 * Default locale stays unprefixed: `/about`.
 */
export function localizedPath(
  href: string,
  locale: string,
  defaultLocale: string = DEFAULT_LOCALE,
): string {
  const base = stripLocalePrefix(href || "/");
  const path = base.startsWith("/") ? base : `/${base}`;
  if (!locale || locale === defaultLocale) {
    return path || "/";
  }
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** Locale code from URL prefix, if present. */
export function localeFromPathname(pathname: string): string | null {
  const parts = (pathname.startsWith("/") ? pathname : `/${pathname}`).split("/");
  if (parts.length >= 2 && isPrefixLocale(parts[1])) return parts[1];
  return null;
}
