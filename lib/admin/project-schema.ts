
import { z } from "zod";

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const projectInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, sayı ve tire"),
  status: publishStatusSchema.default("DRAFT"),
  year: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  siteUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().datetime().optional().nullable(),
  localeCode: z.string().default("en"),
  title: z.string().min(1),
  about: z.string().default(""),
  client: z.string().default(""),
  expertise: z.string().default(""),
  duration: z.string().default(""),
  designer: z.string().default(""),
  services: z.array(z.string()).default([]),
  metrics: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .default([]),
  nextSlug: z.string().optional().nullable(),
  nextTitle: z.string().optional().nullable(),
  nextMeta: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
});

export const projectUpdateSchema = projectInputSchema.partial().extend({
  slug: projectInputSchema.shape.slug.optional(),
  title: z.string().min(1).optional(),
});
