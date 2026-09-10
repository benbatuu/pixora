
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { created, ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { projectInputSchema } from "@/lib/admin/project-schema";
import { writeAudit } from "@/lib/admin/audit";

export const GET = withAdmin(async () => {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      translations: { include: { locale: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  return ok({ projects });
});

export const POST = withAdmin(async (req, { session }) => {
  const body = await parseJson(req, projectInputSchema);
  const slug = body.slug.trim().toLowerCase();

  const exists = await prisma.project.findUnique({ where: { slug } });
  if (exists) throw new ApiError("Bu slug zaten kullanılıyor", 409);

  const locale = await prisma.locale.findUnique({
    where: { code: body.localeCode },
  });
  if (!locale) throw new ApiError("Locale bulunamadı", 400);

  const project = await prisma.project.create({
    data: {
      slug,
      status: body.status,
      year: body.year ?? null,
      coverUrl: body.coverUrl ?? null,
      siteUrl: body.siteUrl ?? null,
      sortOrder: body.sortOrder ?? 0,
      tags: body.tags,
      publishedAt:
        body.status === "PUBLISHED"
          ? body.publishedAt
            ? new Date(body.publishedAt)
            : new Date()
          : body.publishedAt
            ? new Date(body.publishedAt)
            : null,
      translations: {
        create: {
          localeId: locale.id,
          title: body.title,
          about: body.about,
          client: body.client,
          expertise: body.expertise,
          duration: body.duration,
          designer: body.designer,
          services: body.services,
          metrics: body.metrics,
          nextSlug: body.nextSlug ?? null,
          nextTitle: body.nextTitle ?? null,
          nextMeta: body.nextMeta ?? null,
        },
      },
      images: {
        create: body.gallery.map((url, sortOrder) => ({ url, sortOrder })),
      },
    },
    include: {
      translations: { include: { locale: true } },
      images: true,
    },
  });

  await writeAudit({
    action: "project.create",
    entityType: "Project",
    entityId: project.id,
    meta: { slug: project.slug },
    session,
  });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  return created({ project });
});
