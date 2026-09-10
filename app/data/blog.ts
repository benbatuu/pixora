/**
 * Blog post stubs
 *
 * Seed + content-layer fallback only (seed + content fallback).
 * Admin dashboard / live lists must use Prisma / API — do not import
 * these arrays for primary admin counts or inbox.
 */

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

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "keep-goals-in-sight",
    title: "Keep Goals in Sight",
    date: "2026-02-12",
    dateLabel: "February 12, 2026",
    category: "Design",
    image: "/assets/img/project/project-2.jpg",
    author: "James Carter",
    authorRole: "Content writer",
    readTime: "4 min read",
    comments: 12,
    excerpt:
      "We love to bring designs to life as a developer, and I aim to do this using whatever front end tools are necessary.",
  },
  {
    slug: "always-remember-your-goals",
    title: "Always Remember Your Goals!",
    date: "2026-02-18",
    dateLabel: "February 18, 2026",
    category: "Motion design",
    image: "/assets/img/project/project-1.jpg",
    author: "James Carter",
    readTime: "5 min read",
    comments: 8,
    excerpt: "Vision and persistence keep creative teams aligned through every sprint.",
  },
  {
    slug: "never-lose-purpose",
    title: "Never Lose Purpose",
    date: "2026-03-01",
    dateLabel: "March 01, 2026",
    category: "Branding",
    image: "/assets/img/project/project-3.jpg",
    author: "James Carter",
    readTime: "4 min read",
    comments: 6,
    excerpt: "Purpose-led design creates brands that feel intentional and memorable.",
  },
  {
    slug: "vision-drives-action",
    title: "Vision Drives Action",
    date: "2026-03-05",
    dateLabel: "March 05, 2026",
    category: "AI Tools",
    image: "/assets/img/project/project-4.jpg",
    author: "James Carter",
    readTime: "6 min read",
    comments: 4,
    excerpt: "Clear vision turns ambitious ideas into shippable digital products.",
  },
  {
    slug: "fueling-ambition",
    title: "Fueling Ambition & Achieving Your Goals",
    date: "2026-03-10",
    dateLabel: "March 10, 2026",
    category: "UX",
    image: "/assets/img/project/project-5.jpg",
    author: "James Carter",
    readTime: "5 min read",
    comments: 9,
    excerpt: "Ambition needs systems — UX patterns that keep users moving forward.",
  },
  {
    slug: "creative-process-notes",
    title: "Behind the Scenes of Creative Processes",
    date: "2026-03-14",
    dateLabel: "March 14, 2026",
    category: "Web experience",
    image: "/assets/img/project/project-6.jpg",
    author: "James Carter",
    readTime: "4 min read",
    comments: 3,
    excerpt: "A look inside how Pixora shapes concepts into polished experiences.",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs() {
  return BLOG_POSTS.map((p) => p.slug);
}
