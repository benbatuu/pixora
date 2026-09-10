import type { Metadata } from "next";
import ProjectsPageContent from "../../components/pages/ProjectsPageContent";
import { listProjects } from "@/lib/content/projects";
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
  return buildPageMetadata(settings, "projects", { path: "/projects", locale });
}

export default async function ProjectsPage() {
  const locale = await getRequestLocale();
  const projects = await listProjects({ publishedOnly: true, locale });
  return <ProjectsPageContent projects={projects} ui={getUi(locale)} />;
}
