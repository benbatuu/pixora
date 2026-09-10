import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { metaForPageKey, PROTECTED_PAGE_KEYS } from "@/lib/admin/constants";
import { revalidatePath } from "next/cache";
import { publicPathForPageKey } from "@/lib/content/pages";

export const GET = withAdmin(async (req, { params }) => {
  const key = params?.key;
  if (!key) throw new ApiError("key gerekli", 400);

  const meta = metaForPageKey(key);
  const url = new URL(req.url);
  const localeFilter = url.searchParams.get("locale");

  let page = await prisma.page.findUnique({
    where: { key },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: {
            include: { locale: true },
            ...(localeFilter
              ? { where: { locale: { code: localeFilter } } }
              : {}),
          },
        },
      },
    },
  });

  if (!page) {
    throw new ApiError("Sayfa bulunamadı", 404);
  }

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
    page: {
      ...page,
      label: meta.label,
      publicPath: meta.publicPath,
      hasPublicRoute: meta.hasPublicRoute,
    },
    locales,
  });
});

export const DELETE = withAdmin(async (_req, { params }) => {
  const key = params?.key;
  if (!key) throw new ApiError("key gerekli", 400);
  if (PROTECTED_PAGE_KEYS.has(key)) {
    throw new ApiError("Bu sayfa silinemez (korumalı)", 400);
  }

  const page = await prisma.page.findUnique({ where: { key } });
  if (!page) throw new ApiError("Sayfa bulunamadı", 404);

  await prisma.page.delete({ where: { id: page.id } });
  revalidatePath(publicPathForPageKey(key));
  return ok({ ok: true });
});
