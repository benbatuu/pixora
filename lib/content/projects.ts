
import { prisma } from "@/lib/db/prisma";
import {
  PROJECTS as STUB_PROJECTS,
  type Project,
} from "@/app/data/projects";
import { pickTranslation } from "@/lib/i18n/pick-translation";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

type DbProject = Awaited<ReturnType<typeof prisma.project.findMany>>[number] & {
  translations: { title: string; about: string; client: string; expertise: string; duration: string; designer: string; services: string[]; metrics: unknown; nextSlug: string | null; nextTitle: string | null; nextMeta: string | null; locale: { code: string } }[];
  images: { url: string; sortOrder: number }[];
};

function mapProject(p: DbProject, locale = DEFAULT_LOCALE, defaultLocale = DEFAULT_LOCALE): Project {
  const tr = pickTranslation(p.translations, locale, defaultLocale);
  const metrics = Array.isArray(tr?.metrics)
    ? (tr!.metrics as { value: string; label: string }[])
    : [];
  return {
    slug: p.slug,
    title: tr?.title ?? p.slug,
    image: p.coverUrl ?? "",
    tags: p.tags,
    year: p.year ?? "",
    client: tr?.client ?? "",
    expertise: tr?.expertise ?? "",
    duration: tr?.duration ?? "",
    designer: tr?.designer ?? "",
    siteUrl: p.siteUrl ?? "#",
    about: tr?.about ?? "",
    services: tr?.services ?? [],
    metrics,
    gallery: [...p.images].sort((a, b) => a.sortOrder - b.sortOrder).map((i) => i.url),
    nextSlug: tr?.nextSlug ?? "",
    nextTitle: tr?.nextTitle ?? "",
    nextMeta: tr?.nextMeta ?? "",
  };
}

const include = {
  translations: { include: { locale: true } },
  images: true,
} as const;

export async function listProjects(opts?: {
  publishedOnly?: boolean;
  locale?: string;
}): Promise<Project[]> {
  const locale = opts?.locale ?? DEFAULT_LOCALE;
  try {
    const rows = await prisma.project.findMany({
      where: opts?.publishedOnly ? { status: "PUBLISHED" } : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include,
    });
    if (rows.length === 0) return STUB_PROJECTS;
    return rows.map((r) => mapProject(r as DbProject, locale, DEFAULT_LOCALE));
  } catch (e) {
    console.error("[content.listProjects]", e);
    return STUB_PROJECTS;
  }
}

export async function getProjectBySlug(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<Project | null> {
  try {
    const row = await prisma.project.findUnique({
      where: { slug },
      include,
    });
    if (!row) {
      return STUB_PROJECTS.find((p) => p.slug === slug) ?? null;
    }
    if (row.status !== "PUBLISHED") {
      return null;
    }
    return mapProject(row as DbProject, locale, DEFAULT_LOCALE);
  } catch (e) {
    console.error("[content.getProjectBySlug]", e);
    return STUB_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getPublishedProjectBySlug(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<Project | null> {
  try {
    const row = await prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      include,
    });
    if (!row) {
      return STUB_PROJECTS.find((p) => p.slug === slug) ?? null;
    }
    return mapProject(row as DbProject, locale, DEFAULT_LOCALE);
  } catch (e) {
    console.error("[content.getPublishedProjectBySlug]", e);
    return STUB_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllPublishedProjectSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return STUB_PROJECTS.map((p) => p.slug);
    return rows.map((r) => r.slug);
  } catch {
    return STUB_PROJECTS.map((p) => p.slug);
  }
}
