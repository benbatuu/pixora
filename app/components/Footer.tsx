"use client";

import { useRef } from "react";
import Link from "next/link";
import { useFadeAnim } from "./useFadeAnim";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import {
  FALLBACK_NAV,
  type NavItemPublic,
} from "@/lib/content/nav-data";
import type { PublicLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { SITE_SETTINGS } from "@/app/data/site";
import type { SiteSettings } from "@/lib/admin/types";
import type { UiMessages } from "@/lib/i18n/ui";
import { getChrome } from "@/lib/content/chrome";

const FOOTER_SOCIALS = [
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
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M12.0586 4.94727C12.6109 4.94727 13.0586 4.49955 13.0586 3.94727C13.0586 3.39498 12.6109 2.94727 12.0586 2.94727V4.94727ZM12.0496 2.94727C11.4973 2.94727 11.0496 3.39498 11.0496 3.94727C11.0496 4.49955 11.4973 4.94727 12.0496 4.94727V2.94727ZM8 14C6.32181 14 5.16377 13.9979 4.2928 13.8808C3.45059 13.7675 3.02803 13.5636 2.73223 13.2678L1.31802 14.682C2.04735 15.4113 2.96231 15.7199 4.0263 15.8629C5.06152 16.0021 6.37835 16 8 16V14ZM0 8C0 9.62165 -0.00212373 10.9385 0.137058 11.9737C0.280107 13.0377 0.588687 13.9526 1.31802 14.682L2.73223 13.2678C2.43644 12.972 2.23246 12.5494 2.11922 11.7072C2.00212 10.8362 2 9.67819 2 8H0ZM14 8C14 9.67819 13.9979 10.8362 13.8808 11.7072C13.7675 12.5494 13.5636 12.972 13.2678 13.2678L14.682 14.682C15.4113 13.9526 15.7199 13.0377 15.8629 11.9737C16.0021 10.9385 16 9.62165 16 8H14ZM8 16C9.62165 16 10.9385 16.0021 11.9737 15.8629C13.0377 15.7199 13.9526 15.4113 14.682 14.682L13.2678 13.2678C12.972 13.5636 12.5494 13.7675 11.7072 13.8808C10.8362 13.9979 9.67819 14 8 14V16ZM8 2C9.67819 2 10.8362 2.00212 11.7072 2.11922C12.5494 2.23246 12.972 2.43644 13.2678 2.73223L14.682 1.31802C13.9526 0.588687 13.0377 0.280107 11.9737 0.137058C10.9385 -0.00212373 9.62165 0 8 0V2ZM16 8C16 6.37835 16.0021 5.06152 15.8629 4.0263C15.7199 2.96231 15.4113 2.04735 14.682 1.31802L13.2678 2.73223C13.5636 3.02803 13.7675 3.45059 13.8808 4.2928C13.9979 5.16377 14 6.32181 14 8H16ZM8 0C6.37835 0 5.06152 -0.00212373 4.0263 0.137058C2.96231 0.280107 2.04735 0.588687 1.31802 1.31802L2.73223 2.73223C3.02803 2.43644 3.45059 2.23246 4.2928 2.11922C5.16377 2.00212 6.32181 2 8 2V0ZM2 8C2 6.32181 2.00212 5.16377 2.11922 4.2928C2.23246 3.45059 2.43644 3.02803 2.73223 2.73223L1.31802 1.31802C0.588687 2.04735 0.280107 2.96231 0.137058 4.0263C-0.00212373 5.06152 0 6.37835 0 8H2ZM10.3171 8.00134C10.3171 9.28031 9.28031 10.3171 8.00134 10.3171V12.3171C10.3849 12.3171 12.3171 10.3849 12.3171 8.00134H10.3171ZM8.00134 10.3171C6.72236 10.3171 5.68555 9.28031 5.68555 8.00134H3.68555C3.68555 10.3849 5.61779 12.3171 8.00134 12.3171V10.3171ZM5.68555 8.00134C5.68555 6.72236 6.72236 5.68555 8.00134 5.68555V3.68555C5.61779 3.68555 3.68555 5.61779 3.68555 8.00134H5.68555ZM8.00134 5.68555C9.28031 5.68555 10.3171 6.72236 10.3171 8.00134H12.3171C12.3171 5.61779 10.3849 3.68555 8.00134 3.68555V5.68555ZM12.0586 2.94727H12.0496V4.94727H12.0586V2.94727Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export type FooterProps = {
  navItems?: NavItemPublic[];
  locale?: string;
  locales?: PublicLocale[];
  defaultLocale?: string;
  settings?: SiteSettings;
  ui?: UiMessages;
};

export default function Footer({
  navItems,
  locale = DEFAULT_LOCALE,
  locales = [],
  defaultLocale = DEFAULT_LOCALE,
  settings = SITE_SETTINGS,
  ui: _ui,
}: FooterProps = {}) {
  const chrome = getChrome(settings, locale);
  const footerRef = useRef<HTMLElement>(null);
  useFadeAnim(footerRef);
  const quickLinks = navItems?.length ? navItems : FALLBACK_NAV;
  const socials = (settings.socials?.length ? settings.socials : SITE_SETTINGS.socials).map((s) => {
    const icon = FOOTER_SOCIALS.find((f) => f.label.toLowerCase() === s.label.toLowerCase())?.icon;
    return { ...s, icon: icon ?? <span className="text-[10px] font-bold">{s.label.slice(0, 1)}</span> };
  });
  const tagline = chrome.footerTagline;
  const email = settings.footerContactEmail ?? settings.email;
  const phone = settings.footerContactPhone ?? settings.phone;
  const address = chrome.footerAddress;

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="bg-[#0a0a0a] text-white"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="px-footer-area pt-[125px] pb-[35px]">
        <div className="w-full px-16">
          <div className="flex flex-wrap items-start gap-y-10">
            <div className="w-full pb-10 lg:w-1/3 xl:w-1/3">
              <div
                className="px-footer-widget px-footer-col-1 px-fade-anim"
                data-delay=".3"
              >
                <h4 className="m-0 font-thunder text-[clamp(40px,5vw,80px)] font-bold uppercase leading-none text-white whitespace-pre-line">
                  {tagline}
                </h4>
                <div className="px-footer-widget-social mt-6 flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="inline-grid h-[42px] w-[42px] place-items-center rounded-full bg-white/10 text-white transition-[background,color] duration-300 hover:bg-px-red hover:text-white"
                      style={{ marginRight: 5 }}
                      aria-label={s.label}
                    >
                      <span>{s.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full pb-10 md:w-1/2 lg:w-1/3 xl:w-5/12">
              <div
                className="px-footer-widget px-footer-col-2 px-fade-anim"
                data-delay=".5"
              >
                <h4 className="mb-6 m-0 text-lg font-semibold tracking-[0.02em] text-white">{chrome.footerQuickLinksTitle}</h4>
                <div className="[&_ul]:m-0 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-wrap [&_ul]:gap-2.5 [&_ul]:p-0 [&_li]:list-none [&_a]:inline-block [&_a]:rounded-[20px] [&_a]:bg-white/10 [&_a]:px-5 [&_a]:py-[13px] [&_a]:text-sm [&_a]:font-medium [&_a]:uppercase [&_a]:leading-none [&_a]:text-white [&_a]:transition-[background,color] [&_a]:duration-300 hover:[&_a]:bg-px-red">
                  <ul>
                    {quickLinks.map((l) => (
                      <li key={`${l.href}-${l.label}`} style={{ marginRight: 5 }}>
                        <Link href={localizedPath(l.href, locale, defaultLocale)}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <LanguageSwitcher
                    locale={locale}
                    locales={locales}
                    defaultLocale={defaultLocale}
                    variant="footer"
                    label={chrome.languageLabel}
                  />
                </div>
              </div>
            </div>

            <div className="w-full pb-10 md:w-1/2 lg:w-1/3 xl:w-1/4">
              <div
                className="px-footer-widget px-footer-col-3 mb-8 px-fade-anim"
                data-delay=".7"
              >
                <h4 className="mb-5 m-0 text-lg font-semibold tracking-[0.02em] text-white">{chrome.footerContactTitle}</h4>
                <div className="flex flex-col gap-2 [&_a]:text-base [&_a]:text-white [&_a]:transition-colors [&_a]:duration-300 hover:[&_a]:text-px-red">
                  <a href={`mailto:${email}`}>{email}</a>
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
                </div>
                <div className="mt-4 [&_a]:text-[15px] [&_a]:leading-[1.6] [&_a]:text-white/85 hover:[&_a]:text-white">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={chrome.footerMapsUrl || "https://www.google.com/maps/"}
                    className="whitespace-pre-line"
                  >
                    {address}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-copyright-area">
        <div className="w-full px-16">
          <div className="px-copyright-content overflow-hidden text-center">
            <h2 className="font-thunder text-[clamp(64px,18vw,280px)] font-bold uppercase leading-[0.85] tracking-[0.04em] text-px-red">
              {chrome.copyrightName}
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
}
