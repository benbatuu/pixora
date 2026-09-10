import type { Metadata } from "next";
import BlogPageContent from "../../components/pages/BlogPageContent";
import { listPosts } from "@/lib/content/blog";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { getUi } from "@/lib/i18n/ui";
import { getSiteSettings } from "@/lib/content/settings";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getRequestLocale(),
  ]);
  return buildPageMetadata(settings, "blog", { path: "/blog", locale });
}

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const posts = await listPosts({ publishedOnly: true, locale });
  return <BlogPageContent posts={posts} ui={getUi(locale)} />;
}
