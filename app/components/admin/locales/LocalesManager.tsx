"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import { useConfirm } from "@/app/components/admin/ui/ConfirmDialog";

type Locale = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
};

type CoverageRow = {
  code: string;
  name: string;
  isDefault: boolean;
  overall: { percent: number; have: number; total: number };
  projects: { percent: number };
  posts: { percent: number };
  sections: { percent: number };
  navItems: { percent: number };
};

export default function LocalesManager() {
  const { success, error: toastError } = useToast();
  const { confirmDelete } = useConfirm();
  const [locales, setLocales] = useState<Locale[]>([]);
  const [coverage, setCoverage] = useState<CoverageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, covRes] = await Promise.all([
        fetch("/api/admin/locales"),
        fetch("/api/admin/i18n/coverage"),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      setLocales(data.locales);
      if (covRes.ok) {
        const covData = await covRes.json();
        setCoverage(covData.coverage ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createLocale(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/locales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eklenemedi");
      setCode("");
      setName("");
      success("Dil eklendi");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/locales/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Güncellenemedi");
      success("Dil güncellendi");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const ok = await confirmDelete("Bu dili silmek istediğine emin misin?");
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/locales/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      success("Dil silindi");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  const covByCode = Object.fromEntries(coverage.map((c) => [c.code, c]));

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      {coverage.length > 0 ? (
        <div className="rounded-2xl border border-black/8 bg-white p-5">
          <h2 className="text-sm font-semibold text-px-black">
            Çeviri tamamlanma
          </h2>
          <p className="mt-1 text-xs text-px-body">
            Aktif diller için proje, yazı, sayfa bölümü ve menü çeviri oranı
            (varsayılan dil tabanına göre).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {coverage.map((c) => (
              <div
                key={c.code}
                className="rounded-xl border border-black/8 bg-[#fafafa] px-3 py-2"
                title={`Projeler %${c.projects.percent} · Yazılar %${c.posts.percent} · Bölümler %${c.sections.percent} · Menü %${c.navItems.percent}`}
              >
                <span className="text-xs font-semibold uppercase text-px-black">
                  {c.code}
                </span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    c.overall.percent >= 90
                      ? "bg-emerald-50 text-emerald-700"
                      : c.overall.percent >= 50
                        ? "bg-amber-50 text-amber-800"
                        : "bg-[#e11010]/10 text-px-red"
                  }`}
                >
                  %{c.overall.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={createLocale}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white p-5"
      >
        <label className="min-w-[120px] flex-1">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body">
            Kod
          </span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="tr"
            required
            className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
          />
        </label>
        <label className="min-w-[180px] flex-[2]">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body">
            Ad
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Türkçe"
            required
            className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red disabled:opacity-60"
        >
          Dil ekle
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-px-body">Yükleniyor…</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-black/8 bg-[#fafafa] text-xs uppercase tracking-[0.06em] text-px-body">
              <tr>
                <th className="px-4 py-3 font-medium">Kod</th>
                <th className="px-4 py-3 font-medium">Ad</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Varsayılan</th>
                <th className="px-4 py-3 font-medium">Çeviri</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {locales.map((l) => (
                <tr key={l.id} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 font-mono text-xs">{l.code}</td>
                  <td className="px-4 py-3 font-medium text-px-black">{l.name}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={busy || l.isDefault}
                      onClick={() => patch(l.id, { isActive: !l.isActive })}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        l.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-[#f0f0f0] text-px-body"
                      }`}
                    >
                      {l.isActive ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {l.isDefault ? (
                      <span className="text-xs font-semibold text-px-red">Varsayılan</span>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => patch(l.id, { isDefault: true, isActive: true })}
                        className="text-xs font-medium text-px-body hover:text-px-red"
                      >
                        Varsayılan yap
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {covByCode[l.code] ? (
                      <span className="rounded-full bg-[#f0f0f0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-px-black">
                        {l.code.toUpperCase()} %{covByCode[l.code].overall.percent}
                      </span>
                    ) : (
                      <span className="text-xs text-px-body">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={busy || l.isDefault}
                      onClick={() => remove(l.id)}
                      className="text-xs font-semibold text-px-red hover:underline disabled:opacity-40"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
