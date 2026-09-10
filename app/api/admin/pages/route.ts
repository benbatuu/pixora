import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { created, ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { createPageSchema } from "@/lib/admin/page-schema";
import { metaForPageKey } from "@/lib/admin/constants";
import type { Prisma } from "@prisma/client";

export const GET = withAdmin(async () => {
  const rows = await prisma.page.findMany({
    orderBy: { key: "asc" },
    include: {
      _count: { select: { sections: true } },
    },
  });

  const pages = rows.map((row) => {
    const meta = metaForPageKey(row.key);
    return {
      key: row.key,
      label: meta.label,
      publicPath: meta.publicPath,
      hasPublicRoute: meta.hasPublicRoute,
      id: row.id,
      status: row.status,
      sectionCount: row._count.sections,
      updatedAt: row.updatedAt,
    };
  });

  return ok({ pages });
});

export const POST = withAdmin(async (req) => {
  const body = await parseJson(req, createPageSchema);
  const key = body.key.trim().toLowerCase();

  const existing = await prisma.page.findUnique({ where: { key } });
  if (existing) throw new ApiError("Bu sayfa anahtarı zaten var", 409);

  const localeCode = body.localeCode ?? "en";
  const locale = await prisma.locale.findUnique({ where: { code: localeCode } });
  if (!locale) throw new ApiError("Locale bulunamadı", 400);

  const page = await prisma.$transaction(async (tx) => {
    const createdPage = await tx.page.create({
      data: { key, status: "PUBLISHED" },
    });

    if (body.withHero !== false) {
      const section = await tx.pageSection.create({
        data: {
          pageId: createdPage.id,
          sectionKey: "hero",
          type: "hero",
          sortOrder: 0,
        },
      });
      await tx.pageSectionTranslation.create({
        data: {
          sectionId: section.id,
          localeId: locale.id,
          payload: {
            title: body.heroTitle?.trim() || body.labelNote?.trim() || key,
            subtitle: "",
          } as Prisma.InputJsonValue,
        },
      });
    }

    return tx.page.findUnique({
      where: { id: createdPage.id },
      include: {
        _count: { select: { sections: true } },
        sections: {
          include: { translations: { include: { locale: true } } },
        },
      },
    });
  });

  const meta = metaForPageKey(key);
  return created({
    page: {
      ...page,
      label: meta.label,
      publicPath: meta.publicPath,
      hasPublicRoute: meta.hasPublicRoute,
    },
  });
});
