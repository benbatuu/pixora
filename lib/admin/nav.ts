import type { AdminNavItem } from "./types";
import { ADMIN_BASE } from "./constants";

/** Primary sidebar navigation for the admin panel. */
export const ADMIN_NAV: AdminNavItem[] = [
  { href: ADMIN_BASE, label: "Dashboard", icon: "LayoutDashboard" },
  { href: `${ADMIN_BASE}/site-pages`, label: "Sayfalar", icon: "FileText" },
  { href: `${ADMIN_BASE}/nav`, label: "Menü", icon: "List" },
  { href: `${ADMIN_BASE}/projects`, label: "Projeler", icon: "FolderKanban" },
  { href: `${ADMIN_BASE}/blog`, label: "Blog", icon: "Newspaper" },
  { href: `${ADMIN_BASE}/media`, label: "Medya", icon: "Image" },
  { href: `${ADMIN_BASE}/messages`, label: "Mesajlar", icon: "Inbox", badgeKey: "messages" },
  { href: `${ADMIN_BASE}/locales`, label: "Diller", icon: "Languages", adminOnly: true },
  { href: `${ADMIN_BASE}/components`, label: "Bileşenler", icon: "LayoutTemplate", adminOnly: true },
  { href: `${ADMIN_BASE}/seo`, label: "SEO & AI", icon: "Search", adminOnly: true },
  { href: `${ADMIN_BASE}/settings`, label: "Ayarlar", icon: "Settings", adminOnly: true },
  { href: `${ADMIN_BASE}/audit`, label: "Audit", icon: "ScrollText", adminOnly: true },
];
