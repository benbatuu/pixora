import type { Metadata } from "next";
import NotFoundContent from "../components/pages/NotFoundContent";
import { getNotFoundContent } from "@/lib/content/pages";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { getUi } from "@/lib/i18n/ui";
import { getSiteSettings } from "@/lib/content/settings";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

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

/** Used when notFound() is called inside (site) — SiteChrome already from layout. */
export default async function SiteNotFound() {
  const locale = await getRequestLocale();
  const content = await getNotFoundContent(locale);
  return <NotFoundContent hero={content.hero} links={content.links} ui={getUi(locale)} />;
}
