"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOME_DEFAULTS } from "@/app/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * Simple flow banner from 04-banner.html.
 * Light parallax only: data-speed 0.1 → scrub yPercent. No pin, no sticky-behind.
 */

export type BannerProps = {
  src?: string;
  alt?: string;
};

export default function Banner({
  src = HOME_DEFAULTS.banner.src,
  alt = HOME_DEFAULTS.banner.alt,
}: BannerProps = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
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
    <div ref={wrapRef} className="px-banner-wraper fix overflow-hidden pb-[70px] w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        data-speed="0.1"
        className="w-100 banner-img w-full h-auto block"
        src={src}
        alt={alt}
        width={1905}
        height={1078}
      />
    </div>
  );
}
