import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailContent from "../../../components/pages/BlogDetailContent";
import {
  getAllPublishedPostSlugs,
  getPublishedPostBySlug,
  listPosts,
} from "@/lib/content/blog";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { getUi } from "@/lib/i18n/ui";
import { getSiteSettings } from "@/lib/content/settings";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [settings, post] = await Promise.all([
    getSiteSettings(),
    getPublishedPostBySlug(slug, locale),
  ]);
  if (!post) {
    return buildPageMetadata(settings, "blog", { path: "/blog", locale });
  }
  return buildPageMetadata(settings, "blog", {
    path: `/blog/${slug}`,
    title: post.seoTitle?.trim() || post.title,
    description: post.seoDescription?.trim() || post.excerpt,
    ogImageUrl: post.image || undefined,
    locale,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const post = await getPublishedPostBySlug(slug, locale);
  if (!post) notFound();
  const all = await listPosts({ publishedOnly: true, locale });
  const others = all.filter((p) => p.slug !== post.slug);
  const related = others.slice(0, 3);
  const latest = others.slice(0, 3);
  return <BlogDetailContent post={post} related={related} latest={latest} ui={getUi(locale)} />;
}
