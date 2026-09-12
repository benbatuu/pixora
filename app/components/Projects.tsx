"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFadeAnim } from "./useFadeAnim";
import type { Project } from "../data/projects";

type ProjectsProps = {
  projects: Project[];
  limit?: number;
};

export default function Projects({ projects, limit }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useFadeAnim(sectionRef);
  const items = typeof limit === "number" ? projects.slice(0, limit) : projects;

  return (
    <section id="projects" ref={sectionRef} className="px-portfolio-area py-6 md:py-10 px-4 ">
      <div className="w-full">
        <div className="px-portfolio-wrap">
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="relative mb-[30px] sticky top-20 max-lg:relative max-lg:top-auto px-fade-anim"
              data-delay={String(0.2 + i * 0.1)}
              style={{ zIndex: i + 1 }}
            >
              <Link href={`/projects/${p.slug}`} className="relative block after:pointer-events-none after:absolute after:inset-0 after:rounded-[24px] after:bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0.08)_45%,transparent)] after:content-['']">
                <div className="relative max-h-[85vh] min-h-[420px] overflow-hidden rounded-[24px] max-lg:min-h-[280px] max-lg:max-h-none [&_img]:h-full [&_img]:min-h-[420px] [&_img]:max-h-[85vh] [&_img]:w-full [&_img]:object-cover max-lg:[&_img]:min-h-[280px] max-lg:[&_img]:max-h-none">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={1820}
                    height={820}
                    className="img-fluid h-auto w-full object-cover"
                    sizes="100vw"
                  />
                </div>
                <div className="px-portfolio-category absolute left-6 top-6 z-10 flex flex-wrap gap-1 md:left-10 md:top-10">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white md:text-xs"
                      style={{ marginLeft: 4 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="px-portfolio-category portfolio-meta absolute right-6 top-6 z-10 md:right-10 md:top-10">
                  <span className="rounded-full border border-white/80 px-3 py-1 text-[10px] font-medium text-white md:text-xs">
                    {p.year}
                  </span>
                </div>
                <div className="px-portfolio-content absolute inset-x-0 bottom-8 z-10 text-center md:bottom-12">
                  <h2 className="px-portfolio-title font-thunder text-[clamp(48px,8vw,140px)] leading-none text-white">
                    {p.title}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
