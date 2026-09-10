/** Chrome / UI chrome strings (not marketing CMS). */

export type BlogFilterKey =
  | "All"
  | "Design"
  | "Motion design"
  | "Branding"
  | "AI Tools"
  | "UX"
  | "Web experience"
  | "3d modeling";

export type UiMessages = {
  openMenu: string;
  closeMenu: string;
  primaryNav: string;
  language: string;
  studio: string;
  quickLinks: string;
  contact: string;
  backToTop: string;
  // contact form
  emailPh: string;
  namePh: string;
  phonePh: string;
  companyPh: string;
  budgetPh: string;
  messagePh: string;
  sendLabel: string;
  sendAria: string;
  sentThanks: string;
  sentThanksBody: string;
  sendAnother: string;
  directionsLabel: string;
  // blog list / detail chrome
  blogTitle: string;
  search: string;
  searchPh: string;
  searchAria: string;
  aboutAuthor: string;
  leaveReply: string;
  commentNamePh: string;
  commentEmailPh: string;
  commentPh: string;
  postComment: string;
  category: string;
  latestPosts: string;
  relatedPosts: string;
  studioNews: string;
  publishedOn: string;
  noPosts: string;
  commentsLabel: string;
  replyLabel: string;
  taggedWith: string;
  blogFilters: Record<BlogFilterKey, string>;
  // projects page leftovers
  projectsEyebrow: string;
  projectsTitleRest: string;
  projectsMetaLeft: string;
  projectsMetaRight: string;
  // awards table
  awardCol: string;
  nominationCol: string;
  yearCol: string;
  // services chrome (CMS preferred; dict as fallback)
  viewDetails: string;
  stepLabel: string;
  howWeWork: string;
  craftingStories: string;
  // about chrome leftovers
  discoverAll: string;
  servicesCol: string;
  infoCol: string;
  // not-found
  quickLinksAria: string;
};

const EN: UiMessages = {
  openMenu: "Open menu",
  closeMenu: "Close menu",
  primaryNav: "Primary",
  language: "Language",
  studio: "Studio",
  quickLinks: "Quick links",
  contact: "Contact",
  backToTop: "Back to top",
  emailPh: "Your email *",
  namePh: "Your name *",
  phonePh: "Your phone *",
  companyPh: "Company name",
  budgetPh: "Budget",
  messagePh: "Message *",
  sendLabel: "Send Message",
  sendAria: "Send contact message",
  sentThanks: "Message sent.",
  sentThanksBody: "Thanks for reaching out. We'll get back to you soon.",
  sendAnother: "Send another",
  directionsLabel: "Directions",
  blogTitle: "Explore latest News",
  search: "Search",
  searchPh: "Search...",
  searchAria: "Search posts",
  aboutAuthor: "About Author",
  leaveReply: "Leave a Reply",
  commentNamePh: "Name *",
  commentEmailPh: "Email *",
  commentPh: "Comment *",
  postComment: "Post Comment",
  category: "Category",
  latestPosts: "Latest Posts",
  relatedPosts: "Related Posts",
  studioNews: "Studio News",
  publishedOn: "Published on",
  noPosts: "No posts match your filters.",
  commentsLabel: "Comments",
  replyLabel: "Reply →",
  taggedWith: "Tagged with :",
  blogFilters: {
    All: "All",
    Design: "Design",
    "Motion design": "Motion design",
    Branding: "Branding",
    "AI Tools": "AI Tools",
    UX: "UX",
    "Web experience": "Web experience",
    "3d modeling": "3d modeling",
  },
  projectsEyebrow: "Graphic Design",
  projectsTitleRest: "Driven Production",
  projectsMetaLeft: "Web & Digital Experiences\nDesign, Development, Brand Identity",
  projectsMetaRight: "Philadelphia, PA\n2026",
  awardCol: "Award",
  nominationCol: "Nomination",
  yearCol: "Year",
  viewDetails: "View details",
  stepLabel: "Step",
  howWeWork: "How we work",
  craftingStories: "Crafting unique stories for brands",
  discoverAll: "Discover All",
  servicesCol: "Services",
  infoCol: "Info",
  quickLinksAria: "Quick links",
};

