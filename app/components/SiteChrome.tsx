"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import PageTransition from "./PageTransition";
import type { NavItemPublic } from "@/lib/content/nav-data";
import type { PublicLocale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { localeFromPathname } from "@/lib/i18n/path";
import type { SiteSettings } from "@/lib/admin/types";
import { SITE_SETTINGS } from "@/app/data/site";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";

gsap.registerPlugin(ScrollTrigger);

export type SiteChromeProps = {
  children: React.ReactNode;
  navItems?: NavItemPublic[];
  footerNavItems?: NavItemPublic[];
  locale?: string;
  locales?: PublicLocale[];
  defaultLocale?: string;
  settings?: SiteSettings;
  ui?: UiMessages;
};

export default function SiteChrome({
  children,
  navItems,
  footerNavItems,
  locale = DEFAULT_LOCALE,
  locales = [],
  defaultLocale = DEFAULT_LOCALE,
  settings = SITE_SETTINGS,
  ui,
}: SiteChromeProps) {
  const pathname = usePathname();
  const pathLocale = localeFromPathname(pathname || "/");
  const activeLocale = pathLocale || locale;
  const messages = ui ?? getUi(activeLocale);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    const t1 = window.setTimeout(refresh, 150);
    const t2 = window.setTimeout(refresh, 500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <>
      <Header
        navItems={navItems}
        locale={activeLocale}
        locales={locales}
        defaultLocale={defaultLocale}
        settings={settings}
        ui={messages}
      />
      <PageTransition>{children}</PageTransition>
      <Footer
        navItems={footerNavItems ?? navItems}
        locale={activeLocale}
        locales={locales}
        defaultLocale={defaultLocale}
        settings={settings}
        ui={messages}
      />
      <BackToTop label={messages.backToTop} />
    </>
  );
}
