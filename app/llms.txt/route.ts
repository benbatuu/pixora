import { getSiteSettings } from "@/lib/content/settings";
import { buildLlmsTxt } from "@/lib/seo/llms-txt";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings();
  if (settings.llm?.enabled === false) {
    return new Response("Not Found", { status: 404 });
  }
  const body = buildLlmsTxt(settings);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
