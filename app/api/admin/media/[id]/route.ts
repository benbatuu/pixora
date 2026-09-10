import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { updateMediaAltSchema } from "@/lib/admin/media-schema";
import { deleteUpload } from "@/lib/media/storage";
import { writeAudit } from "@/lib/admin/audit";

export const PATCH = withAdmin(async (req, { params }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);

  const body = await parseJson(req, updateMediaAltSchema);
  const current = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!current) throw new ApiError("Medya bulunamadı", 404);

  const asset = await prisma.mediaAsset.update({
    where: { id },
    data: {
      alt: body.alt === undefined ? undefined : body.alt,
    },
  });

  return ok({ asset });
});

export const DELETE = withAdmin(async (_req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);

  const current = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!current) throw new ApiError("Medya bulunamadı", 404);

  try {
    if (current.url.startsWith("http")) {
      await deleteUpload(current.url);
    } else if (current.path) {
      await deleteUpload(current.path);
    } else if (current.url.startsWith("/uploads/")) {
      await deleteUpload(current.url);
    }
  } catch (e) {
    console.error("[media] delete file", e);
    // continue — still remove DB row
  }

  await prisma.mediaAsset.delete({ where: { id } });
  await writeAudit({
    action: "media.delete",
    entityType: "MediaAsset",
    entityId: id,
    meta: { filename: current.filename },
    session,
  });
  return ok({ ok: true });
});
