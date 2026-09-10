# Pixora — Operasyon Runbook

Neon + Next.js production / local ops. Şifre veya secret değerleri bu dosyada **yok**.

## Ortam değişkenleri (yalnızca adlar)

| Ad | Kullanım |
|----|----------|
| `DATABASE_URL` | Neon PostgreSQL (pooler OK) |
| `DATABASE_URL_UNPOOLED` | Opsiyonel; migrate için direct URL |
| `ADMIN_EMAIL` | Seed / `db:sync-admin` admin e-posta |
| `ADMIN_PASSWORD` | Seed / sync admin şifresi (≥8) |
| `ADMIN_SESSION_SECRET` | JWT cookie imza (≥16 karakter) |
| `EDITOR_EMAIL` | Opsiyonel; `db:sync-editor` (varsayılan `editor@pixora.com`) |
| `EDITOR_PASSWORD` | Opsiyonel; set değilse EDITOR oluşturulmaz (≥8) |
| `NEXT_PUBLIC_SITE_URL` | Public origin (trailing slash yok); boş `seo.canonicalBaseUrl` için |
| `BLOB_READ_WRITE_TOKEN` | Opsiyonel Vercel Blob RW token — set ise medya Blob'a gider |
| `NODE_ENV` | `production` / `development` |

Örnek şablon: `.env.example`.

## Neon yedekleme

1. [Neon Console](https://console.neon.tech) → proje → **Branches / Restore**.
2. Point-in-time recovery (PITR): branch’i geçmiş bir zamana restore et veya yeni branch oluştur.
3. Mantıksal export (opsiyonel):
   ```bash
   # Direct (unpooled) connection string kullan
   pg_dump "$DATABASE_URL_UNPOOLED" --no-owner --format=custom -f pixora-$(date +%Y%m%d).dump
   ```
4. Restore öncesi staging branch’te dene; production’a uygulamadan önce checklist çalıştır.

## Migrate / seed / admin sync

```bash
pnpm db:generate          # Prisma client
pnpm db:migrate           # prisma migrate dev (local)
# CI / prod: prisma migrate deploy  (DATABASE_URL_UNPOOLED tercih)
pnpm db:seed              # stub → DB upsert (idempotent)
pnpm db:sync-admin        # ADMIN_EMAIL / ADMIN_PASSWORD ile ADMIN kullanıcı
pnpm db:sync-editor       # EDITOR_PASSWORD set ise EDITOR kullanıcı
```

Prod deploy sırasında genelde: `migrate deploy` → (gerekirse) `db:seed` bir kez → `db:sync-admin` → (opsiyonel) `db:sync-editor`.

### Opsiyonel: EDITOR kullanıcı

`EDITOR_PASSWORD` yoksa seed/sync EDITOR oluşturmaz (zayıf şifre yok). Set edince:

```bash
pnpm db:sync-editor
# veya seed içinde aynı koşul
```

Legacy one-liner (gerekirse):

```bash
pnpm exec tsx -e '
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./lib/admin/password";
const prisma = new PrismaClient();
const email = process.env.EDITOR_EMAIL ?? "editor@pixora.com";
const password = process.env.EDITOR_PASSWORD;
if (!password || password.length < 8) throw new Error("EDITOR_PASSWORD required");
const passwordHash = await hashPassword(password);
const u = await prisma.user.upsert({
  where: { email },
  update: { passwordHash, role: "EDITOR", name: "Editor" },
  create: { email, passwordHash, role: "EDITOR", name: "Editor" },
});
console.log("EDITOR synced:", u.email, u.role);
await prisma.$disconnect();
'
```

EDITOR ile `/api/admin/settings` veya `/api/admin/locales` → **403** (`Yalnızca admin`).

## Media storage (local / Blob / R2-ready)

Provider: `lib/media/storage.ts` (`saveUpload` / `deleteUpload`).

| Ortam | Davranış |
|-------|----------|
| `BLOB_READ_WRITE_TOKEN` **yok** | Yerel: `public/uploads/YYYY/MM/<uuid>-<safeFilename>` |
| `BLOB_READ_WRITE_TOKEN` **var** | `@vercel/blob` `put` / `del` (public URL) |

- Yerel dosyaları git’e commit etme (`.gitignore`)
- Vercel ephemeral disk kalıcı değil — production’da Blob (veya ileride R2) kullan
- R2: aynı `saveUpload`/`deleteUpload` yüzeyinin arkasına S3-compatible client eklenebilir
- `next.config.ts` `images.remotePatterns`: unsplash + `**.vercel-storage.com` + localhost

## Deploy (Next + Neon)

1. Env’leri host’a ekle (Vercel / Node host).
2. Build: `pnpm build` (`prisma generate` postinstall veya build adımında).
3. Migrate: `pnpm exec prisma migrate deploy`
4. Admin: `pnpm db:sync-admin` (veya seed)
5. Smoke: `docs/PRODUCTION_CHECKLIST.md`

Cache: içerik mutasyonları `revalidatePath` kullanır (`/`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/p/{key}`, sayfa path’leri, contact).

## Faydalı linkler

- Admin plan: [`ADMIN_PLAN.md`](./ADMIN_PLAN.md)
- API: [`API.md`](./API.md)
- Production checklist: [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md)


## Audit / i18n coverage / contact form

- **Denetim:** `/admin/audit` (ADMIN) — `AuditLog`; mutasyonlar `lib/admin/audit.ts` `writeAudit` (best-effort).
- **Çeviri tamamlanma:** `GET /api/admin/i18n/coverage` + Diller sayfası kart/rozetleri.
- **İletişim formu i18n:** `Setting.site.contactForm[locale]` — Bileşenler → İletişim formu.
- **Medya seed:** `prisma/seed.ts` key `/assets/img/...` satırlarını `MediaAsset` olarak upsert eder.
- **Dynamic pages:** `/p/[pageKey]` for CMS pages without dedicated routes.
