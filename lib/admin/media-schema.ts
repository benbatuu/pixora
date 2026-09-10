import { z } from "zod";

export const updateMediaAltSchema = z.object({
  alt: z.string().max(500).nullable().optional(),
});

export const ALLOWED_MEDIA_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
]);

export const MAX_MEDIA_BYTES = 10 * 1024 * 1024; // 10MB
