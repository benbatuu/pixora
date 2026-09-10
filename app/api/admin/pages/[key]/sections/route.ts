import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { putPageSectionsSchema } from "@/lib/admin/page-schema";
import { validateSectionPayload } from "@/lib/content/section-types";
import { publicPathForPageKey } from "@/lib/content/pages";
import type { Prisma } from "@prisma/client";
import { writeAudit } from "@/lib/admin/audit";

export const PUT = withAdmin(async (req, { params, session }) => {
  const key = params?.key;
  if (!key) throw new ApiError("key gerekli", 400);

  const existingPage = await prisma.page.findUnique({ where: { key } });
  if (!existingPage) throw new ApiError("Sayfa bulunamadı", 404);

  const body = await parseJson(req, putPageSectionsSchema);

  for (const section of body.sections) {
    const result = validateSectionPayload(section.type, section.payload);
    if (!result.ok) {
      throw new ApiError(
        `Geçersiz payload: ${section.sectionKey}`,
        400,
        result.error.flatten(),
      );
    }
    section.payload = result.data;
  }

  const locale = await prisma.locale.findUnique({
    where: { code: body.localeCode },
  });
  if (!locale) throw new ApiError("Locale bulunamadı", 400);

  const page = await prisma.page.upsert({
    where: { key },
    update: {},
    create: { key, status: "PUBLISHED" },
  });

  const incomingKeys = new Set(body.sections.map((s) => s.sectionKey));

  await prisma.$transaction(async (tx) => {
    const existing = await tx.pageSection.findMany({
      where: { pageId: page.id },
    });

    const toDelete = existing.filter((s) => !incomingKeys.has(s.sectionKey));
    if (toDelete.length) {
      await tx.pageSection.deleteMany({
        where: { id: { in: toDelete.map((s) => s.id) } },
      });
    }

    for (const item of body.sections) {
      const section = await tx.pageSection.upsert({
        where: {
          pageId_sectionKey: {
            pageId: page.id,
            sectionKey: item.sectionKey,
          },
        },
        update: {
          type: item.type,
          sortOrder: item.sortOrder,
        },
        create: {
          pageId: page.id,
          sectionKey: item.sectionKey,
          type: item.type,
          sortOrder: item.sortOrder,
        },
      });

      await tx.pageSectionTranslation.upsert({
        where: {
          sectionId_localeId: {
            sectionId: section.id,
            localeId: locale.id,
          },
        },
        update: {
          payload: item.payload as Prisma.InputJsonValue,
        },
        create: {
          sectionId: section.id,
          localeId: locale.id,
          payload: item.payload as Prisma.InputJsonValue,
        },
      });
    }
  });

  const path = publicPathForPageKey(key);
  revalidatePath(path);
  if (key === "home") revalidatePath("/");
  if (key === "not-found") revalidatePath("/", "layout");

  const updated = await prisma.page.findUnique({
    where: { id: page.id },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: {
            where: { localeId: locale.id },
            include: { locale: true },
          },
        },
      },
    },
  });

  await writeAudit({
    action: "page.sections.update",
    entityType: "Page",
    entityId: page.id,
    meta: { key, localeCode: body.localeCode, sectionCount: body.sections.length },
    session,
  });
  return ok({ page: updated });
});
