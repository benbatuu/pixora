import type { Metadata } from "next";
import AboutPageContent from "../../components/pages/AboutPageContent";
import { getAboutContent } from "@/lib/content/pages";
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
  return buildPageMetadata(settings, "about", { path: "/about", locale });
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const content = await getAboutContent(locale);
  return <AboutPageContent content={content} ui={getUi(locale)} />;
}
