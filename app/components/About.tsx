"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFadeAnim } from "./useFadeAnim";
import { HOME_DEFAULTS, type HomeAboutContent } from "@/app/data/home";

gsap.registerPlugin(ScrollTrigger);

function ZikzakBg() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M60 0C50.3904 0 42.6 7.7904 42.6 17.4V17.9928L42.1812 17.5734C35.3856 10.7784 24.369 10.7784 17.5734 17.5734C10.7784 24.3684 10.7784 35.3856 17.5734 42.1812L17.9928 42.6H17.4C7.7904 42.6 0 50.3904 0 60C0 69.6096 7.7904 77.4 17.4 77.4H17.9928L17.5734 77.8188C10.7784 84.6144 10.7784 95.631 17.5734 102.427C24.3684 109.222 35.3856 109.222 42.1812 102.427L42.6 102.007V102.6C42.6 112.21 50.3904 120 60 120C69.6096 120 77.4 112.21 77.4 102.6V102.007L77.8194 102.427C84.6144 109.222 95.631 109.222 102.427 102.427C109.222 95.631 109.222 84.6144 102.427 77.8194L102.007 77.4H102.6C112.21 77.4 120 69.6096 120 60C120 50.3904 112.21 42.6 102.6 42.6H102.007L102.427 42.1812C109.222 35.3856 109.222 24.3684 102.427 17.5734C95.631 10.7784 84.6144 10.7784 77.8194 17.5734L77.4 17.9928V17.4C77.4 7.7904 69.6096 0 60 0Z"
        fill="#E11010"
      />
    </svg>
  );
}


export type AboutProps = Partial<HomeAboutContent>;

export default function About({
  line1Bold = HOME_DEFAULTS.about.line1Bold,
  line1Accent = HOME_DEFAULTS.about.line1Accent,
  designLabel = HOME_DEFAULTS.about.designLabel,
  gifUrl = HOME_DEFAULTS.about.gifUrl,
  studioLabel = HOME_DEFAULTS.about.studioLabel,
  aboutCtaLabel = HOME_DEFAULTS.about.aboutCtaLabel,
  aboutCtaHref = HOME_DEFAULTS.about.aboutCtaHref,
  fromLabel = HOME_DEFAULTS.about.fromLabel,
}: AboutProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  useFadeAnim(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const blurTargets = section.querySelectorAll(".text-effect");
      // Start readable; scrub only clears residual blur (never blank white)
      gsap.set(blurTargets, { filter: "blur(6px)", opacity: 0.85 });
      gsap.to(blurTargets, {
        filter: "blur(0px)",
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "center center",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="px-about-2-area py-6 md:py-10 px-4 items-center">
      <div className="w-full">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-3/4">
            <div className="px-about-2-title-box relative px-fade-anim" data-delay=".2">
              <h3 className="m-0 font-thunder font-bold uppercase leading-[0.85] tracking-[-0.02em] text-px-black [&_>b.text-effect:first-child]:inline-block [&_>b.text-effect:first-child]:text-[clamp(64px,18vw,350px)]">
                <b className="text-effect">{line1Bold}</b>{" "}
                <i className="inline-block align-baseline font-thunder text-[clamp(40px,5vw,80px)] not-italic text-px-red">{line1Accent}</i>
                <br />
                <em className="text-effect inline-block items-center gap-[clamp(12px,2vw,28px)] text-9xl md:text-[128px] lg:text-[256px] not-italic text-px-red">
                  <Image
                    src={gifUrl}
                    alt="gif image"
                    width={640}
                    height={360}
                    className="inline-block h-auto w-[640px] lg:w-[480px] lg:-mx-[42px]"
                    unoptimized
                  />
                  {designLabel}
                  <b className="text-effect text-black relative text-9xl md:text-[128px] lg:[256px] hidden md:inline-block lg:hidden md:px-4">
                  {studioLabel}
                </b>
                </em>
                <br />
                <b className="text-effect relative inline-block lg:inline-block text-9xl md:text-[256px] lg:[256px] md:hidden">
                  {studioLabel}
                  <span />
                </b>
              </h3>
            </div>
          </div>
          <div className="mt-10 w-full xl:mt-0 xl:w-1/4">
            <div
              className="px-about-2-subtitle-box text-end text-right px-fade-anim"
              data-delay=".4"
            >
              <Link
                className="relative mb-2 lg:mb-[90px] inline-grid h-[120px] w-[120px] place-items-center text-center font-thunder text-base leading-[1.15] text-white"
                href={aboutCtaHref}
              >
                <span className="text-xl relative z-10 text-white font-bold whitespace-pre-line">
                  {aboutCtaLabel}
                </span>
                <i className="zikzak-bg absolute inset-0 grid place-items-center">
                  <ZikzakBg />
                </i>
              </Link>
              <span className="text-effect mt-0 md:mt-6 block font-thunder text-[clamp(48px,8vw,160px)] font-bold uppercase leading-[0.9] text-px-black whitespace-nowrap lg:whitespace-pre-line">
                {fromLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
