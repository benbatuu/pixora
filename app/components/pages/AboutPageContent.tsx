"use client";

import { useEffect, useRef, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import {
  ABOUT_DEFAULTS,
  type AboutContent,
} from "@/app/data/about";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";
import Awards from "../Awards";

gsap.registerPlugin(ScrollTrigger);

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" fill="none" />
    </svg>
  );
}

function SocialIcons() {
  return (
    <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="flex gap-2 [&_a]:inline-flex [&_a]:h-9 [&_a]:w-9 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-full [&_a]:bg-white [&_a]:text-xs [&_a]:font-semibold [&_a]:text-px-black">
        <a href="#" aria-label="Facebook">
          <span>Fb</span>
        </a>
        <a href="#" aria-label="X">
          <span>X</span>
        </a>
        <a href="#" aria-label="Instagram">
          <span>Ig</span>
        </a>
      </div>
    </div>
  );
}

export type AboutPageContentProps = {
  content?: AboutContent;
  ui?: UiMessages;
};

export default function AboutPageContent({
  content = ABOUT_DEFAULTS,
  ui,
}: AboutPageContentProps = {}) {
  const messages = ui ?? getUi("en");
  const hero = content.hero;
  const STATS = content.stats;
  const SOLUTIONS = content.solutions;
  const TEAM = content.team;
  const AWARDS = content.awards;
  const MARQUEE_SLIDES = Array.from({ length: 8 }, () => content.marquee.text);
  const bannerWrapRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = bannerWrapRef.current;
    const img = bannerImgRef.current;
    if (!wrap || !img) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white text-px-black px-4">
      {/* 1. Hero */}
      <section className="border-b border-[#1e1e1e0f] pt-[80px] md:pt-[calc(120px+48px)] pb-[150px] max-lg:pt-[120px] max-lg:pb-[90px]">
        <div className="w-full mx-auto">
          <div className="text-center">
            <h2 className="mb-12.5 mt-0 font-thunder text-7xl md:text-[172px] lg:text-[376px] font-semibold uppercase tracking-[0.09em] text-px-red">
              {hero.title}
            </h2>
          </div>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-6">
            <div className="xl:col-span-5">
              <span className="inline-block text-base font-medium tracking-[-0.03em] text-px-black">{hero.label}</span>
            </div>
            <div className="xl:col-span-7">
              <div className="[&_p]:mb-[50px] [&_p]:font-[var(--font-inter),Inter,system-ui,sans-serif] [&_p]:text-[24px] [&_p]:font-semibold [&_p]:leading-[1.05] [&_p]:tracking-[-2px] [&_p]:text-px-black min-[576px]:[&_p]:text-[32px] lg:[&_p]:text-[42px] xl:[&_p]:text-[50px] xl:[&_p]:mb-[50px] min-[1400px]:[&_p]:mb-[50px] [&_p_span]:text-[#e11010]">
                <p>
                  {(() => {
                    const words = hero.introAccentWords ?? [];
                    if (!words.length) return hero.intro;
                    let nodes: Array<string | ReactElement> = [hero.intro];
                    words.forEach((w, wi) => {
                      const next: Array<string | ReactElement> = [];
                      nodes.forEach((part) => {
                        if (typeof part !== "string" || !part.includes(w)) {
                          next.push(part);
                          return;
                        }
                        const chunks = part.split(w);
                        chunks.forEach((chunk, ci) => {
                          next.push(chunk);
                          if (ci < chunks.length - 1) {
                            next.push(<span key={`acc-${wi}-${ci}`}>{w}</span>);
                          }
                        });
                      });
                      nodes = next;
                    });
                    return nodes;
                  })()}
                </p>
                <Link className="inline-block rounded-[50px] bg-px-black px-9 py-[17px] text-[15px] font-semibold uppercase leading-none tracking-[-0.6px] text-white transition-[background] duration-300 hover:bg-[#e11010] hover:text-white" href={hero.ctaHref}>
                  {hero.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Parallax banner */}
      <div ref={bannerWrapRef} className="relative w-full overflow-hidden leading-[0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bannerImgRef}
          src={hero.bannerUrl}
          alt={hero.bannerAlt || "banner-image"}
          width={1905}
          height={1078}
          className="block h-auto w-full max-w-none origin-center scale-[1.15] will-change-transform"
          data-speed="0.1"
        />
      </div>

      {/* 3. Lead + video + copy */}
      <section className="pt-[100px] pb-20 xl:pt-[120px]">
        <div className="w-full px4">
          <div className="mb-[70px] w-full">
            <div className="[&_p]:mb-0 [&_p]:font-thunder [&_p]:text-[36px] [&_p]:font-semibold [&_p]:uppercase [&_p]:leading-none [&_p]:tracking-[-1px] [&_p]:text-px-black min-[576px]:[&_p]:text-[54px] lg:[&_p]:text-[75px] xl:[&_p]:text-[85px] min-[1600px]:[&_p]:text-[100px] [&_p_span]:text-[#e11010]">
              <p>
                {hero.lead}{" "}
                <span>{hero.leadAccent}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <div className="relative min-h-[280px] overflow-hidden bg-[#111] [&_video]:relative [&_video]:z-[1] [&_video]:block [&_video]:h-auto [&_video]:min-h-[280px] [&_video]:w-full [&_video]:object-cover">
                <video
                  loop
                  muted
                  autoPlay
                  playsInline
                  preload="auto"
                  controls={false}
                >
                  <source src={hero.videoUrl} type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="xl:col-span-5 xl:col-start-8 my-auto">
              <p className="mb-5 font-[var(--font-inter),Inter,system-ui,sans-serif] text-[30px] font-semibold leading-[40px] tracking-[-1.2px] text-px-black">
                  {hero.approachTitle}
                </p>
                <p className="mb-10 text-lg font-normal leading-7 tracking-[-0.36px] text-[#5d5d5d]">
                  {hero.approachBody}
                </p>
                <Link className="inline-block rounded-[50px] bg-px-black px-9 py-[17px] text-[15px] font-semibold uppercase leading-none tracking-[-0.6px] text-white transition-[background] duration-300 hover:bg-[#e11010] hover:text-white" href={hero.portfolioHref}>
                  {hero.portfolioLabel}
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Funfacts — 4 across */}
      <section className="pb-[50px]">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="h-full border border-[#1e1e1e0f] px-[45px] pt-[45px] pb-[35px] shadow-[-1px_0_#e11010] max-lg:p-[30px] [&_h4]:mb-0 [&_h4]:font-thunder [&_h4]:text-[70px] [&_h4]:font-semibold [&_h4]:uppercase [&_h4]:leading-[0.76] [&_h4]:text-px-black xl:[&_h4]:text-[100px] [&_h4_i]:not-italic [&_span]:mt-3 [&_span]:block [&_span]:text-lg [&_span]:font-normal [&_span]:capitalize [&_span]:leading-none [&_span]:tracking-[-0.36px] [&_span]:text-[#5d5d5d]">
                <h4>
                  <i className="purecounter">{s.value}</i>
                  {s.suffix}
                </h4>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Marquee */}
      <div className="overflow-hidden py-[30px] pb-2.5">
        <Swiper
          modules={[Autoplay, FreeMode]}
          loop
          slidesPerView="auto"
          spaceBetween={40}
          speed={16000}
          allowTouchMove={false}
          freeMode={{ enabled: true, momentum: false }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          className="!overflow-visible"
        >
          {MARQUEE_SLIDES.map((text, i) => (
            <SwiperSlide key={`${text}-${i}`} className="!w-auto">
              <div className="[&_span]:inline-block [&_span]:whitespace-nowrap [&_span]:pr-10 [&_span]:font-thunder [&_span]:text-[56px] [&_span]:font-semibold [&_span]:leading-none [&_span]:tracking-[-1.4px] [&_span]:text-[#e11010] min-[576px]:[&_span]:text-[90px] lg:[&_span]:text-[150px] xl:[&_span]:text-[190px] min-[1600px]:[&_span]:text-[280px]">
                <span>{text}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 6. OUR SOLUTIONS — label left, list right */}
      <section className="pt-20 pb-20">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="inline-block text-base font-medium tracking-[-0.03em] text-px-black">{hero.solutionsHeading}</span>
            </div>
            <div className="lg:col-span-8">
              <div className="aus-service-content-wrap">
                <div className="mb-2 grid-cols-2 gap-4 hidden md:grid lg:grid">
                  <label className="pl-20 text-sm font-medium uppercase tracking-wide text-[var(--px-black)]">
                    {hero.solutionsServicesLabel ?? messages.servicesCol}
                  </label>
                  <label className="text-sm font-medium uppercase tracking-wide text-[var(--px-black)]">
                    {hero.solutionsInfoLabel ?? messages.infoCol}
                  </label>
                </div>
                {SOLUTIONS.map((s) => (
                  <div key={s.num} className="border-t border-black/10 px-5 py-[29px] last:border-b last:border-black/10">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
                      <div className="flex items-center [&_span]:mr-10 [&_span]:inline-block [&_span]:text-lg [&_span]:font-normal [&_span]:uppercase [&_span]:leading-none [&_span]:tracking-[-0.2px] [&_span]:text-px-black [&_h4]:mb-0 [&_h4]:font-[var(--font-inter),Inter,system-ui,sans-serif] [&_h4]:text-[34px] [&_h4]:font-medium [&_h4]:leading-[1.1] [&_h4]:tracking-[-2px] [&_h4]:text-px-black lg:[&_h4]:text-[42px] lg:[&_h4]:tracking-[-3px]">
                        <span>{s.num}</span>
                        <h4>{s.title}</h4>
                      </div>
                      <div className="[&_p]:m-0 [&_p]:text-base [&_p]:leading-[1.6] [&_p]:text-[#5d5d5d]">
                        <p>{s.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Team — 4 square-ish cards in a row */}
      <section className="pt-[130px] pb-10">
        <div className="w-full">
          <div className="mb-[60px] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h3 className="mb-0 whitespace-pre-line font-thunder text-[48px] font-bold leading-[0.9] tracking-[-0.02em] text-px-black md:text-[72px] xl:text-[100px]">
              {hero.teamTitle ?? hero.teamHeading ?? "Meet the\ntalented team"}
            </h3>
            <Link
              className="inline-flex items-center gap-2 text-[15px] font-medium text-px-black [&_i]:relative [&_i]:inline-flex [&_i]:h-3 [&_i]:w-3 [&_i]:overflow-hidden"
              href="/about"
            >
              <span>{hero.discoverAllLabel ?? messages.discoverAll}</span>
              <i>
                <ArrowIcon />
                <ArrowIcon />
              </i>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="group">
                <div className="relative">
                  <div className="ripple-image">
                    <SocialIcons />
                    <div className="px-team-img-square relative aspect-square overflow-hidden bg-[#f2f2f2]">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 [&_span]:text-sm [&_span]:text-px-body">
                  <h4 className="mb-1 text-xl font-semibold text-px-black">{m.name}</h4>
                  <span>{m.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Awards — title + 4-column rows */}
      <Awards />
    </div>
  );
}
