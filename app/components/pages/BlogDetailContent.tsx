"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../../data/blog";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";
import BlogMarkdown from "@/app/components/blog/BlogMarkdown";

const DEMO_COMMENTS = [
  {
    name: "Farhan Firoz",
    date: "January 2, 2026",
    img: "/assets/img/blog/blog-details/user-1.jpg",
    body: "I love this theme. Sometimes it's difficult to work with some themes, because even if they are created with Elementor, you can't edit all the things with Elementor.",
  },
  {
    name: "Oliver Williams",
    date: "January 4, 2026",
    img: "/assets/img/blog/blog-details/user-2.jpg",
    body: "They have really taken their time to work appearance of the theme, also, they have a very interactive client assistance service, I like() !",
  },
  {
    name: "James Taylor",
    date: "January 6, 2026",
    img: "/assets/img/blog/blog-details/user-3.jpg",
    body: "They have really taken their time to work appearance of the theme, also, they have a very interactive client assistance service, I like() !",
  },
];

export default function BlogDetailContent({
  post,
  related = [],
  latest = [],
  ui,
  showDemoComments = false,
}: {
  post: BlogPost;
  related?: BlogPost[];
  latest?: BlogPost[];
  ui?: UiMessages;
  /** Demo/fake comments — off by default until a real comments model exists */
  showDemoComments?: boolean;
}) {
  const messages = ui ?? getUi("en");
  const cover = post.image || "/assets/img/blog/blog-details/blog-details-banner.jpg";
  const authorName = post.author || "Pixora";
  const authorRole = post.authorRole || "";
  const authorImage = post.authorImage || "/assets/img/avater/avater-2.png";
  const tags =
    post.tags && post.tags.length > 0
      ? post.tags
      : post.category
        ? [post.category]
        : [];
  const body = (post.body ?? "").trim();
  const promo = post.sidebarPromo;
  const quote = post.quote;

  return (
    <div className="bg-white text-[var(--px-black)]">
      <section className="pt-[140px] pb-8 md:pt-[160px]">
        <div className="w-full px-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f2f2f2] md:aspect-[2/1]">
            <Image
              src={cover}
              alt={post.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="w-full px-16">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--px-body)] md:gap-6">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={authorImage}
                  alt={authorName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <span className="font-medium text-[var(--px-black)]">{authorName}</span>
            </div>
            <span>{post.dateLabel}</span>
            {post.comments > 0 ? (
              <span>
                {post.comments} {messages.commentsLabel}
              </span>
            ) : null}
            {post.readTime ? <span>{post.readTime}</span> : null}
          </div>
          <h1 className="mt-8 text-center font-thunder text-[clamp(40px,7vw,96px)] leading-[0.95] tracking-[-0.03em]">
            {post.title}
          </h1>
        </div>
      </section>

      <section className="pb-[100px] pt-8">
        <div className="w-full px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <article className="lg:col-span-8">
              {body ? (
                <BlogMarkdown source={body} />
              ) : (
                <p className="text-base leading-relaxed text-[var(--px-body)] md:text-lg">
                  {post.excerpt}
                </p>
              )}

              {quote?.text ? (
                <blockquote className="mt-10 rounded-2xl border border-black/10 bg-[#fafafa] p-6 md:p-8">
                  <p className="font-thunder text-[clamp(24px,3vw,36px)] leading-[1.15] tracking-[-0.02em]">
                    “{quote.text}”
                  </p>
                  {quote.cite ? (
                    <cite className="mt-4 block text-sm not-italic text-[var(--px-body)]">
                      {quote.cite}
                    </cite>
                  ) : null}
                </blockquote>
              ) : null}

              {tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-[var(--px-body)]">{messages.taggedWith}</span>
                  {tags.map((t) => (
                    <Link
                      key={t}
                      href="/blog"
                      className="font-medium hover:text-[var(--px-red)]"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              ) : null}

              {authorName ? (
                <div className="mt-12 border-t border-black/10 pt-10">
                  <h4 className="font-thunder text-[clamp(28px,3vw,36px)] leading-none">
                    {messages.aboutAuthor}
                  </h4>
                  <div className="mt-6 flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={authorImage}
                        alt={authorName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{authorName}</h4>
                      {authorRole ? (
                        <p className="mt-1 text-sm text-[var(--px-body)]">{authorRole}</p>
                      ) : null}
                      {post.authorBio ? (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--px-body)]">
                          {post.authorBio}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {showDemoComments ? (
                <>
                  <div className="mt-12 border-t border-black/10 pt-10">
                    <h3 className="font-thunder text-[clamp(28px,3vw,40px)] leading-none">
                      {messages.commentsLabel} ({String(DEMO_COMMENTS.length).padStart(2, "0")})
                    </h3>
                    <p className="mt-2 text-xs text-[var(--px-body)]">Demo</p>
                    <div className="mt-8 space-y-8">
                      {DEMO_COMMENTS.map((c) => (
                        <div key={c.name} className="flex gap-4">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={c.img}
                              alt={c.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">By {c.name}</p>
                            <p className="text-xs text-[var(--px-body)]">{c.date}</p>
                            <p className="mt-2 text-sm leading-relaxed text-[var(--px-body)] md:text-base">
                              {c.body}
                            </p>
                            <button
                              type="button"
                              className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--px-black)]"
                            >
                              {messages.replyLabel}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12 border-t border-black/10 pt-10">
                    <h3 className="font-thunder text-[clamp(28px,3vw,40px)] leading-none">
                      {messages.leaveReply}
                    </h3>
                    <form
                      className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input
                        name="name"
                        placeholder={messages.commentNamePh}
                        className="min-h-[48px] rounded-xl border border-black/10 px-4 outline-none focus:border-[var(--px-red)]"
                      />
                      <input
                        name="email"
                        type="email"
                        placeholder={messages.commentEmailPh}
                        className="min-h-[48px] rounded-xl border border-black/10 px-4 outline-none focus:border-[var(--px-red)]"
                      />
                      <textarea
                        name="comment"
                        rows={5}
                        placeholder={messages.commentPh}
                        className="md:col-span-2 rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[var(--px-red)]"
                      />
                      <button
                        type="submit"
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--px-red)] px-8 text-sm font-semibold uppercase tracking-wide text-white md:col-span-2 md:w-fit"
                      >
                        {messages.postComment}
                      </button>
                    </form>
                  </div>
                </>
              ) : null}
            </article>

            <aside className="lg:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-28">
                <label className="relative block">
                  <span className="sr-only">{messages.search}</span>
                  <input
                    type="search"
                    placeholder={messages.searchPh}
                    className="min-h-[48px] w-full rounded-full border border-black/10 px-4 pr-12 text-sm outline-none focus:border-[var(--px-red)]"
                  />
                  <span
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[var(--px-red)] text-white"
                    aria-hidden
                  >
                    ⌕
                  </span>
                </label>

                <div className="rounded-2xl border border-black/10 p-6 text-center">
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      src={authorImage}
                      alt={authorName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <h3 className="mt-4 font-thunder text-[clamp(28px,3vw,36px)] leading-none">
                    {promo?.title || authorName}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--px-body)]">
                    {promo?.subtitle || authorRole || messages.studio}
                  </p>
                </div>

                <Link
                  href={promo?.ctaHref || "/contact"}
                  className="flex min-h-[52px] items-center justify-center rounded-full bg-[var(--px-red)] px-6 text-sm font-semibold uppercase tracking-wide text-white"
                >
                  {promo?.ctaLabel || "Pixora"}
                </Link>

                {post.category ? (
                  <div>
                    <h3 className="font-thunder text-[clamp(28px,3vw,36px)] leading-none">
                      {messages.category}
                    </h3>
                    <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
                      <li className="flex items-center justify-between py-3 text-sm md:text-base">
                        <span>{post.category}</span>
                      </li>
                    </ul>
                  </div>
                ) : null}

                <div>
                  <h3 className="font-thunder text-[clamp(28px,3vw,36px)] leading-none">
                    {messages.latestPosts}
                  </h3>
                  <div className="mt-5 space-y-4">
                    {latest.map((p) => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} className="flex gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2]">
                          <Image
                            src={p.image || cover}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-snug">{p.title}</p>
                          <p className="mt-1 text-xs text-[var(--px-body)]">{p.dateLabel}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 ? (
            <div className="mt-16 border-t border-black/10 pt-12">
              <h3 className="mb-8 font-thunder text-[clamp(32px,4vw,48px)] leading-none">
                {messages.relatedPosts}
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {related.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f2f2f2]">
                      <Image
                        src={p.image || cover}
                        alt={p.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        sizes="33vw"
                      />
                    </div>
                    <h4 className="mt-4 font-thunder text-[clamp(24px,3vw,32px)] leading-none group-hover:text-[var(--px-red)]">
                      {p.title}
                    </h4>
                    <p className="mt-2 text-sm text-[var(--px-body)]">{p.dateLabel}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
