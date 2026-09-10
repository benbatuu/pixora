import type { LlmBotRule, SiteLlmSettings, SiteSettings } from "@/lib/admin/types";

export const LLM_BOT_AGENTS: {
  key: keyof NonNullable<SiteLlmSettings["robots"]>;
  userAgent: string;
  trainingOriented?: boolean;
}[] = [
  { key: "gptBot", userAgent: "GPTBot", trainingOriented: true },
  { key: "chatGptUser", userAgent: "ChatGPT-User" },
  { key: "googleExtended", userAgent: "Google-Extended", trainingOriented: true },
  { key: "claudeBot", userAgent: "ClaudeBot" },
  { key: "perplexityBot", userAgent: "PerplexityBot" },
  { key: "bytespider", userAgent: "Bytespider" },
  { key: "anthropicAi", userAgent: "Anthropic-AI" },
];

/** Resolve allow/block: explicit rule wins; else allowTraining=false blocks training bots. */
export function resolveLlmBotRule(
  settings: SiteSettings,
  key: keyof NonNullable<SiteLlmSettings["robots"]>,
  trainingOriented?: boolean,
): LlmBotRule {
  const explicit = settings.llm?.robots?.[key];
  if (explicit === "allow" || explicit === "block") return explicit;
  if (settings.llm?.allowTraining === false && trainingOriented) return "block";
  return "allow";
}
