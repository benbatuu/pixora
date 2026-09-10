import { NextResponse } from "next/server";
import { z } from "zod";
import { ok, err } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { prisma } from "@/lib/db/prisma";
import { COOKIE_NAME, DEFAULT_LOCALE } from "@/lib/i18n/config";

const bodySchema = z.object({
  code: z.string().min(2).max(12),
});

export async function POST(req: Request) {
  try {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      throw new ApiError("Geçersiz JSON gövde", 400);
    }

    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      throw new ApiError("Doğrulama hatası", 400, parsed.error.flatten());
    }

    const code = parsed.data.code.trim().toLowerCase();
    const locale = await prisma.locale.findFirst({
      where: { code, isActive: true },
      select: { code: true },
    });
    if (!locale) {
      throw new ApiError("Dil bulunamadı veya pasif", 400);
    }

    const res = ok({ code: locale.code });
    res.cookies.set(COOKIE_NAME, locale.code, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (e) {
    return err(e);
  }
}

export async function GET() {
  // Lightweight probe — no secrets
  return NextResponse.json({
    cookie: COOKIE_NAME,
    defaultLocale: DEFAULT_LOCALE,
  });
}
