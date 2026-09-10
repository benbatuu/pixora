import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content/settings";
import { getCanonicalBase } from "@/lib/seo/metadata";
import { getAllPublishedPostSlugs } from "@/lib/content/blog";
import { getAllPublishedProjectSlugs } from "@/lib/content/projects";

export const dynamic = "force-dynamic";

const STATIC: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = getCanonicalBase(settings) || "http://localhost:3000";
  const now = new Date();

  const [projectSlugs, postSlugs] = await Promise.all([
    getAllPublishedProjectSlugs(),
    getAllPublishedPostSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: `${base}${s.path === "/" ? "" : s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...postEntries];
}
