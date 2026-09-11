"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFadeAnim } from "./useFadeAnim";

import {
  HOME_DEFAULTS,
  type HomeHeroItem,
} from "@/app/data/home";

export type HeroCollageProps = {
  items?: HomeHeroItem[];
  defaultActive?: number;
  ctaHref?: string;
  bottomLeft?: string;
  bottomRight?: string;
  bottomTagline?: string;
};

export default function HeroCollage({
  items = HOME_DEFAULTS.hero.items,
  defaultActive = HOME_DEFAULTS.hero.defaultActive,
  ctaHref = HOME_DEFAULTS.hero.ctaHref,
  bottomLeft = HOME_DEFAULTS.hero.bottomLeft,
  bottomRight = HOME_DEFAULTS.hero.bottomRight,
  bottomTagline = HOME_DEFAULTS.hero.bottomTagline,
}: HeroCollageProps = {}) {
  const ITEMS = items;
  const [active, setActive] = useState(defaultActive);
  const sectionRef = useRef<HTMLElement>(null);
  useFadeAnim(sectionRef);

  return (
    <section ref={sectionRef} className="px-hero-2-area pt-[120px] pb-5">
      {/* Desktop collage — d-none d-xl-block */}
      <div className="px-hero-2-main relative mb-[110px] hidden xl:block">
        <div className="w-full px-16">
          <div className="grid grid-cols-12">
            {ITEMS.map((item, i) => (
              <div
                key={item.src}
                className={`${item.col} mb-[50px] px-fade-anim`}
                data-delay=".3"
                onMouseEnter={() => setActive(i)}
              >
                <div
                  className={`px-hero-2-item mb-0 flex ${
                    item.justify === "end" ? "justify-end" : "justify-start"
                  } ${item.pad ?? ""} ${active === i ? "active" : ""}`}
                >
                  <div className="px-hero-2-thumb">
                    <Link href={ctaHref}>
                      <Image
                        src={item.src}
                        alt={item.title}
                        width={130}
                        height={168}
                        priority={i < 2}
                      />
                    </Link>
                  </div>
                  <div className="px-hero-2-content text-center z-[1]">
                    <div className="tp">
                      <span>{item.title}</span>
                    </div>
                    <div className="tp">
                      <span>{item.subtitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / tablet — simplified thumbs + caption */}
      <div className="px-hero-2-slider xl:hidden ">
        <div className="w-full pb-12">
          <div className="mb-8 text-center">
            <p className="font-thunder text-[clamp(28px,6vw,42px)] leading-[0.95] text-(--px-black)">
              {ITEMS[active].title}
            </p>
            <p className="mt-1 font-thunder text-[clamp(18px,4vw,28px)] leading-[0.95] text-(--px-body)">
              {ITEMS[active].subtitle}
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ITEMS.map((item, i) => (
              <button
                key={item.src}
                type="button"
                className={`px-hero-2-item shrink-0 ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
              >
                <div className="px-hero-2-thumb">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={130}
                    height={168}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* design / Studio bottom — merged DesignTitle */}
      <div className="w-full">
        <div className="px-hero-2-bottom relative p-relative text-center px-fade-anim" data-delay=".3">
          <h4 className="flex items-end justify-center gap-3 md:gap-6">
            <span className="font-thunder text-5xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-[-0.03em] text-px-black">{bottomLeft}</span>
            <i className="hidden xl:block text-4xl">
              <span className="inline-block max-w-[12ch] whitespace-pre-line text-center">
                {bottomTagline}
              </span>
            </i>
            <span className="font-thunder text-5xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-[-0.03em] text-px-black">{bottomRight}</span>
          </h4>
          <p className="mt-4 text-center text-sm text-[var(--px-black)] xl:hidden">
            {bottomTagline}
          </p>
        </div>
      </div>
    </section>
  );
}
