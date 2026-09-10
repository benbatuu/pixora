import SiteChrome from "../components/SiteChrome";
import JsonLd from "../components/JsonLd";
import { getNavItems } from "@/lib/content/nav";
import { getSiteSettings } from "@/lib/content/settings";
import {
  getRequestLocale,
  listActiveLocales,
} from "@/lib/i18n/get-locale";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";

/** Locale comes from proxy header/cookie — must not serve a cached layout for the wrong language. */
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, locales, settings] = await Promise.all([
    getRequestLocale(),
    listActiveLocales(),
    getSiteSettings(),
  ]);
  const defaultLocale =
    locales.find((l) => l.isDefault)?.code ?? DEFAULT_LOCALE;
  const [navItems, footerNavItems] = await Promise.all([
    getNavItems("HEADER", locale),
    getNavItems("FOOTER", locale),
  ]);

  return (
    <main className="bg-[var(--px-bg)] overflow-x-clip">
      <JsonLd settings={settings} />
      <SiteChrome
        navItems={navItems}
        footerNavItems={footerNavItems}
        locale={locale}
        locales={locales}
        defaultLocale={defaultLocale}
        settings={settings}
        ui={getUi(locale)}
      >
        {children}
      </SiteChrome>
    </main>
  );
}
