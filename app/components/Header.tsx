"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MenuIcon, XIcon } from "lucide-react";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import {
  FALLBACK_NAV,
  type NavItemPublic,
} from "@/lib/content/nav-data";
import type { PublicLocale } from "@/lib/i18n/config";
import { localizedPath, stripLocalePrefix } from "@/lib/i18n/path";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { SITE_SETTINGS } from "@/app/data/site";
import type { SiteSettings } from "@/lib/admin/types";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";
import { getChrome } from "@/lib/content/chrome";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.82727 6.83333C1.14284 6.83333 1 6.96763 1 7.61111V8.77778C1 9.42126 1.14284 9.55556 1.82727 9.55556H3.48182V14.2222C3.48182 14.8657 3.62466 15 4.30909 15H5.96364C6.64807 15 6.79091 14.8657 6.79091 14.2222V9.55556H8.64871C9.1678 9.55556 9.30155 9.4607 9.44416 8.99145L9.7987 7.82478C10.043 7.02095 9.89246 6.83333 9.00326 6.83333H6.79091V4.88889C6.79091 4.45933 7.16129 4.11111 7.61818 4.11111H9.97273C10.6572 4.11111 10.8 3.97681 10.8 3.33333V1.77778C10.8 1.1343 10.6572 1 9.97273 1H7.61818C5.33373 1 3.48182 2.74111 3.48182 4.88889V6.83333H1.82727Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M2.50589 12.7494C4.57662 16.336 9.16278 17.5648 12.7494 15.4941C14.2113 14.65 15.2816 13.388 15.8962 11.9461C16.7895 9.85066 16.7208 7.37526 15.4941 5.25063C14.2674 3.12599 12.1581 1.82872 9.89669 1.55462C8.34063 1.366 6.71259 1.66183 5.25063 2.50589C1.66403 4.57662 0.435172 9.16278 2.50589 12.7494Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12.7127 15.4292C12.7127 15.4292 12.0086 10.4867 10.5011 7.87559C8.99362 5.26451 5.28935 2.57155 5.28935 2.57155M5.68449 15.6124C6.79553 12.2606 12.34 8.54524 16.3975 9.43537M12.311 2.4082C11.1953 5.72344 5.75732 9.38453 1.71875 8.58915"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="14" height="13" viewBox="0 0 14 13" fill="none" aria-hidden>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.41177 0H0L5.23083 6.87316L0.334618 12.6389H2.59681L6.29998 8.27809L9.58823 12.5988H14L8.6172 5.52593L8.62673 5.53813L13.2614 0.0802914H10.9992L7.55741 4.13336L4.41177 0ZM2.43522 1.20371H3.80866L11.5648 11.395H10.1913L2.43522 1.20371Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "Youtube",
    href: "#",
    icon: (
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
        <path
          d="M12.75 13H5.25C3 13 1.5 11.5 1.5 9.25V4.75C1.5 2.5 3 1 5.25 1H12.75C15 1 16.5 2.5 16.5 4.75V9.25C16.5 11.5 15 13 12.75 13Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.70676 5.14837L10.8006 6.40465C11.5543 6.90716 11.5543 7.66093 10.8006 8.16344L8.70676 9.41972C7.86923 9.92224 7.19922 9.50348 7.19922 8.5822V6.06964C7.19922 4.98086 7.86923 4.64585 8.70676 5.14837Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

function isActivePath(pathname: string, href: string) {
  const bare = stripLocalePrefix(pathname);
  if (href === "/") return bare === "/";
  return bare === href || bare.startsWith(`${href}/`);
}

export type HeaderProps = {
  navItems?: NavItemPublic[];
  locale?: string;
  locales?: PublicLocale[];
  defaultLocale?: string;
  settings?: SiteSettings;
  ui?: UiMessages;
};

export default function Header({
  navItems,
  locale = DEFAULT_LOCALE,
  locales = [],
  defaultLocale = DEFAULT_LOCALE,
  settings = SITE_SETTINGS,
  ui,
}: HeaderProps = {}) {
  const messages = ui ?? getUi(locale);
  const chrome = getChrome(settings, locale);
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = navItems?.length ? navItems : FALLBACK_NAV;
  const logoUrl = settings.brand?.logoLightUrl || SITE_SETTINGS.brand.logoLightUrl;
  const logoAlt = settings.brand?.logoAlt || SITE_SETTINGS.brand.logoAlt;
  const headerSocials = settings.headerSocials?.length
    ? settings.headerSocials
    : settings.socials?.length
      ? settings.socials
      : SITE_SETTINGS.headerSocials ?? [];
  const socialByLabel = Object.fromEntries(SOCIALS.map((s) => [s.label.toLowerCase(), s]));
  const resolvedSocials = headerSocials.map((s) => {
    const iconEntry = socialByLabel[s.label.toLowerCase()];
    return {
      label: s.label,
      href: s.href,
      icon: iconEntry?.icon ?? <span className="text-[10px] font-bold">{s.label.slice(0, 1)}</span>,
    };
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    const t = window.setTimeout(refresh, 200);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showGlass = scrolled && !open;

  return (
    <>
      {/* ── Header bar ──────────────────────────────────────────── */}
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-80 p-2 md:p-4 lg:p-6 transition-all duration-300 ${open ? "pt-8 p-8 md:p-16 lg:p-16 xl:p-16" : "p-0"} ${
          showGlass
            ? "bg-white/10 backdrop-blur-md backdrop-saturate-150 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link
            href={localizedPath("/", locale, defaultLocale)}
            className="pointer-events-auto relative z-90 shrink-0"
          >
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={110}
              height={39}
              className="h-auto w-36 px-3 md:px-0 lg:px-0"
              priority
            />
          </Link>

          {/* Right controls */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4 px-4 md:px-0">
            <LanguageSwitcher
              locale={locale}
              locales={locales}
              defaultLocale={defaultLocale}
              variant="header"
              className="pointer-events-auto relative z-90 hidden sm:block"
              label={chrome.languageLabel}
            />

            {/* Hamburger / close button (was .tp-hamburger-btn / .hamburger-btn) */}
            <button
              type="button"
              className={`pointer-events-auto relative z-90 inline-grid h-14 w-14 origin-right scale-[0.72] sm:scale-[0.85] lg:scale-100 place-items-center rounded-full border-0 p-0 shadow-[0_8px_28px_rgba(0,0,0,0.12)] transition-colors duration-300 cursor-pointer ${
                open ? "bg-px-black text-white" : "bg-white text-px-black"
              }`}
              aria-label={open ? messages.closeMenu : messages.openMenu}
              aria-expanded={open}
              aria-controls="offcanvasMenu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Offcanvas menu (was .px-offcanvas-2-area and children) ─ */}
      <div
        id="offcanvasMenu"
        aria-hidden={!open}
        className={`fixed inset-0 z-70 h-full w-full transition-[visibility] duration-0 ${
          open ? "visible pointer-events-auto delay-0 p-5 md:p-0 lg:p-0" : "invisible pointer-events-none delay-1000 px-8 pt-0"
        }`}
      >
        {/* Background panel with clip-path reveal */}
        <div
          className={`fixed inset-0 -z-10 overflow-hidden rounded-2xl bg-px-black shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-[clip-path] duration-700 ease-in-out m-5 md:rounded-[20px] ${
            open
              ? "delay-0 [clip-path:circle(150%_at_calc(100%-45px)_45px)]"
              : "delay-400 [clip-path:circle(0%_at_calc(100%-45px)_45px)]"
          }`}
        >
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.55]"
            loop
            muted
            playsInline
            autoPlay={open}
            key={open ? "menu-bg-on" : "menu-bg-off"}
          >
            <source src="/assets/video/menu-bg-smoke.mp4" type="video/mp4" />
          </video>
          <div
            className="pointer-events-none absolute inset-0 [background:linear-gradient(105deg,rgba(10,10,10,0.72)_0%,rgba(10,10,10,0.45)_45%,rgba(10,10,10,0.7)_100%)]"
            aria-hidden
          />
        </div>

        {/* Content wrapper */}
        <div
          className={`relative z-1 h-full px-0 md:px-7.5 pt-24 md:p-36 pb-10 ${
            open ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className={`grid h-full max-h-[calc(100vh-140px)] grid-cols-1 items-start gap-8 min-[992px]:grid-cols-2 min-[992px]:items-center min-[992px]:gap-12 ${open ? "p-6 md:p-8" : "p-0"}`}>
            {/* Nav links (was .px-offcanvas-2-left) */}
            <div
              className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                open ? "translate-y-0 opacity-100 delay-760" : "translate-y-7.5 opacity-0 delay-600"
              }`}
            >
              <nav aria-label={messages.primaryNav}>
                <ul className="m-0 list-none p-0 [&>li:not(:last-child)]:mb-4.5 min-[992px]:[&>li:not(:last-child)]:mb-5.5">
                  {items.map((item) => {
                    const active = isActivePath(pathname, item.href);
                    const href = localizedPath(item.href, locale, defaultLocale);
                    return (
                      <li key={`${item.href}-${item.label}`}>
                        <div className="flex items-center justify-start gap-6">
                          <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={`font-thunder text-[clamp(42px,9vw,120px)] font-bold uppercase leading-[0.82] tracking-[0.09em] ${
                              active ? "text-px-red" : "text-white"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Contact / social (was .px-offcanvas-2-right) */}
            <div
              className={`flex w-full min-h-[200px] flex-col items-start justify-end gap-5 transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] min-[992px]:items-end ${
                open ? "translate-y-0 opacity-100 delay-[1310ms] w-full p-0" : "translate-y-[30px] opacity-0 delay-0"
              }`}
            >
              <div className="w-full max-w-none text-white min-[992px]:max-w-[420px] min-[992px]:text-right">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  {chrome.offcanvasLabel}
                </p>
                <h3 className={`font-thunder mb-[22px] whitespace-pre-line md:whitespace-pre-line lg:whitespace-pre-line text-[clamp(36px,4vw,56px)] font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-white`}>
                  {chrome.offcanvasTitle}
                </h3>
                <a
                  href={`mailto:${chrome.offcanvasEmail}`}
                  className="mb-2 block text-[clamp(18px,2vw,24px)] font-medium text-white transition-colors duration-300 hover:text-[#e11010]"
                >
                  {chrome.offcanvasEmail}
                </a>
                <a
                  href={`tel:${chrome.offcanvasPhone.replace(/[^\d+]/g, "")}`}
                  className="mb-2 block text-[clamp(18px,2vw,24px)] font-medium text-white transition-colors duration-300 hover:text-[#e11010]"
                >
                  {chrome.offcanvasPhone}
                </a>
                <p className="mt-[18px] whitespace-nowrap md:whitespace-pre-line lg:whitespace-pre-line text-sm font-medium leading-[1.5] text-white/50">
                  {chrome.offcanvasMeta}
                </p>
              </div>
 
              <div className="w-full text-white">
                <ul className="m-0 flex list-none items-center justify-start gap-2 p-0 min-[992px]:justify-end">
                  {resolvedSocials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        aria-label={s.label}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1e1e1e] text-white transition-colors duration-300 hover:bg-[#e11010]"
                      >
                        {s.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}