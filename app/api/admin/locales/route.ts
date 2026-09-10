
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { created, ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { createLocaleSchema } from "@/lib/admin/locale-schema";
import { writeAudit } from "@/lib/admin/audit";

export const GET = withAdmin(async () => {
  const locales = await prisma.locale.findMany({
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });
  return ok({ locales });
});

export const POST = withAdmin(async (req, { session }) => {
  const body = await parseJson(req, createLocaleSchema);
  const code = body.code.trim().toLowerCase();

  const existing = await prisma.locale.findUnique({ where: { code } });
  if (existing) throw new ApiError("Bu dil kodu zaten var", 409);

  const locale = await prisma.$transaction(async (tx) => {
    if (body.isDefault) {
      await tx.locale.updateMany({ data: { isDefault: false } });
    }
    return tx.locale.create({
      data: {
        code,
        name: body.name.trim(),
        isDefault: body.isDefault ?? false,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
  });

  await writeAudit({
    action: "locale.create",
    entityType: "Locale",
    entityId: locale.id,
    meta: { code: locale.code },
    session,
  });
  revalidatePath("/");
  return created({ locale });
}, { role: "ADMIN" });
