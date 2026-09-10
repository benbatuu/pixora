"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

/**
 * Safe Markdown renderer for post bodies.
 * Does not enable raw HTML (no rehype-raw) — scripts/HTML tags stay inert text.
 */
const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-10 font-thunder text-[clamp(28px,3vw,40px)] leading-none first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-10 font-thunder text-[clamp(26px,2.8vw,36px)] leading-none first:mt-0">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-8 font-thunder text-[clamp(22px,2.4vw,30px)] leading-none first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-base leading-relaxed text-[var(--px-body)] md:text-lg first:mt-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-[var(--px-body)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-base text-[var(--px-body)]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-[var(--px-red)] underline-offset-2 hover:underline"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-8 rounded-2xl border border-black/10 bg-[#fafafa] p-6 md:p-8">
      <div className="font-thunder text-[clamp(22px,2.5vw,32px)] leading-[1.15] tracking-[-0.02em]">
        {children}
      </div>
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-2xl bg-[#eef3f8] p-5 text-sm leading-relaxed text-[var(--px-black)]">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-[#eef3f8] px-1.5 py-0.5 text-[0.9em] text-[var(--px-red)]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mt-6 overflow-x-auto">{children}</pre>,
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--px-black)]">{children}</strong>
  ),
  hr: () => <hr className="my-10 border-black/10" />,
  img: ({ src, alt }) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        className="mt-6 w-full rounded-2xl object-cover"
      />
    ) : null,
};

export default function BlogMarkdown({ source }: { source: string }) {
  const md = source?.trim() ?? "";
  if (!md) return null;
  return (
    <div className="blog-md">
      <ReactMarkdown components={components}>{md}</ReactMarkdown>
    </div>
  );
}
