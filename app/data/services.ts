/**
 * Services page default content (seed + content-layer fallback).
 */

export type ServiceCard = {
  title: string;
  body: string;
  icon: string;
  viewDetailsLabel?: string;
};

export type ServiceCapsule = {
  label: string;
  bg?: string;
  size?: number;
};

export type ServiceStep = {
  num: string;
  title: string[];
  bodyLines: string[];
  bg: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
  bullets: string[];
};

export type ServiceTestimonial = {
  body: string;
  name: string;
  role: string;
};

export type ServicesHeroContent = {
  titleLine1: string;
  titleAccent: string;
  videoUrl: string;
  shapeUrl: string;
  introTitle: string;
  introBody: string;
  introCtaLabel: string;
  introCtaHref: string;
  capsulesSubtitle: string;
  capsulesTitle: string;
  faqSubtitle: string;
  faqTitle: string;
  brandsHeading?: string;
  testimonialsHeading?: string;
  ctaLabel?: string;
};

export type ServicesStepsMeta = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  stepLabel?: string;
};

export type ServicesContent = {
  hero: ServicesHeroContent;
  marquee: { tags: string[] };
  cards: ServiceCard[];
  viewDetailsLabel?: string;
  capsules: ServiceCapsule[];
  steps: ServiceStep[];
  stepsMeta?: ServicesStepsMeta;
  faqs: ServiceFaq[];
  brands: string[];
  testimonials: ServiceTestimonial[];
};

export const SERVICES_MARQUEE = [
  "We develop & create digital future",
  "Brand systems & motion",
  "We develop & create digital future",
  "Web Design & Development",
];

export const SERVICE_CARDS: ServiceCard[] = [
  {
    title: "Brand Strategy",
    body: "Positioning, narrative, and visual systems that give your brand a lasting edge.",
    icon: "/assets/img/service/icon/icon-1.png",
  },
  {
    title: "Web Development",
    body: "Clean, fast websites and product interfaces built for real users and real growth.",
    icon: "/assets/img/service/icon/icon-2.png",
  },
  {
    title: "UI/UX Design",
    body: "Interfaces that feel effortless — researched, refined, and ready to ship.",
    icon: "/assets/img/service/icon/icon-3.png",
  },
  {
    title: "Digital Marketing",
    body: "Campaigns and content systems that amplify the brand you have worked hard to build.",
    icon: "/assets/img/service/icon/icon-4.png",
  },
];

export const SERVICE_CAPSULES: ServiceCapsule[] = [
  { label: "Development", bg: "#ffbae3", size: 220 },
  { label: "Marketing", bg: "#c6f7c3", size: 220 },
  { label: "E-commerce", bg: "#ffcf68", size: 220 },
  { label: "Marketing", bg: "#d6baff", size: 220 },
  { label: "Branding", bg: "#a9e6ff", size: 160 },
  { label: "SMM", bg: "#ffb3b3", size: 160 },
  { label: "Web Design", bg: "#baffe0", size: 160 },
  { label: "Analysis", bg: "#ffe1a8", size: 160 },
  { label: "Illustration", bg: "#e3baff", size: 160 },
  { label: "SEO", bg: "#ffcba4", size: 160 },
  { label: "UI/UX", bg: "#bad7ff", size: 160 },
];

export const SERVICE_STEPS: ServiceStep[] = [
  {
    num: "01",
    title: ["Discover", "And define"],
    bodyLines: ["We begin with deep", "listening understanding", "your vision"],
    bg: "#ffcf68",
  },
  {
    num: "02",
    title: ["Structure", "and Strategy"],
    bodyLines: ["We analyze insights", "and build a clear", "strategic roadmap"],
    bg: "#e11010",
  },
  {
    num: "03",
    title: ["Design", "and Refine"],
    bodyLines: ["We craft visuals and", "iterate to achieve", "perfection"],
    bg: "#ffbae3",
  },
  {
    num: "04",
    title: ["Deliver", "and Support"],
    bodyLines: ["We launch your product", "and provide ongoing", "support"],
    bg: "#a9e6ff",
  },
];

