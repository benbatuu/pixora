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
  email: "inquiry@pixora.com",
  phone: "+1 215 555 0198",
  address: "Raleigh, NC",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Behance", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  seo: {
    defaultTitle: "Home | Pixora",
    defaultDescription:
      "Pixora Design Studio — motion graphics, branding, and creative digital experiences.",
    titleTemplate: "%s | Pixora",
    keywords: [
      "Pixora",
      "design studio",
      "motion graphics",
      "branding",
      "digital experiences",
    ],
    // Production origin (no trailing slash), e.g. https://pixora.studio
    // Empty → getSiteSettings merges process.env.NEXT_PUBLIC_SITE_URL
    canonicalBaseUrl: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    robotsIndex: true,
    robotsFollow: true,
    pages: {
      home: {
        title: "Home | Pixora",
        subtitle: "Design Studio",
        description:
          "Pixora Design Studio — motion graphics, branding, and creative digital experiences.",
        i18n: {
          en: {
            title: "Home | Pixora",
            subtitle: "Design Studio",
            description:
              "Pixora Design Studio — motion graphics, branding, and creative digital experiences.",
          },
          tr: {
            title: "Ana Sayfa | Pixora",
            subtitle: "Tasarım Stüdyosu",
            description:
              "Pixora Tasarım Stüdyosu — motion graphics, branding ve yaratıcı dijital deneyimler.",
          },
          ru: {
            title: "Главная | Pixora",
            subtitle: "Дизайн-студия",
            description:
              "Pixora Design Studio — моушн-графика, брендинг и креативные цифровые решения.",
          },
        },
      },
      about: {
        title: "About",
        subtitle: "Creative studio",
        description:
          "Pixora is a creative studio — design, development, branding.",
        i18n: {
          en: {
            title: "About",
            subtitle: "Creative studio",
            description:
              "Pixora is a creative studio — design, development, branding.",
          },
          tr: {
            title: "Hakkımızda",
            subtitle: "Yaratıcı stüdyo",
            description:
              "Pixora yaratıcı bir stüdyodur — tasarım, geliştirme, branding.",
          },
          ru: {
            title: "О нас",
            subtitle: "Креативная студия",
            description:
              "Pixora — креативная студия: дизайн, разработка, брендинг.",
          },
        },
      },
      services: {
        title: "Services",
        subtitle: "What we do",
        description:
          "Brand strategy, web development, UI/UX design, and digital marketing from Pixora.",
        i18n: {
          en: {
            title: "Services",
            subtitle: "What we do",
            description:
              "Brand strategy, web development, UI/UX design, and digital marketing from Pixora.",
          },
          tr: {
            title: "Hizmetler",
            subtitle: "Neler yapıyoruz",
            description:
              "Pixora'dan marka stratejisi, web geliştirme, UI/UX tasarımı ve dijital pazarlama.",
          },
          ru: {
            title: "Услуги",
            subtitle: "Чем мы занимаемся",
            description:
              "Бренд-стратегия, веб-разработка, UI/UX-дизайн и цифровой маркетинг от Pixora.",
          },
        },
      },
      projects: {
        title: "Projects",
        subtitle: "Selected work",
        description: "Selected portfolio work from Pixora Design Studio.",
        i18n: {
          en: {
            title: "Projects",
            subtitle: "Selected work",
            description: "Selected portfolio work from Pixora Design Studio.",
          },
          tr: {
            title: "Projeler",
            subtitle: "Seçilmiş işler",
            description: "Pixora Tasarım Stüdyosu'ndan seçilmiş portföy çalışmaları.",
          },
          ru: {
            title: "Проекты",
            subtitle: "Избранные работы",
            description: "Избранные портфолио-работы Pixora Design Studio.",
          },
        },
      },
      blog: {
        title: "Blog",
        subtitle: "News & notes",
        description:
          "Explore latest news from Pixora — design, motion, branding, and process.",
        i18n: {
          en: {
            title: "Blog",
            subtitle: "News & notes",
            description:
              "Explore latest news from Pixora — design, motion, branding, and process.",
          },
          tr: {
            title: "Blog",
            subtitle: "Haberler ve notlar",
            description:
              "Pixora'dan son haberler — tasarım, motion, branding ve süreç.",
          },
          ru: {
            title: "Блог",
            subtitle: "Новости и заметки",
            description:
              "Последние новости Pixora — дизайн, моушн, брендинг и процесс.",
          },
        },
      },
      contact: {
        title: "Contact",
        subtitle: "Get in touch",
        description:
          "Get in touch with Pixora Design Studio — London, New York, Singapore, Raleigh.",
        i18n: {
          en: {
            title: "Contact",
            subtitle: "Get in touch",
            description:
              "Get in touch with Pixora Design Studio — London, New York, Singapore, Raleigh.",
          },
          tr: {
            title: "İletişim",
            subtitle: "Bize ulaşın",
            description:
              "Pixora Tasarım Stüdyosu ile iletişime geçin — Londra, New York, Singapur, Raleigh.",
          },
          ru: {
            title: "Контакты",
            subtitle: "Свяжитесь с нами",
            description:
              "Свяжитесь с Pixora Design Studio — Лондон, Нью-Йорк, Сингапур, Роли.",
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
    areaServed: ["Raleigh", "North Carolina", "United States"],
    priceRange: "$$",
  },
  llm: {
    enabled: true,
    title: "Pixora Design Studio",
    summary:
      "Pixora Design Studio — motion graphics, branding, and creative digital experiences.",
    llmsTxt: "",
    contactEmail: "inquiry@pixora.com",
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
