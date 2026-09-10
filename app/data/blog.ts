/**
 * Blog post stubs
 *
 * Seed + content-layer fallback only (seed + content fallback).
 * Admin dashboard / live lists must use Prisma / API — do not import
 * these arrays for primary admin counts or inbox.
 */

import { BLOG_ARTICLES, getBlogArticleCopy } from "./blog-articles";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  image: string;
  author: string;
  authorRole?: string;
  /** Optional author bio shown on detail */
  authorBio?: string;
  /** Optional author avatar URL */
  authorImage?: string;
  readTime: string;
  comments: number;
  excerpt: string;
  /** Markdown body from CMS */
  body?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  /** Optional quote block (from seed / future JSON extras) */
  quote?: { text: string; cite: string };
  /** Optional sidebar promo */
  sidebarPromo?: { title: string; subtitle?: string; ctaLabel?: string; ctaHref?: string };
};

export const BLOG_FILTERS = [
  "All",
  "Design",
  "Motion design",
  "Branding",
  "AI Tools",
  "UX",
  "Web experience",
  "3d modeling",
] as const;

type BlogMeta = {
  slug: string;
  date: string;
  dateLabel: string;
  category: string;
  image: string;
  author: string;
  authorRole?: string;
  readTime: string;
  comments: number;
  tags: string[];
};

const BLOG_META: BlogMeta[] = [
  {
    slug: "brand-systems-that-scale",
    date: "2026-03-03",
    dateLabel: "March 03, 2026",
    category: "Branding",
    image: "/assets/img/project/project-3.jpg",
    author: "Pixora Studio",
    authorRole: "Creative team",
    readTime: "7 min read",
    comments: 0,
    tags: ["Branding", "Design systems", "Identity"],
  },
  {
    slug: "motion-graphics-that-clarify",
    date: "2026-03-12",
    dateLabel: "March 12, 2026",
    category: "Motion design",
    image: "/assets/img/project/project-1.jpg",
    author: "Pixora Studio",
    authorRole: "Creative team",
    readTime: "6 min read",
    comments: 0,
    tags: ["Motion design", "Product storytelling", "Animation"],
  },
  {
    slug: "ux-writing-meets-visual-design",
    date: "2026-03-20",
    dateLabel: "March 20, 2026",
    category: "UX",
    image: "/assets/img/project/project-5.jpg",
    author: "Pixora Studio",
    authorRole: "Creative team",
    readTime: "6 min read",
    comments: 0,
    tags: ["UX", "UX writing", "UI design"],
  },
  {
    slug: "design-studio-website-that-converts",
    date: "2026-04-02",
    dateLabel: "April 02, 2026",
    category: "Web experience",
    image: "/assets/img/project/project-2.jpg",
    author: "Pixora Studio",
    authorRole: "Creative team",
    readTime: "8 min read",
    comments: 0,
    tags: ["Web experience", "Conversion", "Studio sites"],
  },
  {
    slug: "ai-tools-in-creative-workflows",
    date: "2026-04-14",
    dateLabel: "April 14, 2026",
    category: "AI Tools",
    image: "/assets/img/project/project-4.jpg",
    author: "Pixora Studio",
    authorRole: "Creative team",
    readTime: "7 min read",
    comments: 0,
    tags: ["AI Tools", "Creative process", "Craft"],
  },
  {
    slug: "from-identity-to-launch",
    date: "2026-04-28",
    dateLabel: "April 28, 2026",
    category: "Design",
    image: "/assets/img/project/project-6.jpg",
    author: "Pixora Studio",
    authorRole: "Creative team",
    readTime: "8 min read",
    comments: 0,
    tags: ["Design", "Branding", "Process"],
  },
];

function postFromMeta(meta: BlogMeta, locale = "en"): BlogPost {
  const copy = getBlogArticleCopy(meta.slug, locale) ?? BLOG_ARTICLES[meta.slug]?.en;
  return {
    slug: meta.slug,
    date: meta.date,
    dateLabel: meta.dateLabel,
    category: meta.category,
    image: meta.image,
    author: meta.author,
    authorRole: meta.authorRole,
    readTime: meta.readTime,
    comments: meta.comments,
    tags: meta.tags,
    title: copy?.title ?? meta.slug,
    excerpt: copy?.excerpt ?? "",
    body: copy?.body,
    seoTitle: copy?.seoTitle,
    seoDescription: copy?.seoDescription,
  };
}

/** English stubs (seed + unlocalized fallback). */
export const BLOG_POSTS: BlogPost[] = BLOG_META.map((meta) => postFromMeta(meta, "en"));

export function getPost(slug: string, locale = "en") {
  const meta = BLOG_META.find((p) => p.slug === slug);
  return meta ? postFromMeta(meta, locale) : undefined;
}

export function getAllPostSlugs() {
  return BLOG_META.map((p) => p.slug);
}

export function listStubPosts(locale = "en"): BlogPost[] {
  return BLOG_META.map((meta) => postFromMeta(meta, locale));
}
