import { ok, err } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { getSiteSettings } from "@/lib/content/settings";
import { listActiveLocales } from "@/lib/i18n/get-locale";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [settings, locales] = await Promise.all([
      getSiteSettings(),
      listActiveLocales(),
    ]);
    return ok({ settings, locales });
  } catch (e) {
    console.error("[GET /api/public/site]", e);
    return err(new ApiError("Site ayarları yüklenemedi", 500));
  }
}
