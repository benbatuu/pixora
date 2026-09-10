/**
 * Home page default content (seed + content-layer fallback).
 * Admin live CMS must not import these for counts.
 */

export type HomeHeroItem = {
  src: string;
  title: string;
  subtitle: string;
  col: string;
  justify: "start" | "end";
  pad?: string;
};

export type HomeServiceItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type HomeAwardItem = {
  index: string;
  name: string;
  org: string;
  year: string;
  icon: string;
};

export type HomeAboutContent = {
  line1Bold: string;
  line1Accent: string;
  designLabel: string;
  gifUrl: string;
  studioLabel: string;
  aboutCtaLabel: string;
  aboutCtaHref: string;
  fromLabel: string;
};

export type HomeServicesHeader = {
  subtitle: string;
  heading: string;
};

export type HomeAwardsHeader = {
  subtitle: string;
  title: string;
  subtitle2: string;
};

export type HomeFeaturedContent = {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  limit?: number;
};

export type HomeHeroContent = {
  items: HomeHeroItem[];
  defaultActive: number;
  ctaHref: string;
  ctaLabel?: string;
  bottomLeft: string;
  bottomRight: string;
  bottomTagline: string;
};

export type HomeContent = {
  hero: HomeHeroContent;
  marquee: { tags: string[] };
  banner: { src: string; alt: string };
  about: HomeAboutContent;
  services: { header: HomeServicesHeader; items: HomeServiceItem[] };
  featured: HomeFeaturedContent;
  awards: { header: HomeAwardsHeader; items: HomeAwardItem[] };
};

export const HOME_HERO_ITEMS: HomeHeroItem[] = [
  {
    src: "/assets/img/hero/hero-2-1.jpg",
    title: "©Pixora - Video",
    subtitle: "Branding, Digital Studio",
    col: "col-span-6 xl:col-span-2",
    justify: "start",
  },
  {
    src: "/assets/img/hero/hero-2-2.jpg",
    title: "©Pixora - Motion",
    subtitle: "Graphics, Visual Studio",
    col: "col-span-6 xl:col-span-4",
    justify: "start",
    pad: "pl-0 xl:pl-[80px]",
  },
  {
    src: "/assets/img/hero/hero-2-3.jpg",
    title: "©Pixora - Brand",
    subtitle: "Identity, Media Studio",
    col: "col-span-6 xl:col-span-4",
    justify: "end",
    pad: "pr-0 xl:pr-[80px]",
  },
  {
    src: "/assets/img/hero/hero-2-4.jpg",
    title: "©Pixora - Digital",
    subtitle: "Branding, Creative Agency",
    col: "col-span-6 xl:col-span-2",
    justify: "end",
  },
  {
    src: "/assets/img/hero/hero-2-5.jpg",
    title: "©Pixora - Video",
    subtitle: "Production, Design Studio",
    col: "col-span-6 xl:col-span-3",
    justify: "end",
    pad: "pr-0 xl:pr-[85px]",
  },
  {
    src: "/assets/img/hero/hero-2-6.jpg",
    title: "©Pixora - Visual",
    subtitle: "Storytelling, Digital Agency",
    col: "col-span-6 xl:col-span-3",
    justify: "start",
    pad: "pl-0 xl:pl-[105px]",
  },
  {
    src: "/assets/img/hero/hero-2-7.jpg",
    title: "©Pixora - Creative",
    subtitle: "Media, Branding Studio",
    col: "col-span-6 xl:col-span-3",
    justify: "start",
    pad: "pl-0 xl:pl-[100px]",
  },
  {
    src: "/assets/img/hero/hero-2-8.jpg",
    title: "©Pixora - Motion",
    subtitle: "Design, Creative Studio",
    col: "col-span-6 xl:col-span-3",
    justify: "start",
    pad: "pl-0 xl:pl-[100px]",
  },
];

export const HOME_MARQUEE_TAGS = [
  "Brand Identity Design",
  "Motion & storytelling",
  "Branding & Identity",
  "Web Design & Development",
  "UI / UX Design",
  "Complex brand design",
];

export const HOME_SERVICES: HomeServiceItem[] = [
  {
    id: "01",
    title: "Branding",
    description:
      "Distinctive brand systems that set you apart and resonate with the people you serve.",
    image: "/assets/img/service/service-2-1.jpg",
  },
  {
    id: "02",
    title: "Development",
    description:
      "Robust, performant builds engineered to scale with your product and your ambitions.",
    image: "/assets/img/project/project-1.jpg",
  },
  {
    id: "03",
    title: "Design support",
    description:
      "Ongoing design partnership — crisp interfaces, assets, and systems when you need them.",
    image: "/assets/img/project/project-2.jpg",
  },
  {
    id: "04",
    title: "Websites",
    description:
      "Refined digital experiences that look exceptional and convert with quiet confidence.",
    image: "/assets/img/project/project-3.jpg",
  },
];

export const HOME_AWARDS: HomeAwardItem[] = [
  {
    index: "001",
    name: "Best web design agency",
    org: "Web Excellence Awards",
    year: "2023",
    icon: "/assets/img/award/award-1.png",
  },
  {
    index: "002",
    name: "Top digital marketing firm",
    org: "Clutch Top Agencies",
    year: "2022",
    icon: "/assets/img/award/award-2.png",
  },
  {
    index: "003",
    name: "Best web design agency",
    org: "Awwwards Honorable Mention",
    year: "2024",
    icon: "/assets/img/award/award-3.png",
  },
  {
    index: "004",
    name: "Best web design agency",
    org: "CSS Design Awards",
    year: "2025",
    icon: "/assets/img/award/award-1.png",
  },
];

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    items: HOME_HERO_ITEMS,
    defaultActive: 1,
    ctaHref: "/projects",
    bottomLeft: "design",
    bottomRight: "Studio",
    bottomTagline: "©Pixora\nLive in a World\nof creative designs",
  },
  marquee: { tags: HOME_MARQUEE_TAGS },
  banner: { src: "/assets/img/banner/banner-1.jpg", alt: "banner-image" },
  about: {
    line1Bold: "We are",
    line1Accent: "The Creative",
    designLabel: "design",
    gifUrl: "/assets/img/gift-img/title-img.gif",
    studioLabel: "studio",
    aboutCtaLabel: "About\nUs",
    aboutCtaHref: "/about",
    fromLabel: "/ FROM\nTURKIYE",
  },
  services: {
    header: {
      subtitle: "[ Services ]",
      heading: "Solutions That We Deliver",
    },
    items: HOME_SERVICES,
  },
  featured: {
    title: "Featured work",
    viewAllLabel: "View all projects",
    viewAllHref: "/projects",
    limit: 3,
  },
  awards: {
    header: {
      subtitle: "Our achievements",
      title: "Awards.",
      subtitle2: "& Recognitions",
    },
    items: HOME_AWARDS,
  },
};
