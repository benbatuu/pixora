
import { z } from "zod";

export const createLocaleSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(12)
    .regex(/^[a-z][a-z0-9-]*$/i, "Dil kodu geçersiz (ör. en, tr)"),
  name: z.string().min(1),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateLocaleSchema = z.object({
  name: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});
