"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";

type MediaAsset = {
  id: string;
  url: string;
  filename: string;
  mime: string;
  alt: string | null;
};

type Props = {
  onSelect: (url: string) => void;
  label?: string;
};

export default function MediaPickerButton({
  onSelect,
  label = "Kütüphaneden seç",
}: Props) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      setAssets(
        (data.assets as MediaAsset[]).filter((a) => a.mime.startsWith("image/")),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 text-xs font-semibold text-px-black hover:border-px-red hover:text-px-red"
      >
        <ImageIcon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-black/8 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
              <h3 className="text-base font-semibold text-px-black">
                Medya kütüphanesi
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-px-body hover:bg-[#f7f7f7]"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {error ? (
                <p className="mb-3 text-sm text-px-red">{error}</p>
              ) : null}
              {loading ? (
                <p className="text-sm text-px-body">Yükleniyor…</p>
              ) : assets.length === 0 ? (
                <p className="text-sm text-px-body">
                  Henüz görsel yok. Önce Medya sayfasından yükle.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {assets.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        onSelect(a.url);
                        setOpen(false);
                      }}
                      className="relative aspect-square overflow-hidden rounded-xl border border-black/8 hover:border-px-red"
                      title={a.filename}
                    >
                      {a.mime.includes("svg") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.url}
                          alt={a.alt || a.filename}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={a.url}
                          alt={a.alt || a.filename}
                          fill
                          unoptimized={a.url.startsWith("/uploads/")}
                          className="object-cover"
                          sizes="120px"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
