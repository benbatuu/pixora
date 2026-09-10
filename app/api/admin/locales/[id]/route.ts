
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { updateLocaleSchema } from "@/lib/admin/locale-schema";
import { writeAudit } from "@/lib/admin/audit";

export const PATCH = withAdmin(async (req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);

  const body = await parseJson(req, updateLocaleSchema);
  const current = await prisma.locale.findUnique({ where: { id } });
  if (!current) throw new ApiError("Dil bulunamadı", 404);

  if (body.isActive === false && current.isDefault) {
    throw new ApiError("Varsayılan dil pasif yapılamaz", 400);
  }

  const locale = await prisma.$transaction(async (tx) => {
    if (body.isDefault === true) {
      await tx.locale.updateMany({ data: { isDefault: false } });
    }
    return tx.locale.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        ...(body.isDefault !== undefined ? { isDefault: body.isDefault } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
      },
    });
  });

  await writeAudit({
    action: "locale.update",
    entityType: "Locale",
    entityId: locale.id,
    meta: { code: locale.code },
    session,
  });
  revalidatePath("/");
  return ok({ locale });
}, { role: "ADMIN" });

export const DELETE = withAdmin(async (_req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);

  const current = await prisma.locale.findUnique({ where: { id } });
  if (!current) throw new ApiError("Dil bulunamadı", 404);
  if (current.isDefault) {
    throw new ApiError("Varsayılan dil silinemez", 400);
  }

  const count = await prisma.locale.count();
  if (count <= 1) {
    throw new ApiError("Son dil silinemez", 400);
  }

  await prisma.locale.delete({ where: { id } });
  await writeAudit({
    action: "locale.delete",
    entityType: "Locale",
    entityId: id,
    meta: { code: current.code },
    session,
  });
  revalidatePath("/");
  return ok({ ok: true });
}, { role: "ADMIN" });
