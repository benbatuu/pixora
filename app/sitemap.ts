import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content/settings";
import { getCanonicalBase } from "@/lib/seo/metadata";
import { getAllPublishedPostSlugs } from "@/lib/content/blog";
import { getAllPublishedProjectSlugs } from "@/lib/content/projects";
import { DEFAULT_LOCALE, PREFIX_LOCALES } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";

export const dynamic = "force-dynamic";

const STATIC: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

function languageMap(base: string, path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const code of PREFIX_LOCALES) {
    const loc = localizedPath(path, code, DEFAULT_LOCALE);
    languages[code] = `${base}${loc === "/" ? "" : loc}`;
  }
  return languages;
}

function entriesForPath(
  base: string,
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = languageMap(base, path);
  return PREFIX_LOCALES.map((code) => {
    const loc = localizedPath(path, code, DEFAULT_LOCALE);
    return {
      url: `${base}${loc === "/" ? "" : loc}`,
      lastModified,
      changeFrequency,
      priority: code === DEFAULT_LOCALE ? priority : Math.max(0.4, priority - 0.1),
      alternates: { languages },
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = getCanonicalBase(settings) || "http://localhost:3000";
  const now = new Date();

  const [projectSlugs, postSlugs] = await Promise.all([
    getAllPublishedProjectSlugs(),
    getAllPublishedPostSlugs(),
  ]);

  const staticEntries = STATIC.flatMap((s) =>
    entriesForPath(base, s.path, now, s.changeFrequency, s.priority),
  );

  const projectEntries = projectSlugs.flatMap((slug) =>
    entriesForPath(base, `/projects/${slug}`, now, "monthly", 0.7),
  );

  const postEntries = postSlugs.flatMap((slug) =>
    entriesForPath(base, `/blog/${slug}`, now, "weekly", 0.6),
  );

  return [...staticEntries, ...projectEntries, ...postEntries];
}
