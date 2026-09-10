"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Trash2, Upload, X } from "lucide-react";
import AdminEmptyState from "@/app/components/admin/ui/AdminEmptyState";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import { useConfirm } from "@/app/components/admin/ui/ConfirmDialog";

type MediaAsset = {
  id: string;
  url: string;
  path: string | null;
  filename: string;
  mime: string;
  bytes: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  createdAt: string;
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function isLocalOrRemoteImage(url: string, mime: string) {
  return mime.startsWith("image/") && !mime.includes("svg");
}

export default function MediaLibrary() {
  const { success, error: toastError } = useToast();
  const { confirmDelete } = useConfirm();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      setAssets(data.assets);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setAltDraft(selected?.alt ?? "");
    setCopied(false);
  }, [selected]);

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      }
      success("Medya yüklendi");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function saveAlt() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: altDraft.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Güncellenemedi");
      setSelected(data.asset);
      success("Alt metin kaydedildi");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function removeAsset() {
    if (!selected) return;
    const ok = await confirmDelete("Bu medyayı silmek istediğine emin misin?");
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${selected.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      setSelected(null);
      success("Medya silindi");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("URL kopyalanamadı");
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-px-body">
          {loading ? "Yükleniyor…" : `${assets.length} dosya`}
        </p>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4"
            multiple
            className="hidden"
            onChange={(e) => void onUpload(e.target.files)}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red disabled:opacity-60"
          >
            <Upload className="h-4 w-4" aria-hidden />
            {busy ? "Yükleniyor…" : "Yükle"}
          </button>
        </div>
      </div>

      {!loading && assets.length === 0 ? (
        <AdminEmptyState
          title="Henüz medya yok"
          description="JPEG, PNG, WebP, GIF, SVG veya MP4 yükleyebilirsin (max 10MB)."
          action={
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red"
            >
              <Upload className="h-4 w-4" aria-hidden />
              İlk dosyayı yükle
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {assets.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a)}
              className={`group relative aspect-square overflow-hidden rounded-2xl border bg-white text-left transition ${
                selected?.id === a.id
                  ? "border-px-red ring-2 ring-px-red/30"
                  : "border-black/8 hover:border-black/20"
              }`}
            >
              {isLocalOrRemoteImage(a.url, a.mime) ? (
                <Image
                  src={a.url}
                  alt={a.alt || a.filename}
                  fill
                  unoptimized={a.url.startsWith("/uploads/")}
                  className="object-cover"
                  sizes="(max-width:768px) 50vw, 20vw"
                />
              ) : a.mime.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.url}
                  alt={a.alt || a.filename}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f7f7f7] text-xs font-medium text-px-body">
                  {a.mime}
                </div>
              )}
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                {a.filename}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-black/8 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-px-black">
                  {selected.filename}
                </h3>
                <p className="mt-1 text-xs text-px-body">
                  {selected.mime} · {formatBytes(selected.bytes)} ·{" "}
                  {new Date(selected.createdAt).toLocaleString("tr-TR")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full p-2 text-px-body hover:bg-[#f7f7f7] hover:text-px-black"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-[#f7f7f7]">
              {selected.mime.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.url}
                  alt={selected.alt || selected.filename}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-px-body">
                  Önizleme yok
                </div>
              )}
            </div>

            <label className="mb-3 block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body">
                Alt metin
              </span>
              <input
                value={altDraft}
                onChange={(e) => setAltDraft(e.target.value)}
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
              />
            </label>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-black/8 bg-[#fafafa] px-3 py-2">
              <code className="min-w-0 flex-1 truncate text-xs text-px-black">
                {selected.url}
              </code>
              <button
                type="button"
                onClick={() => void copyUrl()}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-px-body hover:bg-white hover:text-px-black"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveAlt()}
                className="inline-flex h-10 items-center rounded-full bg-px-black px-4 text-sm font-semibold text-white hover:bg-px-red disabled:opacity-60"
              >
                Alt kaydet
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void removeAsset()}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-px-red/40 px-4 text-sm font-semibold text-px-red hover:bg-[#e11010]/5 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Sil
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
