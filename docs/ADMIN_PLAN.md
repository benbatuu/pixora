# Pixora Admin Panel — Uygulama Planı

> Kaynak: bu dosya admin geliştirmesinin tek referansıdır. Adımlar sırayla tamamlanır; bir faz bitmeden sonrakine geçilmez (aksi belirtilmedikçe).
>
> Son güncelleme: 2026-09-10 (Faz 8 tamam)  
> Stack hedefi: Next.js App Router · Tailwind · Neon PostgreSQL · Prisma · REST/Route Handlers · i18n

---

## 0. Mevcut durum (tamamlandı)

- [x] Public site (Home, About, Services, Projects, Blog, Contact) — Pixora referansına yakın
- [x] Site chrome: Header / Footer / PageTransition / Lenis+GSAP
- [x] Tailwind-only migration; sabit renkler (`#e11010`, `#0a0a0a`, Inter / Thunder)
- [x] Admin **iskeleti** (`/admin`):
  - Shell: Sidebar + Topbar
  - Modüller (UI stub): Dashboard, Sayfalar, Projeler, Blog, Medya, Mesajlar, Ayarlar
  - Login sayfası (auth yok)
  - Veri hâlâ `app/data/*.ts` stub’ları

**Eksik (bu planın konusu):** gerçek DB, API, auth, i18n, CRUD, public sitenin DB’den beslenmesi, medya upload, iletişim formu kalıcılığı.

---

## 1. Hedef

Gelişmiş bir CMS admin paneli:

1. **Uçtan uca içerik yönetimi** — sayfa bölümleri, projeler, blog, medya, menü/footer, SEO, iletişim mesajları
2. **Çoklu dil (i18n)** — dil eklenebilir; tüm metin içerikleri dil bazlı yönetilir
3. **API** — admin UI ve (gerekirse) harici istemciler için Route Handler / typed API katmanı
4. **Neon PostgreSQL** — tek kaynak gerçeklik; Prisma ORM
5. **Public site** — production’da stub yerine DB (veya build-time / ISR cache) üzerinden render

Admin dili (UI chrome): **Türkçe**. Site içerik dilleri: başlangıçta `en` (+ istenen diğerleri); dinamik dil kaydı.

**Bileşenler** (`/admin/components`) = footer / offcanvas per-locale chrome (`Setting.site.chrome`).

---

