import { prisma } from "@/lib/db/prisma";
import { ok, err } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { publicContactSchema } from "@/lib/admin/contact-schema";
import {
  clientIpFromRequest,
  rateLimit,
} from "@/lib/api/rate-limit";

const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: Request) {
  try {
    const ip = clientIpFromRequest(req);
    const limited = rateLimit(`contact:${ip}`, CONTACT_LIMIT, CONTACT_WINDOW_MS);
    if (!limited.ok) {
      throw new ApiError("Çok fazla istek. Lütfen daha sonra tekrar deneyin.", 429, {
        retryAfterSec: limited.retryAfterSec,
      });
    }

    let raw: unknown;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        raw = await req.json();
      } catch {
        throw new ApiError("Geçersiz JSON gövde", 400);
      }
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const form = await req.formData();
      raw = Object.fromEntries(form.entries());
    } else {
      try {
        raw = await req.json();
      } catch {
        throw new ApiError("Geçersiz gövde", 400);
      }
    }

    const parsed = publicContactSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ApiError("Doğrulama hatası", 400, parsed.error.flatten());
    }

    const data = parsed.data;

    // Honeypot filled → pretend success
    if (data.website) {
      return ok({ ok: true });
    }

    const subjectParts: string[] = [];
    if (data.company?.trim()) subjectParts.push(data.company.trim());
    if (data.budget?.trim()) subjectParts.push(`Budget: ${data.budget.trim()}`);
    const subject = subjectParts.length
      ? subjectParts.join(" · ")
      : "Contact form";

    const bodyLines = [data.message.trim()];
    if (data.phone?.trim()) bodyLines.push(`Phone: ${data.phone.trim()}`);
    if (data.company?.trim()) bodyLines.push(`Company: ${data.company.trim()}`);
    if (data.budget?.trim()) bodyLines.push(`Budget: ${data.budget.trim()}`);

    await prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject,
        body: bodyLines.join("\n"),
        locale: data.locale?.trim() || null,
      },
    });

    return ok({ ok: true });
  } catch (e) {
    return err(e);
  }
}
