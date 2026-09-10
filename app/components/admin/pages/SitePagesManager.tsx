"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ADMIN_BASE,
  PROTECTED_PAGE_KEYS,
} from "@/lib/admin/constants";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import { useConfirm } from "@/app/components/admin/ui/ConfirmDialog";

type PageRow = {
  id: string;
  key: string;
  label: string;
  publicPath: string;
  hasPublicRoute: boolean;
  status: string;
  sectionCount: number;
  updatedAt: string | null;
};

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body";

export default function SitePagesManager() {
  const { success, error: toastError } = useToast();
  const { confirmDelete } = useConfirm();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [key, setKey] = useState("");
  const [labelNote, setLabelNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      setPages(data.pages ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createPage(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: key.trim().toLowerCase(),
          labelNote: labelNote.trim() || undefined,
          withHero: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Oluşturulamadı");
      success("Sayfa oluşturuldu");
      setShowCreate(false);
      setKey("");
      setLabelNote("");
      await load();
      if (data.page?.key) {
        window.location.href = `${ADMIN_BASE}/site-pages/${data.page.key}`;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function deletePage(pageKey: string) {
    if (PROTECTED_PAGE_KEYS.has(pageKey)) {
      toastError("Bu sayfa silinemez");
      return;
    }
    const ok = await confirmDelete(
      `"${pageKey}" sayfasını silmek istediğine emin misin? Bölümler de silinir.`,
    );
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageKey}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      success("Sayfa silindi");
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata";
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
              İçerik sayfaları
            </h2>
            <p className="mt-1 text-sm text-px-body">
              Prisma <code className="text-xs">Page</code> kayıtları — bölüm editörü ile
              yönetilir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex h-10 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red"
          >
            Yeni sayfa
          </button>
        </div>

        {showCreate ? (
          <form
            onSubmit={createPage}
            className="mb-4 grid gap-3 rounded-2xl border border-black/8 bg-white p-5 md:grid-cols-3"
          >
            <label>
              <span className={labelClass}>Anahtar (slug)</span>
              <input
                className={inputClass}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="pricing"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              />
            </label>
            <label>
              <span className={labelClass}>Not (opsiyonel)</span>
              <input
                className={inputClass}
                value={labelNote}
                onChange={(e) => setLabelNote(e.target.value)}
                placeholder="Fiyatlandırma"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-11 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red disabled:opacity-50"
              >
                Oluştur
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="h-11 text-sm text-px-body hover:text-px-black"
              >
                Vazgeç
              </button>
            </div>
            <p className="md:col-span-3 text-xs text-px-body">
              Özel anahtarlar otomatik olarak{" "}
              <code className="text-[10px]">/p/&#123;key&#125;</code> altında yayınlanır
              (ör. <code className="text-[10px]">pricing</code> →{" "}
              <code className="text-[10px]">/p/pricing</code>).
            </p>
          </form>
        ) : null}

        {loading ? (
          <p className="rounded-2xl border border-black/8 bg-white px-5 py-8 text-sm text-px-body">
            Yükleniyor…
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {pages.map((p) => (
              <div
                key={p.key}
                className="rounded-2xl border border-black/8 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`${ADMIN_BASE}/site-pages/${p.key}`}
                    className="min-w-0 flex-1 transition hover:opacity-80"
                  >
                    <p className="text-base font-semibold text-px-black">{p.label}</p>
                    <p className="mt-1 text-xs text-px-body">
                      <code>{p.key}</code> · {p.status} · {p.sectionCount} bölüm
                    </p>
                    <p className="mt-1 text-xs text-px-body">
                      Public: {p.publicPath}
                      {!p.hasPublicRoute ? (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                          Public route yok
                        </span>
                      ) : null}
                    </p>
                  </Link>
                  {!PROTECTED_PAGE_KEYS.has(p.key) ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void deletePage(p.key)}
                      className="shrink-0 text-xs font-medium text-px-red hover:underline disabled:opacity-50"
                    >
                      Sil
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {pages.length === 0 ? (
              <p className="col-span-full rounded-2xl border border-dashed border-black/15 bg-white px-5 py-10 text-center text-sm text-px-body">
                Henüz sayfa yok. Seed çalıştır veya yeni sayfa ekle.
              </p>
            ) : null}
          </div>
        )}
      </section>


      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Kısayollar
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Link
            href={`${ADMIN_BASE}/site-pages/not-found`}
            className="rounded-2xl border border-black/8 bg-white p-5 transition hover:border-px-black"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-px-red">
              Sistem
            </p>
            <p className="mt-1 text-base font-semibold text-px-black">404 sayfası</p>
            <p className="mt-1 text-xs text-px-body">
              Bulunamadı — metin, CTA ve tasarım ayarları · public 404
            </p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Site menüsü ile uyum
        </h2>
        <p className="mb-4 text-sm text-px-body">
          Projeler ve Blog ayrı modüllerdir (liste/CRUD). Site header etiketleri ve sırası{" "}
          <strong>Menü</strong> ekranından yönetilir — Sayfalar editöründe değildir.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <Link
            href={`${ADMIN_BASE}/projects`}
            className="rounded-2xl border border-black/8 bg-white p-5 transition hover:border-px-black"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-px-red">
              Modül
            </p>
            <p className="mt-1 text-base font-semibold text-px-black">Projeler</p>
            <p className="mt-1 text-xs text-px-body">/admin/projects · public /projects</p>
          </Link>
          <Link
            href={`${ADMIN_BASE}/blog`}
            className="rounded-2xl border border-black/8 bg-white p-5 transition hover:border-px-black"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-px-red">
              Modül
            </p>
            <p className="mt-1 text-base font-semibold text-px-black">Blog</p>
            <p className="mt-1 text-xs text-px-body">/admin/blog · public /blog</p>
          </Link>
          <Link
            href={`${ADMIN_BASE}/nav`}
            className="rounded-2xl border border-black/8 bg-white p-5 transition hover:border-px-black"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-px-red">
              Navigasyon
            </p>
            <p className="mt-1 text-base font-semibold text-px-black">Menüyü düzenle</p>
            <p className="mt-1 text-xs text-px-body">Header / Footer etiketleri</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
