/** Client-safe nav fallback + types (no DB imports). */

export type NavItemPublic = {
  href: string;
  label: string;
};

/** Hardcoded fallback matching historical Header/Footer NAV. */
export const FALLBACK_NAV: NavItemPublic[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
