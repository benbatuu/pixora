"use client";

import Link from "next/link";
import { useRef } from "react";
import { useFadeAnim } from "../useFadeAnim";
import {
  NOT_FOUND_DEFAULTS,
  type NotFoundHero,
  type NotFoundLink,
} from "@/app/data/not-found";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";

export type NotFoundContentProps = {
  hero?: NotFoundHero;
  links?: NotFoundLink[];
  ui?: UiMessages;
};

function bgClasses(background: NotFoundHero["background"]) {
  switch (background) {
    case "dark":
      return "bg-[#0a0a0a] text-white";
    case "red":
      return "bg-[#e11010] text-white";
    case "light":
    default:
      return "bg-[var(--px-bg)] text-px-black";
  }
}

function codeColor(background: NotFoundHero["background"]) {
  switch (background) {
    case "dark":
      return "text-[#e11010]";
    case "red":
      return "text-white/90";
    default:
      return "text-[#e11010]";
  }
}

function mutedColor(background: NotFoundHero["background"]) {
  switch (background) {
    case "dark":
    case "red":
      return "text-white/70";
    default:
      return "text-[#5d5d5d]";
  }
}

function primaryCta(background: NotFoundHero["background"]) {
  if (background === "red") {
    return "bg-white text-px-black hover:bg-px-black hover:text-white";
  }
  return "bg-px-black text-white hover:bg-[#e11010]";
}

function secondaryCta(background: NotFoundHero["background"]) {
  if (background === "dark") {
    return "border-white/40 text-white hover:border-white hover:bg-white hover:text-px-black";
  }
  if (background === "red") {
    return "border-white/60 text-white hover:bg-white hover:text-[#e11010]";
  }
  return "border-black/15 text-px-black hover:border-px-black hover:bg-px-black hover:text-white";
}

export default function NotFoundContent({
  hero = NOT_FOUND_DEFAULTS.hero,
  links = NOT_FOUND_DEFAULTS.links,
  ui,
}: NotFoundContentProps = {}) {
  const messages = ui ?? getUi("en");
  const rootRef = useRef<HTMLDivElement>(null);
  useFadeAnim(rootRef);

  const background = hero.background ?? "light";
  const align = hero.align ?? "center";
  const showCode = hero.showCode !== false;
  const code = hero.code?.trim() || "404";
  const alignCls =
    align === "left"
      ? "items-start text-left"
      : "items-center text-center";

  return (
    <div ref={rootRef} className={bgClasses(background)}>
      <section className="relative w-full px-16 py-24 md:py-32 lg:py-40">
        <div className={`mx-auto flex max-w-[1400px] flex-col gap-8 ${alignCls}`}>
          {showCode ? (
            <p
              className={`mb-0 font-thunder text-[96px] font-semibold uppercase leading-none tracking-[1px] md:text-[160px] lg:text-[220px] xl:text-[280px] ${codeColor(background)}`}
            >
              {code}
            </p>
          ) : null}

          <h1 className="mb-0 font-thunder text-[42px] font-semibold uppercase leading-[0.95] tracking-[-1px] md:text-[64px] lg:text-[80px]">
            {hero.title}
          </h1>

          {hero.description ? (
            <p
              className={`max-w-xl text-base font-medium leading-relaxed tracking-[-0.02em] md:text-lg ${mutedColor(background)} ${align === "center" ? "mx-auto" : ""}`}
            >
              {hero.description}
            </p>
          ) : null}

          <div
            className={`mt-2 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : "justify-start"}`}
          >
            {hero.ctaLabel && hero.ctaHref ? (
              <Link
                href={hero.ctaHref}
                className={`inline-flex items-center rounded-[50px] px-9 py-[17px] text-[15px] font-semibold uppercase leading-none tracking-[-0.6px] transition-[background,color] duration-300 ${primaryCta(background)}`}
              >
                {hero.ctaLabel}
              </Link>
            ) : null}
            {hero.secondaryCtaLabel && hero.secondaryCtaHref ? (
              <Link
                href={hero.secondaryCtaHref}
                className={`inline-flex items-center rounded-[50px] border px-9 py-[17px] text-[15px] font-semibold uppercase leading-none tracking-[-0.6px] transition-all duration-300 ${secondaryCta(background)}`}
              >
                {hero.secondaryCtaLabel}
              </Link>
            ) : null}
          </div>

          {hero.imageUrl ? (
            <div
              className={`mt-6 w-full max-w-3xl overflow-hidden rounded-2xl ${align === "center" ? "mx-auto" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.imageUrl}
                alt=""
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}

          {links.length > 0 ? (
            <nav
              aria-label={messages.quickLinksAria}
              className={`mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t pt-8 ${background === "light" ? "border-black/10" : "border-white/20"} ${align === "center" ? "justify-center" : "justify-start"}`}
            >
              {links.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className={`text-sm font-semibold uppercase tracking-[-0.4px] transition-opacity hover:opacity-70 ${background === "light" ? "text-px-black" : "text-white"}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}

