import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { updateMessageSchema } from "@/lib/admin/contact-schema";
import { writeAudit } from "@/lib/admin/audit";

export const PATCH = withAdmin(async (req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);

  const body = await parseJson(req, updateMessageSchema);
  const current = await prisma.contactMessage.findUnique({ where: { id } });
  if (!current) throw new ApiError("Mesaj bulunamadı", 404);

  const data: { readAt?: Date | null; archivedAt?: Date | null } = {};
  if (body.read === true) data.readAt = current.readAt ?? new Date();
  if (body.read === false) data.readAt = null;
  if (body.archived === true) data.archivedAt = current.archivedAt ?? new Date();
  if (body.archived === false) data.archivedAt = null;

  const message = await prisma.contactMessage.update({
    where: { id },
    data,
  });

  await writeAudit({
    action: "message.update",
    entityType: "ContactMessage",
    entityId: id,
    meta: { read: body.read, archived: body.archived },
    session,
  });
  return ok({ message });
});

export const DELETE = withAdmin(async (_req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);

  const current = await prisma.contactMessage.findUnique({ where: { id } });
  if (!current) throw new ApiError("Mesaj bulunamadı", 404);

  await prisma.contactMessage.delete({ where: { id } });
  await writeAudit({
    action: "message.delete",
    entityType: "ContactMessage",
    entityId: id,
    session,
  });
  return ok({ ok: true });
});
