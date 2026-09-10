import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailContent from "../../../components/pages/BlogDetailContent";
import { JsonLdNodes } from "../../../components/JsonLd";
import {
  getAllPublishedPostSlugs,
  getPublishedPostBySlug,
  listPosts,
} from "@/lib/content/blog";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { getUi } from "@/lib/i18n/ui";
import { getSiteSettings } from "@/lib/content/settings";
import { getBlogArticleCopy } from "@/app/data/blog-articles";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";

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
    ogType: "article",
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
  const settings = await getSiteSettings();
  const ui = getUi(locale);
  const homeLabel =
    locale === "tr" ? "Ana sayfa" : locale === "ru" ? "Главная" : "Home";
  const blogLabel = locale === "ru" ? "Блог" : "Blog";
  const articleCopy = getBlogArticleCopy(post.slug, locale);
  const jsonLd = [
    ...buildArticleJsonLd(settings, {
      title: post.seoTitle?.trim() || post.title,
      description: post.seoDescription?.trim() || post.excerpt,
      path: `/blog/${post.slug}`,
      image: post.image || undefined,
      datePublished: post.date || undefined,
      authorName: post.author,
      locale,
      keywords: post.tags,
      faqs: articleCopy?.faqs,
    }),
    ...buildBreadcrumbJsonLd(
      settings,
      [
        { name: homeLabel, path: "/" },
        { name: blogLabel, path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ],
      locale,
    ),
  ];
  return (
    <>
      <JsonLdNodes nodes={jsonLd} />
      <BlogDetailContent post={post} related={related} latest={latest} ui={ui} />
    </>
  );
}
