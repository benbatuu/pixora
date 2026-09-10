"use client";

import { useRef, useState } from "react";
import { useFadeAnim } from "./useFadeAnim";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import {
  HOME_DEFAULTS,
  type HomeServiceItem,
} from "@/app/data/home";

export type ServicesProps = {
  items?: HomeServiceItem[];
  subtitle?: string;
  heading?: string;
};

export default function Services({
  items = HOME_DEFAULTS.services.items,
  subtitle = HOME_DEFAULTS.services.header.subtitle,
  heading = HOME_DEFAULTS.services.header.heading,
}: ServicesProps = {}) {
  const SERVICES = items;
  const [active, setActive] = useState(0);
  const current = SERVICES[active] ?? SERVICES[0];
  const sectionRef = useRef<HTMLElement>(null);
  useFadeAnim(sectionRef);

  return (
    <section id="services" ref={sectionRef} className="px-service-2-area pb-[75px]">
      <div className="w-full px-16">
        <div className="px-service-2-top mb-[50px] px-fade-anim" data-delay=".2">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="px-service-2-subtitle-box">
              <span className="px-section-subtitle text-sm text-[var(--px-body)]">
                {subtitle}
              </span>
            </div>
            <div className="px-service-2-wrap text-end text-right">
              <label className="font-thunder text-[clamp(28px,3vw,48px)] uppercase leading-none text-[var(--px-black)]">
                {heading}
              </label>
            </div>
          </div>
        </div>

        <div className="px-service-2-main relative px-fade-anim" data-delay=".35">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  className="px-service-2-info"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src={current.image}
                      alt={current.title}
                      width={350}
                      height={263}
                      className="img-fluid h-auto w-full object-cover"
                    />
                  </div>
                  <div className="px-service-2-content mt-5">
                    <span className="block text-sm uppercase tracking-wide text-[var(--px-body)]">
                      {current.title}
                    </span>
                    <p className="mt-2 text-base leading-relaxed text-[var(--px-black)] md:text-lg">
                      {current.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-8 xl:col-span-6 xl:col-start-7">
              <div className="px-service-2-wrap">
                {SERVICES.map((s, i) => (
                  <div
                    key={s.id}
                    className={`px-service-2-element border-b border-black/10 ${
                      active === i ? "active" : ""
                    }`}
                    onMouseEnter={() => setActive(i)}
                  >
                    <div className="px-service-2-item">
                      <h4 className="px-service-2-title relative flex w-full items-baseline justify-between gap-4 py-5 md:py-7">
                        <button
                          type="button"
                          className={`services-list-title text-left font-thunder text-[clamp(28px,3.5vw,48px)] font-semibold uppercase leading-[0.95] tracking-[-0.02em] transition-colors ${
                            active === i
                              ? "text-[var(--px-red)]"
                              : "text-[var(--px-black)]"
                          }`}
                          onClick={() => setActive(i)}
                        >
                          {s.title}
                        </button>
                        <span className="shrink-0 text-sm text-[var(--px-body)]">
                          {s.id}
                        </span>
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
