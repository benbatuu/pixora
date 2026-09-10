import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { created, ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { saveUpload } from "@/lib/media/storage";
import { writeAudit } from "@/lib/admin/audit";
import {
  ALLOWED_MEDIA_MIMES,
  MAX_MEDIA_BYTES,
} from "@/lib/admin/media-schema";

export const GET = withAdmin(async () => {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
  return ok({ assets });
});

export const POST = withAdmin(async (req, { session }) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    throw new ApiError("file gerekli", 400);
  }
  if (!file.size) {
    throw new ApiError("Boş dosya", 400);
  }
  if (file.size > MAX_MEDIA_BYTES) {
    throw new ApiError("Dosya en fazla 10MB olabilir", 400);
  }
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MEDIA_MIMES.has(mime)) {
    throw new ApiError(
      "Desteklenmeyen dosya türü (jpeg/png/webp/gif/svg/mp4)",
      400,
    );
  }

  const altRaw = form.get("alt");
  const alt =
    typeof altRaw === "string" && altRaw.trim() ? altRaw.trim() : null;

  const saved = await saveUpload(file, file.name || "upload");

  const asset = await prisma.mediaAsset.create({
    data: {
      url: saved.url,
      path: saved.relativePath,
      filename: saved.filename,
      mime,
      bytes: saved.bytes,
      alt,
      uploadedById: session.sub,
    },
  });

  await writeAudit({
    action: "media.upload",
    entityType: "MediaAsset",
    entityId: asset.id,
    meta: { filename: asset.filename, mime },
    session,
  });
  return created({ asset });
});