export const SERVICE_FAQS: ServiceFaq[] = [
  {
    q: "How long does it take to build a website?",
    a: "Timelines depend on the spec of the website project, but here are some guidelines...",
    bullets: [
      "Shopify projects usually take around four weeks.",
      "Craft CMS projects usually take a minimum of five weeks.",
      "Craft Commerce projects usually take a minimum of eight weeks.",
    ],
  },
  {
    q: "Website Development Timeline: What to Expect",
    a: "Timelines depend on the spec of the website project, but here are some guidelines...",
    bullets: [
      "Shopify projects usually take around four weeks.",
      "Craft CMS projects usually take a minimum of five weeks.",
      "Craft Commerce projects usually take a minimum of eight weeks.",
    ],
  },
  {
    q: "How long should building a website really take?",
    a: "Timelines depend on the spec of the website project, but here are some guidelines...",
    bullets: [
      "Shopify projects usually take around four weeks.",
      "Craft CMS projects usually take a minimum of five weeks.",
      "Craft Commerce projects usually take a minimum of eight weeks.",
    ],
  },
  {
    q: "What affects the time it takes to build a website?",
    a: "Timelines depend on the spec of the website project, but here are some guidelines...",
    bullets: [
      "Shopify projects usually take around four weeks.",
      "Craft CMS projects usually take a minimum of five weeks.",
      "Craft Commerce projects usually take a minimum of eight weeks.",
    ],
  },
];

export const SERVICE_BRANDS = [
  "/assets/img/brand/brand-1-1.png",
  "/assets/img/brand/brand-1-2.png",
  "/assets/img/brand/brand-1-3.png",
  "/assets/img/brand/brand-1-4.png",
  "/assets/img/brand/brand-1-5.png",
  "/assets/img/brand/brand-1-6.png",
];

export const SERVICE_TESTIMONIALS: ServiceTestimonial[] = [
  {
    body: "Pixora began as a collaborative workshop and has stayed true to that cross-disciplinary way of thinking ever since — sharp ideas, thoughtful craft.",
    name: "Royal Caribbean",
    role: "Commodity & Marketing Manager",
  },
  {
    body: "Pixora began as a collaborative workshop and has stayed true to that cross-disciplinary way of thinking ever since — sharp ideas, thoughtful craft.",
    name: "Royal Caribbean",
    role: "Commodity & Marketing Manager",
  },
  {
    body: "Pixora began as a collaborative workshop and has stayed true to that cross-disciplinary way of thinking ever since — sharp ideas, thoughtful craft.",
    name: "Royal Caribbean",
    role: "Commodity & Marketing Manager",
  },
  {
    body: "Pixora began as a collaborative workshop and has stayed true to that cross-disciplinary way of thinking ever since — sharp ideas, thoughtful craft.",
    name: "Royal Caribbean",
    role: "Commodity & Marketing Manager",
  },
  {
    body: "Pixora began as a collaborative workshop and has stayed true to that cross-disciplinary way of thinking ever since — sharp ideas, thoughtful craft.",
    name: "Royal Caribbean",
    role: "Commodity & Marketing Manager",
  },
  {
    body: "Pixora began as a collaborative workshop and has stayed true to that cross-disciplinary way of thinking ever since — sharp ideas, thoughtful craft.",
    name: "Royal Caribbean",
    role: "Commodity & Marketing Manager",
  },
];

export const SERVICES_DEFAULTS: ServicesContent = {
  hero: {
    titleLine1: "Shine in\nthe",
    titleAccent: "digital\nworld",
    videoUrl: "/assets/video/banner-4-1.mp4",
    shapeUrl: "/assets/img/shape/shape-1.png",
    introTitle:
      "PASSIONATELY PUSHING THE\nBOUNDARIES OF CREATIVE EXCELLENCE.\nREDEFINING POSSIBILITIES IN THE\nREALMS OF DESIGN.",
    introBody:
      "Our focus is on creating functional, fast, & well-structured websites that meet business goals without unnecessary complexity.",
    introCtaLabel: "Discover more",
    introCtaHref: "/about",
    capsulesSubtitle: "Digital Services",
    capsulesTitle: "We can\nhelp with...",
    faqSubtitle: "Digital Services",
    faqTitle: "The answers\nto your questions.",
  },
  marquee: { tags: SERVICES_MARQUEE },
  cards: SERVICE_CARDS,
  viewDetailsLabel: "View details",
  capsules: SERVICE_CAPSULES,
  steps: SERVICE_STEPS,
  stepsMeta: {
    eyebrow: "Step",
    title: "How we work",
    subtitle: "Crafting unique stories for brands",
    stepLabel: "Step",
  },
  faqs: SERVICE_FAQS,
  brands: SERVICE_BRANDS,
  testimonials: SERVICE_TESTIMONIALS,
};
