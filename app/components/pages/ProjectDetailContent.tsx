"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import type { Project } from "../../data/projects";
import { useFadeAnim } from "../useFadeAnim";

/**
 * Project detail — Pixora language (Thunder, #e11010, #F7F7F7).
 * Images stay transform-free (no y/fade on media — prevents Lenis jitter).
 */
export default function ProjectDetailContent({
  project,
}: {
  project: Project;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  useFadeAnim(rootRef);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    const els = intro.querySelectorAll(".px-pd-intro-item");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.05,
        }
      );
    }, intro);
    return () => ctx.revert();
  }, [project.slug]);

  const gallery = project.gallery.length
    ? project.gallery
    : [project.image];

  const frameBase =
    "relative w-full overflow-hidden bg-[#f2f2f2] rounded-[20px] max-md:rounded-2xl [transform:translateZ(0)] [backface-visibility:hidden]";

  return (
    <div
      ref={rootRef}
      className="bg-white text-px-black"
    >
      <section className="pt-[140px] pb-8 md:pt-[180px] md:pb-12">
        <div className="w-full px-16" ref={introRef}>
          <div className="px-pd-intro-item flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-px-body transition hover:text-px-red"
            >
              <span aria-hidden>←</span> All projects
            </Link>
            <span className="text-px-body/40">/</span>
            <span className="text-sm font-medium uppercase tracking-wide text-px-black">
              {project.year}
            </span>
          </div>

          <h1 className="px-pd-intro-item mt-8 font-['Thunder',Impact,sans-serif] text-[clamp(56px,12vw,160px)] font-semibold uppercase leading-[0.85] tracking-[-0.03em] text-px-black md:mt-12">
            {project.title}
          </h1>

          <div className="px-pd-intro-item mt-6 flex flex-wrap items-center gap-2 md:mt-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[rgba(10,10,10,0.18)] px-[0.95rem] py-[0.45rem] text-[11px] font-semibold uppercase tracking-[0.1em] text-px-black transition-[border-color,color] duration-250 hover:border-px-red hover:text-px-red"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="w-full px-16">
          <div className={`${frameBase} aspect-[16/9] max-md:aspect-[4/3]`}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 py-10 md:py-12">
        <div className="w-full px-16">
          <div
            className="px-fade-anim grid grid-cols-2 gap-8 md:grid-cols-5 md:items-end"
            data-delay="0.05"
          >
            {(
              [
                ["Client", project.client],
                ["Expertise", project.expertise],
                ["Duration", project.duration],
                ["Designer", project.designer],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-px-body">
                  {label}
                </p>
                <p className="mt-2 text-base font-medium leading-snug md:text-lg">
                  {value}
                </p>
              </div>
            ))}
            <div className="col-span-2 md:col-span-1 md:flex md:justify-end">
              <a
                href={project.siteUrl}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-px-black px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-px-red"
              >
                Visit site
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="w-full px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="px-fade-anim lg:col-span-6" data-delay="0.05">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-px-red">
                About project
              </span>
              <h2 className="mt-5 font-['Thunder',Impact,sans-serif] text-[clamp(32px,4.2vw,52px)] font-medium leading-[1.05] tracking-[-0.02em]">
                {project.about}
              </h2>
            </div>
            <div className="px-fade-anim lg:col-span-5 lg:col-start-8" data-delay="0.12">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-px-body">
                Services
              </span>
              <ul className="mt-5">
                {project.services.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-3 border-b border-[rgba(10,10,10,0.1)] py-[0.9rem] text-[1.05rem] font-medium"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-px-red"
                      aria-hidden
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="w-full px-16">
          {gallery[0] && (
            <div className={`${frameBase} mb-5 aspect-[21/9] max-md:aspect-[16/10] md:mb-6`}>
              <Image
                src={gallery[0]}
                alt={`${project.title} detail 1`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}

          {gallery.length > 1 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
              {gallery.slice(1).map((src, i) => (
                <div
                  key={src}
                  className={`${frameBase} aspect-[4/3]`}
                >
                  <Image
                    src={src}
                    alt={`${project.title} detail ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F7F7F7] py-16 md:py-24">
        <div className="w-full px-16">
          <div className="px-fade-anim w-full text-center" data-delay="0.05">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-px-red">
              Results
            </span>
            <p className="mt-5 text-base leading-relaxed text-px-body md:text-lg">
              Our journey has been marked by projects that not only met but
              surpassed client goals — reinforcing trust through craft, clarity,
              and measurable impact.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:mt-16 md:grid-cols-4 md:gap-6">
            {project.metrics.map((m, i) => (
              <div
                key={`${m.label}-${m.value}`}
                className="px-fade-anim text-center"
                data-delay={String(0.1 + i * 0.06)}
              >
                <h3 className="font-['Thunder',Impact,sans-serif] text-[clamp(48px,7vw,88px)] font-semibold leading-none tracking-[-0.03em]">
                  {m.value}
                </h3>
                <p className="mt-3 text-sm text-px-body md:text-base">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <Link
          href={`/projects/${project.nextSlug}`}
          className="group grid grid-cols-1 no-underline md:grid-cols-12"
        >
          <div className="bg-px-black px-8 py-12 text-white md:col-span-4 md:px-12 md:py-16 lg:px-16">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
              Next project
            </span>
            <p className="mt-5 font-['Thunder',Impact,sans-serif] text-[clamp(28px,3.5vw,40px)] font-medium leading-[1.05] tracking-[-0.02em]">
              Keep exploring the work.
            </p>
            <span className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-lg transition group-hover:border-px-red group-hover:bg-px-red">
              →
            </span>
          </div>
          <div className="flex flex-col justify-center bg-[#F7F7F7] px-8 py-12 md:col-span-8 md:px-12 md:py-16 md:text-right lg:px-16">
            <h4 className="font-['Thunder',Impact,sans-serif] text-[clamp(40px,6vw,88px)] font-semibold uppercase leading-[0.9] tracking-[-0.03em] transition group-hover:text-px-red">
              {project.nextTitle}
            </h4>
            <p className="mt-4 text-sm text-px-body md:text-base">
              {project.nextMeta}
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
