"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFadeAnim } from "../useFadeAnim";
import type { Project } from "../../data/projects";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";

/**
 * portfolio-6 reference: centered Thunder hero, meta row, sticky project panels.
 * Orange accents → #e11010. No header/footer (SiteChrome).
 */
export default function ProjectsPageContent({
  projects,
  ui,
}: {
  projects: Project[];
  ui?: UiMessages;
}) {
  const messages = ui ?? getUi("en");
  const listRef = useRef<HTMLElement>(null);
  useFadeAnim(listRef);

  return (
    <div className="bg-white text-px-black">
      <section className="pt-25 pb-10 md:pt-40 md:pb-20 lg:pt-25 lg:pb-10">
        <div className="w-full">
          <div className="text-center">
            <h1 className="m-0 font-['Thunder',Impact,sans-serif] font-bold uppercase leading-tight  text-px-black">
              <span className="text-[#e11010] text-[clamp(24px,8vw,140px)]">{messages.projectsEyebrow}</span>{" "}<br/>
              <span className="text-[clamp(36px,8vw,140px)]">
                {messages.projectsTitleRest}
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section ref={listRef} className="">
        <div className="w-full px-4">
          <div>
            <div className="mb-8 flex flex-col justify-between gap-4 pb-6 md:mb-10 md:flex-row md:items-center md:pb-10">
              <div>
                <span className="inline-block whitespace-pre-line text-lg font-medium leading-[1.45] text-px-black">
                  {messages.projectsMetaLeft}
                </span>
              </div>
              <div className="text-left md:text-right">
                <span className="inline-block whitespace-pre-line text-lg font-medium leading-[1.45] text-px-black">
                  {messages.projectsMetaRight}
                </span>
              </div>
            </div>

            {projects.map((p, i) => (
              <article
                key={p.slug}
                className="px-portfolio-panel px-fade-anim relative mb-[30px] sticky top-20 max-lg:relative max-lg:top-auto"
                data-delay={String(0.15 + i * 0.08)}
                style={{ zIndex: i + 1 }}
              >
                <Link href={`/projects/${p.slug}`} className="relative block after:pointer-events-none after:absolute after:inset-0 after:rounded-[20px] after:bg-[linear-gradient(to_top,rgba(20,20,20,0.4)_0%,rgba(20,20,20,0)_55%)] after:content-['']">
                  <div className="ripple-image relative max-h-[85vh] min-h-[420px] overflow-hidden rounded-[20px] max-lg:min-h-[280px] max-lg:max-h-none">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={1820}
                      height={820}
                      className="h-full min-h-[420px] max-h-[85vh] w-full object-cover max-lg:min-h-[280px] max-lg:max-h-none"
                      sizes="100vw"
                      priority={i === 0}
                    />
                  </div>
                  <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1 md:left-[50px] md:top-[45px]">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="ml-1 inline-block rounded-full border border-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white md:text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute right-4 top-4 z-10 md:right-[50px] md:top-[45px]">
                    <span className="inline-block rounded-full border border-white/80 px-3 py-1 text-[10px] font-medium text-white md:text-xs">
                      {p.year}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-6 z-10 text-center md:bottom-[50px]">
                    <h2 className="font-['Thunder',Impact,sans-serif] text-[clamp(48px,10vw,180px)] font-semibold leading-none text-white">
                      {p.title}
                    </h2>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
