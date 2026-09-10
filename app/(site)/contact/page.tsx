import type { Metadata } from "next";
import ContactPageContent from "../../components/pages/ContactPageContent";
import { getContactContent } from "@/lib/content/pages";
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
  return buildPageMetadata(settings, "contact", { path: "/contact", locale });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const [content, settings] = await Promise.all([
    getContactContent(locale),
    getSiteSettings(),
  ]);
  return (
    <ContactPageContent
      title={content.title}
      inquiries={content.inquiries}
      offices={content.offices}
      socials={content.socials}
      officesHeading={content.officesHeading}
      ui={getUi(locale)}
      contactForm={settings.contactForm?.[locale] ?? settings.contactForm?.en}
    />
  );
}
