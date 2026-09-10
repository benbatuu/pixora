import type { SiteSettings } from "@/lib/admin/types";
import { getCanonicalBase } from "./metadata";

const STATIC_PATHS: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/projects", label: "Projects" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
];

export function buildLlmsTxt(settings: SiteSettings): string {
  const custom = settings.llm?.llmsTxt?.trim();
  if (custom) return custom.endsWith("\n") ? custom : `${custom}\n`;

  const base = getCanonicalBase(settings);
  const title = settings.llm?.title?.trim() || settings.studioName;
  const summary =
    settings.llm?.summary?.trim() || settings.seo.defaultDescription;
  const contact =
    settings.llm?.contactEmail?.trim() || settings.email;

  const lines: string[] = [
    `# ${title}`,
    "",
    `> ${summary}`,
    "",
    "## Site",
  ];

  for (const item of STATIC_PATHS) {
    const url = base ? `${base}${item.path === "/" ? "" : item.path}` : item.path;
    lines.push(`- [${item.label}](${url}): ${item.label} page`);
  }

  lines.push("", "## Contact", "");
  lines.push(`- Email: ${contact}`);
  if (settings.phone) lines.push(`- Phone: ${settings.phone}`);
  if (settings.address) lines.push(`- Address: ${settings.address}`);

  if (settings.llm?.allowTraining === false) {
    lines.push(
      "",
      "## AI training",
      "",
      "Training-oriented crawlers should not use this site for model training. See /robots.txt.",
    );
  }

  lines.push("");
  return lines.join("\n");
}
