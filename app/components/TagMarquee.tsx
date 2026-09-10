"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import { HOME_DEFAULTS } from "@/app/data/home";

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M7 0L8.89064 5.10936L14 7L8.89064 8.89064L7 14L5.10936 8.89064L0 7L5.10936 5.10936L7 0Z"
        fill="#FEFFF8"
      />
    </svg>
  );
}

export type TagMarqueeProps = {
  tags?: string[];
};

export default function TagMarquee({
  tags = HOME_DEFAULTS.marquee.tags,
}: TagMarqueeProps = {}) {
  const slides = [...tags, ...tags, ...tags];

  return (
    <div
      className="px-text-slider-wrap overflow-hidden pt-[25px] pb-[25px]"
      style={{ backgroundColor: "#f11111" }}
    >
      <div className="px-text-slider-active tp-slider-transtion">
        <Swiper
          modules={[Autoplay, FreeMode]}
          loop
          slidesPerView="auto"
          spaceBetween={40}
          speed={12000}
          allowTouchMove={false}
          freeMode={{ enabled: true, momentum: false }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          className="!overflow-visible"
        >
          {slides.map((tag, i) => (
            <SwiperSlide key={`${tag}-${i}`} className="!w-auto">
              <div className="flex items-center gap-10 whitespace-nowrap font-thunder text-[clamp(28px,4vw,56px)] font-bold uppercase leading-none tracking-[-0.02em] text-[#FEFFF8]">
                <span>{tag}</span>
                <span className="pl-0">
                  <StarIcon />
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
