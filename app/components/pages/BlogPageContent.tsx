"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { BLOG_FILTERS, type BlogPost } from "../../data/blog";
import { useFadeAnim } from "../useFadeAnim";
import type { BlogFilterKey, UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";

/**
 * Blog list — match https://pixora-nextjs-app.vercel.app/blog
 * Orange accents → #e11010. No header/footer (SiteChrome).
 */
export default function BlogPageContent({
  posts: allPosts,
  ui,
}: {
  posts: BlogPost[];
  ui?: UiMessages;
}) {
  const messages = ui ?? getUi("en");
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useFadeAnim(rootRef);

  const posts = useMemo(() => {
    return allPosts.filter((p) => {
      const matchFilter =
        filter === "All" ||
        p.category.toLowerCase() === filter.toLowerCase();
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [allPosts, filter, query]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }, grid);
    return () => ctx.revert();
  }, [filter, query]);

  const searchActive = searchOpen || !!query;

  return (
    <div
      ref={rootRef}
      className="bg-white text-px-black"
    >
      <section className="pt-[150px] pb-5 lg:pt-[200px]">
        <div className="w-full px-16">
          <div className="mb-5">
            <h1
              className="px-fade-anim m-0 font-['Thunder',Impact,sans-serif] text-[clamp(55px,14vw,200px)] font-bold uppercase leading-[0.8] tracking-[-0.02em] text-px-black"
              data-delay="0"
            >
              {messages.blogTitle}
            </h1>
          </div>
        </div>
      </section>

      <section className="pb-[90px]">
        <div className="w-full px-16">
          <div className="mb-[60px] border-y border-[rgba(30,30,30,0.08)] py-2.5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap">
                {BLOG_FILTERS.map((f) => {
                  const active = filter === f;
                  const label =
                    messages.blogFilters[f as BlogFilterKey] ?? f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`mb-1.5 mr-[5px] inline-flex cursor-pointer rounded-[6px] border-0 px-[22px] py-3 text-sm font-medium uppercase leading-none tracking-[-0.2px] transition-all duration-300 xl:px-[30px] xl:text-[15px] ${
                        active
                          ? "bg-[#e11010] text-white"
                          : "bg-[#f5f5f5] text-px-black hover:bg-[#e11010] hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex xl:justify-end">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="w-full xl:w-auto"
                >
                  <div
                    className={`relative inline-block before:absolute before:bottom-0 before:left-0 before:h-px before:bg-px-black before:transition-[width] before:duration-300 before:content-[''] ${
                      searchActive
                        ? "before:w-full before:delay-150"
                        : "before:w-0"
                    }`}
                  >
                    <input
                      type="text"
                      name="search"
                      placeholder={messages.searchPh}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                      onBlur={() => {
                        if (!query) setSearchOpen(false);
                      }}
                      aria-label={messages.searchAria}
                      className={`inline-block h-11 border-0 bg-transparent pl-[35px] text-sm font-normal tracking-[-0.02em] text-px-black outline-none transition-[width] duration-300 placeholder:text-black/60 ${
                        searchActive ? "w-[min(240px,70vw)]" : "w-[95px]"
                      }`}
                    />
                    <div
                      className="pointer-events-none absolute top-[48%] left-0 flex -translate-y-1/2 leading-none text-px-black"
                      aria-hidden
                    >
                      <span>
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.88888 18.7778C14.7981 18.7778 18.7778 14.7981 18.7778 9.88888C18.7778 4.97969 14.7981 1 9.88888 1C4.97969 1 1 4.97969 1 9.88888C1 14.7981 4.97969 18.7778 9.88888 18.7778Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 21L16.1666 16.1666"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div ref={gridRef} className="relative">
            <div className="grid grid-cols-1 gap-x-[30px] gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, i) => (
                <article
                  key={post.slug}
                  className="px-fade-anim mb-10"
                  data-delay={String(0.05 + (i % 3) * 0.06)}
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="ripple-image relative mb-5 aspect-[4/3] overflow-hidden rounded-[10px] bg-[#f2f2f2]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="rounded-[10px] object-cover"
                        sizes="(max-width:767px) 100vw, (max-width:1199px) 50vw, 33vw"
                        priority={i < 3}
                      />
                    </div>
                  </Link>
                  <div>
                    <span className="mb-0.5 inline-block text-[15px] font-semibold tracking-[-0.03em] text-px-black">
                      {messages.studioNews}
                    </span>
                    <h2 className="mb-1.5 mt-0 font-['Thunder',Impact,sans-serif] text-[clamp(28px,3vw,40px)] font-medium leading-[1.05] tracking-[-0.02em]">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-inherit no-underline transition-colors duration-250 hover:text-[#e11010]"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <span className="text-sm font-medium tracking-[-0.03em] text-[rgba(30,30,30,0.5)]">
                      {messages.publishedOn} {post.dateLabel}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {posts.length === 0 ? (
              <p className="py-16 text-center text-px-body">
                {messages.noPosts}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
