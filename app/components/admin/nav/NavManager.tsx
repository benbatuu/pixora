"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/app/components/admin/ui/ToastProvider";

type Locale = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
};

type NavRow = {
  id?: string;
  href: string;
  sortOrder: number;
  label: string;
  clientKey: string;
};

type LocationTab = "HEADER" | "FOOTER";

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body";

function newClientKey() {
  return `tmp-${Math.random().toString(36).slice(2, 9)}`;
}

export default function NavManager() {
  const { success, error: toastError } = useToast();
  const [location, setLocation] = useState<LocationTab>("HEADER");
  const [locales, setLocales] = useState<Locale[]>([]);
  const [localeCode, setLocaleCode] = useState("en");
  const [items, setItems] = useState<NavRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/nav?location=${location}&locale=${encodeURIComponent(localeCode)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      const list: Locale[] = data.locales ?? [];
      setLocales(list);
      if (list.length && !list.some((l) => l.code === localeCode)) {
        const def = list.find((l) => l.isDefault)?.code ?? list[0].code;
        setLocaleCode(def);
      }
      setItems(
        (data.items ?? []).map(
          (it: { id: string; href: string; sortOrder: number; label: string }) => ({
            id: it.id,
            href: it.href,
            sortOrder: it.sortOrder,
            label: it.label,
            clientKey: it.id,
          }),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, [location, localeCode]);

  useEffect(() => {
    void load();
  }, [load]);

  function addRow() {
    const max = items.reduce((m, i) => Math.max(m, i.sortOrder), -1);
    setItems((prev) => [
      ...prev,
      {
        href: "/",
        sortOrder: max + 1,
        label: "Yeni",
        clientKey: newClientKey(),
      },
    ]);
  }

  function updateRow(clientKey: string, patch: Partial<NavRow>) {
    setItems((prev) =>
      prev.map((row) => (row.clientKey === clientKey ? { ...row, ...patch } : row)),
    );
  }

  function removeRow(clientKey: string) {
    setItems((prev) => prev.filter((r) => r.clientKey !== clientKey));
  }

  function move(clientKey: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((r) => r.clientKey === clientKey);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const [row] = copy.splice(idx, 1);
      copy.splice(next, 0, row);
      return copy.map((r, i) => ({ ...r, sortOrder: i }));
    });
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/nav", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          localeCode,
          items: items.map((it, i) => ({
            id: it.id,
            href: it.href.trim(),
            sortOrder: i,
            label: it.label.trim(),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi");
      success("Menü kaydedildi — site yenilenecek");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/8 bg-white p-3">
        {(["HEADER", "FOOTER"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setLocation(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              location === tab
                ? "bg-px-black text-white"
                : "bg-[#f7f7f7] text-px-black hover:bg-black/10"
            }`}
          >
            {tab === "HEADER" ? "Header" : "Footer"}
          </button>
        ))}
        <div className="mx-2 h-6 w-px bg-black/10" />
        <div className="flex flex-wrap gap-1">
          {locales.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLocaleCode(l.code)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                localeCode === l.code
                  ? "bg-px-red text-white"
                  : "bg-[#f7f7f7] text-px-body hover:text-px-black"
              }`}
            >
              {l.code}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          type="button"
          disabled={busy || loading}
          onClick={() => void save()}
          className="inline-flex h-10 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red disabled:opacity-50"
        >
          {busy ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-black/8 bg-white px-5 py-8 text-sm text-px-body">
          Yükleniyor…
        </p>
      ) : (
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black/15 bg-white px-5 py-10 text-center text-sm text-px-body">
              Menü boş. Öğe ekleyebilirsin.
            </p>
          ) : null}
          {items.map((row, index) => (
            <div
              key={row.clientKey}
              className="grid gap-3 rounded-2xl border border-black/8 bg-white p-4 md:grid-cols-[1fr_1fr_auto_auto]"
            >
              <label>
                <span className={labelClass}>Etiket ({localeCode})</span>
                <input
                  className={inputClass}
                  value={row.label}
                  onChange={(e) => updateRow(row.clientKey, { label: e.target.value })}
                />
              </label>
              <label>
                <span className={labelClass}>Href</span>
                <input
                  className={inputClass}
                  value={row.href}
                  onChange={(e) => updateRow(row.clientKey, { href: e.target.value })}
                  placeholder="/about"
                />
              </label>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => move(row.clientKey, -1)}
                  disabled={index === 0}
                  className="h-11 rounded-xl border border-black/10 px-3 text-sm disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(row.clientKey, 1)}
                  disabled={index === items.length - 1}
                  className="h-11 rounded-xl border border-black/10 px-3 text-sm disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeRow(row.clientKey)}
                  className="h-11 text-xs font-medium text-px-red hover:underline"
                >
                  Kaldır
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="inline-flex h-11 items-center rounded-full border border-black/15 bg-white px-5 text-sm font-semibold text-px-black hover:border-px-black"
          >
            Öğe ekle
          </button>
        </div>
      )}
    </div>
  );
}
