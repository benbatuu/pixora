# Pixora — Production checklist

Manuel doğrulama. Her satırı işaretle; secret yazma.

## Ortam & DB

- [ ] `DATABASE_URL` (ve gerekirse `DATABASE_URL_UNPOOLED`) set
- [ ] `ADMIN_SESSION_SECRET` ≥16 karakter, production’da unique
- [ ] `ADMIN_EMAIL` / `ADMIN_PASSWORD` set (sync için)
- [ ] `pnpm exec prisma migrate deploy` başarılı
- [ ] `pnpm db:seed` (ilk kurulum) veya içerik zaten DB’de
- [x] `pnpm db:sync-admin` → admin login çalışıyor
- [x] `pnpm db:sync-editor` (EDITOR_PASSWORD set ise) — code-complete
- [x] AuditLog migration (`audit_log`) — code-complete

## Auth & roller

- [x] `/admin/login` → dashboard
- [x] JWT session cookie HttpOnly; logout temizler
- [x] EDITOR (varsa): içerik CRUD OK; Settings/Diller UI “Yalnızca admin”; API 403
- [x] ADMIN: Settings + Diller CRUD OK

## CMS smoke

- [x] Dashboard sayıları DB’den (stub değil)
- [x] Proje oluştur / düzenle / sil (confirm modal + toast)
- [x] Blog yazısı oluştur / düzenle / sil
- [x] Sayfa sections kaydet → public path güncellenir
- [x] Medya yükle + alt text + sil (+ seed static assets)
- [x] Mesajlar: okundu / arşiv / sil; sidebar badge
- [x] `/admin/audit` (ADMIN) — denetim günlüğü + entityType filtresi
- [x] `/admin/locales` çeviri tamamlanma kartı + `GET /api/admin/i18n/coverage`
- [x] Bileşenler → İletişim formu (`settings.contactForm[locale]`)
- [x] Dynamic pages `/p/[pageKey]` (+ typed sections)

## Public site

- [ ] Contact form → mesaj admin’de görünür
- [ ] i18n dil switch (cookie / `/tr` `/en`) içerik değişir
- [ ] Proje düzenle → `/projects/[slug]` revalidate sonrası güncel
- [ ] Upload URL (`/uploads/...`) public erişilebilir (local) veya Blob URL

## Ops

- [x] Neon backup / PITR biliniyor (`docs/OPS.md`)
- [x] Local uploads stratejisi prod için net (disk vs Blob / `BLOB_READ_WRITE_TOKEN`)
- [x] `pnpm exec tsc --noEmit` temiz
