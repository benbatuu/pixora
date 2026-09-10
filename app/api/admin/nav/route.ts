import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { putNavSchema, navLocationSchema } from "@/lib/admin/nav-schema";
import type { NavLocation } from "@prisma/client";
import { writeAudit } from "@/lib/admin/audit";

export const GET = withAdmin(async (req) => {
  const url = new URL(req.url);
  const raw = url.searchParams.get("location") ?? "HEADER";
  const parsed = navLocationSchema.safeParse(raw);
  if (!parsed.success) throw new ApiError("Geçersiz location", 400);
  const location = parsed.data as NavLocation;

  const localeCode = url.searchParams.get("locale");

  const items = await prisma.navItem.findMany({
    where: { location, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      translations: {
        include: { locale: true },
        ...(localeCode
          ? { where: { locale: { code: localeCode } } }
          : {}),
      },
    },
  });

  const locales = await prisma.locale.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      isDefault: true,
      isActive: true,
    },
  });

  return ok({
    location,
    items: items.map((item) => ({
      id: item.id,
      href: item.href,
      sortOrder: item.sortOrder,
      translations: item.translations.map((t) => ({
        localeCode: t.locale.code,
        label: t.label,
      })),
      label:
        item.translations.find((t) =>
          localeCode ? t.locale.code === localeCode : t.locale.isDefault,
        )?.label ??
        item.translations[0]?.label ??
        item.href,
    })),
    locales,
  });
});

export const PUT = withAdmin(async (req, { session }) => {
  const body = await parseJson(req, putNavSchema);
  const location = body.location as NavLocation;

  const locale = await prisma.locale.findUnique({
    where: { code: body.localeCode },
  });
  if (!locale) throw new ApiError("Locale bulunamadı", 400);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.navItem.findMany({
      where: { location, parentId: null },
    });
    const keepIds = new Set(
      body.items.map((i) => i.id).filter((id): id is string => Boolean(id)),
    );
    const toDelete = existing.filter((e) => !keepIds.has(e.id));
    if (toDelete.length) {
      await tx.navItem.deleteMany({
        where: { id: { in: toDelete.map((d) => d.id) } },
      });
    }

    for (const item of body.items) {
      let navItemId = item.id;
      if (navItemId) {
        const found = existing.find((e) => e.id === navItemId);
        if (!found) navItemId = undefined;
      }

      const row = navItemId
        ? await tx.navItem.update({
            where: { id: navItemId },
            data: { href: item.href, sortOrder: item.sortOrder },
          })
        : await tx.navItem.create({
            data: {
              location,
              href: item.href,
              sortOrder: item.sortOrder,
            },
          });

      await tx.navItemTranslation.upsert({
        where: {
          navItemId_localeId: {
            navItemId: row.id,
            localeId: locale.id,
          },
        },
        update: { label: item.label },
        create: {
          navItemId: row.id,
          localeId: locale.id,
          label: item.label,
        },
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/projects");
  revalidatePath("/blog");
  revalidatePath("/contact");
  // layout wraps all site pages
  revalidatePath("/", "layout");

  const items = await prisma.navItem.findMany({
    where: { location, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      translations: {
        where: { localeId: locale.id },
        include: { locale: true },
      },
    },
  });

  await writeAudit({
    action: "nav.update",
    entityType: "NavItem",
    entityId: null,
    meta: {
      location,
      localeCode: body.localeCode,
      itemCount: body.items.length,
    },
    session,
  });
  return ok({
    location,
    localeCode: body.localeCode,
    items: items.map((item) => ({
      id: item.id,
      href: item.href,
      sortOrder: item.sortOrder,
      label: item.translations[0]?.label ?? item.href,
    })),
  });
});
