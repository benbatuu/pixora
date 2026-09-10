
import { prisma } from "@/lib/db/prisma";
import {
  BLOG_POSTS as STUB_POSTS,
  type BlogPost,
} from "@/app/data/blog";
import { pickTranslation } from "@/lib/i18n/pick-translation";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

type DbPost = Awaited<ReturnType<typeof prisma.post.findMany>>[number] & {
  translations: {
    title: string;
    excerpt: string;
    body: string;
    seoTitle: string | null;
    seoDescription: string | null;
    locale: { code: string };
  }[];
};

function formatDateLabel(d: Date | null | undefined, locale = DEFAULT_LOCALE) {
  if (!d) return "";
  const loc =
    locale === "tr" ? "tr-TR" : locale === "ru" ? "ru-RU" : "en-US";
  return d.toLocaleDateString(loc, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function mapPost(p: DbPost, locale = DEFAULT_LOCALE, defaultLocale = DEFAULT_LOCALE): BlogPost {
  const tr = pickTranslation(p.translations, locale, defaultLocale);
  const publishedAt = p.publishedAt;
  const tags = p.category
    ? p.category.split(/[,|/]/).map((t) => t.trim()).filter(Boolean)
    : [];
  return {
    slug: p.slug,
    title: tr?.title ?? p.slug,
    date: publishedAt ? publishedAt.toISOString().slice(0, 10) : "",
    dateLabel: formatDateLabel(publishedAt, locale),
    category: p.category ?? "",
    image: p.coverUrl ?? "",
    author: p.authorName ?? "",
    authorRole: p.authorRole ?? undefined,
    readTime: p.readTime ?? "",
    comments: p.comments,
    excerpt: tr?.excerpt ?? "",
    body: tr?.body ?? "",
    tags,
    seoTitle: tr?.seoTitle ?? undefined,
    seoDescription: tr?.seoDescription ?? undefined,
  };
}

const include = {
  translations: { include: { locale: true } },
} as const;

export async function listPosts(opts?: {
  publishedOnly?: boolean;
  locale?: string;
}): Promise<BlogPost[]> {
  const locale = opts?.locale ?? DEFAULT_LOCALE;
  try {
    const rows = await prisma.post.findMany({
      where: opts?.publishedOnly ? { status: "PUBLISHED" } : undefined,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include,
    });
    if (rows.length === 0) return STUB_POSTS;
    return rows.map((r) => mapPost(r as DbPost, locale, DEFAULT_LOCALE));
  } catch (e) {
    console.error("[content.listPosts]", e);
    return STUB_POSTS;
  }
}

export async function getPublishedPostBySlug(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<BlogPost | null> {
  try {
    const row = await prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      include,
    });
    if (!row) return STUB_POSTS.find((p) => p.slug === slug) ?? null;
    return mapPost(row as DbPost, locale, DEFAULT_LOCALE);
  } catch (e) {
    console.error("[content.getPublishedPostBySlug]", e);
    return STUB_POSTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllPublishedPostSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length === 0) return STUB_POSTS.map((p) => p.slug);
    return rows.map((r) => r.slug);
  } catch {
    return STUB_POSTS.map((p) => p.slug);
  }
}
