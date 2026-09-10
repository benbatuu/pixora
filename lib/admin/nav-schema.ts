import { z } from "zod";

export const navLocationSchema = z.enum(["HEADER", "FOOTER", "OFFCANVAS"]);

export const navItemInputSchema = z.object({
  id: z.string().optional(),
  href: z.string().min(1),
  sortOrder: z.number().int().default(0),
  label: z.string().min(1),
});

export const putNavSchema = z.object({
  location: navLocationSchema,
  localeCode: z.string().min(1),
  items: z.array(navItemInputSchema),
});

export type PutNavInput = z.infer<typeof putNavSchema>;
