import type { Metadata } from "next";
import SiteChrome from "./components/SiteChrome";
import NotFoundContent from "./components/pages/NotFoundContent";
import { getNavItems } from "@/lib/content/nav";
import { getSiteSettings } from "@/lib/content/settings";
import { getNotFoundContent } from "@/lib/content/pages";
import {
  getDefaultLocaleCode,
  getRequestLocale,
  listActiveLocales,
} from "@/lib/i18n/get-locale";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getUi } from "@/lib/i18n/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getRequestLocale(),
  ]);
  const content = await getNotFoundContent(locale);
  const base = buildPageMetadata(settings, "not-found", {
    path: "/404",
    title: content.hero.title,
    description: content.hero.description,
    locale,
  });
  return {
    ...base,
    robots: { index: false, follow: false },
  };
}

export default async function RootNotFound() {
  const locale = await getRequestLocale();
  const [navItems, footerNavItems, locales, defaultLocale, settings, content] =
    await Promise.all([
      getNavItems("HEADER", locale),
      getNavItems("FOOTER", locale),
      listActiveLocales(),
      getDefaultLocaleCode(),
      getSiteSettings(),
      getNotFoundContent(locale),
    ]);

  return (
    <main className="bg-[var(--px-bg)] overflow-x-clip">
      <SiteChrome
        navItems={navItems}
        footerNavItems={footerNavItems}
        locale={locale}
        locales={locales}
        defaultLocale={defaultLocale}
        settings={settings}
        ui={getUi(locale)}
      >
        <NotFoundContent hero={content.hero} links={content.links} ui={getUi(locale)} />
      </SiteChrome>
    </main>
  );
}
