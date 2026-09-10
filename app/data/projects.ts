/**
 * Project stubs
 *
 * Seed + content-layer fallback only (seed + content fallback).
 * Admin dashboard / live lists must use Prisma / API — do not import
 * these arrays for primary admin counts or inbox.
 */

export type Project = {
  slug: string;
  title: string;
  image: string;
  tags: string[];
  year: string;
  client: string;
  expertise: string;
  duration: string;
  designer: string;
  siteUrl: string;
  about: string;
  services: string[];
  metrics: { value: string; label: string }[];
  gallery: string[];
  nextSlug: string;
  nextTitle: string;
  nextMeta: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "electro-hub",
    title: "Electro Hub",
    image: "/assets/img/project/project-2-1.jpg",
    tags: ["Web Design", "Web Development"],
    year: "2026",
    client: "Dribbble",
    expertise: "Web Design, Web Development",
    duration: "3 January 2026",
    designer: "ThemePure",
    siteUrl: "#",
    about:
      "Since 2004 we have earned more than thirty awards — delivering work that meets the highest standards on every brief.",
    services: [
      "UX/UI Design",
      "App Design",
      "Brand Development",
      "Copywriting",
      "Front-end Development",
      "Shopify Development",
    ],
    metrics: [
      { value: "6%", label: "Increase in conversions" },
      { value: "7%", label: "Increase in website traffic" },
      { value: "4%", label: "Average daily signups" },
      { value: "7%", label: "Increase in conversions" },
    ],
    gallery: [
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-1.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-2.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-3.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-4.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-5.jpg",
    ],
    nextSlug: "energy-grid",
    nextTitle: "Energy Grid",
    nextMeta: "Research, UX, UI Design",
  },
  {
    slug: "energy-grid",
    title: "Energy Grid",
    image: "/assets/img/project/project-2-2.jpg",
    tags: ["Web Design", "Web Development"],
    year: "2026",
    client: "Dribbble",
    expertise: "Web Design, Web Development",
    duration: "12 February 2026",
    designer: "ThemePure",
    siteUrl: "#",
    about:
      "Since 2004 we have earned more than thirty awards — delivering work that meets the highest standards on every brief.",
    services: [
      "UX/UI Design",
      "App Design",
      "Brand Development",
      "Copywriting",
      "Front-end Development",
      "Shopify Development",
    ],
    metrics: [
      { value: "6%", label: "Increase in conversions" },
      { value: "7%", label: "Increase in website traffic" },
      { value: "4%", label: "Average daily signups" },
      { value: "7%", label: "Increase in conversions" },
    ],
    gallery: [
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-2.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-3.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-4.jpg",
    ],
    nextSlug: "circuit-core",
    nextTitle: "Circuit Core",
    nextMeta: "Research, UX, UI Design",
  },
  {
    slug: "circuit-core",
    title: "Circuit Core",
    image: "/assets/img/project/project-2-3.jpg",
    tags: ["Web Design", "Web Development"],
    year: "2026",
    client: "Dribbble",
    expertise: "Web Design, Web Development",
    duration: "8 March 2026",
    designer: "ThemePure",
    siteUrl: "#",
    about:
      "Since 2004 we have earned more than thirty awards — delivering work that meets the highest standards on every brief.",
    services: [
      "UX/UI Design",
      "App Design",
      "Brand Development",
      "Copywriting",
      "Front-end Development",
      "Shopify Development",
    ],
    metrics: [
      { value: "6%", label: "Increase in conversions" },
      { value: "7%", label: "Increase in website traffic" },
      { value: "4%", label: "Average daily signups" },
      { value: "7%", label: "Increase in conversions" },
    ],
    gallery: [
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-3.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-4.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-5.jpg",
    ],
    nextSlug: "volt-zone",
    nextTitle: "Volt Zone",
    nextMeta: "Research, UX, UI Design",
  },
  {
    slug: "volt-zone",
    title: "Volt Zone",
    image: "/assets/img/project/project-2-4.jpg",
    tags: ["Web Design", "Web Development"],
    year: "2026",
    client: "Dribbble",
    expertise: "Web Design, Web Development",
    duration: "21 April 2026",
    designer: "ThemePure",
    siteUrl: "#",
    about:
      "Since 2004 we have earned more than thirty awards — delivering work that meets the highest standards on every brief.",
    services: [
      "UX/UI Design",
      "App Design",
      "Brand Development",
      "Copywriting",
      "Front-end Development",
      "Shopify Development",
    ],
    metrics: [
      { value: "6%", label: "Increase in conversions" },
      { value: "7%", label: "Increase in website traffic" },
      { value: "4%", label: "Average daily signups" },
      { value: "7%", label: "Increase in conversions" },
    ],
    gallery: [
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-4.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-5.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-1.jpg",
    ],
    nextSlug: "power-nexus",
    nextTitle: "Power Nexus",
    nextMeta: "Research, UX, UI Design",
  },
  {
    slug: "power-nexus",
    title: "Power Nexus",
    image: "/assets/img/project/project-2-5.jpg",
    tags: ["Web Design", "Web Development"],
    year: "2026",
    client: "Dribbble",
    expertise: "Web Design, Web Development",
    duration: "3 January 2026",
    designer: "ThemePure",
    siteUrl: "#",
    about:
      "Since 2004 we have earned more than thirty awards — delivering work that meets the highest standards on every brief.",
    services: [
      "UX/UI Design",
      "App Design",
      "Brand Development",
      "Copywriting",
      "Front-end Development",
      "Shopify Development",
    ],
    metrics: [
      { value: "6%", label: "Increase in conversions" },
      { value: "7%", label: "Increase in website traffic" },
      { value: "4%", label: "Average daily signups" },
      { value: "7%", label: "Increase in conversions" },
    ],
    gallery: [
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-1.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-2.jpg",
      "/assets/img/project/portfolio-details-2/portfolio-details-2-thumb-3.jpg",
    ],
    nextSlug: "electro-hub",
    nextTitle: "Electro Hub",
    nextMeta: "Research, UX, UI Design",
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs() {
  return PROJECTS.map((p) => p.slug);
}
