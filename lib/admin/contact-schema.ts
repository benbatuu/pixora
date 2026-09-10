import { z } from "zod";

/** Public contact form payload. */
export const publicContactSchema = z.object({
  name: z.string().trim().min(1, "İsim gerekli").max(200),
  email: z.string().trim().email("Geçerli e-posta gerekli").max(320),
  phone: z.string().trim().max(80).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Mesaj gerekli").max(5000),
  locale: z.string().trim().max(16).optional(),
  /** Honeypot — accepted any string; handler ignores if non-empty */
  website: z.string().max(200).optional(),
});

export const updateMessageSchema = z.object({
  read: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const messagesFilterSchema = z.enum(["inbox", "archived", "all"]).default("inbox");
