
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { projectUpdateSchema } from "@/lib/admin/project-schema";
import { writeAudit } from "@/lib/admin/audit";

async function findProject(idOrSlug: string) {
  return prisma.project.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      translations: { include: { locale: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export const GET = withAdmin(async (_req, { params }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);
  const project = await findProject(id);
  if (!project) throw new ApiError("Proje bulunamadı", 404);
  return ok({ project });
});

export const PATCH = withAdmin(async (req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);
  const current = await findProject(id);
  if (!current) throw new ApiError("Proje bulunamadı", 404);

  const body = await parseJson(req, projectUpdateSchema);

  if (body.slug && body.slug !== current.slug) {
    const clash = await prisma.project.findUnique({
      where: { slug: body.slug },
    });
    if (clash) throw new ApiError("Bu slug zaten kullanılıyor", 409);
  }

  const localeCode = body.localeCode ?? "en";
  const locale = await prisma.locale.findUnique({ where: { code: localeCode } });
  if (!locale) throw new ApiError("Locale bulunamadı", 400);

  const status = body.status ?? current.status;
  let publishedAt = current.publishedAt;
  if (body.publishedAt !== undefined) {
    publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  } else if (status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  }

  const project = await prisma.$transaction(async (tx) => {
    const updated = await tx.project.update({
      where: { id: current.id },
      data: {
        ...(body.slug !== undefined ? { slug: body.slug } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.year !== undefined ? { year: body.year } : {}),
        ...(body.coverUrl !== undefined ? { coverUrl: body.coverUrl } : {}),
        ...(body.siteUrl !== undefined ? { siteUrl: body.siteUrl } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
        ...(body.tags !== undefined ? { tags: body.tags } : {}),
        publishedAt,
      },
    });

    const hasTranslationFields =
      body.title !== undefined ||
      body.about !== undefined ||
      body.client !== undefined ||
      body.expertise !== undefined ||
      body.duration !== undefined ||
      body.designer !== undefined ||
      body.services !== undefined ||
      body.metrics !== undefined ||
      body.nextSlug !== undefined ||
      body.nextTitle !== undefined ||
      body.nextMeta !== undefined;

    if (hasTranslationFields) {
      const existing = current.translations.find((t) => t.localeId === locale.id);
      const trData = {
        title: body.title ?? existing?.title ?? current.slug,
        about: body.about ?? existing?.about ?? "",
        client: body.client ?? existing?.client ?? "",
        expertise: body.expertise ?? existing?.expertise ?? "",
        duration: body.duration ?? existing?.duration ?? "",
        designer: body.designer ?? existing?.designer ?? "",
        services: body.services ?? existing?.services ?? [],
        metrics: body.metrics ?? existing?.metrics ?? [],
        nextSlug: body.nextSlug !== undefined ? body.nextSlug : existing?.nextSlug ?? null,
        nextTitle: body.nextTitle !== undefined ? body.nextTitle : existing?.nextTitle ?? null,
        nextMeta: body.nextMeta !== undefined ? body.nextMeta : existing?.nextMeta ?? null,
      };
      await tx.projectTranslation.upsert({
        where: {
          projectId_localeId: { projectId: current.id, localeId: locale.id },
        },
        update: trData,
        create: { projectId: current.id, localeId: locale.id, ...trData },
      });
    }

    if (body.gallery !== undefined) {
      await tx.projectImage.deleteMany({ where: { projectId: current.id } });
      if (body.gallery.length) {
        await tx.projectImage.createMany({
          data: body.gallery.map((url, sortOrder) => ({
            projectId: current.id,
            url,
            sortOrder,
          })),
        });
      }
    }

    return tx.project.findUnique({
      where: { id: updated.id },
      include: {
        translations: { include: { locale: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  });

  const slug = project?.slug ?? current.slug;
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  if (body.slug && body.slug !== current.slug) {
    revalidatePath(`/projects/${current.slug}`);
  }
  await writeAudit({
    action: "project.update",
    entityType: "Project",
    entityId: current.id,
    meta: { slug },
    session,
  });
  return ok({ project });
});

export const DELETE = withAdmin(async (_req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);
  const current = await findProject(id);
  if (!current) throw new ApiError("Proje bulunamadı", 404);
  await prisma.project.delete({ where: { id: current.id } });
  await writeAudit({
    action: "project.delete",
    entityType: "Project",
    entityId: current.id,
    meta: { slug: current.slug },
    session,
  });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${current.slug}`);
  return ok({ ok: true });
});
