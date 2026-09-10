/**
 * 404 / not-found page defaults (fallback when DB empty / seed source).
 * Seed + content-layer fallback only.
 */

export type NotFoundLink = {
  label: string;
  href: string;
};

export type NotFoundHero = {
  code?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  background?: "light" | "dark" | "red";
  align?: "center" | "left";
  showCode?: boolean;
};

export type NotFoundContent = {
  hero: NotFoundHero;
  links: NotFoundLink[];
};

export const NOT_FOUND_DEFAULTS: NotFoundContent = {
  hero: {
    code: "404",
    title: "Page not found",
    description:
      "The page you’re looking for doesn’t exist or has been moved.",
    ctaLabel: "Back to home",
    ctaHref: "/",
    secondaryCtaLabel: "Contact us",
    secondaryCtaHref: "/contact",
    background: "light",
    align: "center",
    showCode: true,
  },
  links: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
};
