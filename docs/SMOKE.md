# Admin E2E smoke (manuel)

1. **Login** → `/admin` dashboard DB sayıları gösterir (projeler / yazılar / okunmamış mesaj / sayfalar).
2. **Toast + confirm** — proje kaydet → başarı toast; sil → modal onay → toast.
3. **Roller** — EDITOR kullanıcı (bkz. `OPS.md`) ile `/api/admin/settings` → 403; ADMIN ile 200.
4. **Revalidate** — projeyi düzenle → public `/projects/[slug]` (hard refresh / yeni sekme) güncel içerik.
5. Contact form gönder → Mesajlar’da görünür; medya yükle → picker’da seçilebilir.
6. Dil switch public’te TR/EN içerik değiştirir.
