import type { SiteSettings } from "@/lib/admin/types";
import { getCanonicalBase } from "./metadata";

const STATIC_PATHS: { path: string; label: string; note: string }[] = [
  { path: "/", label: "Home", note: "Studio overview" },
  { path: "/about", label: "About", note: "Studio, approach, team" },
  { path: "/services", label: "Services", note: "Brand, motion, UI/UX, web" },
  { path: "/projects", label: "Projects", note: "Selected work" },
  { path: "/blog", label: "Blog", note: "Design, motion, branding, process" },
  { path: "/contact", label: "Contact", note: "Start a project" },
];

export type LlmsTxtPost = {
  slug: string;
  title: string;
  excerpt?: string;
};

export function buildLlmsTxt(
  settings: SiteSettings,
  extras?: { posts?: LlmsTxtPost[] },
): string {
  const custom = settings.llm?.llmsTxt?.trim();
  if (custom) return custom.endsWith("\n") ? custom : `${custom}\n`;

  const base = getCanonicalBase(settings);
  const title = settings.llm?.title?.trim() || settings.studioName;
  const summary =
    settings.llm?.summary?.trim() || settings.seo.defaultDescription;
  const contact =
    settings.llm?.contactEmail?.trim() || settings.email;

  const href = (path: string) =>
    base ? `${base}${path === "/" ? "" : path}` : path;

  const lines: string[] = [
    `# ${title}`,
    "",
    `> ${summary}`,
    "",
    "## Site",
  ];

  for (const item of STATIC_PATHS) {
    lines.push(`- [${item.label}](${href(item.path)}): ${item.note}`);
  }

  lines.push(
    "",
    "## Languages",
    "",
    "- English (default, unprefixed URLs)",
    "- Turkish (`/tr/...`)",
    "- Russian (`/ru/...`)",
  );

  const posts = extras?.posts?.filter((p) => p.slug && p.title) ?? [];
  if (posts.length) {
    lines.push("", "## Blog", "");
    for (const post of posts) {
      const note = post.excerpt?.trim() ? `: ${post.excerpt.trim()}` : "";
      lines.push(`- [${post.title}](${href(`/blog/${post.slug}`)})${note}`);
    }
  }

  lines.push("", "## Contact", "");
  lines.push(`- Email: ${contact}`);
  if (settings.phone) lines.push(`- Phone: ${settings.phone}`);
  if (settings.address) lines.push(`- Address: ${settings.address}`);
  if (base) lines.push(`- Website: ${base}`);

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
