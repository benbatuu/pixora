import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailContent from "../../../components/pages/ProjectDetailContent";
import {
  getAllPublishedProjectSlugs,
  getPublishedProjectBySlug,
} from "@/lib/content/projects";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { getSiteSettings } from "@/lib/content/settings";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [settings, project] = await Promise.all([
    getSiteSettings(),
    getPublishedProjectBySlug(slug, locale),
  ]);
  if (!project) {
    return buildPageMetadata(settings, "projects", { path: "/projects", locale });
  }
  return buildPageMetadata(settings, "projects", {
    path: `/projects/${slug}`,
    title: project.title,
    description: project.about,
    ogImageUrl: project.image || undefined,
    locale,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const project = await getPublishedProjectBySlug(slug, locale);
  if (!project) notFound();
  return <ProjectDetailContent project={project} />;
}
