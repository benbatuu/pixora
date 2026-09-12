"use client";

import { useRef } from "react";
import Image from "next/image";
import { useFadeAnim } from "./useFadeAnim";

import {
  HOME_DEFAULTS,
  type HomeAwardItem,
} from "@/app/data/home";

export type AwardsProps = {
  items?: HomeAwardItem[];
  subtitle?: string;
  title?: string;
  subtitle2?: string;
  awardCol?: string;
  nominationCol?: string;
  yearCol?: string;
};

export default function Awards({
  items = HOME_DEFAULTS.awards.items,
  subtitle = HOME_DEFAULTS.awards.header.subtitle,
  title = HOME_DEFAULTS.awards.header.title,
  subtitle2 = HOME_DEFAULTS.awards.header.subtitle2,
  awardCol = "Award",
  nominationCol = "Nomination",
  yearCol = "Year",
}: AwardsProps = {}) {
  const AWARDS = items;
  const sectionRef = useRef<HTMLElement>(null);
  useFadeAnim(sectionRef);

  return (
    <section
      id="awards"
      ref={sectionRef}
      className="px-award-2-area px-award-style-2 py-6 md:py-10 px-4 "
    >
      <div className="w-full">
        <div className="px-award-title-wrap mb-[35px] px-fade-anim" data-delay=".2">
          <div className="flex flex-wrap items-end gap-y-6">
            <div className="w-full xl:w-1/4">
              <div className="px-award-subtitle-box">
                <span className="px-section-subtitle inline-flex items-center gap-2 pb-0 text-sm font-medium text-[var(--px-black)] xl:pb-[120px]">
                  <i aria-hidden>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 1V9M1 5H9"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </i>
                  {subtitle}
                </span>
              </div>
            </div>
            <div className="w-full xl:w-3/4">
              <div className="px-award-content">
                <h3 className="px-section-title ff-thunder mb-0 font-thunder text-[clamp(72px,12vw,280px)] leading-[0.85] text-[var(--px-red)]">
                  {title}
                </h3>
                <span className="font-thunder block text-[clamp(40px,7vw,140px)] leading-[0.9] text-[var(--px-black)]">
                  {subtitle2}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-award-wrapper">
          <div className="xl:ml-[25%] xl:w-3/4">
            <div className="px-award-item hidden border-b border-black/10 py-5 md:block">
              <div className="grid grid-cols-12 gap-4 text-sm uppercase tracking-wider text-[var(--px-body)]">
                <div className="col-span-3" />
                <div className="col-span-4">
                  <label>{awardCol}</label>
                </div>
                <div className="col-span-4">
                  <label>{nominationCol}</label>
                </div>
                <div className="col-span-1 text-right">
                  <label>{yearCol}</label>
                </div>
              </div>
            </div>

            {AWARDS.map((a, i) => (
              <div
                key={a.index}
                className="px-award-item border-b border-black/10 py-6 md:py-8 px-fade-anim"
                data-delay={String(0.2 + i * 0.2)}
              >
                <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12 md:gap-4">
                  <div className="md:col-span-3">
                    <div className="px-award-num">
                      <span className="text-base text-[var(--px-body)]">
                        ({a.index})
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="px-award-category flex items-center gap-3">
                      <Image
                        src={a.icon}
                        alt={a.name}
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                      <span className="text-lg font-medium text-[var(--px-black)] md:text-xl">
                        {a.name}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="px-award-nomination">
                      <span className="text-base text-[var(--px-body)] md:text-lg">
                        {a.org}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="px-award-year text-left md:text-right">
                      <span className="text-lg font-semibold text-[var(--px-black)]">
                        {a.year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
