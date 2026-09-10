import { ok, err } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { getPageSections, publicPathForPageKey } from "@/lib/content/pages";
import { prisma } from "@/lib/db/prisma";
import { PublishStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ key: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    const { key } = await ctx.params;
    const url = new URL(req.url);
    const locale = url.searchParams.get("locale") || "en";

    const page = await prisma.page.findUnique({ where: { key } });
    if (!page) {
      return err(new ApiError("Sayfa bulunamadı", 404));
    }
    if (page.status !== PublishStatus.PUBLISHED) {
      return err(new ApiError("Sayfa yayınlanmamış", 404));
    }

    const sections = await getPageSections(key, locale);
    return ok({
      key,
      path: publicPathForPageKey(key),
      locale,
      sections,
    });
  } catch (e) {
    console.error("[GET /api/public/pages/[key]]", e);
    return err(e instanceof ApiError ? e : new ApiError("Sayfa içeriği yüklenemedi", 500));
  }
}
