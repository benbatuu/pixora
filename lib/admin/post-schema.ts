
import { z } from "zod";
import { publishStatusSchema } from "./project-schema";

export const postInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, sayı ve tire"),
  status: publishStatusSchema.default("DRAFT"),
  coverUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  authorRole: z.string().optional().nullable(),
  readTime: z.string().optional().nullable(),
  comments: z.number().int().nonnegative().default(0),
  publishedAt: z.string().datetime().optional().nullable(),
  localeCode: z.string().default("en"),
  title: z.string().min(1),
  excerpt: z.string().default(""),
  body: z.string().default(""),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const postUpdateSchema = postInputSchema.partial().extend({
  slug: postInputSchema.shape.slug.optional(),
  title: z.string().min(1).optional(),
});
