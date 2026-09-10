/**
 * Seed Neon from existing stub data (app/data/*).
 * Safe to re-run: upserts by unique keys.
 */
import "dotenv/config";
import {
  PrismaClient,
  PublishStatus,
  NavLocation,
} from "@prisma/client";
import { PROJECTS } from "../app/data/projects";
import { BLOG_POSTS } from "../app/data/blog";
import { SITE_SETTINGS } from "../app/data/site";
import { CONTACT_MESSAGES } from "../app/data/messages";
import {
  CONTACT_SECTION_DEFS,
  HOME_SECTION_DEFS,
  ABOUT_SECTION_DEFS,
  SERVICES_SECTION_DEFS,
  NOT_FOUND_SECTION_DEFS,
  type SectionDef,
} from "../lib/content/section-types";
import type { Prisma } from "@prisma/client";
import { hashPassword } from "../lib/admin/password";

const prisma = new PrismaClient();

async function main() {
  const locale = await prisma.locale.upsert({
    where: { code: "en" },
    update: { name: "English", isDefault: true, isActive: true, sortOrder: 0 },
    create: {
      code: "en",
      name: "English",
      isDefault: true,
      isActive: true,
      sortOrder: 0,
    },
  });

  const localeTr = await prisma.locale.upsert({
    where: { code: "tr" },
    update: { name: "Türkçe", isDefault: false, isActive: true, sortOrder: 1 },
    create: {
      code: "tr",
      name: "Türkçe",
      isDefault: false,
      isActive: true,
      sortOrder: 1,
    },
  });

  const localeRu = await prisma.locale.upsert({
    where: { code: "ru" },
    update: { name: "Русский", isDefault: false, isActive: true, sortOrder: 2 },
    create: {
      code: "ru",
      name: "Русский",
      isDefault: false,
      isActive: true,
      sortOrder: 2,
    },
  });

  await prisma.setting.upsert({
    where: { key: "site" },
    update: { value: SITE_SETTINGS as object },
    create: { key: "site", value: SITE_SETTINGS as object },
  });

  const pageKeys = ["home", "about", "services", "contact", "not-found"] as const;
  for (const key of pageKeys) {
    await prisma.page.upsert({
      where: { key },
      update: { status: PublishStatus.PUBLISHED },
      create: { key, status: PublishStatus.PUBLISHED },
    });
  }

  const CONTACT_TR_PAYLOADS: Record<string, unknown> = {
    hero: { title: "İletişime geç" },
    inquiries: {
      items: [
        { label: "sorgular", email: "contact@pixora.com" },
        {
          label: "Raleigh",
          lines: ["125 N. Harrington Street", "Raleigh, NC 27603", "919-833.6413"],
        },
        {
          label: "Raleigh",
          lines: ["125 N. Harrington Street", "Raleigh, NC 27603", "919-833.6413"],
        },
      ],
    },
    offices: {
      heading: "Birlikte çalışalım",
      offices: [
        {
          city: "Londra",
          lines: ["28 Foubert's Place", "London W1F 7PR"],
          phone: "+44 (0)20 3667 7446",
          email: "london@pixora.com",
        },
        {
          city: "New York",
          lines: ["28 Foubert's Place", "London W1F 7PR"],
          phone: "+44 (0)20 3667 7446",
          email: "london@pixora.com",
        },
        {
          city: "Singapur",
          lines: ["28 Foubert's Place", "London W1F 7PR"],
          phone: "+44 (0)20 3667 7446",
          email: "london@pixora.com",
        },
      ],
    },
    socials: { items: ["LinkedIn", "Instagram", "Twitter"] },
  };

  const CONTACT_RU_PAYLOADS: Record<string, unknown> = {
    hero: { title: "Связаться с нами" },
    inquiries: {
      items: [
        { label: "Запросы", email: "contact@pixora.com" },
        {
          label: "Raleigh",
          lines: ["125 N. Harrington Street", "Raleigh, NC 27603", "919-833.6413"],
        },
        {
          label: "Raleigh",
          lines: ["125 N. Harrington Street", "Raleigh, NC 27603", "919-833.6413"],
        },
      ],
    },
    offices: {
      heading: "Давайте работать вместе",
      offices: [
        {
          city: "Лондон",
          lines: ["28 Foubert's Place", "London W1F 7PR"],
          phone: "+44 (0)20 3667 7446",
          email: "london@pixora.com",
        },
        {
          city: "Нью-Йорк",
          lines: ["28 Foubert's Place", "London W1F 7PR"],
          phone: "+44 (0)20 3667 7446",
          email: "london@pixora.com",
        },
        {
          city: "Сингапур",
          lines: ["28 Foubert's Place", "London W1F 7PR"],
          phone: "+44 (0)20 3667 7446",
          email: "london@pixora.com",
        },
      ],
    },
    socials: { items: ["LinkedIn", "Instagram", "Twitter"] },
  };

  const homeServicesEn = HOME_SECTION_DEFS.find((d) => d.sectionKey === "services")!
    .payload as { subtitle?: string; heading?: string; items: Array<{ id: string; title: string; description: string; image: string }> };
  const homeHeroEn = HOME_SECTION_DEFS.find((d) => d.sectionKey === "hero")!.payload as {
    items: Array<Record<string, unknown>>;
    defaultActive: number;
    ctaHref: string;
    bottomLeft: string;
    bottomRight: string;
    bottomTagline: string;
  };
  const homeAboutEn = HOME_SECTION_DEFS.find((d) => d.sectionKey === "about")!.payload as Record<string, unknown>;
  const homeAwardsEn = HOME_SECTION_DEFS.find((d) => d.sectionKey === "awards")!.payload as {
    subtitle: string;
    title: string;
    subtitle2: string;
    items: Array<Record<string, unknown>>;
  };
  const homeBannerEn = HOME_SECTION_DEFS.find((d) => d.sectionKey === "banner")!.payload as Record<string, unknown>;

  const HOME_TR_OVERRIDES: Record<string, unknown> = {
    featured: {
      title: "Öne çıkan işler",
      viewAllLabel: "Tüm projeler",
      viewAllHref: "/projects",
      limit: 3,
    },
    services: {
      subtitle: "[ Hizmetler ]",
      heading: "Sunduğumuz Çözümler",
      items: homeServicesEn.items,
    },
  };

  const HOME_RU_OVERRIDES: Record<string, unknown> = {
    hero: {
      ...homeHeroEn,
      items: homeHeroEn.items.map((item) => {
        const subtitle = String(item.subtitle ?? "");
        const map: Record<string, string> = {
          "Branding, Digital Studio": "Брендинг, цифровая студия",
          "Graphics, Visual Studio": "Графика, визуальная студия",
          "Identity, Media Studio": "Идентичность, медиастудия",
          "Branding, Creative Agency": "Брендинг, креативное агентство",
          "Production, Design Studio": "Продакшн, дизайн-студия",
          "Storytelling, Digital Agency": "Сторителлинг, digital-агентство",
          "Media, Branding Studio": "Медиа, брендинг-студия",
          "Design, Creative Studio": "Дизайн, креативная студия",
        };
        return { ...item, subtitle: map[subtitle] ?? subtitle };
      }),
      bottomLeft: "дизайн",
      bottomRight: "Студия",
      bottomTagline: "©Pixora\nЖивите в мире\nкреативного дизайна",
    },
    marquee: {
      tags: [
        "Фирменный стиль",
        "Моушн и сторителлинг",
        "Брендинг и идентичность",
        "Веб-дизайн и разработка",
        "UI / UX дизайн",
        "Комплексный бренд-дизайн",
      ],
    },
    banner: {
      ...homeBannerEn,
      alt: "Баннер студии Pixora",
    },
    about: {
      ...homeAboutEn,
      line1Bold: "Мы —",
      line1Accent: "креативная",
      designLabel: "дизайн",
      studioLabel: "студия",
      aboutCtaLabel: "О\nнас",
      fromLabel: "/ ИЗ\nТУРЦИИ",
    },
    services: {
      subtitle: "[ Услуги ]",
      heading: "Решения, которые мы создаём",
      items: [
        {
          id: "01",
          title: "Брендинг",
          description:
            "Выразительные бренд-системы, которые выделяют вас и находят отклик у аудитории.",
          image: "/assets/img/service/service-2-1.jpg",
        },
        {
          id: "02",
          title: "Разработка",
          description:
            "Надёжные и быстрые продукты, готовые расти вместе с вашим бизнесом.",
          image: "/assets/img/project/project-1.jpg",
        },
        {
          id: "03",
          title: "Дизайн-поддержка",
          description:
            "Постоянное партнёрство по дизайну — интерфейсы, ассеты и системы, когда они нужны.",
          image: "/assets/img/project/project-2.jpg",
        },
        {
          id: "04",
          title: "Сайты",
          description:
            "Выверенный digital-опыт, который выглядит безупречно и уверенно конвертирует.",
          image: "/assets/img/project/project-3.jpg",
        },
      ],
    },
    featured: {
      title: "Избранные работы",
      viewAllLabel: "Все проекты",
      viewAllHref: "/projects",
      limit: 3,
    },
    awards: {
      subtitle: "Наши достижения",
      title: "Награды.",
      subtitle2: "и признание",
      items: homeAwardsEn.items.map((item) => {
        const name = String(item.name ?? "");
        const nameMap: Record<string, string> = {
          "Best web design agency": "Лучшее веб-дизайн агентство",
          "Top digital marketing firm": "Топ digital-маркетинг агентство",
        };
        return { ...item, name: nameMap[name] ?? name };
      }),
    },
  };

  const aboutHeroEn = ABOUT_SECTION_DEFS.find((d) => d.sectionKey === "hero")!.payload as Record<string, unknown>;
  const aboutTeamEn = ABOUT_SECTION_DEFS.find((d) => d.sectionKey === "team")!.payload as { heading?: string; items: Array<Record<string, unknown>> };
  const aboutAwardsEn = ABOUT_SECTION_DEFS.find((d) => d.sectionKey === "awards")!.payload as { heading?: string; items: Array<Record<string, unknown>> };

  const ABOUT_TR_OVERRIDES: Record<string, unknown> = {
    hero: {
      ...aboutHeroEn,
      title: "Pixora hakkında",
      label: "Hakkımızda",
      ctaLabel: "Daha fazla",
      portfolioLabel: "Portföy",
      solutionsHeading: "ÇÖZÜMLERİMİZ",
      teamHeading: "Ekibimiz",
      teamTitle: "Yetenekli\nekibimiz",
      discoverAllLabel: "Tümünü keşfet",
      awardsHeading: "Ödüller",
      awardsTitle: "Ödüller &\ntanımalar.",
      solutionsServicesLabel: "Hizmetler",
      solutionsInfoLabel: "Bilgi",
    },
    team: {
      heading: "Ekibimiz",
      items: aboutTeamEn.items,
    },
    awards: {
      heading: "Ödüller",
      items: aboutAwardsEn.items,
    },
    marquee: { text: "yeni nesil dijital yaratıcılar" },
  };

  const ABOUT_RU_OVERRIDES: Record<string, unknown> = {
    hero: {
      ...aboutHeroEn,
      title: "О Pixora",
      label: "О нас",
      intro:
        "Pixora — креативная студия с базами в Португалии, Бразилии и Лондоне. Мы мыслим как агентство и создаём визуальный язык для брендов и партнёров по всему миру.",
      introAccentWords: ["агентство", "создаём"],
      ctaLabel: "Подробнее о нас",
      bannerAlt: "Баннер студии Pixora",
      lead: "Дизайн-агентство Pixora создаёт",
      leadAccent: "креативные, точные и адаптивные решения.",
      approachTitle:
        "Наш подход прост: функциональность, скорость и ясность — каждый проект служит понятной цели без лишней сложности.",
      approachBody:
        "Мы начинаем с понимания ваших задач и воплощаем идеи без шума. Смелые концепции становятся ясными digital-продуктами — будь то изящный сайт, точное приложение или бренд, который запоминают.",
      portfolioLabel: "Портфолио",
      solutionsHeading: "НАШИ РЕШЕНИЯ",
      teamHeading: "Команда",
      teamTitle: "Талантливая\nкоманда",
      discoverAllLabel: "Смотреть всех",
      awardsHeading: "Награды",
      awardsTitle: "Награды и\nпризнание.",
      solutionsServicesLabel: "Услуги",
      solutionsInfoLabel: "Инфо",
    },
    stats: {
      items: [
        { value: "240", suffix: "+", label: "Клиентов по всему миру" },
        { value: "19", suffix: "+", label: "Лет опыта" },
        { value: "236", suffix: "+", label: "Успешно реализованных проектов" },
        { value: "98", suffix: "%", label: "Удовлетворённость и удержание клиентов" },
      ],
    },
    marquee: { text: "новое поколение цифровых создателей" },
    solutions: {
      heading: "НАШИ РЕШЕНИЯ",
      items: [
        {
          num: "01",
          title: "Дизайн",
          body: "Ясный, ориентированный на пользователя дизайн, созданный в связке с разработкой.",
        },
        {
          num: "02",
          title: "Разработка",
          body: "Надёжная front-end и продуктовая разработка, которая уважает дизайн и бриф.",
        },
        {
          num: "03",
          title: "Digital-консалтинг",
          body: "Практичные рекомендации, которые помогают выбрать верный путь до крупных вложений.",
        },
        {
          num: "04",
          title: "Брендинг",
          body: "Системы идентичности с характером — запоминаемые, цельные и готовые к росту.",
        },
      ],
    },
    team: {
      heading: "Команда",
      items: aboutTeamEn.items.map((m) => {
        const role = String(m.role ?? "");
        const roleMap: Record<string, string> = {
          "Founder & CEO": "Основатель и CEO",
          "Creative Director": "Креативный директор",
          "Lead Developer": "Ведущий разработчик",
          "Marketing Strategist": "Маркетинг-стратег",
        };
        return { ...m, role: roleMap[role] ?? role };
      }),
    },
    awards: {
      heading: "Награды",
      items: aboutAwardsEn.items.map((item) => {
        const name = String(item.name ?? "");
        const nameMap: Record<string, string> = {
          "Best web design agency": "Лучшее веб-дизайн агентство",
          "Top digital marketing firm": "Топ digital-маркетинг агентство",
        };
        return { ...item, name: nameMap[name] ?? name };
      }),
    },
  };

  const servicesHeroEn = SERVICES_SECTION_DEFS.find((d) => d.sectionKey === "hero")!.payload as Record<string, unknown>;
  const servicesCapsulesEn = SERVICES_SECTION_DEFS.find((d) => d.sectionKey === "capsules")!.payload as {
    subtitle?: string;
    title?: string;
    items: Array<Record<string, unknown>>;
  };
  const servicesTestimonialsEn = SERVICES_SECTION_DEFS.find((d) => d.sectionKey === "testimonials")!.payload as {
    items: Array<Record<string, unknown>>;
  };
  const servicesBrandsEn = SERVICES_SECTION_DEFS.find((d) => d.sectionKey === "brands")!.payload as Record<string, unknown>;

  const SERVICES_TR_OVERRIDES: Record<string, unknown> = {
    hero: {
      ...servicesHeroEn,
      titleLine1: "Dijital dünyada",
      titleAccent: "parlayın",
      introCtaLabel: "Keşfet",
      capsulesSubtitle: "Dijital Hizmetler",
      capsulesTitle: "Yardım edebileceğimiz konular...",
      faqSubtitle: "Dijital Hizmetler",
      faqTitle: "Sorularınızın cevapları.",
    },
    cards: {
      viewDetailsLabel: "Detayları gör",
      items: (SERVICES_SECTION_DEFS.find((d) => d.sectionKey === "cards")!.payload as { items: unknown[] }).items,
    },
    steps: {
      stepsEyebrow: "Adım",
      stepsTitle: "Nasıl çalışıyoruz",
      stepsSubtitle: "Markalar için özgün hikâyeler yaratıyoruz",
      stepLabel: "Adım",
      items: (SERVICES_SECTION_DEFS.find((d) => d.sectionKey === "steps")!.payload as { items: unknown[] }).items,
    },
  };

  const SERVICES_RU_OVERRIDES: Record<string, unknown> = {
    hero: {
      ...servicesHeroEn,
      titleLine1: "Сияйте в\n",
      titleAccent: "цифровом\nмире",
      introTitle:
        "МЫ СТРАСТНО РАСШИРЯЕМ\nГРАНИЦЫ КРЕАТИВНОГО МАСТЕРСТВА.\nПЕРЕОПРЕДЕЛЯЕМ ВОЗМОЖНОСТИ\nВ МИРЕ ДИЗАЙНА.",
      introBody:
        "Мы создаём функциональные, быстрые и продуманные сайты, которые служат бизнес-целям — без лишней сложности.",
      introCtaLabel: "Узнать больше",
      capsulesSubtitle: "Digital-услуги",
      capsulesTitle: "Мы можем\nпомочь с…",
      faqSubtitle: "Digital-услуги",
      faqTitle: "Ответы\nна ваши вопросы.",
    },
    marquee: {
      tags: [
        "Мы создаём цифровое будущее",
        "Бренд-системы и моушн",
        "Мы создаём цифровое будущее",
        "Веб-дизайн и разработка",
      ],
    },
    cards: {
      viewDetailsLabel: "Подробнее",
      items: [
        {
          title: "Бренд-стратегия",
          body: "Позиционирование, нарратив и визуальные системы, которые дают бренду устойчивое преимущество.",
          icon: "/assets/img/service/icon/icon-1.png",
        },
        {
          title: "Веб-разработка",
          body: "Чистые и быстрые сайты и интерфейсы, созданные для реальных пользователей и роста.",
          icon: "/assets/img/service/icon/icon-2.png",
        },
        {
          title: "UI/UX дизайн",
          body: "Интерфейсы, которые ощущаются лёгкими — исследованные, выверенные и готовые к запуску.",
          icon: "/assets/img/service/icon/icon-3.png",
        },
        {
          title: "Digital-маркетинг",
          body: "Кампании и контент-системы, которые усиливают бренд, который вы уже построили.",
          icon: "/assets/img/service/icon/icon-4.png",
        },
      ],
    },
    capsules: {
      subtitle: "Digital-услуги",
      title: "Мы можем\nпомочь с…",
      items: servicesCapsulesEn.items.map((c) => {
        const label = String(c.label ?? "");
        const map: Record<string, string> = {
          Development: "Разработка",
          Marketing: "Маркетинг",
          "E-commerce": "E-commerce",
          Branding: "Брендинг",
          SMM: "SMM",
          "Web Design": "Веб-дизайн",
          Analysis: "Аналитика",
          Illustration: "Иллюстрация",
          SEO: "SEO",
          "UI/UX": "UI/UX",
        };
        return { ...c, label: map[label] ?? label };
      }),
    },
    testimonials: {
      items: servicesTestimonialsEn.items.map((t) => ({
        ...t,
        body: "Pixora начиналась как совместная мастерская и с тех пор сохраняет междисциплинарный подход — острые идеи и вдумчивый крафт.",
        role: "Менеджер по продуктам и маркетингу",
      })),
    },
    brands: servicesBrandsEn,
    steps: {
      stepsEyebrow: "Шаг",
      stepsTitle: "Как мы работаем",
      stepsSubtitle: "Создаём уникальные истории для брендов",
      stepLabel: "Шаг",
      items: [
        {
          num: "01",
          title: ["Исследуем", "и определяем"],
          bodyLines: ["Начинаем с глубокого", "слушания и понимания", "вашего видения"],
          bg: "#ffcf68",
        },
        {
          num: "02",
          title: ["Структура", "и стратегия"],
          bodyLines: ["Анализируем инсайты", "и строим ясный", "стратегический план"],
          bg: "#e11010",
        },
        {
          num: "03",
          title: ["Дизайн", "и уточнение"],
          bodyLines: ["Создаём визуал", "и итерируем до", "идеального результата"],
          bg: "#ffbae3",
        },
        {
          num: "04",
          title: ["Запуск", "и поддержка"],
          bodyLines: ["Выводим продукт", "и обеспечиваем", "постоянную поддержку"],
          bg: "#a9e6ff",
        },
      ],
    },
    faq: {
      subtitle: "Digital-услуги",
      title: "Ответы\nна ваши вопросы.",
      items: [
        {
          q: "Сколько времени занимает создание сайта?",
          a: "Сроки зависят от объёма проекта — ориентиры такие:",
          bullets: [
            "Проекты на Shopify обычно занимают около четырёх недель.",
            "Проекты на Craft CMS — минимум пять недель.",
            "Проекты на Craft Commerce — минимум восемь недель.",
          ],
        },
        {
          q: "Сроки разработки сайта: чего ожидать",
          a: "Сроки зависят от объёма проекта — ориентиры такие:",
          bullets: [
            "Проекты на Shopify обычно занимают около четырёх недель.",
            "Проекты на Craft CMS — минимум пять недель.",
            "Проекты на Craft Commerce — минимум восемь недель.",
          ],
        },
        {
          q: "Сколько реально должно занимать создание сайта?",
          a: "Сроки зависят от объёма проекта — ориентиры такие:",
          bullets: [
            "Проекты на Shopify обычно занимают около четырёх недель.",
            "Проекты на Craft CMS — минимум пять недель.",
            "Проекты на Craft Commerce — минимум восемь недель.",
          ],
        },
        {
          q: "Что влияет на сроки создания сайта?",
          a: "Сроки зависят от объёма проекта — ориентиры такие:",
          bullets: [
            "Проекты на Shopify обычно занимают около четырёх недель.",
            "Проекты на Craft CMS — минимум пять недель.",
            "Проекты на Craft Commerce — минимум восемь недель.",
          ],
        },
      ],
    },
  };

  const NOT_FOUND_TR_OVERRIDES: Record<string, unknown> = {
    hero: {
      ...(NOT_FOUND_SECTION_DEFS.find((d) => d.sectionKey === "hero")!.payload as object),
      code: "404",
      title: "Sayfa bulunamadı",
      description:
        "Aradığınız sayfa mevcut değil veya taşınmış olabilir.",
      ctaLabel: "Ana sayfaya dön",
      ctaHref: "/",
      secondaryCtaLabel: "İletişim",
      secondaryCtaHref: "/contact",
      background: "light",
      align: "center",
      showCode: true,
    },
    links: {
      links: [
        { label: "Ana sayfa", href: "/" },
        { label: "Hakkımızda", href: "/about" },
        { label: "Hizmetler", href: "/services" },
        { label: "Projeler", href: "/projects" },
        { label: "İletişim", href: "/contact" },
      ],
    },
  };

  const NOT_FOUND_RU_OVERRIDES: Record<string, unknown> = {
    hero: {
      ...(NOT_FOUND_SECTION_DEFS.find((d) => d.sectionKey === "hero")!.payload as object),
      code: "404",
      title: "Страница не найдена",
      description:
        "Запрашиваемой страницы не существует или она была перемещена.",
      ctaLabel: "На главную",
      ctaHref: "/",
      secondaryCtaLabel: "Связаться с нами",
      secondaryCtaHref: "/contact",
      background: "light",
      align: "center",
      showCode: true,
    },
    links: {
      links: [
        { label: "Главная", href: "/" },
        { label: "О нас", href: "/about" },
        { label: "Услуги", href: "/services" },
        { label: "Проекты", href: "/projects" },
        { label: "Контакты", href: "/contact" },
      ],
    },
  };

  async function seedPageSections(
    pageKey: string,
    defs: SectionDef[],
    enLocaleId: string,
    trLocaleId: string,
    trOverrides: Record<string, unknown> = {},
    ruLocaleId?: string,
    ruOverrides: Record<string, unknown> = {},
  ) {
    const page = await prisma.page.findUnique({ where: { key: pageKey } });
    if (!page) return;
    for (const def of defs) {
      const section = await prisma.pageSection.upsert({
        where: {
          pageId_sectionKey: {
            pageId: page.id,
            sectionKey: def.sectionKey,
          },
        },
        update: {
          type: def.type,
          sortOrder: def.sortOrder,
        },
        create: {
          pageId: page.id,
          sectionKey: def.sectionKey,
          type: def.type,
          sortOrder: def.sortOrder,
        },
      });
      await prisma.pageSectionTranslation.upsert({
        where: {
          sectionId_localeId: {
            sectionId: section.id,
            localeId: enLocaleId,
          },
        },
        update: { payload: def.payload as Prisma.InputJsonValue },
        create: {
          sectionId: section.id,
          localeId: enLocaleId,
          payload: def.payload as Prisma.InputJsonValue,
        },
      });
      const trPayload = trOverrides[def.sectionKey] ?? def.payload;
      await prisma.pageSectionTranslation.upsert({
        where: {
          sectionId_localeId: {
            sectionId: section.id,
            localeId: trLocaleId,
          },
        },
        update: { payload: trPayload as Prisma.InputJsonValue },
        create: {
          sectionId: section.id,
          localeId: trLocaleId,
          payload: trPayload as Prisma.InputJsonValue,
        },
      });
      if (ruLocaleId) {
        const ruPayload = ruOverrides[def.sectionKey] ?? def.payload;
        await prisma.pageSectionTranslation.upsert({
          where: {
            sectionId_localeId: {
              sectionId: section.id,
              localeId: ruLocaleId,
            },
          },
          update: { payload: ruPayload as Prisma.InputJsonValue },
          create: {
            sectionId: section.id,
            localeId: ruLocaleId,
            payload: ruPayload as Prisma.InputJsonValue,
          },
        });
      }
    }
  }

  await seedPageSections(
    "contact",
    CONTACT_SECTION_DEFS,
    locale.id,
    localeTr.id,
    CONTACT_TR_PAYLOADS,
    localeRu.id,
    CONTACT_RU_PAYLOADS,
  );
  await seedPageSections(
    "home",
    HOME_SECTION_DEFS,
    locale.id,
    localeTr.id,
    HOME_TR_OVERRIDES,
    localeRu.id,
    HOME_RU_OVERRIDES,
  );
  await seedPageSections(
    "about",
    ABOUT_SECTION_DEFS,
    locale.id,
    localeTr.id,
    ABOUT_TR_OVERRIDES,
    localeRu.id,
    ABOUT_RU_OVERRIDES,
  );
  await seedPageSections(
    "services",
    SERVICES_SECTION_DEFS,
    locale.id,
    localeTr.id,
    SERVICES_TR_OVERRIDES,
    localeRu.id,
    SERVICES_RU_OVERRIDES,
  );
  await seedPageSections(
    "not-found",
    NOT_FOUND_SECTION_DEFS,
    locale.id,
    localeTr.id,
    NOT_FOUND_TR_OVERRIDES,
    localeRu.id,
    NOT_FOUND_RU_OVERRIDES,
  );


  const PROJECT_TR: Record<
    string,
    {
      title: string;
      about: string;
      expertise: string;
      duration: string;
      services: string[];
      metrics: { value: string; label: string }[];
      nextTitle: string;
      nextMeta: string;
    }
  > = {
    "electro-hub": {
      title: "Electro Hub",
      about:
        "2004’ten bu yana otuzdan fazla ödül kazandık — her brifte yüksek standartta iş teslim ediyoruz.",
      expertise: "Web Tasarım, Web Geliştirme",
      duration: "3 Ocak 2026",
      services: [
        "UX/UI Tasarım",
        "Uygulama Tasarımı",
        "Marka Geliştirme",
        "Metin Yazarlığı",
        "Front-end Geliştirme",
        "Shopify Geliştirme",
      ],
      metrics: [
        { value: "6%", label: "Dönüşüm artışı" },
        { value: "7%", label: "Site trafiği artışı" },
        { value: "4%", label: "Günlük ortalama kayıt" },
        { value: "7%", label: "Dönüşüm artışı" },
      ],
      nextTitle: "Energy Grid",
      nextMeta: "Araştırma, UX, UI Tasarım",
    },
    "energy-grid": {
      title: "Energy Grid",
      about:
        "2004’ten bu yana otuzdan fazla ödül kazandık — her brifte yüksek standartta iş teslim ediyoruz.",
      expertise: "Web Tasarım, Web Geliştirme",
      duration: "12 Şubat 2026",
      services: [
        "UX/UI Tasarım",
        "Uygulama Tasarımı",
        "Marka Geliştirme",
        "Metin Yazarlığı",
        "Front-end Geliştirme",
        "Shopify Geliştirme",
      ],
      metrics: [
        { value: "6%", label: "Dönüşüm artışı" },
        { value: "7%", label: "Site trafiği artışı" },
        { value: "4%", label: "Günlük ortalama kayıt" },
        { value: "7%", label: "Dönüşüm artışı" },
      ],
      nextTitle: "Circuit Core",
      nextMeta: "Araştırma, UX, UI Tasarım",
    },
    "circuit-core": {
      title: "Circuit Core",
      about:
        "2004’ten bu yana otuzdan fazla ödül kazandık — her brifte yüksek standartta iş teslim ediyoruz.",
      expertise: "Web Tasarım, Web Geliştirme",
      duration: "8 Mart 2026",
      services: [
        "UX/UI Tasarım",
        "Uygulama Tasarımı",
        "Marka Geliştirme",
        "Metin Yazarlığı",
        "Front-end Geliştirme",
        "Shopify Geliştirme",
      ],
      metrics: [
        { value: "6%", label: "Dönüşüm artışı" },
        { value: "7%", label: "Site trafiği artışı" },
        { value: "4%", label: "Günlük ortalama kayıt" },
        { value: "7%", label: "Dönüşüm artışı" },
      ],
      nextTitle: "Volt Zone",
      nextMeta: "Araştırma, UX, UI Tasarım",
    },
    "volt-zone": {
      title: "Volt Zone",
      about:
        "2004’ten bu yana otuzdan fazla ödül kazandık — her brifte yüksek standartta iş teslim ediyoruz.",
      expertise: "Web Tasarım, Web Geliştirme",
      duration: "21 Nisan 2026",
      services: [
        "UX/UI Tasarım",
        "Uygulama Tasarımı",
        "Marka Geliştirme",
        "Metin Yazarlığı",
        "Front-end Geliştirme",
        "Shopify Geliştirme",
      ],
      metrics: [
        { value: "6%", label: "Dönüşüm artışı" },
        { value: "7%", label: "Site trafiği artışı" },
        { value: "4%", label: "Günlük ortalama kayıt" },
        { value: "7%", label: "Dönüşüm artışı" },
      ],
      nextTitle: "Power Nexus",
      nextMeta: "Araştırma, UX, UI Tasarım",
    },
    "power-nexus": {
      title: "Power Nexus",
      about:
        "2004’ten bu yana otuzdan fazla ödül kazandık — her brifte yüksek standartta iş teslim ediyoruz.",
      expertise: "Web Tasarım, Web Geliştirme",
      duration: "3 Ocak 2026",
      services: [
        "UX/UI Tasarım",
        "Uygulama Tasarımı",
        "Marka Geliştirme",
        "Metin Yazarlığı",
        "Front-end Geliştirme",
        "Shopify Geliştirme",
      ],
      metrics: [
        { value: "6%", label: "Dönüşüm artışı" },
        { value: "7%", label: "Site trafiği artışı" },
        { value: "4%", label: "Günlük ortalama kayıt" },
        { value: "7%", label: "Dönüşüm artışı" },
      ],
      nextTitle: "Electro Hub",
      nextMeta: "Araştırma, UX, UI Tasarım",
    },
  };

  const POST_BODY_EN: Record<string, string> = {
    "keep-goals-in-sight": `## Using a Query

We love to bring designs to life as a developer, and we aim to do this using whatever front-end tools are necessary. Preferred tools lean toward modern libraries like React — but we pick what fits the brief.

There are several reasons a business would consider a rebrand, and it does not necessarily mean the business has been unsuccessful.

## The Spark of an Idea

Vision keeps creative teams aligned. Map the outcome first, then choose the stack, motion language, and content system that support it.

> Success is the result of perfection, hard work, learning from failure, loyalty, and persistence.

## Practical notes

- Prefer clarity over novelty when shipping
- Keep goals visible in every critique
- Document decisions so the next sprint starts faster
`,
    "always-remember-your-goals": `## Stay aligned

Vision and persistence keep creative teams aligned through every sprint. Write the goal on the wall — then design toward it.

## Rituals that help

1. Kickoff with a one-line success metric
2. Mid-sprint check against the same metric
3. Ship notes that mention what moved the needle
`,
    "never-lose-purpose": `## Purpose-led design

Purpose-led design creates brands that feel intentional and memorable. Start with the why, then shape the identity system.

Brand, product, and content should share one narrative spine.
`,
    "vision-drives-action": `## From vision to ship

Clear vision turns ambitious ideas into shippable digital products. Break the vision into milestones the team can actually deliver.
`,
    "fueling-ambition": `## Systems for ambition

Ambition needs systems — UX patterns that keep users moving forward. Remove friction, reward progress, measure what matters.
`,
    "creative-process-notes": `## Behind the scenes

A look inside how Pixora shapes concepts into polished experiences — research, critique, craft, and launch.
`,
  };

  const POST_TR: Record<string, { title: string; excerpt: string; body: string }> = {
    "keep-goals-in-sight": {
      title: "Hedefleri göz önünde tutun",
      excerpt:
        "Tasarımları kodda hayata geçirmeyi seviyoruz — ve işe gerçekten yarayan front-end araçlarını seçiyoruz.",
      body: `## Sorgunun gücü

Tasarımları geliştirici olarak hayata geçirmeyi seviyoruz. Modern araçlar (ör. React) tercih edilse de briefe en uygun olanı seçeriz.

Bir işin yeniden markalaşmayı düşünmesinin birçok nedeni vardır; bu, başarısız olduğu anlamına gelmez.

## Fikrin kıvılcımı

Vizyon, ekipleri aynı ritimde tutar. Önce sonucu netleştirin; sonra stack, motion dili ve içerik sistemini ona göre seçin.

> Başarı; mükemmellik, sıkı çalışma, başarısızlıktan öğrenme, sadakat ve sebatın sonucudur.
`,
    },
    "always-remember-your-goals": {
      title: "Hedeflerinizi her zaman hatırlayın",
      excerpt:
        "Net vizyon ve sebat, yaratıcı ekipleri her sprintte aynı hizada tutar.",
      body: `## Hizada kalın

Vizyon ve sebat, yaratıcı ekipleri her sprintte aynı ritimde tutar. Hedefi görünür kılın — sonra ona doğru tasarlayın.
`,
    },
    "never-lose-purpose": {
      title: "Amacı kaybetmeyin",
      excerpt:
        "Amaca dayalı tasarım, bilinçli ve akılda kalıcı markalar yaratır.",
      body: `## Amaca dayalı tasarım

Önce nedeni netleştirin; sonra kimlik sistemini şekillendirin. Marka, ürün ve içerik aynı anlatı omurgasını paylaşmalı.
`,
    },
    "vision-drives-action": {
      title: "Vizyon eylemi doğurur",
      excerpt:
        "Net vizyon, cesur fikirleri yayınlanabilir dijital ürünlere dönüştürür.",
      body: `## Vizyondan yayına

Vizyonu ekibin gerçekten teslim edebileceği kilometre taşlarına bölün.
`,
    },
    "fueling-ambition": {
      title: "Hırsı beslemek ve hedeflere ulaşmak",
      excerpt:
        "Hırsın sistemlere ihtiyacı vardır — kullanıcıyı ileri taşıyan UX kalıpları.",
      body: `## Hırs için sistemler

Sürtünmeyi azaltın, ilerlemeyi ödüllendirin, önemli olanı ölçün.
`,
    },
    "creative-process-notes": {
      title: "Yaratıcı süreçlerin perde arkası",
      excerpt:
        "Pixora’nın kavramları cilalı deneyimlere nasıl dönüştürdüğüne içeriden bir bakış.",
      body: `## Perde arkası

Araştırma, eleştiri, zanaat ve lansman — kavramdan cilalı deneyime.
`,
    },
  };

  const POST_RU_BODY: Record<string, string> = {
    "keep-goals-in-sight": `## Используя запрос

Мы любим оживлять дизайн в коде — и выбираем те front-end инструменты, которые действительно нужны задаче.

## Искра идеи

Видение держит команды в одном ритме. Сначала зафиксируйте результат, затем выбирайте стек и систему контента.

> Успех — это результат совершенства, усердной работы, обучения на ошибках, лояльности и настойчивости.
`,
    "always-remember-your-goals": `## Оставайтесь в фокусе

Ясное видение и настойчивость держат креативные команды в одном ритме на каждом спринте.
`,
    "never-lose-purpose": `## Дизайн со смыслом

Начните с «зачем», затем выстраивайте систему идентичности.
`,
    "vision-drives-action": `## От видения к релизу

Чёткое видение превращает смелые идеи в digital-продукты, которые можно выпустить.
`,
    "fueling-ambition": `## Системы для амбиций

Амбициям нужны системы — UX-паттерны, которые ведут пользователя вперёд.
`,
    "creative-process-notes": `## За кулисами

Как Pixora превращает концепции в отточенные впечатления.
`,
  };


  const PROJECT_RU: Record<
    string,
    {
      title: string;
      about: string;
      expertise: string;
      duration: string;
      services: string[];
      metrics: { value: string; label: string }[];
      nextTitle: string;
      nextMeta: string;
    }
  > = {
    "electro-hub": {
      title: "Electro Hub",
      about:
        "С 2004 года мы получили более тридцати наград — каждый проект доводим до высокого стандарта качества.",
      expertise: "Веб-дизайн, веб-разработка",
      duration: "3 января 2026",
      services: [
        "UX/UI дизайн",
        "Дизайн приложений",
        "Развитие бренда",
        "Копирайтинг",
        "Front-end разработка",
        "Разработка на Shopify",
      ],
      metrics: [
        { value: "6%", label: "Рост конверсий" },
        { value: "7%", label: "Рост трафика сайта" },
        { value: "4%", label: "Средние регистрации в день" },
        { value: "7%", label: "Рост конверсий" },
      ],
      nextTitle: "Energy Grid",
      nextMeta: "Исследование, UX, UI дизайн",
    },
    "energy-grid": {
      title: "Energy Grid",
      about:
        "С 2004 года мы получили более тридцати наград — каждый проект доводим до высокого стандарта качества.",
      expertise: "Веб-дизайн, веб-разработка",
      duration: "12 февраля 2026",
      services: [
        "UX/UI дизайн",
        "Дизайн приложений",
        "Развитие бренда",
        "Копирайтинг",
        "Front-end разработка",
        "Разработка на Shopify",
      ],
      metrics: [
        { value: "6%", label: "Рост конверсий" },
        { value: "7%", label: "Рост трафика сайта" },
        { value: "4%", label: "Средние регистрации в день" },
        { value: "7%", label: "Рост конверсий" },
      ],
      nextTitle: "Circuit Core",
      nextMeta: "Исследование, UX, UI дизайн",
    },
    "circuit-core": {
      title: "Circuit Core",
      about:
        "С 2004 года мы получили более тридцати наград — каждый проект доводим до высокого стандарта качества.",
      expertise: "Веб-дизайн, веб-разработка",
      duration: "8 марта 2026",
      services: [
        "UX/UI дизайн",
        "Дизайн приложений",
        "Развитие бренда",
        "Копирайтинг",
        "Front-end разработка",
        "Разработка на Shopify",
      ],
      metrics: [
        { value: "6%", label: "Рост конверсий" },
        { value: "7%", label: "Рост трафика сайта" },
        { value: "4%", label: "Средние регистрации в день" },
        { value: "7%", label: "Рост конверсий" },
      ],
      nextTitle: "Volt Zone",
      nextMeta: "Исследование, UX, UI дизайн",
    },
    "volt-zone": {
      title: "Volt Zone",
      about:
        "С 2004 года мы получили более тридцати наград — каждый проект доводим до высокого стандарта качества.",
      expertise: "Веб-дизайн, веб-разработка",
      duration: "21 апреля 2026",
      services: [
        "UX/UI дизайн",
        "Дизайн приложений",
        "Развитие бренда",
        "Копирайтинг",
        "Front-end разработка",
        "Разработка на Shopify",
      ],
      metrics: [
        { value: "6%", label: "Рост конверсий" },
        { value: "7%", label: "Рост трафика сайта" },
        { value: "4%", label: "Средние регистрации в день" },
        { value: "7%", label: "Рост конверсий" },
      ],
      nextTitle: "Power Nexus",
      nextMeta: "Исследование, UX, UI дизайн",
    },
    "power-nexus": {
      title: "Power Nexus",
      about:
        "С 2004 года мы получили более тридцати наград — каждый проект доводим до высокого стандарта качества.",
      expertise: "Веб-дизайн, веб-разработка",
      duration: "3 января 2026",
      services: [
        "UX/UI дизайн",
        "Дизайн приложений",
        "Развитие бренда",
        "Копирайтинг",
        "Front-end разработка",
        "Разработка на Shopify",
      ],
      metrics: [
        { value: "6%", label: "Рост конверсий" },
        { value: "7%", label: "Рост трафика сайта" },
        { value: "4%", label: "Средние регистрации в день" },
        { value: "7%", label: "Рост конверсий" },
      ],
      nextTitle: "Electro Hub",
      nextMeta: "Исследование, UX, UI дизайн",
    },
  };

  const POST_RU: Record<string, { title: string; excerpt: string }> = {
    "keep-goals-in-sight": {
      title: "Держите цели в поле зрения",
      excerpt:
        "Мы любим оживлять дизайн в коде — и выбираем те front-end инструменты, которые действительно нужны задаче.",
    },
    "always-remember-your-goals": {
      title: "Всегда помните о своих целях",
      excerpt:
        "Ясное видение и настойчивость держат креативные команды в одном ритме на каждом спринте.",
    },
    "never-lose-purpose": {
      title: "Не теряйте смысл",
      excerpt:
        "Дизайн, основанный на цели, создаёт бренды, которые ощущаются осознанными и запоминаются.",
    },
    "vision-drives-action": {
      title: "Видение двигает действие",
      excerpt:
        "Чёткое видение превращает смелые идеи в digital-продукты, которые можно выпустить.",
    },
    "fueling-ambition": {
      title: "Подпитывая амбиции и достигая целей",
      excerpt:
        "Амбициям нужны системы — UX-паттерны, которые ведут пользователя вперёд.",
    },
    "creative-process-notes": {
      title: "За кулисами креативных процессов",
      excerpt:
        "Как Pixora превращает концепции в отточенные впечатления — взгляд изнутри.",
    },
  };

  // Projects
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        status: PublishStatus.PUBLISHED,
        year: p.year,
        coverUrl: p.image,
        siteUrl: p.siteUrl,
        sortOrder: i,
        tags: p.tags,
        publishedAt: new Date(),
      },
      create: {
        slug: p.slug,
        status: PublishStatus.PUBLISHED,
        year: p.year,
        coverUrl: p.image,
        siteUrl: p.siteUrl,
        sortOrder: i,
        tags: p.tags,
        publishedAt: new Date(),
      },
    });

    await prisma.projectTranslation.upsert({
      where: {
        projectId_localeId: { projectId: project.id, localeId: locale.id },
      },
      update: {
        title: p.title,
        about: p.about,
        client: p.client,
        expertise: p.expertise,
        duration: p.duration,
        designer: p.designer,
        services: p.services,
        metrics: p.metrics,
        nextSlug: p.nextSlug,
        nextTitle: p.nextTitle,
        nextMeta: p.nextMeta,
      },
      create: {
        projectId: project.id,
        localeId: locale.id,
        title: p.title,
        about: p.about,
        client: p.client,
        expertise: p.expertise,
        duration: p.duration,
        designer: p.designer,
        services: p.services,
        metrics: p.metrics,
        nextSlug: p.nextSlug,
        nextTitle: p.nextTitle,
        nextMeta: p.nextMeta,
      },
    });

    const tr = PROJECT_TR[p.slug];
    if (tr) {
      await prisma.projectTranslation.upsert({
        where: {
          projectId_localeId: { projectId: project.id, localeId: localeTr.id },
        },
        update: {
          title: tr.title,
          about: tr.about,
          client: p.client,
          expertise: tr.expertise,
          duration: tr.duration,
          designer: p.designer,
          services: tr.services,
          metrics: tr.metrics,
          nextSlug: p.nextSlug,
          nextTitle: tr.nextTitle,
          nextMeta: tr.nextMeta,
        },
        create: {
          projectId: project.id,
          localeId: localeTr.id,
          title: tr.title,
          about: tr.about,
          client: p.client,
          expertise: tr.expertise,
          duration: tr.duration,
          designer: p.designer,
          services: tr.services,
          metrics: tr.metrics,
          nextSlug: p.nextSlug,
          nextTitle: tr.nextTitle,
          nextMeta: tr.nextMeta,
        },
      });
    }

    const ru = PROJECT_RU[p.slug];
    if (ru) {
      await prisma.projectTranslation.upsert({
        where: {
          projectId_localeId: { projectId: project.id, localeId: localeRu.id },
        },
        update: {
          title: ru.title,
          about: ru.about,
          client: p.client,
          expertise: ru.expertise,
          duration: ru.duration,
          designer: p.designer,
          services: ru.services,
          metrics: ru.metrics,
          nextSlug: p.nextSlug,
          nextTitle: ru.nextTitle,
          nextMeta: ru.nextMeta,
        },
        create: {
          projectId: project.id,
          localeId: localeRu.id,
          title: ru.title,
          about: ru.about,
          client: p.client,
          expertise: ru.expertise,
          duration: ru.duration,
          designer: p.designer,
          services: ru.services,
          metrics: ru.metrics,
          nextSlug: p.nextSlug,
          nextTitle: ru.nextTitle,
          nextMeta: ru.nextMeta,
        },
      });
    }

    // Replace gallery images
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    if (p.gallery?.length) {
      await prisma.projectImage.createMany({
        data: p.gallery.map((url, sortOrder) => ({
          projectId: project.id,
          url,
          sortOrder,
        })),
      });
    }
  }

  // Blog posts
  for (const post of BLOG_POSTS) {
    const row = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        status: PublishStatus.PUBLISHED,
        coverUrl: post.image,
        category: post.category,
        authorName: post.author,
        authorRole: post.authorRole ?? null,
        readTime: post.readTime,
        comments: post.comments,
        publishedAt: new Date(post.date),
      },
      create: {
        slug: post.slug,
        status: PublishStatus.PUBLISHED,
        coverUrl: post.image,
        category: post.category,
        authorName: post.author,
        authorRole: post.authorRole ?? null,
        readTime: post.readTime,
        comments: post.comments,
        publishedAt: new Date(post.date),
      },
    });

    const enBody = POST_BODY_EN[post.slug] ?? post.excerpt;
    await prisma.postTranslation.upsert({
      where: {
        postId_localeId: { postId: row.id, localeId: locale.id },
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: enBody,
        seoTitle: post.title,
        seoDescription: post.excerpt,
      },
      create: {
        postId: row.id,
        localeId: locale.id,
        title: post.title,
        excerpt: post.excerpt,
        body: enBody,
        seoTitle: post.title,
        seoDescription: post.excerpt,
      },
    });

    const trPost = POST_TR[post.slug];
    if (trPost) {
      await prisma.postTranslation.upsert({
        where: {
          postId_localeId: { postId: row.id, localeId: localeTr.id },
        },
        update: {
          title: trPost.title,
          excerpt: trPost.excerpt,
          body: trPost.body,
          seoTitle: trPost.title,
          seoDescription: trPost.excerpt,
        },
        create: {
          postId: row.id,
          localeId: localeTr.id,
          title: trPost.title,
          excerpt: trPost.excerpt,
          body: trPost.body,
          seoTitle: trPost.title,
          seoDescription: trPost.excerpt,
        },
      });
    }

    const ruPost = POST_RU[post.slug];
    if (ruPost) {
      const ruBody = POST_RU_BODY[post.slug] ?? ruPost.excerpt;
      await prisma.postTranslation.upsert({
        where: {
          postId_localeId: { postId: row.id, localeId: localeRu.id },
        },
        update: {
          title: ruPost.title,
          excerpt: ruPost.excerpt,
          body: ruBody,
          seoTitle: ruPost.title,
          seoDescription: ruPost.excerpt,
        },
        create: {
          postId: row.id,
          localeId: localeRu.id,
          title: ruPost.title,
          excerpt: ruPost.excerpt,
          body: ruBody,
          seoTitle: ruPost.title,
          seoDescription: ruPost.excerpt,
        },
      });
    }
  }

  // Nav (header + footer)
  const nav = [
    { href: "/", label: "Home", labelTr: "Ana sayfa", labelRu: "Главная", sortOrder: 0 },
    { href: "/about", label: "About", labelTr: "Hakkımızda", labelRu: "О нас", sortOrder: 1 },
    { href: "/services", label: "Services", labelTr: "Hizmetler", labelRu: "Услуги", sortOrder: 2 },
    { href: "/projects", label: "Projects", labelTr: "Projeler", labelRu: "Проекты", sortOrder: 3 },
    { href: "/blog", label: "Blog", labelTr: "Blog", labelRu: "Блог", sortOrder: 4 },
    { href: "/contact", label: "Contact", labelTr: "İletişim", labelRu: "Контакты", sortOrder: 5 },
  ];

  async function upsertNavTranslations(
    location: (typeof NavLocation)[keyof typeof NavLocation],
  ) {
    for (const item of nav) {
      const existing = await prisma.navItem.findFirst({
        where: { location, href: item.href, parentId: null },
      });
      const navItem =
        existing ??
        (await prisma.navItem.create({
          data: {
            location,
            href: item.href,
            sortOrder: item.sortOrder,
          },
        }));

      await prisma.navItem.update({
        where: { id: navItem.id },
        data: { sortOrder: item.sortOrder },
      });

      await prisma.navItemTranslation.upsert({
        where: {
          navItemId_localeId: { navItemId: navItem.id, localeId: locale.id },
        },
        update: { label: item.label },
        create: {
          navItemId: navItem.id,
          localeId: locale.id,
          label: item.label,
        },
      });

      await prisma.navItemTranslation.upsert({
        where: {
          navItemId_localeId: { navItemId: navItem.id, localeId: localeTr.id },
        },
        update: { label: item.labelTr },
        create: {
          navItemId: navItem.id,
          localeId: localeTr.id,
          label: item.labelTr,
        },
      });

      await prisma.navItemTranslation.upsert({
        where: {
          navItemId_localeId: { navItemId: navItem.id, localeId: localeRu.id },
        },
        update: { label: item.labelRu },
        create: {
          navItemId: navItem.id,
          localeId: localeRu.id,
          label: item.labelRu,
        },
      });
    }
  }

  await upsertNavTranslations(NavLocation.HEADER);
  await upsertNavTranslations(NavLocation.FOOTER);

  // Contact messages (only if empty)
  const msgCount = await prisma.contactMessage.count();
  if (msgCount === 0) {
    await prisma.contactMessage.createMany({
      data: CONTACT_MESSAGES.map((m) => ({
        name: m.name,
        email: m.email,
        subject: m.subject,
        body: m.body,
        createdAt: new Date(m.createdAt),
        readAt: m.read ? new Date(m.createdAt) : null,
      })),
    });
  }

  // Admin user from env (prefer ADMIN_EMAIL / ADMIN_PASSWORD); fallback placeholder.
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@pixora.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const passwordHash = adminPassword
    ? await hashPassword(adminPassword)
    : "PENDING_SET_PASSWORD_VIA_DB_SYNC_ADMIN";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: adminPassword
      ? { passwordHash, role: "ADMIN", name: "Batuhan" }
      : { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Batuhan",
      passwordHash,
      role: "ADMIN",
    },
  });

  // EDITOR only when EDITOR_PASSWORD is present (no weak default password).
  const editorEmail = (
    process.env.EDITOR_EMAIL?.trim() || "editor@pixora.com"
  ).toLowerCase();
  const editorPassword = process.env.EDITOR_PASSWORD;
  if (editorPassword && editorPassword.length >= 8) {
    const editorHash = await hashPassword(editorPassword);
    await prisma.user.upsert({
      where: { email: editorEmail },
      update: { passwordHash: editorHash, role: "EDITOR", name: "Editor" },
      create: {
        email: editorEmail,
        name: "Editor",
        passwordHash: editorHash,
        role: "EDITOR",
      },
    });
  } else {
    console.log(
      "EDITOR seed skipped (set EDITOR_PASSWORD and run pnpm db:sync-editor)",
    );
  }

  // Seed MediaAsset rows for key public assets (idempotent by url)
  const mediaSeeds: {
    url: string;
    filename: string;
    mime: string;
    bytes: number;
    alt: string;
  }[] = [
    { url: "/assets/img/logo/logo-red-uppercase.png", filename: "logo-red-uppercase.png", mime: "image/png", bytes: 12000, alt: "PIXORA logo" },
    { url: "/assets/img/hero/hero-2-1.jpg", filename: "hero-2-1.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 1" },
    { url: "/assets/img/hero/hero-2-2.jpg", filename: "hero-2-2.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 2" },
    { url: "/assets/img/hero/hero-2-3.jpg", filename: "hero-2-3.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 3" },
    { url: "/assets/img/hero/hero-2-4.jpg", filename: "hero-2-4.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 4" },
    { url: "/assets/img/hero/hero-2-5.jpg", filename: "hero-2-5.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 5" },
    { url: "/assets/img/hero/hero-2-6.jpg", filename: "hero-2-6.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 6" },
    { url: "/assets/img/hero/hero-2-7.jpg", filename: "hero-2-7.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 7" },
    { url: "/assets/img/hero/hero-2-8.jpg", filename: "hero-2-8.jpg", mime: "image/jpeg", bytes: 180000, alt: "Hero 8" },
    { url: "/assets/img/team/team-1.jpg", filename: "team-1.jpg", mime: "image/jpeg", bytes: 90000, alt: "Team 1" },
    { url: "/assets/img/team/team-2.jpg", filename: "team-2.jpg", mime: "image/jpeg", bytes: 90000, alt: "Team 2" },
    { url: "/assets/img/team/team-3.jpg", filename: "team-3.jpg", mime: "image/jpeg", bytes: 90000, alt: "Team 3" },
    { url: "/assets/img/team/team-4.jpg", filename: "team-4.jpg", mime: "image/jpeg", bytes: 90000, alt: "Team 4" },
    { url: "/assets/img/brand/brand-1-1.png", filename: "brand-1-1.png", mime: "image/png", bytes: 20000, alt: "Brand 1" },
    { url: "/assets/img/brand/brand-1-2.png", filename: "brand-1-2.png", mime: "image/png", bytes: 20000, alt: "Brand 2" },
    { url: "/assets/img/brand/brand-1-3.png", filename: "brand-1-3.png", mime: "image/png", bytes: 20000, alt: "Brand 3" },
    { url: "/assets/img/brand/brand-1-4.png", filename: "brand-1-4.png", mime: "image/png", bytes: 20000, alt: "Brand 4" },
    { url: "/assets/img/brand/brand-1-5.png", filename: "brand-1-5.png", mime: "image/png", bytes: 20000, alt: "Brand 5" },
    { url: "/assets/img/brand/brand-1-6.png", filename: "brand-1-6.png", mime: "image/png", bytes: 20000, alt: "Brand 6" },
    { url: "/assets/img/banner/banner-1.jpg", filename: "banner-1.jpg", mime: "image/jpeg", bytes: 150000, alt: "Banner" },
    { url: "/assets/img/avater/avater-2.png", filename: "avater-2.png", mime: "image/png", bytes: 30000, alt: "Avatar" },
  ];

  let mediaSeeded = 0;
  for (const m of mediaSeeds) {
    const existing = await prisma.mediaAsset.findFirst({ where: { url: m.url } });
    if (existing) continue;
    await prisma.mediaAsset.create({
      data: {
        url: m.url,
        path: m.url.replace(/^\//, ""),
        filename: m.filename,
        mime: m.mime,
        bytes: m.bytes,
        alt: m.alt,
      },
    });
    mediaSeeded += 1;
  }

  console.log("Seed OK:", {
    locales: [locale.code, localeTr.code, localeRu.code],
    projects: PROJECTS.length,
    posts: BLOG_POSTS.length,
    contactSections: CONTACT_SECTION_DEFS.length,
    homeSections: HOME_SECTION_DEFS.length,
    aboutSections: ABOUT_SECTION_DEFS.length,
    servicesSections: SERVICES_SECTION_DEFS.length,
    notFoundSections: NOT_FOUND_SECTION_DEFS.length,
    mediaSeeded,
  });
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
