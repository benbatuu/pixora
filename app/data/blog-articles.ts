/**
 * Full blog copy (EN / TR / RU) — seed + content-layer fallback.
 */

export type BlogLocaleCode = "en" | "tr" | "ru";

export type BlogFaq = { q: string; a: string };

export type BlogLocaleCopy = {
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  faqs: BlogFaq[];
};

export type BlogArticleLocales = Record<BlogLocaleCode, BlogLocaleCopy>;

export const BLOG_ARTICLES: Record<string, BlogArticleLocales> = {
  "brand-systems-that-scale": {
    en: {
      title: "Brand Systems That Scale Across Digital Products",
      excerpt:
        "How to build identity systems that stay coherent from logo to product UI — without freezing creativity.",
      seoTitle: "Brand Systems That Scale Across Products | Pixora",
      seoDescription:
        "Build brand systems that stay coherent from logo to product UI: principles, semantic tokens, governance, and flexibility. From Pixora at getpixoria.com.",
      faqs: [
        {
          q: "What is a scalable brand system?",
          a: "A living set of principles, semantic tokens, and a flexible mark family that stays coherent from marketing sites to product UI — not a static PDF.",
        },
        {
          q: "How does Pixora keep identity from freezing creativity?",
          a: "We separate what is fixed (primary palette, wordmark geometry) from what is flexible (campaign art, illustration themes) and review extensions in a lightweight brand desk.",
        },
      ],
      body: `## Why brand systems matter now

Digital products ship in weeks, not seasons. Logos, color tokens, motion rules, and UI patterns have to travel together — from a landing page to an app shell to a campaign microsite — without drifting into five accidental brands.

At Pixora we treat the brand system as product infrastructure. It is not a PDF that sits in a shared drive. It is a living set of decisions that designers, developers, and marketers can apply with confidence.

## Start with principles, not assets

Before you draw marks, write three to five principles that describe how the brand behaves. Examples: “calm under pressure,” “precise over decorative,” “friendly without being cute.” Principles become the filter for every later choice: type, spacing, illustration style, and motion easing.

When teams disagree in critique, principles resolve the tie. That alone saves weeks of subjective debate.

## Tokens that travel

A scalable system needs shared tokens:

- **Color** with semantic names (\`surface\`, \`accent\`, \`danger\`) instead of only hex swatches
- **Type** with roles (\`display\`, \`title\`, \`body\`, \`caption\`) and clear line-height rules
- **Space** on a consistent scale so layouts feel related across web and native
- **Radius, elevation, and stroke** that match the product’s personality

Semantic tokens let engineering map brand to design systems (and back) without rewriting screens when a palette evolves.

## Identity that survives product reality

A logo lockup that only works on a white hero will fail in dark mode, favicons, and app icons. Build a flexible mark family: primary lockup, compact mark, monochrome, and motion-safe versions. Document clear space and minimum sizes — then test them in real UI chrome.

## Governance without freezing creativity

Scaling does not mean saying no to everything. Define what is **fixed** (primary palette, wordmark geometry) versus **flexible** (illustration themes, campaign photography). Give product squads a lightweight extension path: propose a token, show three screens, and review in a weekly brand desk.

## What good looks like

A healthy system feels quiet in everyday UI and expressive where stories need emphasis. Users may never notice the system — they notice clarity. That is the point.

If you are rebuilding identity for a product suite, start with principles and tokens, then let the mark follow. The brands that scale are the ones that stay coherent under shipping pressure.
`,
    },
    tr: {
      title: "Dijital ürünlerde ölçeklenen marka sistemleri",
      excerpt:
        "Logodan ürün arayüzüne kadar tutarlı kalan — ama yaratıcılığı dondurmayan — kimlik sistemleri nasıl kurulur?",
      seoTitle: "Ölçeklenen Marka Sistemleri | Pixora",
      seoDescription:
        "Logodan ürün UI’sine tutarlı marka sistemleri: ilkeler, semantik token’lar ve yönetişim. Pixora — getpixoria.com.",
      faqs: [
        {
          q: "Ölçeklenen marka sistemi nedir?",
          a: "Pazarlama sitesinden ürün arayüzüne kadar tutarlı kalan yaşayan ilkeler, semantik token’lar ve esnek işaret ailesidir; statik bir PDF değildir.",
        },
        {
          q: "Pixora yaratıcılığı nasıl dondurmaz?",
          a: "Sabit olanı (ana palet, wordmark) esnek olandan (kampanya görselleri) ayırır, genişlemeleri hafif bir brand desk’te inceleriz.",
        },
      ],
      body: `## Neden marka sistemi?

Dijital ürünler mevsimlere değil haftalara sığarak çıkıyor. Logo, renk token’ları, motion kuralları ve UI kalıplarının birlikte yol alması gerekir; aksi halde beş farklı “yanlışlıkla oluşmuş” marka doğar.

Pixora’da marka sistemini ürün altyapısı gibi ele alırız. Paylaşılan klasördeki bir PDF değil; tasarımcı, geliştirici ve pazarlamanın güvenle uygulayacağı yaşayan kararlar bütünüdür.

## Önce ilkeler, sonra varlıklar

İşaret çizmeden önce markanın davranışını anlatan üç–beş ilke yazın. İlkeler; tipografi, boşluk, illüstrasyon ve easing tartışmalarında hakem olur.

## Seyahat eden token’lar

Ölçeklenen sistem semantik token ister: \`surface\`, \`accent\`, \`danger\` gibi isimler; rol bazlı tipografi; tutarlı boşluk ölçeği. Semantik isimler, palet evrilse bile ekranları yeniden yazmadan güncellemeyi mümkün kılar.

## Ürün gerçekliğine dayanan kimlik

Yalnızca beyaz hero’da çalışan bir logo, koyu modda ve favicon’da çöker. Esnek bir işaret ailesi kurun; gerçek UI kromunda test edin.

## Yönetişim, yaratıcılığı kilitlemeden

Sabit olanı (ana palet, wordmark geometrisi) ve esnek olanı (kampanya görselleri) ayırın. Ekiplere hafif bir genişletme yolu verin: token öner, üç ekran göster, haftalık brand desk’te gözden geçir.

İyi bir sistem günlük arayüzde sakin, hikâyenin güç istediği yerde ise ifade sahibidir. Kullanıcı sistemi değil netliği fark eder — asıl mesele budur.
`,
    },
    ru: {
      title: "Бренд-системы, которые масштабируются в цифровых продуктах",
      excerpt:
        "Как строить системы идентичности, которые остаются цельными от логотипа до UI — не замораживая креатив.",
      seoTitle: "Масштабируемые бренд-системы | Pixora",
      seoDescription:
        "Системы бренда от логотипа до UI: принципы, семантические токены, управление. Pixora — getpixoria.com.",
      faqs: [
        {
          q: "Что такое масштабируемая бренд-система?",
          a: "Живой набор принципов, семантических токенов и гибкого семейства знака, который держится от маркетинг-сайта до UI продукта — не статичный PDF.",
        },
        {
          q: "Как Pixora не замораживает креатив?",
          a: "Отделяем фиксированное (палитра, wordmark) от гибкого (кампанийные визуалы) и разбираем расширения на лёгком brand desk.",
        },
      ],
      body: `## Зачем нужна система бренда

Цифровые продукты выходят за недели, а не за сезоны. Логотип, цветовые токены, motion-правила и UI-паттерны должны жить вместе — от лендинга до оболочки приложения — иначе получается пять случайных брендов.

В Pixora мы считаем бренд-систему продуктовой инфраструктурой. Это не PDF в общей папке, а живой набор решений для дизайна, разработки и маркетинга.

## Сначала принципы, потом ассеты

До отрисовки знака зафиксируйте 3–5 принципов поведения бренда. Они становятся фильтром для шрифта, отступов, иллюстраций и easing — и снимают бесконечные споры на критике.

## Токены, которые путешествуют

Нужны семантические имена (\`surface\`, \`accent\`, \`danger\`), роли типографики, единая шкала отступов. Так палитра может эволюционировать без переписывания экранов.

## Идентичность, живущая в продукте

Знак, который работает только на белом hero, падает в тёмной теме и favicon. Соберите семейство: основной lockup, компактный знак, монохром, motion-безопасные версии — и проверьте в реальном UI.

## Управление без заморозки креатива

Отделите фиксированное (палитра, геометрия wordmark) от гибкого (кампанийные визуалы). Дайте командам лёгкий путь расширения через еженедельный brand desk.

Хорошая система тиха в повседневном UI и выразительна там, где нужна история. Пользователь замечает ясность — и это главная цель.
`,
    },
  },
  "motion-graphics-that-clarify": {
    en: {
      title: "Motion Graphics That Clarify Product Stories",
      excerpt:
        "Motion should explain, not decorate. A studio playbook for product storytelling with timing, hierarchy, and restraint.",
      seoTitle: "Motion Graphics That Clarify Product Stories | Pixora",
      seoDescription:
        "Use motion graphics to explain product stories — timing, hierarchy, accessibility, and a practical checklist from Pixora Design Studio.",
      faqs: [
        {
          q: "When should a product use motion graphics?",
          a: "When motion clarifies a relationship, sequence, or change of state. If it only “looks cool,” cut it or move it to a brand film.",
        },
        {
          q: "How does Pixora keep motion accessible?",
          a: "We respect prefers-reduced-motion, provide still fallbacks, never convey meaning with motion alone, and keep most UI motion in the 150–320ms range.",
        },
      ],
      body: `## Motion with a job

Motion is easy to overuse. A bounce here, a blur there, and suddenly the product feels busy instead of clear. At Pixora we ask one question before animating: **what does this motion help someone understand?**

If the answer is “it looks cool,” we cut it — or move it to a brand film where spectacle belongs.

## Hierarchy through timing

Viewers read in order. Use duration and delay to create hierarchy:

1. Establish context (layout settles)
2. Reveal the primary claim
3. Support with secondary detail
4. Invite the next action

Keep most UI motion in the 150–320ms range. Longer arcs belong to storytelling sequences, not button feedback.

## Product stories, not decoration

Product explainers work when motion maps to meaning. Show a data flow moving left to right if that is how the system works. Morph a messy state into a tidy dashboard when the feature’s promise is clarity. Sync captions with beats so sound-off viewers still follow.

Storyboards beat improvisation. Even a six-frame board prevents “animation for animation’s sake.”

## Systems for motion

Treat easing, spring configs, and entrance patterns as brand tokens — the same way you treat color. Document:

- Entrance / exit presets for cards and drawers
- Emphasis pulses for alerts (rare, intentional)
- Forbidden patterns (endless loops on content, parallax that fights scroll)

Developers ship faster when motion is specified like type.

## Accessibility is part of craft

Respect \`prefers-reduced-motion\`. Provide still fallbacks for critical information. Never convey meaning with motion alone.

## A practical checklist

- Does this clarify a relationship, sequence, or change of state?
- Can someone get the idea with motion off?
- Is the easing consistent with the rest of the product?
- Did we remove one flourish for every flourish we added?

Motion that clarifies builds trust. Motion that performs for its own sake burns attention. Choose the former — especially on product pages where comprehension drives conversion.
`,
    },
    tr: {
      title: "Ürün hikâyelerini netleştiren motion graphics",
      excerpt:
        "Motion süslemek için değil, anlatmak için vardır. Zamanlama, hiyerarşi ve ölçülülük üzerine stüdyo notları.",
      seoTitle: "Ürün Hikâyesini Netleştiren Motion | Pixora",
      seoDescription:
        "Motion graphics ile ürün hikâyesi: zamanlama, hiyerarşi, erişilebilirlik ve Pixora kontrol listesi.",
      faqs: [
        {
          q: "Üründe motion ne zaman kullanılmalı?",
          a: "İlişkiyi, sırayı veya durum değişimini netleştirdiğinde. Yalnızca “havalı” ise kesin veya marka filmine taşıyın.",
        },
        {
          q: "Pixora motion’ı nasıl erişilebilir tutar?",
          a: "prefers-reduced-motion’a uyarız, hareketsiz yedekler sunarız, anlamı yalnızca harekete bağlamayız; çoğu UI hareketi 150–320ms’dir.",
        },
      ],
      body: `## İşi olan hareket

Animasyon eklemeden önce soruyoruz: **Bu hareket neyi anlamaya yardım ediyor?** Cevap “havalı duruyor” ise keseriz — ya da spektakelin ait olduğu marka filmine taşırız.

## Zamanlama ile hiyerarşi

Önce bağlam otursun, sonra ana vaat, ardından destekleyici detay, en sonda eylem. Çoğu UI hareketi 150–320ms aralığında kalsın; uzun arklar anlatı dizilerine aittir.

## Dekorasyon değil ürün hikâyesi

Veri akışını sistemin gerçek yönünde gösterin. Özellik vaadi “netlik” ise dağınık durumu sade bir panele dönüştürün. Storyboard, “animasyon olsun diye animasyon”u engeller.

## Motion da sistemdir

Easing ve giriş kalıplarını renk gibi belgeleyin. \`prefers-reduced-motion\` saygı ister; anlamı yalnızca harekete bağlamayın.

Kontrol listesi: İlişkiyi / sırayı / durum değişimini netleştiriyor mu? Motion kapalıyken fikir hâlâ anlaşılıyor mu? Her eklediğimiz gösteriş için bir tanesini çıkardık mı?

Netleştiren motion güven üretir. Kendi için sahne alan motion ise dikkat yakar.
`,
    },
    ru: {
      title: "Моушн-графика, которая проясняет продукт-истории",
      excerpt:
        "Motion должен объяснять, а не украшать. Иерархия, тайминг и сдержанность — студийный подход Pixora.",
      seoTitle: "Моушн, который проясняет продукт | Pixora",
      seoDescription:
        "Моушн-графика для продукт-историй: тайминг, иерархия, доступность и чеклист Pixora Design Studio.",
      faqs: [
        {
          q: "Когда продукту нужен motion?",
          a: "Когда движение проясняет связь, последовательность или смену состояния. Если это только «красиво» — режем или уводим в brand-ролик.",
        },
        {
          q: "Как Pixora делает motion доступным?",
          a: "Уважаем prefers-reduced-motion, даём статичные запасные варианты, не кодируем смысл только движением; UI-motion обычно 150–320 мс.",
        },
      ],
      body: `## Движение с задачей

Перед анимацией мы спрашиваем: **что это движение помогает понять?** Если ответ «просто красиво» — режем или уводим в brand-ролик.

## Иерархия через тайминг

Сначала контекст, затем главный тезис, потом детали, в конце действие. Большинство UI-движений — 150–320 мс. Длинные арки — для storytelling, не для кнопок.

## История продукта, не декор

Показывайте поток данных в реальном направлении системы. Если обещание фичи — ясность, морфируйте хаос в спокойный дашборд. Раскадровка из шести кадров уже спасает от «анимации ради анимации».

## Motion как система

Easing и пресеты входа документируйте как бренд-токены. Уважайте \`prefers-reduced-motion\`; не кодируйте смысл только движением.

Чеклист: проясняет ли связь/последовательность/смену состояния? Понятна ли идея без motion? Убрали ли один эффект за каждый добавленный?

Motion, который проясняет, строит доверие. Motion ради шоу сжигает внимание.
`,
    },
  },
  "ux-writing-meets-visual-design": {
    en: {
      title: "When UX Writing and Visual Design Work Together",
      excerpt:
        "Interfaces feel effortless when copy and layout are designed as one system — not two handoffs.",
      seoTitle: "UX Writing and Visual Design as One System | Pixora",
      seoDescription:
        "Pair UX writing with visual design from the first wireframe: hierarchy, CTAs, empty states, and localization. Notes from Pixora.",
      faqs: [
        {
          q: "Why should UX writing start in the wireframe?",
          a: "Copy drafted in real component widths avoids awkward wraps, empty boxes, and CTAs that do not match the visual hierarchy.",
        },
        {
          q: "How does Pixora handle localization in UI copy?",
          a: "We plan EN/TR/RU length early, ship component libraries with sample strings instead of lorem, and critique copy together with composition.",
        },
      ],
      body: `## One interface, one voice

UX writing and visual design are often sequenced as separate phases: first frames, then copy. That split creates empty boxes, awkward line wraps, and buttons that say everything and nothing. Pixora runs copy and layout as a paired craft from the first wireframe.

## Write in the frame

Draft microcopy inside the actual component widths. A headline that sings in a Google Doc may fail at 320px. Designers should see real words early; writers should feel spacing, contrast, and hierarchy.

Shared Figma (or code) files with editable text styles beat annotated screenshots.

## Hierarchy is linguistic and visual

Users scan. Pair typographic scale with content priority:

- **Title** — the decision or destination
- **Support** — one clarifying sentence
- **Action** — a verb that matches the outcome
- **Helper** — rare, and never competing with the CTA

If everything is bold, nothing is. The same is true for copy length.

## Buttons that behave

Good CTAs are specific: “Start free trial,” “Book a studio call,” “Download brand kit.” Avoid vague “Submit” and “Learn more” when the destination is known. Visually, primary actions should outrank secondary ones in weight and color — and the label should deserve that weight.

## Error and empty states deserve design

Empty states are onboarding. Errors are trust moments. Write calm, actionable language and design layouts that keep users oriented. A red outline without a next step is unfinished design.

## Rituals that keep teams aligned

- Kickoffs include voice principles alongside visual principles
- Critiques review copy and composition together
- Component libraries ship with sample strings, not “lorem”
- Localization is planned early so layouts flex for TR/RU/EN length

## The payoff

When writing and visuals share a system, interfaces feel inevitable — like they could not have been designed any other way. That calm is not accidental. It is collaboration, practiced on purpose.
`,
    },
    tr: {
      title: "UX yazımı ile görsel tasarım birlikte çalışınca",
      excerpt:
        "Arayüzler, metin ve yerleşim tek sistem gibi tasarlandığında zahmetsiz hissedilir — iki ayrı teslimat gibi değil.",
      seoTitle: "UX Yazımı ve Görsel Tasarım Tek Sistem | Pixora",
      seoDescription:
        "İlk wireframe’den itibaren UX yazımı ve görsel tasarım: hiyerarşi, CTA, boş durumlar ve lokalizasyon. Pixora notları.",
      faqs: [
        {
          q: "UX metni neden wireframe’de yazılmalı?",
          a: "Gerçek bileşen genişliğinde yazılan kopya, garip satır kırılımlarını, boş kutuları ve görsel hiyerarşiyle uyumsuz CTA’ları önler.",
        },
        {
          q: "Pixora arayüz metninde lokalizasyonu nasıl ele alır?",
          a: "EN/TR/RU uzunluğunu erken planlarız, kütüphanelerde lorem yerine örnek string taşırız, metni kompozisyonla birlikte eleştiririz.",
        },
      ],
      body: `## Tek arayüz, tek ses

Önce çerçeve, sonra metin sırası boş kutular ve garip satır kırılımları üretir. Pixora’da kopya ile yerleşimi ilk wireframe’den itibaren birlikte yürütürüz.

## Çerçevenin içinde yazın

Mikro metni gerçek bileşen genişliğinde taslaklayın. Google Doc’ta parlayan başlık 320px’te düşebilir. Ortak dosyalar, anotasyonlu ekran görüntülerinden iyidir.

## Hiyerarşi dilsel ve görseldir

Başlık kararı/hedefi söylesin; destek bir cümle olsun; eylem sonucu anlatan bir fiil taşısın. Her şey kalınsa hiçbir şey kalın değildir — metin uzunluğu için de geçerlidir.

## Davranan butonlar

“Gönder” ve belirsiz “Daha fazla bilgi” yerine spesifik CTA’lar kullanın. Birincil eylem görsel ağırlığı hak etmeli.

## Boş ve hata durumları da tasarım

Boş durum onboarding’dir; hata güven anıdır. Sakin, eyleme geçen dil ve yönünü kaybettirmeyen yerleşim şarttır.

Ritüeller: ses ilkeleri görsel ilkelerle birlikte; eleştiride metin+kompozisyon birlikte; bileşen kütüphanesinde lorem yerine örnek string; lokalizasyon erken planlanır.

Metin ve görsel aynı sistemi paylaşınca arayüz kaçınılmaz hissedilir. O sakinlik tesadüf değil, bilinçli iş birliğidir.
`,
    },
    ru: {
      title: "Когда UX-тексты и визуальный дизайн работают вместе",
      excerpt:
        "Интерфейсы ощущаются лёгкими, когда копирайтинг и вёрстка — одна система, а не два хэндоффа.",
      seoTitle: "UX-тексты и визуал как одна система | Pixora",
      seoDescription:
        "UX-копирайтинг вместе с визуалом с первого вайрфрейма: иерархия, CTA, пустые состояния, локализация. Заметки Pixora.",
      faqs: [
        {
          q: "Почему UX-тексты писать в вайрфрейме?",
          a: "Копирайт в реальной ширине компонента избавляет от странных переносов, пустых боксов и CTA, которые не совпадают с визуальной иерархией.",
        },
        {
          q: "Как Pixora локализует UI-тексты?",
          a: "Планируем длину EN/TR/RU заранее, в библиотеке — примеры строк вместо lorem, критикуем текст вместе с композицией.",
        },
      ],
      body: `## Один интерфейс — один голос

Схема «сначала макеты, потом тексты» даёт пустые боксы и странные переносы. В Pixora копирайтинг и визуал идут парой с первого вайрфрейма.

## Пишите в рамке

Черновите микротексты в реальной ширине компонента. Заголовок из Docs может сломаться на 320px. Общие файлы лучше скриншотов с аннотациями.

## Иерархия языковая и визуальная

Заголовок — решение или цель; поддержка — одно предложение; действие — глагол про результат. Если всё жирное — ничего не важно. То же про длину текстов.

## Кнопки с поведением

Вместо «Отправить» и туманного «Подробнее» — конкретные CTA. Визуальный вес primary должен соответствовать силе формулировки.

## Пустые и ошибочные состояния — тоже дизайн

Пустое состояние — онбординг; ошибка — момент доверия. Спокойный actionable язык и ориентация в макете обязательны.

Ритуалы: голосовые принципы рядом с визуальными; критика текста и композиции вместе; в библиотеке — примеры строк, не lorem; локализация планируется рано.

Когда текст и визуал — одна система, интерфейс ощущается неизбежным. Это не случайность, а сотрудничество.
`,
    },
  },
  "design-studio-website-that-converts": {
    en: {
      title: "Building a Design Studio Website That Converts",
      excerpt:
        "Portfolio beauty is not enough. Structure, proof, and clear next steps turn visitors into clients.",
      seoTitle: "Design Studio Website That Converts | Pixora",
      seoDescription:
        "How a design studio website converts: positioning, case studies, process, SEO, and trust — the checklist we use at getpixoria.com.",
      faqs: [
        {
          q: "What makes a design studio website convert?",
          a: "Clear positioning, case studies with constraints and results, a calm process, real proof, fast performance, and a human primary CTA.",
        },
        {
          q: "Is SEO part of studio-site craft?",
          a: "Yes. Canonical URLs, honest meta descriptions, and Core Web Vitals are design decisions. Slow heroes lose leads.",
        },
      ],
      body: `## Beauty is table stakes

A design studio website has to look sharp. Visitors expect craft. But craft alone does not book projects. Conversion comes from clarity: who you help, how you work, proof that you ship, and an obvious next step.

We rebuilt our own thinking around getpixoria.com with that lens — and we use the same checklist with clients.

## Lead with outcomes, not adjectives

“Creative,” “passionate,” and “full-service” appear on every studio site. Replace them with outcomes: faster launches, clearer product stories, brand systems that survive the next three releases. Case studies should name the constraint and the result.

## Structure that sells without shouting

A converting studio site usually includes:

1. **Sharp positioning** above the fold
2. **Selected work** with context, not only aesthetics
3. **Services** framed as problems you solve
4. **Process** that reduces buyer anxiety
5. **Proof** — metrics, quotes, logos, awards when real
6. **Contact** that feels human and low-friction

Navigation should be short. Every extra link dilutes attention.

## Case studies that work hard

Show the brief, the decision, and the artifact. Include one paragraph on tradeoffs. Motion reels are powerful when they explain a product moment, not only when they impress peers.

## Speed and SEO are design

Slow heroes lose leads. Unclear titles lose search. Set a canonical base URL, write real meta descriptions, and keep Core Web Vitals in the craft conversation. Studio sites are products too.

## CTAs with manners

Primary CTA: start a conversation. Secondary: view work or download a capability overview. Repeat the primary CTA after proof sections. Avoid dark patterns — trust is the product you are selling.

## Measure what matters

Track inquiry quality, not only traffic. If visits rise and briefs stay vague, your positioning is soft. Tighten the story until the right clients self-select.

A studio website converts when it feels like the first meeting went well: clear, credible, and easy to continue.
`,
    },
    tr: {
      title: "Dönüşüm sağlayan bir tasarım stüdyosu sitesi kurmak",
      excerpt:
        "Portföy güzelliği yetmez. Yapı, kanıt ve net sonraki adımlar ziyaretçiyi müşteriye çevirir.",
      seoTitle: "Dönüşen Stüdyo Web Sitesi | Pixora",
      seoDescription:
        "Tasarım stüdyosu sitesi nasıl dönüşür: konumlandırma, case study, süreç, SEO ve güven — getpixoria.com kontrol listesi.",
      faqs: [
        {
          q: "Stüdyo sitesini ne dönüştürür?",
          a: "Keskin konumlandırma, kısıt ve sonuçlu case study’ler, sakin süreç, gerçek kanıt, hızlı performans ve insani birincil CTA.",
        },
        {
          q: "SEO stüdyo sitesinin zanaatının parçası mı?",
          a: "Evet. Canonical URL, dürüst meta açıklamalar ve Core Web Vitals tasarım kararıdır. Yavaş hero lead kaybettirir.",
        },
      ],
      body: `## Güzellik eşik şart

Stüdyo sitesi keskin görünmeli. Ama yalnızca zanaat proje getirmez. Dönüşüm netlikten gelir: kime yardım ettiğiniz, nasıl çalıştığınız, teslim kanıtı ve bariz sonraki adım.

getpixoria.com için düşündüğümüz çerçeveyi müşterilerimizle de kullanıyoruz.

## Sıfat değil sonuç

“Yaratıcı” ve “full-service” her sitede var. Bunları sonuçlarla değiştirin: daha hızlı lansman, daha net ürün hikâyesi, sonraki üç sürümü taşıyan marka sistemi.

## Bağırmadan satan yapı

Keskin konumlandırma, bağlamlı işler, problem olarak çerçevelenmiş hizmetler, kaygıyı azaltan süreç, gerçek kanıt, insanî iletişim. Kısa navigasyon; her fazla link dikkati böler.

## Çalışan case study

Brifi, kararı ve çıktıyı gösterin. Tradeoff’a bir paragraf ayırın. Motion, yalnızca meslektaş etkilemek için değil ürün anını açıklamak için güçlenir.

## Hız ve SEO da tasarım

Yavaş hero lead kaybettirir. Canonical URL, gerçek meta açıklamalar ve performans, zanaat konuşmasının parçasıdır.

Birincil CTA konuşmayı başlatsın; kanıttan sonra tekrar edin. Karanlık desenlerden kaçının — sattığınız şey güvendir.

Ziyaretten çok brief kalitesini ölçün. Doğru müşteri kendini seçene kadar hikâyeyi sıkılaştırın.
`,
    },
    ru: {
      title: "Сайт дизайн-студии, который конвертирует",
      excerpt:
        "Красоты портфолио мало. Структура, доказательства и ясный следующий шаг превращают визиты в клиентов.",
      seoTitle: "Сайт студии, который конвертирует | Pixora",
      seoDescription:
        "Как сайт дизайн-студии конвертирует: позиционирование, кейсы, процесс, SEO и доверие — чеклист getpixoria.com.",
      faqs: [
        {
          q: "Что конвертирует сайт студии?",
          a: "Жёсткое позиционирование, кейсы с ограничением и результатом, спокойный процесс, реальные доказательства, скорость и человечный primary CTA.",
        },
        {
          q: "SEO — часть крафта студийного сайта?",
          a: "Да. Canonical, честные meta и Core Web Vitals — дизайнерские решения. Медленный hero теряет лиды.",
        },
      ],
      body: `## Красота — необходимый минимум

Сайт студии должен выглядеть сильно. Но крафт сам по себе не бронирует проекты. Конверсия — это ясность: кому помогаете, как работаете, доказательства поставки и очевидный следующий шаг.

Тот же чеклист мы применяем к getpixoria.com и к клиентским проектам.

## Результаты вместо прилагательных

«Креативные» и «full-service» есть у всех. Замените исходами: быстрее запуски, яснее продукт-история, система бренда на три релиза вперёд.

## Структура, которая продаёт без крика

Жёсткое позиционирование, работы с контекстом, услуги как решаемые проблемы, процесс против тревоги, реальные доказательства, человечный контакт. Короткая навигация.

## Кейсы, которые работают

Покажите бриф, решение и артефакт. Один абзац про tradeoff. Motion силён, когда объясняет продуктовый момент.

## Скорость и SEO — тоже дизайн

Медленный hero теряет лиды. Canonical, честные meta и перформанс — часть крафта. Primary CTA — начать разговор; повторите после доказательств. Без тёмных паттернов: вы продаёте доверие.

Мерьте качество запросов, не только трафик. Сжимайте историю, пока нужные клиенты выбирают вас сами.
`,
    },
  },
  "ai-tools-in-creative-workflows": {
    en: {
      title: "AI Tools in Creative Workflows Without Losing Craft",
      excerpt:
        "Treat AI as a sharp assistant, not an autopilot — keep taste, critique, and authorship in the loop.",
      seoTitle: "AI Tools in Creative Workflows Without Losing Craft | Pixora",
      seoDescription:
        "Where AI helps design teams — and where human craft must stay. Pixora’s workflow for speed with authorship intact.",
      faqs: [
        {
          q: "Should design studios use AI tools?",
          a: "Yes, as accelerators for exploration, drafts, and grunt work. Strategy, ethics, and final art direction stay human at Pixora.",
        },
        {
          q: "How does Pixora keep authorship when using AI?",
          a: "Humans own the brief, selection, refinement, and sign-off. Useful prompts are documented as inputs, not as the work itself.",
        },
      ],
      body: `## Speed is not the strategy

AI tools can draft options in seconds. That is useful. It is not a substitute for taste, research, or accountability. At Pixora we use AI where it compresses grunt work — and we protect the parts of the process where judgment lives.

## Where AI helps

- Exploring moodboard directions faster
- Generating first-pass copy variants for critique
- Expanding alt text drafts and localization stubs
- Cleaning transcripts from client interviews
- Suggesting edge cases in UX flows

These are accelerators. Humans still choose.

## Where craft must stay human

Brand strategy, conceptual leaps, ethical calls, and final art direction remain studio-owned. Clients hire Pixora for point of view. An undifferentiated model output is not a point of view.

We also refuse to ship likenesses, trademarked styles, or client-confidential material into tools that are not cleared for that use.

## A workflow that keeps authorship

1. **Brief** — humans define problem, audience, constraints
2. **Explore** — AI optional for breadth; sketching still welcome
3. **Select** — critique against principles, not novelty
4. **Refine** — craft in the tools of record (design systems, code, motion)
5. **Sign off** — named owners, not “the model made it”

Document prompts that were useful the way you document references — as inputs, not as the work.

## Quality bar

If a frame could have come from anyone, it is not ready. Push until the work has a studio fingerprint: pacing, typography, metaphor, restraint.

## Teaching the team

Run short internal labs: same brief, with and without AI, then compare critique notes. The goal is literacy — knowing when the tool adds leverage and when it flattens ideas.

AI belongs in creative workflows as a sharp assistant. Keep craft, critique, and authorship in the loop, and the work stays yours.
`,
    },
    tr: {
      title: "Zanaatı kaybetmeden yaratıcı süreçte yapay zekâ araçları",
      excerpt:
        "YZ’yi otomatik pilot değil keskin bir asistan gibi kullanın — zevk, eleştiri ve yazarlık döngüde kalsın.",
      seoTitle: "Yaratıcı Süreçte YZ, Zanaat Kayıpsız | Pixora",
      seoDescription:
        "YZ tasarım ekiplerine nerede yardım eder, zanaat nerede insanda kalır. Pixora’nın yazarlığı koruyan iş akışı.",
      faqs: [
        {
          q: "Tasarım stüdyoları YZ kullanmalı mı?",
          a: "Evet, keşif, taslak ve angarya için hızlandırıcı olarak. Strateji, etik ve final art direction Pixora’da insanda kalır.",
        },
        {
          q: "Pixora YZ kullanırken yazarlığı nasıl korur?",
          a: "Brief, seçim, rafine ve onay insanlara aittir. Yararlı prompt’lar işin kendisi değil, girdi olarak belgelenir.",
        },
      ],
      body: `## Hız strateji değil

YZ saniyeler içinde seçenek üretebilir. Bu faydalıdır; zevkin, araştırmanın ve sorumluluğun yerine geçmez. Pixora’da angarya işi sıkıştırdığı yerde kullanır, yargının yaşadığı adımları koruruz.

## Nerede işe yarar?

Moodboard yönlerini hızlandırmak, eleştiri için ilk kopya varyantları, alt metin taslakları, görüşme deşifreleri, UX akışında uç durum önerileri. Bunlar hızlandırıcıdır; seçimi insan yapar.

## Zanaatın insan kalması gereken yer

Marka stratejisi, kavramsal sıçrama, etik kararlar ve final art direction stüdyoya aittir. Müşteri bakış açısı için gelir; anonim model çıktısı bakış açısı değildir. İzinsiz araçlara gizli müşteri materyali sokmayız.

## Yazarlığı koruyan akış

Brief (insan) → keşif (YZ isteğe bağlı) → seçim (ilke ile eleştiri) → rafine (kayıt araçlarında zanaat) → onay (isimli sahipler). Yararlı prompt’ları referans gibi belgelendirin — işin kendisi gibi değil.

Herkesten çıkabilecek bir kare hazır değildir. Tempo, tipografi, metafor ve ölçülülük stüdyo parmak izi bırakana kadar itin.

YZ keskin bir asistandır. Zanaat, eleştiri ve yazarlık döngüde kaldıkça iş sizin kalır.
`,
    },
    ru: {
      title: "ИИ-инструменты в креативных процессах без потери крафта",
      excerpt:
        "Относитесь к ИИ как к острому ассистенту, а не автопилоту — вкус, критика и авторство остаются в цикле.",
      seoTitle: "ИИ в креативе без потери крафта | Pixora",
      seoDescription:
        "Где ИИ помогает дизайн-командам — и где крафт остаётся человеческим. Процесс Pixora со сохранённым авторством.",
      faqs: [
        {
          q: "Стоит ли студиям использовать ИИ?",
          a: "Да, как ускоритель исследования, черновиков и рутины. Стратегия, этика и финальный art direction в Pixora остаются за людьми.",
        },
        {
          q: "Как Pixora сохраняет авторство с ИИ?",
          a: "Бриф, отбор, доводка и подпись — за людьми. Полезные промпты документируются как входы, не как сама работа.",
        },
      ],
      body: `## Скорость — не стратегия

ИИ за секунды даёт варианты. Это полезно, но не заменяет вкус, исследование и ответственность. В Pixora ускоряем рутину и защищаем зоны суждения.

## Где помогает

Быстрые moodboard-направления, черновые варианты копира для критики, черновики alt-текстов, расшифровки интервью, гипотезы edge-case в UX. Ускорители; выбор за людьми.

## Где крафт остаётся человеческим

Стратегия бренда, концептуальный скачок, этика и финальный art direction — за студией. Клиент нанимает точку зрения; безликий вывод модели — не она. Секретные материалы клиентов не отправляем в несогласованные инструменты.

## Процесс с авторством

Бриф → исследование (ИИ опционально) → отбор по принципам → доводка в рабочих инструментах → подпись ответственными. Полезные промпты документируйте как референсы — не как работу.

Если кадр мог сделать кто угодно — он не готов. Темп, типографика, метафора и сдержанность должны оставить отпечаток студии.

ИИ — острый ассистент. Пока крафт, критика и авторство в цикле, работа остаётся вашей.
`,
    },
  },
  "from-identity-to-launch": {
    en: {
      title: "From Identity to Launch: A Practical Branding Process",
      excerpt:
        "A field-tested path from discovery to brand system to launch assets — with checkpoints that keep teams aligned.",
      seoTitle: "From Identity to Launch: Branding Process | Pixora",
      seoDescription:
        "A practical branding process from discovery to launch: positioning, identity system, product application, and checkpoints. Pixora Design Studio.",
      faqs: [
        {
          q: "What are the stages of Pixora’s branding process?",
          a: "Discovery, positioning and narrative, visual exploration, identity system, product and campaign application, then a named launch checklist.",
        },
        {
          q: "When should executives approve branding work?",
          a: "At positioning — before the logo reveal — then at direction choice, system lock, and launch owners. That separates decisions from production.",
        },
      ],
      body: `## A process you can actually run

Branding projects fail in the gaps: fuzzy discovery, endless exploration, or a gorgeous identity that never makes it into the product. Pixora uses a practical path from identity to launch with explicit checkpoints.

## 1. Discovery

Listen before you draw. Stakeholder interviews, competitor audit, audience language, and product constraints. Capture a one-page problem statement and success metrics. If discovery is skipped, design becomes decoration.

## 2. Positioning and narrative

Write the story: who it is for, why it exists now, and what it refuses to be. This narrative steers verbal identity and visual direction. Align executives here — not after the logo reveal.

## 3. Visual exploration

Present two or three coherent directions, not twelve fragmented moods. Each direction includes type, color, mark ideas, and a UI peek so stakeholders see product reality early.

## 4. Identity system

Lock the mark family, palette, type, photography/illustration rules, and motion principles. Build tokens and a lightweight guide. Prefer living documentation over a 90-page PDF nobody opens.

## 5. Product and campaign application

Apply the system to the highest-visibility surfaces first: product shell, marketing site, launch deck, social templates. Fix friction in real layouts before expanding to edge cases.

## 6. Launch

Ship a checklist: favicon to og:image, email signature to announcement motion, press kit to internal Slack banner. Assign owners. Schedule a post-launch audit two weeks later to catch drift.

## Checkpoints that keep teams sane

- Written approval at positioning
- Direction choice before deep craft
- System lock before wide application
- Launch checklist with names and dates

## Why this works

The process separates **decisions** from **production**. People know when to debate and when to build. That is how identity reaches the market intact — and how teams start the next sprint without reinventing the brand.

From identity to launch is not a straight line, but it does not have to be chaos. Clear stages, shared principles, and application in real product surfaces turn branding into an asset the whole company can use.
`,
    },
    tr: {
      title: "Kimlikten lansmana: pratik bir branding süreci",
      excerpt:
        "Keşiften marka sistemine ve lansman varlıklarına — ekipleri hizada tutan kontrol noktalarıyla saha testli bir yol.",
      seoTitle: "Kimlikten Lansmana Branding Süreci | Pixora",
      seoDescription:
        "Keşiften lansmana pratik branding: konumlandırma, kimlik sistemi, ürün uygulaması ve kontrol noktaları. Pixora Tasarım Stüdyosu.",
      faqs: [
        {
          q: "Pixora branding sürecinin aşamaları neler?",
          a: "Keşif, konumlandırma ve anlatı, görsel keşif, kimlik sistemi, ürün ve kampanya uygulaması, ardından isimli lansman kontrol listesi.",
        },
        {
          q: "Yöneticiler branding’i ne zaman onaylamalı?",
          a: "Logo sunumundan önce konumlandırmada; sonra yön seçimi, sistem kilidi ve lansman sahipleri. Karar ile üretim ayrılır.",
        },
      ],
      body: `## Gerçekten yürütülebilir bir süreç

Branding projeleri boşluklarda düşer: bulanık keşif, bitmeyen explorasyon veya ürüne hiç girmeyen güzel kimlik. Pixora, kimlikten lansmana net kontrol noktalı pratik bir yol izler.

## 1. Keşif

Çizmeden önce dinleyin. Paydaş görüşmeleri, rakip auditi, kitle dili, ürün kısıtları. Tek sayfalık problem ve başarı metrikleri. Keşif atlanırsa tasarım dekorasyona iner.

## 2. Konumlandırma ve anlatı

Kimin için, neden şimdi, neyi reddettiği. Bu anlatı sözlü ve görsel kimliği yönetir. Logo sunumundan önce hizalanın.

## 3. Görsel keşif

On iki parçalı mood değil, iki–üç tutarlı yön. Her yönde tip, renk, işaret fikri ve erken bir UI önizlemesi olsun.

## 4. Kimlik sistemi

İşaret ailesi, palet, tip, görsel kurallar, motion ilkeleri. Token’lar ve hafif bir rehber. Kimsenin açmadığı 90 sayfalık PDF yerine yaşayan dokümantasyon.

## 5. Ürün ve kampanya uygulaması

Önce en görünür yüzeyler: ürün kabuğu, pazarlama sitesi, lansman deck’i, sosyal şablonlar. Kenar vakalara genişlemeden önce gerçek yerleşimdeki sürtünmeyi çözün.

## 6. Lansman

Favicon’dan og:image’a, imzadan duyuru motion’ına kontrol listesi. Sahipler atayın. İki hafta sonra drift denetimi planlayın.

Kontrol noktaları: konumlandırmada yazılı onay, derin zanaattan önce yön seçimi, geniş uygulamadan önce sistem kilidi, isimli lansman listesi.

Süreç **karar** ile **üretimi** ayırır. Tartışma zamanı ile inşa zamanı netleşir. Böylece kimlik pazara bütün ulaşır.
`,
    },
    ru: {
      title: "От идентичности до запуска: практичный брендинг-процесс",
      excerpt:
        "Проверенный путь от discovery к системе бренда и launch-ассетам — с чекпоинтами для команды.",
      seoTitle: "От идентичности до запуска | Pixora",
      seoDescription:
        "Практичный брендинг от discovery до запуска: позиционирование, система идентичности, продукт и контрольные точки. Pixora.",
      faqs: [
        {
          q: "Какие этапы брендинга у Pixora?",
          a: "Discovery, позиционирование и нарратив, визуальные направления, система идентичности, применение в продукте и кампании, затем именной launch-чеклист.",
        },
        {
          q: "Когда руководству согласовывать брендинг?",
          a: "На позиционировании — до презентации логотипа — затем выбор направления, lock системы и владельцы запуска. Так решения отделяются от продакшена.",
        },
      ],
      body: `## Процесс, который реально выполняется

Брендинг ломается в зазорах: размытый discovery, бесконечные поиски или красивая идентичность вне продукта. Pixora ведёт путь от идентичности к запуску с явными контрольными точками.

## 1. Discovery

Слушайте до отрисовки. Интервью, аудит конкурентов, язык аудитории, продуктовые ограничения. Одна страница проблемы и метрик успеха.

## 2. Позиционирование и нарратив

Для кого, почему сейчас, от чего отказываетесь. Согласуйте это до презентации логотипа.

## 3. Визуальные направления

Два–три цельных направления, не двенадцать обрывков. В каждом — шрифт, цвет, знак и ранний взгляд на UI.

## 4. Система идентичности

Семейство знака, палитра, тип, правила визуала, принципы motion. Токены и лёгкий гайд вместо мёртвого 90-страничного PDF.

## 5. Применение в продукте и кампании

Сначала самые видимые поверхности: shell продукта, маркетинг-сайт, launch-deck, соцшаблоны. Уберите трение в реальных макетах до крайних кейсов.

## 6. Запуск

Чеклист от favicon до og:image и motion-анонса. Имена владельцев. Аудит дрейфа через две недели.

Контрольные точки отделяют **решения** от **продакшена**. Так идентичность выходит на рынок целой — и команда не изобретает бренд заново на следующем спринте.
`,
    },
  },
};

export function getBlogArticleCopy(
  slug: string,
  locale: string,
): BlogLocaleCopy | undefined {
  const article = BLOG_ARTICLES[slug];
  if (!article) return undefined;
  if (locale === "tr" || locale === "ru") return article[locale];
  return article.en;
}
