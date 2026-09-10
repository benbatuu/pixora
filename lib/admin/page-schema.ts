import { z } from "zod";
import { SECTION_TYPE_IDS } from "@/lib/content/section-types";

export const pageSectionInputSchema = z.object({
  sectionKey: z.string().min(1),
  type: z.enum(SECTION_TYPE_IDS),
  sortOrder: z.number().int().default(0),
  payload: z.unknown(),
});

export const putPageSectionsSchema = z.object({
  localeCode: z.string().min(1).default("en"),
  sections: z.array(pageSectionInputSchema),
});

export const createPageSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: küçük harf, rakam, tire"),
  labelNote: z.string().max(120).optional(),
  withHero: z.boolean().optional().default(true),
  localeCode: z.string().min(1).optional().default("en"),
  heroTitle: z.string().optional(),
});

export type PutPageSectionsInput = z.infer<typeof putPageSectionsSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
