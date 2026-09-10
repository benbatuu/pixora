/**
 * About page default content (seed + content-layer fallback).
 */

export type AboutStat = {
  value: string;
  suffix: string;
  label: string;
};

export type AboutSolution = {
  num: string;
  title: string;
  body: string;
};

export type AboutTeamMember = {
  name: string;
  role: string;
  image: string;
};

export type AboutAward = {
  index: string;
  name: string;
  org: string;
  year: string;
  icon: string;
};

export type AboutHeroContent = {
  title: string;
  label: string;
  intro: string;
  introAccentWords: string[];
  ctaLabel: string;
  ctaHref: string;
  bannerUrl: string;
  bannerAlt: string;
  lead: string;
  leadAccent: string;
  videoUrl: string;
  approachTitle: string;
  approachBody: string;
  portfolioLabel: string;
  portfolioHref: string;
  solutionsHeading: string;
  teamHeading?: string;
  teamTitle?: string;
  discoverAllLabel?: string;
  awardsHeading?: string;
  awardsTitle?: string;
  solutionsServicesLabel?: string;
  solutionsInfoLabel?: string;
};

export type AboutContent = {
  hero: AboutHeroContent;
  stats: AboutStat[];
  solutions: AboutSolution[];
  team: AboutTeamMember[];
  awards: AboutAward[];
  marquee: { text: string };
};

export const ABOUT_STATS: AboutStat[] = [
  { value: "240", suffix: "+", label: "Clients across the world" },
  { value: "19", suffix: "+", label: "Years of Experience" },
  { value: "236", suffix: "+", label: "Successful projects delivered" },
  { value: "98", suffix: "%", label: "Client satisfaction & retention" },
];

export const ABOUT_SOLUTIONS: AboutSolution[] = [
  {
    num: "01",
    title: "Design",
    body: "Clear, user-centred design crafted to work hand-in-hand with engineering.",
  },
  {
    num: "02",
    title: "Development",
    body: "Dependable front-end and product builds that honour the design and the brief.",
  },
  {
    num: "03",
    title: "Digital advice",
    body: "Practical guidance that helps teams choose the right path before they invest.",
  },
  {
    num: "04",
    title: "Branding",
    body: "Identity systems with presence — memorable, coherent, and ready to scale.",
  },
];

export const ABOUT_TEAM: AboutTeamMember[] = [
  { name: "Halvam Alvida", role: "Founder & CEO", image: "/assets/img/team/team-1.jpg" },
  { name: "Sajran Safina", role: "Creative Director", image: "/assets/img/team/team-2.jpg" },
  { name: "Malhar Morshed", role: "Lead Developer", image: "/assets/img/team/team-3.jpg" },
  { name: "Ravian Rahima", role: "Marketing Strategist", image: "/assets/img/team/team-4.jpg" },
];

export const ABOUT_AWARDS: AboutAward[] = [
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

export const ABOUT_DEFAULTS: AboutContent = {
  hero: {
    title: "About Pixora",
    label: "About us",
    intro:
      "Pixora is a creative studio based in Portugal, Brazil, and London. We think like an agency and produce visuals for brands and partners worldwide.",
    introAccentWords: ["agency", "produce"],
    ctaLabel: "More About Us",
    ctaHref: "/about",
    bannerUrl: "/assets/img/banner/banner-3-1.jpg",
    bannerAlt: "banner-image",
    lead: "Pixora Design Agency delivers",
    leadAccent: "creative, innovative, and tailored design solutions.",
    videoUrl: "/assets/video/step-video.mp4",
    approachTitle:
      "Our approach is simple: we focus on functionality, speed, and clarity — every project serves a clear purpose without unnecessary complexity.",
    approachBody:
      "We start by understanding your needs, then bring ideas to life without the noise. Imaginative concepts become clear digital products — whether a sleek website, a focused app, or a brand identity people remember.",
    portfolioLabel: "Portfolio",
    portfolioHref: "/projects",
    solutionsHeading: "OUR SOLUTIONS",
    teamHeading: "Our Team",
    teamTitle: "Meet the\ntalented team",
    discoverAllLabel: "Discover All",
    awardsHeading: "Awards",
    awardsTitle: "Awards &\nrecognitions.",
    solutionsServicesLabel: "Services",
    solutionsInfoLabel: "Info",
  },
  stats: ABOUT_STATS,
  solutions: ABOUT_SOLUTIONS,
  team: ABOUT_TEAM,
  awards: ABOUT_AWARDS,
  marquee: { text: "a new generation of digital creators" },
};
