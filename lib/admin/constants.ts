import type { AdminPageKey } from "./types";

export const ADMIN_BASE = "/admin";

/** Seed defaults / fallback labels — not an exclusive allow-list. */
export const ADMIN_PAGE_KEYS: { key: AdminPageKey; label: string; publicPath: string }[] = [
  { key: "home", label: "Ana sayfa", publicPath: "/" },
  { key: "about", label: "About", publicPath: "/about" },
  { key: "services", label: "Services", publicPath: "/services" },
  { key: "contact", label: "Contact", publicPath: "/contact" },
  { key: "not-found", label: "404 / Bulunamadı", publicPath: "404" },
];

/** Keys that already have public Next.js routes under app/(site). */
export const PUBLIC_ROUTE_PAGE_KEYS = new Set([
  "home",
  "about",
  "services",
  "contact",
  "not-found",
]);

/** Soft-protect from delete in admin UI. */
export const PROTECTED_PAGE_KEYS = new Set(["home", "not-found"]);

function guessPublicPath(key: string): string {
  if (key === "home") return "/";
  if (key === "not-found") return "404";
  if (key === "about") return "/about";
  if (key === "services") return "/services";
  if (key === "contact") return "/contact";
  // Custom CMS keys use the dynamic /p/[pageKey] route
  return `/p/${key}`;
}

export function labelForPageKey(key: string): string {
  return ADMIN_PAGE_KEYS.find((p) => p.key === key)?.label ?? key;
}

export function metaForPageKey(key: string): {
  key: string;
  label: string;
  publicPath: string;
  hasPublicRoute: boolean;
} {
  const seeded = ADMIN_PAGE_KEYS.find((p) => p.key === key);
  const publicPath = seeded?.publicPath ?? guessPublicPath(key);
  return {
    key,
    label: seeded?.label ?? key,
    publicPath,
    // Seeded routes OR dynamic /p/[pageKey] for custom keys
    hasPublicRoute: PUBLIC_ROUTE_PAGE_KEYS.has(key) || publicPath.startsWith("/p/"),
  };
}

export const ADMIN_TITLE_SUFFIX = "Pixora Admin";
