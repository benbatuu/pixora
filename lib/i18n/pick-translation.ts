/**
 * Prefer requested locale translation; else default locale; else first available.
 */
export function pickTranslation<T extends { locale?: { code: string } | null }>(
  rows: T[],
  locale: string,
  defaultLocale = "en",
): T | undefined {
  if (!rows?.length) return undefined;
  return (
    rows.find((r) => r.locale?.code === locale) ??
    rows.find((r) => r.locale?.code === defaultLocale) ??
    rows[0]
  );
}