## 2. Mimari özet

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Public site    │────▶│  lib/content (read)  │────▶│  Neon Postgres  │
│  app/(site)/*   │     │  + cache/revalidate  │     │  (Prisma)       │
└─────────────────┘     └──────────────────────┘     └────────▲────────┘
                                                              │
┌─────────────────┐     ┌──────────────────────┐              │
│  Admin UI       │────▶│  /api/admin/*        │──────────────┘
│  app/admin/*    │     │  (auth + validation) │
└─────────────────┘     └──────────────────────┘
         │
         └── /api/public/*  (opsiyonel: contact form POST, read-only feed)
```

**Kurallar**

- Yazma işlemleri yalnızca authenticated admin API üzerinden
- Public site doğrudan Prisma’ya okuma yapabilir; yazma yok
- Zod ile request validation
- Hassas env: `DATABASE_URL`, `ADMIN_SESSION_SECRET` (veya Auth provider secrets) — asla client’a sızmaz

---

## 3. Teknoloji seçimleri

| Alan | Seçim | Not |
|------|--------|-----|
| DB | **Neon PostgreSQL** | Serverless-friendly connection string |
| ORM | **Prisma** | Schema + migrate; Prisma Postgres adapter gerekirse |
| Auth | **Credentials + iron-session / Lucia veya NextAuth credentials** (Faz 2’de netleştir) | Tek admin kullanıcıyla başla; sonra roller |
| Validation | **Zod** | API + form |
| Upload | **Vercel Blob** veya **S3-compatible (R2)** | Neon dosya tutmaz; URL + metadata DB’de |
| i18n | DB-driven translations + `locale` | next-intl opsiyonel; önce içerik i18n |
| API | App Router `app/api/.../route.ts` | REST; OpenAPI dokümanı opsiyonel Faz 7 |

---

## 4. Veri modeli (Prisma — taslak)

> İsimler uygulama sırasında ince ayarlanabilir; ilişkiler korunur.

### 4.1 Kimlik & sistem

- `User` — id, email, name, passwordHash, role (`ADMIN` \| `EDITOR`), createdAt
- `Session` — (seçilen auth’a göre; NextAuth kullanırsak ayrı tablo)
- `Locale` — code (`en`, `tr`, …), name, isDefault, isActive, sortOrder
- `Setting` — key/value JSON (studio email, phone, socials, SEO defaults) **veya** typed `SiteSettings` + `SiteSettingsTranslation`

### 4.2 Sayfa içerikleri (flexible sections)

- `Page` — key (`home` \| `about` \| `services` \| `contact` \| …), status
- `PageSection` — pageId, sectionKey (`hero`, `faq`, `offices`, …), sortOrder, type
- `PageSectionTranslation` — sectionId, localeId, payload **Json** (alanlar section tipine göre)

Böylece yeni dil eklemek = yeni `Locale` + translation satırları; yeni bölüm = section + translations.

### 4.3 Projeler & blog

- `Project` — slug, status, year, coverUrl, siteUrl, sortOrder, publishedAt
- `ProjectTranslation` — localeId, title, about, client, expertise, duration, designer, meta…
- `ProjectTag` / join veya tags string[] Json
- `ProjectImage` — url, alt, sortOrder
- `Post` — slug, status, coverUrl, category, publishedAt, authorId?
- `PostTranslation` — localeId, title, excerpt, body (Markdown/HTML), seoTitle, seoDescription

### 4.4 Medya & iletişim

- `MediaAsset` — url, path, filename, mime, bytes, width?, height?, alt?, createdAt, uploadedById
- `ContactMessage` — name, email, subject, body, locale?, readAt, archivedAt, createdAt
- `ContactForm` (opsiyonel) — form field config per locale

### 4.5 Navigasyon

- `NavItem` — location (`header` \| `footer` \| `offcanvas`), href, sortOrder, parentId?
- `NavItemTranslation` — localeId, label

---

## 5. Klasör / dosya hedef yapısı

Mevcut iskelet korunur; altına API + DB katmanı eklenir:

```
prisma/
  schema.prisma
  migrations/
  seed.ts                 # mevcut app/data stub → DB

app/api/
  admin/
    auth/[...]/route.ts
    locales/route.ts
    pages/...
    projects/...
    posts/...
    media/...
    messages/...
    settings/...
  public/
    contact/route.ts      # site contact form POST
    # opsiyonel read endpoints

lib/
  admin/                  # mevcut nav/types (genişler)
  db/
    prisma.ts             # singleton client
  api/
    auth.ts
    errors.ts
    validate.ts
  content/                # public read helpers (getPage, getProjects…)
  i18n/
    config.ts
    getLocale.ts

app/admin/(panel)/...     # mevcut UI → gerçek formlar
app/(site)/...            # stub → content layer

.env.local                # DATABASE_URL, vs. (gitignore’da)
docs/ADMIN_PLAN.md        # bu dosya
```

---

## 6. Fazlar (sırayla)

### Faz 1 — Altyapı: Neon + Prisma + env

**Amaç:** DB bağlantısı ve schema v1 ayakta.

- [x] Neon proje + connection string (`DATABASE_URL`, gerekirse pooled `DATABASE_URL_UNPOOLED`)
- [x] `prisma` / `@prisma/client` kurulumu, `prisma/schema.prisma`
- [x] İlk migration (User, Locale, Setting minimum + Project/Post iskeleti) — `20260910154104_init_cms`
- [x] `lib/db/prisma.ts` singleton
- [x] Scripts: `db:migrate`, `db:seed`, `db:studio`, `db:generate` (`package.json`)
- [x] Seed: `en` locale + mevcut `PROJECTS` / `BLOG_POSTS` / `SITE_SETTINGS` / nav / messages import
- [x] `.env.example` (secret yok, sadece key isimleri)

**Bitiş kriteri:** `prisma studio` veya basit script ile Neon’da satır görünüyor; seed tekrar çalıştırılabilir. ✅ (2026-09-10)

**Not:** `DATABASE_URL` şu an pooler; ileride migrate sorun olursa Neon direct URL’yi `DATABASE_URL_UNPOOLED` + schema `directUrl` ekle.

---

### Faz 2 — Auth + admin koruma

**Amaç:** `/admin` sadece oturum açmış kullanıcıya açık.

- [x] Auth seçimi kilitle (öneri: credentials + signed cookie session; tek `ADMIN` user)
- [x] Login API + logout; password hash (bcrypt/argon2)
- [x] `middleware.ts`: `/admin/*` (login hariç) koruması; `/api/admin/*` koruması
- [x] Login UI’yi gerçek API’ye bağla
- [x] Seed admin user (`ADMIN_EMAIL` / `ADMIN_PASSWORD` env ile)

**Bitiş kriteri:** Cookie olmadan `/admin` → login; login sonrası dashboard; logout çalışır. ✅ (2026-09-10)

**Not:** Session cookie `pixora_admin_session` (jose HS256). Sync: `pnpm db:sync-admin`.

---

### Faz 3 — API çekirdeği + Locals / Settings

**Amaç:** Typed admin API kalıbı + dil ve site ayarları CRUD.

- [x] Ortak API helpers: `ok`, `err`, Zod parse, `requireAdmin`
- [x] `Locale` CRUD (ekle / aktif-pasif / default seç)
- [x] `Settings` get/update (iletişim, sosyal, SEO defaults)
- [x] Admin UI: **Ayarlar** + **Diller** (Ayarlar altında veya ayrı nav: `Diller`)
- [x] Nav’a “Diller” maddesi (gerekirse `lib/admin/nav.ts`)

**Bitiş kriteri:** Admin’den yeni dil eklenebiliyor; settings Neon’a yazılıyor. ✅ (2026-09-10)

**Not:** Helpers `lib/api/*`; UI `/admin/locales`, `/admin/settings`; API `/api/admin/locales`, `/api/admin/settings`.

---

### Faz 4 — Projeler & Blog (tam CRUD)

**Amaç:** En net entity’ler önce; liste + create/edit/delete + publish.

- [x] API: projects, posts (+ translations by locale)
- [x] Admin listeleri: gerçek DB (stub kaldır)
- [x] Create / edit formları (TR UI, içerik alanları locale tab’li)
- [x] Publish / draft / archive
- [x] Slug unique validation
- [x] Public `app/data/projects.ts` & `blog.ts` → `lib/content/*` okuma (fallback: seed data sadece empty DB)

**Bitiş kriteri:** Admin’de proje/yazı ekle-düzenle-sil; public `/projects` ve `/blog` DB’den geliyor. ✅ (2026-09-10)

**Not:** Admin formlar `ProjectForm` / `PostForm`; public site `lib/content/projects` & `lib/content/blog` ile beslenir (force-dynamic).

---

### Faz 5 — Sayfa içerikleri (section CMS)

**Amaç:** Home / About / Services / Contact bölümleri yönetilebilir.

- [x] Section type registry (TypeScript: hero, stats, faq, offices, …)
- [x] API: pages + sections + translations (JSON payload)
- [x] Admin **Sayfalar** editörü: section listesi, sıralama, locale tab, kaydet
- [x] Public sayfalar `lib/content/pages` ile render (mevcut UI component’lerine prop enjekte)

**Bitiş kriteri:** Contact “Get in touch” metni veya FAQ maddesi admin’den değişince sitede görünüyor (revalidate). ✅ (2026-09-10)

**Not:** Registry `lib/content/section-types`; API `/api/admin/pages`; admin `PageSectionsEditor`; public Contact `getContactContent` + force-dynamic / `revalidatePath`.

---

### Faz 6 — Medya + iletişim formu

**Amaç:** Upload ve mesaj kutusu production-ready.

- [x] Upload provider seç + `MediaAsset` kaydı
- [x] Admin Medya: grid, upload, sil, alt text
- [x] Form alanlarında media picker
- [x] Public contact form → `POST /api/public/contact` → `ContactMessage`
- [x] Admin Mesajlar: oku / okundu / arşiv / sil; okunmamış badge (sidebar)

**Bitiş kriteri:** Form gönderimi DB’de; admin’de listeleniyor; medya URL’leri içerikte kullanılabiliyor. ✅ (2026-09-10)

**Not:** Storage = local disk `public/uploads/YYYY/MM/<uuid>-<safeFilename>` via `lib/media/storage.ts` (`saveUpload` / `deleteUpload`). Public URL `/uploads/...`. Vercel Blob / R2 ile sonra swap edilebilir. Media picker ProjectForm + PostForm kapak URL’de. Contact honeypot alanı `website`; rate limit Faz 7.

---

### Faz 7 — i18n public site + API olgunlaştırma

**Amaç:** Dil anahtarı site genelinde; API dokümante / tutarlı.

- [x] Locale routing stratejisi — **cookie + opsiyonel `/tr`/`/en` path prefix rewrite** (tam `app/[locale]` yok)
- [x] Header/Footer nav DB’den + dil switcher; Contact (ve projects/blog) locale geçiriyor
- [x] Eksik çeviri fallback (requested → default → first) via `pickTranslation`
- [x] Admin’de “çeviri tamamlanma” göstergesi (`/api/admin/i18n/coverage` + Diller UI)
- [x] API: tutarlı `{ error, details? }`; `docs/API.md`
- [x] Rate limit contact endpoint (5 / 10 dk, in-memory)

**Bitiş kriteri:** İkinci dil eklenip en az bir sayfa + nav çevrilebilir; public’te dil değişince içerik değişir. ✅ (2026-09-10)

**Not:** Cookie `pixora_locale`; proxy matcher `/tr|/en` + admin. Helpers `lib/i18n/*`. Seed: `tr` aktif + TR nav + Contact payload.

---

### Faz 8 — Polish, güvenlik, operasyon

- [x] Admin UI polish (mevcut token’larla; boş state, toast, confirm delete)
- [x] Audit log — `AuditLog` + `/admin/audit` + mutation hooks
- [x] Role: `EDITOR` vs `ADMIN` (settings/locales kısıtı)
- [x] Backup / migrate runbook (Neon) — `docs/OPS.md`
- [x] Performance: `revalidatePath` after mutations (projects/posts/pages/settings/locales)
- [x] E2E smoke checklist — `docs/SMOKE.md` + `docs/PRODUCTION_CHECKLIST.md`
- [x] Stub `app/data/*` — seed + content fallback only (documented; admin dashboard Prisma)

**Bitiş kriteri:** Production checklist yeşil; admin “gelişmiş CMS” olarak kullanılabilir. ✅ (2026-09-10)

**Not:** Toast + Confirm modal. Settings & Locales ADMIN-only; EDITOR içerik CRUD. Audit log + çeviri coverage + contactForm CMS + editor sync + media seed (2026-09-10 polish).

---

## 7. Önerilen uygulama sırası (özet checklist)

| # | Faz | Durum |
|---|-----|--------|
| 0 | UI iskeleti | ✅ |
| 1 | Neon + Prisma + seed | ✅ |
| 2 | Auth + middleware | ✅ |
| 3 | API + Locales + Settings | ✅ |
| 4 | Projects & Blog CRUD + public wire | ✅ |
| 5 | Page sections CMS | ✅ |
| 6 | Media + Contact messages | ✅ |
| 7 | Public i18n + API polish | ✅ |
| 8 | Security / UX / ops | ✅ |

---

## 8. Kararlar (kilitle / güncelle)

| Konu | Karar | Not |
|------|--------|-----|
| DB | Neon PostgreSQL | |
| ORM | Prisma | |
| Admin UI dili | Türkçe | |
| İlk içerik dili | `en` | |
| Dosya storage | Local `public/uploads` | Thin `lib/media/storage.ts`; Blob/R2 later |
| Auth paketi | Credentials + jose JWT cookie | Faz 2 tamamlandı |
| URL locale | Cookie + `/tr`\|`/en` prefix rewrite | No full `app/[locale]` nest; default unprefixed `en` |

Bu tablo değişirse tarih + not düşülür.

---

## 9. Çalışma kuralı

1. Her oturumda **tek faz** (veya fazın net bir alt maddesi) hedeflenir.
2. Faz bitince bu dosyada checkbox işaretlenir.
3. Schema kırıcı değişiklikler migration ile; seed güncellenir.
4. Public site kırılmadan ilerlenir: önce API + admin, sonra public switch (feature flag veya content layer fallback).

---

## 10. Sonraki adım

**CMS complete + polish 9–11.** Audit, coverage, contactForm i18n, EDITOR sync, media seed, Blob, `/p/`.

---

## Sayfalar vs Projeler/Blog vs Menü (ürün modeli)

| Alan | Ne | Admin |
|------|----|-------|
| **Sayfalar** | Prisma `Page` + section payloads (home/about/services/contact + custom keys) | `/admin/site-pages` |
| **Projeler / Blog** | Ayrı CRUD modülleri (liste, çeviriler) | `/admin/projects`, `/admin/blog` — Sayfalar index’te “Modül” kartı |
| **Menü** | Header/Footer `NavItem` + locale label | `/admin/nav` — site menü sırası/etiketleri |

Özel sayfa anahtarı oluşturmak CMS’te serbesttir; public Next route (`app/(site)/…`) yoksa editör uyarır — catch-all v1’de yok.



---

## Content model (CMS)

See [`docs/CONTENT_MODEL.md`](./CONTENT_MODEL.md) for section type → UI mapping. Public site marketing blocks are DB-driven; seed defaults in `app/data/*`.
