import type { Metadata } from "next";
import ServicesPageContent from "../../components/pages/ServicesPageContent";
import { getServicesContent } from "@/lib/content/pages";
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
  return buildPageMetadata(settings, "services", { path: "/services", locale });
}

export default async function ServicesPage() {
  const locale = await getRequestLocale();
  const content = await getServicesContent(locale);
  return <ServicesPageContent content={content} ui={getUi(locale)} />;
}
