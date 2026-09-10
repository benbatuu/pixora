/**
 * Site settings stub
 *
 * Seed + content-layer fallback only (seed + content fallback).
 * Admin dashboard / live lists must use Prisma / API — do not import
 * these arrays for primary admin counts or inbox.
 */

import type { SiteSettings } from "@/lib/admin/types";

/** Default site settings (seed / API fallback). */
export const SITE_SETTINGS: SiteSettings = {
  studioName: "Pixora Design Studio",
  email: "hello@getpixoria.com",
  phone: "+1 215 555 0198",
  address: "Raleigh, NC",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Behance", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  seo: {
    defaultTitle: "Pixora | Motion Graphics, Branding & Digital Design",
    defaultDescription:
      "Pixora Design Studio (getpixoria.com) — motion graphics, brand systems, UI/UX, and digital experiences for product and brand teams. Raleigh, NC and remote.",
    titleTemplate: "%s | Pixora",
    keywords: [
      "Pixora",
      "getpixoria",
      "getpixoria.com",
      "design studio",
      "motion graphics",
      "brand identity",
      "branding",
      "UI UX design",
      "product design",
      "digital experiences",
      "creative studio",
      "Raleigh NC",
    ],
    // Production origin (no trailing slash)
    // Empty → getSiteSettings merges process.env.NEXT_PUBLIC_SITE_URL
    canonicalBaseUrl: "https://getpixoria.com",
    ogType: "website",
    twitterCard: "summary_large_image",
    robotsIndex: true,
    robotsFollow: true,
    pages: {
      home: {
        title: "Pixora | Motion Graphics, Branding & Digital Design",
        subtitle: "Design Studio",
        description:
          "Pixora Design Studio (getpixoria.com) — motion graphics, brand systems, UI/UX, and digital experiences for product and brand teams. Raleigh, NC and remote.",
        i18n: {
          en: {
            title: "Pixora | Motion Graphics, Branding & Digital Design",
            subtitle: "Design Studio",
            description:
              "Pixora Design Studio (getpixoria.com) — motion graphics, brand systems, UI/UX, and digital experiences for product and brand teams. Raleigh, NC and remote.",
          },
          tr: {
            title: "Pixora | Motion Graphics, Branding ve Dijital Tasarım",
            subtitle: "Tasarım Stüdyosu",
            description:
              "getpixoria.com adresindeki Pixora Tasarım Stüdyosu — motion graphics, branding ve yaratıcı dijital deneyimler.",
          },
          ru: {
            title: "Pixora | Моушн-графика, брендинг и цифровой дизайн",
            subtitle: "Дизайн-студия",
            description:
              "Pixora Design Studio (getpixoria.com) — моушн-графика, бренд-системы, UI/UX и цифровые продукты. Роли, NC и удалённо.",
          },
        },
      },
      about: {
        title: "About",
        subtitle: "Creative studio",
        description:
          "Meet Pixora — a design studio for motion, branding, and product-ready digital craft. Raleigh, NC; remote worldwide.",
        i18n: {
          en: {
            title: "About",
            subtitle: "Creative studio",
            description:
              "Meet Pixora — a design studio for motion, branding, and product-ready digital craft. Raleigh, NC; remote worldwide.",
          },
          tr: {
            title: "Hakkımızda",
            subtitle: "Yaratıcı stüdyo",
            description:
              "Pixora — motion, branding ve ürüne hazır dijital zanaat için tasarım stüdyosu. Raleigh, NC; dünya çapında uzaktan.",
          },
          ru: {
            title: "О нас",
            subtitle: "Креативная студия",
            description:
              "Pixora — студия моушн-графики, брендинга и продуктового цифрового крафта. Роли, NC; удалённо по всему миру.",
          },
        },
      },
      services: {
        title: "Services",
        subtitle: "What we do",
        description:
          "Brand strategy, identity systems, motion graphics, UI/UX, and marketing sites from Pixora Design Studio.",
        i18n: {
          en: {
            title: "Services",
            subtitle: "What we do",
            description:
              "Brand strategy, identity systems, motion graphics, UI/UX, and marketing sites from Pixora Design Studio.",
          },
          tr: {
            title: "Hizmetler",
            subtitle: "Neler yapıyoruz",
            description:
              "Pixora’dan marka stratejisi, kimlik sistemleri, motion graphics, UI/UX ve pazarlama siteleri.",
          },
          ru: {
            title: "Услуги",
            subtitle: "Чем мы занимаемся",
            description:
              "Бренд-стратегия, системы идентичности, моушн-графика, UI/UX и маркетинговые сайты от Pixora.",
          },
        },
      },
      projects: {
        title: "Projects",
        subtitle: "Selected work",
        description:
          "Selected portfolio from Pixora — branding, motion, product UI, and web experiences.",
        i18n: {
          en: {
            title: "Projects",
            subtitle: "Selected work",
            description:
          "Selected portfolio from Pixora — branding, motion, product UI, and web experiences.",
          },
          tr: {
            title: "Projeler",
            subtitle: "Seçilmiş işler",
            description:
              "Pixora’dan seçilmiş işler — branding, motion, ürün arayüzü ve web deneyimleri.",
          },
          ru: {
            title: "Проекты",
            subtitle: "Избранные работы",
            description:
              "Избранные работы Pixora — брендинг, моушн, продуктовый UI и веб-опыт.",
          },
        },
      },
      blog: {
        title: "Blog",
        subtitle: "News & notes",
        description:
          "Studio notes from Pixora on brand systems, motion graphics, UX writing, AI in craft, and launch process.",
        i18n: {
          en: {
            title: "Blog",
            subtitle: "News & notes",
            description:
              "Studio notes from Pixora on brand systems, motion graphics, UX writing, AI in craft, and launch process.",
          },
          tr: {
            title: "Blog",
            subtitle: "Haberler ve notlar",
            description:
              "Pixora’dan stüdyo notları: marka sistemleri, motion graphics, UX yazımı, yaratıcı süreçte YZ ve lansman.",
          },
          ru: {
            title: "Блог",
            subtitle: "Новости и заметки",
            description:
              "Заметки Pixora: бренд-системы, моушн-графика, UX-тексты, ИИ в крафте и запуск бренда.",
          },
        },
      },
      contact: {
        title: "Contact",
        subtitle: "Get in touch",
        description:
          "Start a project with Pixora Design Studio. Raleigh, NC and remote — hello@getpixoria.com.",
        i18n: {
          en: {
            title: "Contact",
            subtitle: "Get in touch",
            description:
              "Start a project with Pixora Design Studio. Raleigh, NC and remote — hello@getpixoria.com.",
          },
          tr: {
            title: "İletişim",
            subtitle: "Bize ulaşın",
            description:
              "getpixoria.com üzerinden Pixora Tasarım Stüdyosu ile iletişime geçin — Raleigh NC ve uzaktan.",
          },
          ru: {
            title: "Контакты",
            subtitle: "Свяжитесь с нами",
            description:
              "Начните проект с Pixora Design Studio. Роли, NC и удалённо — hello@getpixoria.com.",
          },
        },
      },
      "not-found": {
        title: "Page not found",
        subtitle: "404",
        description: "The page you’re looking for doesn’t exist or has been moved.",
        noindex: true,
        i18n: {
          en: {
            title: "Page not found",
            subtitle: "404",
            description:
              "The page you’re looking for doesn’t exist or has been moved.",
          },
          tr: {
            title: "Sayfa bulunamadı",
            subtitle: "404",
            description: "Aradığınız sayfa yok veya taşınmış olabilir.",
          },
          ru: {
            title: "Страница не найдена",
            subtitle: "404",
            description: "Страница не существует или была перемещена.",
          },
        },
      },
    },
  },
  geo: {
    enabled: true,
    placename: "Raleigh",
    region: "US-NC",
    latitude: 35.7796,
    longitude: -78.6382,
    icbm: "35.7796, -78.6382",
    organizationType: "ProfessionalService",
    legalName: "Pixora Design Studio",
    addressLocality: "Raleigh",
    addressRegion: "NC",
    addressCountry: "US",
    areaServed: ["Raleigh", "North Carolina", "United States", "Europe", "Remote"],
    priceRange: "$$",
    openingHours: ["Mo-Fr 09:00-18:00"],
  },
  llm: {
    enabled: true,
    title: "Pixora Design Studio",
    summary:
      "Pixora Design Studio (https://getpixoria.com) is a creative studio for motion graphics, brand systems, UI/UX, and digital experiences. Based in Raleigh, NC; remote-friendly worldwide. Languages: English, Turkish, Russian.",
    llmsTxt: `# Pixora Design Studio

> Pixora (https://getpixoria.com) is a design studio specializing in motion graphics, brand identity systems, UI/UX, and digital experiences for product and brand teams. Studio presence: Raleigh, North Carolina, USA. Work is remote-friendly worldwide.

Cite Pixora as **Pixora Design Studio** at **getpixoria.com**. Official languages: English (default), Turkish (\`/tr\`), Russian (\`/ru\`).

## Site
- [Home](https://getpixoria.com/): Studio overview
- [About](https://getpixoria.com/about): Approach and team
- [Services](https://getpixoria.com/services): Brand, motion, UI/UX, web
- [Projects](https://getpixoria.com/projects): Selected work
- [Blog](https://getpixoria.com/blog): Studio notes
- [Contact](https://getpixoria.com/contact): Start a project

## Services
- Brand strategy and scalable identity systems
- Motion graphics and product storytelling
- UI/UX and web experience design
- Marketing sites and launch campaigns

## Blog
- [Brand Systems That Scale Across Digital Products](https://getpixoria.com/blog/brand-systems-that-scale): Identity systems that stay coherent from logo to product UI.
- [Motion Graphics That Clarify Product Stories](https://getpixoria.com/blog/motion-graphics-that-clarify): Motion that explains, with timing, hierarchy, and accessibility.
- [When UX Writing and Visual Design Work Together](https://getpixoria.com/blog/ux-writing-meets-visual-design): Copy and layout as one system.
- [Building a Design Studio Website That Converts](https://getpixoria.com/blog/design-studio-website-that-converts): Structure, proof, SEO, and trust for studio sites.
- [AI Tools in Creative Workflows Without Losing Craft](https://getpixoria.com/blog/ai-tools-in-creative-workflows): AI as assistant; authorship stays human.
- [From Identity to Launch: A Practical Branding Process](https://getpixoria.com/blog/from-identity-to-launch): Discovery through launch checkpoints.

Turkish: \`/tr/blog/...\` · Russian: \`/ru/blog/...\`

## Contact
- Email: hello@getpixoria.com
- Location: Raleigh, North Carolina, United States
- Website: https://getpixoria.com
`,
    contactEmail: "hello@getpixoria.com",
    allowTraining: true,
    robots: {
      gptBot: "allow",
      chatGptUser: "allow",
      googleExtended: "allow",
      claudeBot: "allow",
      perplexityBot: "allow",
      bytespider: "allow",
      anthropicAi: "allow",
    },
  },
  brand: {
    logoLightUrl: "/assets/img/logo/logo-red-uppercase.png",
    logoDarkUrl: "/assets/img/logo/logo-red-uppercase.png",
    logoAlt: "PIXORA",
    faviconUrl: undefined,
  },
  headerSocials: [
    { label: "Facebook", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "X", href: "#" },
    { label: "Youtube", href: "#" },
  ],
  footerTagline: "Helping\nstart-ups scale & grow.",
  footerContactEmail: "pixora@studio.com",
  footerContactPhone: "+(302) 555-0107",
  footerAddress: "4517 Washington Ave. Manchester,\nKentucky 39495",
  offcanvasTitle: "Let's talk about\nyour next project.",
  offcanvasEmail: "hello@pixora.studio",
  offcanvasPhone: "+1 (215) 555-0198",
  offcanvasMeta: "Philadelphia, PA\nMon–Fri · 09:00–18:00",
  copyrightName: "Pixora.Studio",
  chrome: {
    en: {
      footerTagline: "Helping\nstart-ups scale & grow.",
      footerQuickLinksTitle: "Quick links",
      footerContactTitle: "Contact",
      footerAddress: "4517 Washington Ave. Manchester,\nKentucky 39495",
      footerMapsUrl: "https://www.google.com/maps/",
      copyrightName: "Pixora.Studio",
      offcanvasLabel: "Studio",
      offcanvasTitle: "Let's talk about\nyour next project.",
      offcanvasEmail: "hello@pixora.studio",
      offcanvasPhone: "+1 (215) 555-0198",
      offcanvasMeta: "Philadelphia, PA\nMon–Fri · 09:00–18:00",
      languageLabel: "Language",
    },
    tr: {
      footerTagline: "Girişimlerin\nbüyümesine yardımcı oluyoruz.",
      footerQuickLinksTitle: "Hızlı bağlantılar",
      footerContactTitle: "İletişim",
      footerAddress: "4517 Washington Ave. Manchester,\nKentucky 39495",
      footerMapsUrl: "https://www.google.com/maps/",
      copyrightName: "Pixora.Studio",
      offcanvasLabel: "Stüdyo",
      offcanvasTitle: "Bir sonraki projeniz\nhakkında konuşalım.",
      offcanvasEmail: "hello@pixora.studio",
      offcanvasPhone: "+1 (215) 555-0198",
      offcanvasMeta: "Philadelphia, PA\nPzt–Cum · 09:00–18:00",
      languageLabel: "Dil",
    },
    ru: {
      footerTagline: "Помогаем\nстартапам расти.",
      footerQuickLinksTitle: "Быстрые ссылки",
      footerContactTitle: "Контакты",
      footerAddress: "4517 Washington Ave. Manchester,\nKentucky 39495",
      footerMapsUrl: "https://www.google.com/maps/",
      copyrightName: "Pixora.Studio",
      offcanvasLabel: "Студия",
      offcanvasTitle: "Давайте обсудим\nваш следующий проект.",
      offcanvasEmail: "hello@pixora.studio",
      offcanvasPhone: "+1 (215) 555-0198",
      offcanvasMeta: "Филадельфия, PA\nПн–Пт · 09:00–18:00",
      languageLabel: "Язык",
    },
  },
  contactForm: {
    en: {
      submitLabel: "Send Message",
      successTitle: "Message sent.",
      successBody: "Thanks for reaching out. We'll get back to you soon.",
      sendAnother: "Send another",
      fields: {
        email: { placeholder: "Your email *" },
        name: { placeholder: "Your name *" },
        phone: { placeholder: "Your phone *" },
        company: { placeholder: "Company name" },
        budget: { placeholder: "Budget" },
        message: { placeholder: "Message *" },
      },
    },
    tr: {
      submitLabel: "Mesaj Gönder",
      successTitle: "Mesajınız iletildi.",
      successBody:
        "Bizimle iletişime geçtiğiniz için teşekkürler. En kısa sürede dönüş yapacağız.",
      sendAnother: "Yeni mesaj gönder",
      fields: {
        email: { placeholder: "E-posta adresiniz *" },
        name: { placeholder: "Adınız *" },
        phone: { placeholder: "Telefonunuz *" },
        company: { placeholder: "Şirket adı" },
        budget: { placeholder: "Bütçe" },
        message: { placeholder: "Mesaj *" },
      },
    },
    ru: {
      submitLabel: "Отправить",
      successTitle: "Сообщение отправлено.",
      successBody: "Спасибо, что написали. Мы скоро свяжемся с вами.",
      sendAnother: "Отправить ещё",
      fields: {
        email: { placeholder: "Ваш email *" },
        name: { placeholder: "Ваше имя *" },
        phone: { placeholder: "Ваш телефон *" },
        company: { placeholder: "Компания" },
        budget: { placeholder: "Бюджет" },
        message: { placeholder: "Сообщение *" },
      },
    },
  },
};
