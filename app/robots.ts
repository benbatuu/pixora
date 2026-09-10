import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content/settings";
import { getCanonicalBase } from "@/lib/seo/metadata";
import { LLM_BOT_AGENTS, resolveLlmBotRule } from "@/lib/seo/robots-rules";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = getCanonicalBase(settings);
  const index = settings.seo.robotsIndex !== false;

  const llmRules: MetadataRoute.Robots["rules"] = LLM_BOT_AGENTS.map((bot) => {
    const rule = resolveLlmBotRule(settings, bot.key, bot.trainingOriented);
    return {
      userAgent: bot.userAgent,
      ...(rule === "allow"
        ? { allow: "/" }
        : { disallow: "/" }),
    };
  });

  return {
    rules: [
      {
        userAgent: "*",
        ...(index ? { allow: "/" } : { disallow: "/" }),
      },
      ...llmRules,
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
    host: base || undefined,
  };
}