const TR: UiMessages = {
  openMenu: "Menüyü aç",
  closeMenu: "Menüyü kapat",
  primaryNav: "Ana menü",
  language: "Dil",
  studio: "Stüdyo",
  quickLinks: "Hızlı bağlantılar",
  contact: "İletişim",
  backToTop: "Yukarı çık",
  emailPh: "E-posta adresiniz *",
  namePh: "Adınız *",
  phonePh: "Telefonunuz *",
  companyPh: "Şirket adı",
  budgetPh: "Bütçe",
  messagePh: "Mesaj *",
  sendLabel: "Mesaj Gönder",
  sendAria: "İletişim mesajı gönder",
  sentThanks: "Mesajınız iletildi.",
  sentThanksBody: "Bizimle iletişime geçtiğiniz için teşekkürler. En kısa sürede dönüş yapacağız.",
  sendAnother: "Yeni mesaj gönder",
  directionsLabel: "Yol tarifi",
  blogTitle: "Son haberleri keşfet",
  search: "Ara",
  searchPh: "Ara...",
  searchAria: "Yazılarda ara",
  aboutAuthor: "Yazar hakkında",
  leaveReply: "Yanıt bırakın",
  commentNamePh: "Ad *",
  commentEmailPh: "E-posta *",
  commentPh: "Yorum *",
  postComment: "Yorumu gönder",
  category: "Kategori",
  latestPosts: "Son yazılar",
  relatedPosts: "İlgili yazılar",
  studioNews: "Stüdyo haberleri",
  publishedOn: "Yayımlanma",
  noPosts: "Filtrelere uyan yazı yok.",
  commentsLabel: "Yorum",
  replyLabel: "Yanıtla →",
  taggedWith: "Etiketler:",
  blogFilters: {
    All: "Tümü",
    Design: "Tasarım",
    "Motion design": "Motion tasarım",
    Branding: "Marka",
    "AI Tools": "YZ araçları",
    UX: "UX",
    "Web experience": "Web deneyimi",
    "3d modeling": "3B modelleme",
  },
  projectsEyebrow: "Grafik Tasarım",
  projectsTitleRest: "Odaklı Prodüksiyon",
  projectsMetaLeft: "Web & Dijital Deneyimler\nTasarım, Geliştirme, Marka Kimliği",
  projectsMetaRight: "Philadelphia, PA\n2026",
  awardCol: "Ödül",
  nominationCol: "Adaylık",
  yearCol: "Yıl",
  viewDetails: "Detayları gör",
  stepLabel: "Adım",
  howWeWork: "Nasıl çalışıyoruz",
  craftingStories: "Markalar için özgün hikâyeler yaratıyoruz",
  discoverAll: "Tümünü keşfet",
  servicesCol: "Hizmetler",
  infoCol: "Bilgi",
  quickLinksAria: "Hızlı bağlantılar",
};

const RU: UiMessages = {
  openMenu: "Открыть меню",
  closeMenu: "Закрыть меню",
  primaryNav: "Основная навигация",
  language: "Язык",
  studio: "Студия",
  quickLinks: "Быстрые ссылки",
  contact: "Контакты",
  backToTop: "Наверх",
  emailPh: "Ваш email *",
  namePh: "Ваше имя *",
  phonePh: "Ваш телефон *",
  companyPh: "Компания",
  budgetPh: "Бюджет",
  messagePh: "Сообщение *",
  sendLabel: "Отправить",
  sendAria: "Отправить сообщение",
  sentThanks: "Сообщение отправлено.",
  sentThanksBody: "Спасибо, что написали. Мы скоро свяжемся с вами.",
  sendAnother: "Отправить ещё",
  directionsLabel: "Маршрут",
  blogTitle: "Свежие новости",
  search: "Поиск",
  searchPh: "Поиск...",
  searchAria: "Поиск по записям",
  aboutAuthor: "Об авторе",
  leaveReply: "Оставить комментарий",
  commentNamePh: "Имя *",
  commentEmailPh: "Email *",
  commentPh: "Комментарий *",
  postComment: "Отправить комментарий",
  category: "Категория",
  latestPosts: "Последние записи",
  relatedPosts: "Похожие записи",
  studioNews: "Новости студии",
  publishedOn: "Опубликовано",
  noPosts: "Нет записей по выбранным фильтрам.",
  commentsLabel: "Комментарии",
  replyLabel: "Ответить →",
  taggedWith: "Теги:",
  blogFilters: {
    All: "Все",
    Design: "Дизайн",
    "Motion design": "Моушн-дизайн",
    Branding: "Брендинг",
    "AI Tools": "ИИ-инструменты",
    UX: "UX",
    "Web experience": "Веб-опыт",
    "3d modeling": "3D-моделирование",
  },
  projectsEyebrow: "Графический дизайн",
  projectsTitleRest: "Продакшн с характером",
  projectsMetaLeft: "Веб и digital-опыт\nДизайн, разработка, айдентика",
  projectsMetaRight: "Филадельфия, PA\n2026",
  awardCol: "Награда",
  nominationCol: "Номинация",
  yearCol: "Год",
  viewDetails: "Подробнее",
  stepLabel: "Шаг",
  howWeWork: "Как мы работаем",
  craftingStories: "Создаём уникальные истории для брендов",
  discoverAll: "Смотреть всех",
  servicesCol: "Услуги",
  infoCol: "Инфо",
  quickLinksAria: "Быстрые ссылки",
};

export const UI: Record<string, UiMessages> = {
  en: EN,
  tr: TR,
  ru: RU,
};

export function getUi(locale: string): UiMessages {
  return UI[locale] ?? UI.en ?? EN;
}
