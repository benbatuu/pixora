import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import ProjectForm, {
  type ProjectFormInitial,
  type ProjectTranslationFields,
} from "@/app/components/admin/projects/ProjectForm";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function normalizeMetrics(metricsRaw: unknown) {
  const metrics = Array.isArray(metricsRaw)
    ? (metricsRaw as { value: string; label: string }[])
    : [];
  const next = [...metrics];
  while (next.length < 3) next.push({ value: "", label: "" });
  return next.slice(0, 3);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { translations: { include: { locale: true } } },
  });
  const tr =
    project?.translations.find((t) => t.locale.code === "en") ??
    project?.translations[0];
  return { title: tr ? `Proje · ${tr.title}` : "Proje" };
}

export default async function AdminEditProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, locales] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
      include: {
        translations: { include: { locale: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.locale.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
      select: { code: true, name: true, isDefault: true },
    }),
  ]);
  if (!project) notFound();

  const translations: Record<string, ProjectTranslationFields> = {};
  for (const t of project.translations) {
    translations[t.locale.code] = {
      title: t.title,
      about: t.about,
      client: t.client,
      expertise: t.expertise,
      duration: t.duration,
      designer: t.designer,
      services: t.services,
      metrics: normalizeMetrics(t.metrics),
      nextSlug: t.nextSlug ?? "",
      nextTitle: t.nextTitle ?? "",
      nextMeta: t.nextMeta ?? "",
    };
  }

  const defaultCode =
    locales.find((l) => l.isDefault)?.code ??
    project.translations.find((t) => t.locale.code === "en")?.locale.code ??
    project.translations[0]?.locale.code ??
    "en";

  const initial: ProjectFormInitial = {
    id: project.id,
    slug: project.slug,
    status: project.status,
    year: project.year ?? "",
    coverUrl: project.coverUrl ?? "",
    siteUrl: project.siteUrl ?? "",
    tags: project.tags,
    gallery: project.images.map((i) => i.url),
    sortOrder: project.sortOrder,
    localeCode: defaultCode,
    translations,
    translatedLocales: Object.keys(translations),
  };

  const title =
    translations[defaultCode]?.title ??
    translations.en?.title ??
    project.slug;

  return (
    <div>
      <AdminPageHeader
        title={title}
        description="Projeyi dil bazlı düzenle veya sil."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Projeler", href: `${ADMIN_BASE}/projects` },
          { label: title },
        ]}
      />
      <ProjectForm mode="edit" initial={initial} locales={locales} />
    </div>
  );
}
