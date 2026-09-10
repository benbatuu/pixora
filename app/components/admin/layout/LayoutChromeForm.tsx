"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SiteChromeLocale, SiteSettings } from "@/lib/admin/types";
import { SITE_SETTINGS } from "@/app/data/site";
import { useToast } from "@/app/components/admin/ui/ToastProvider";

type SectionTab = "footer" | "offcanvas";

type LocaleRow = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
};

const emptyChrome: SiteChromeLocale = {
  footerTagline: "",
  footerQuickLinksTitle: "",
  footerContactTitle: "",
  footerAddress: "",
  footerMapsUrl: "",
  copyrightName: "",
  offcanvasLabel: "",
  offcanvasTitle: "",
  offcanvasEmail: "",
  offcanvasPhone: "",
  offcanvasMeta: "",
  languageLabel: "",
};

const inputCls =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const textareaCls =
  "w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2 text-sm outline-none focus:border-px-red focus:bg-white";
const labelCls = "mb-1.5 block text-xs font-medium text-px-body";
const sectionCls = "rounded-2xl border border-black/8 bg-white p-5";

function seedForLocale(code: string): SiteChromeLocale {
  return { ...emptyChrome, ...(SITE_SETTINGS.chrome?.[code] ?? {}) };
}

export default function LayoutChromeForm() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [base, setBase] = useState<SiteSettings | null>(null);
  const [chrome, setChrome] = useState<Record<string, SiteChromeLocale>>({});
  const [locales, setLocales] = useState<LocaleRow[]>([]);
  const [localeCode, setLocaleCode] = useState("en");
  const [section, setSection] = useState<SectionTab>("footer");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsRes, localesRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/locales"),
      ]);
      const settingsData = await settingsRes.json();
      if (!settingsRes.ok) {
        throw new Error(settingsData.error || "Ayarlar yüklenemedi");
      }
      const s = settingsData.settings as SiteSettings;
      setBase(s);

      let localesList: LocaleRow[] = [];
      if (localesRes.ok) {
        const locData = await localesRes.json();
        localesList = (locData.locales as LocaleRow[] | undefined) ?? [];
      }
      if (!localesList.length) {
        localesList = [
          { id: "en", code: "en", name: "English", isDefault: true, isActive: true },
          { id: "tr", code: "tr", name: "Türkçe", isDefault: false, isActive: true },
          { id: "ru", code: "ru", name: "Русский", isDefault: false, isActive: true },
        ];
      }
      const active = localesList.filter((l) => l.isActive !== false);
      setLocales(active.length ? active : localesList);

      const merged: Record<string, SiteChromeLocale> = {
        ...(SITE_SETTINGS.chrome ?? {}),
        ...(s.chrome ?? {}),
      };
      for (const l of active.length ? active : localesList) {
        merged[l.code] = {
          ...seedForLocale(l.code),
          ...(merged[l.code] ?? {}),
        };
      }
      setChrome(merged);

      const def =
        (active.length ? active : localesList).find((l) => l.isDefault)?.code ??
        (active.length ? active : localesList)[0]?.code ??
        "en";
      setLocaleCode((prev) =>
        (active.length ? active : localesList).some((l) => l.code === prev)
          ? prev
          : def,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const current = chrome[localeCode] ?? seedForLocale(localeCode);

  const sectionTabs = useMemo(
    () =>
      [
        { id: "footer" as const, label: "Footer" },
        { id: "offcanvas" as const, label: "Menü paneli (offcanvas)" },
      ] as const,
    [],
  );

  function patchCurrent(patch: Partial<SiteChromeLocale>) {
    setChrome((prev) => ({
      ...prev,
      [localeCode]: { ...(prev[localeCode] ?? seedForLocale(localeCode)), ...patch },
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!base) return;
    setSaving(true);
    setError(null);
    try {
      const cleaned: Record<string, SiteChromeLocale> = {};
      for (const [code, row] of Object.entries(chrome)) {
        const next: SiteChromeLocale = {};
        for (const [k, v] of Object.entries(row) as [keyof SiteChromeLocale, string | undefined][]) {
          if (typeof v === "string" && v.trim().length > 0) {
            next[k] = v;
          }
        }
        cleaned[code] = next;
      }

      const payload: SiteSettings = {
        ...base,
        chrome: cleaned,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi");
      const saved = data.settings as SiteSettings;
      setBase(saved);
      setChrome({
        ...(SITE_SETTINGS.chrome ?? {}),
        ...(saved.chrome ?? {}),
      });
      toastSuccess("Bileşen metinleri kaydedildi");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-px-body">Yükleniyor…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {sectionTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSection(t.id)}
            className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
              section === t.id
                ? "bg-px-black text-white"
                : "border border-black/10 bg-white text-px-black hover:border-px-red"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white p-5">
        <div className="min-w-[200px]">
          <span className={labelCls}>Dil</span>
          <div className="flex flex-wrap gap-1">
            {locales.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLocaleCode(l.code)}
                className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  localeCode === l.code
                    ? "bg-px-black text-white"
                    : "bg-[#f7f7f7] text-px-body hover:text-px-black"
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>
        </div>
        <p className="flex-1 text-sm text-px-body">
          Kaydet tüm dillerdeki chrome alanlarını yazar. Boş bırakılan alanlar
          global ayar / UI sözlüğüne düşer.
        </p>
      </div>

      {section === "footer" ? (
        <section className={sectionCls}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
            Footer · {localeCode.toUpperCase()}
          </h2>
          <div className="grid gap-4">
            <label className="block">
              <span className={labelCls}>Slogan (tagline)</span>
              <textarea
                value={current.footerTagline ?? ""}
                onChange={(e) => patchCurrent({ footerTagline: e.target.value })}
                rows={2}
                className={textareaCls}
                placeholder="Helping&#10;start-ups scale & grow."
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className={labelCls}>Hızlı bağlantılar başlığı</span>
                <input
                  value={current.footerQuickLinksTitle ?? ""}
                  onChange={(e) =>
                    patchCurrent({ footerQuickLinksTitle: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Quick links"
                />
              </label>
              <label className="block">
                <span className={labelCls}>İletişim başlığı</span>
                <input
                  value={current.footerContactTitle ?? ""}
                  onChange={(e) =>
                    patchCurrent({ footerContactTitle: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Contact"
                />
              </label>
            </div>
            <label className="block">
              <span className={labelCls}>Adres</span>
              <textarea
                value={current.footerAddress ?? ""}
                onChange={(e) => patchCurrent({ footerAddress: e.target.value })}
                rows={2}
                className={textareaCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Harita URL</span>
              <input
                value={current.footerMapsUrl ?? ""}
                onChange={(e) => patchCurrent({ footerMapsUrl: e.target.value })}
                className={inputCls}
                placeholder="https://www.google.com/maps/"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className={labelCls}>Copyright adı</span>
                <input
                  value={current.copyrightName ?? ""}
                  onChange={(e) =>
                    patchCurrent({ copyrightName: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Pixora.Studio"
                />
              </label>
              <label className="block">
                <span className={labelCls}>Dil seçici etiketi (aria)</span>
                <input
                  value={current.languageLabel ?? ""}
                  onChange={(e) =>
                    patchCurrent({ languageLabel: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Language"
                />
              </label>
            </div>
            <p className="rounded-xl border border-black/8 bg-[#f7f7f7] px-4 py-3 text-sm text-px-body">
              Footer e-posta / telefon globaldir —{" "}
              <a href="/admin/settings" className="font-semibold text-px-red hover:underline">
                Ayarlar
              </a>{" "}
              sayfasından düzenleyin.
            </p>
          </div>
        </section>
      ) : (
        <section className={sectionCls}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
            Menü paneli · {localeCode.toUpperCase()}
          </h2>
          <div className="grid gap-4">
            <label className="block">
              <span className={labelCls}>Etiket (Studio)</span>
              <input
                value={current.offcanvasLabel ?? ""}
                onChange={(e) => patchCurrent({ offcanvasLabel: e.target.value })}
                className={inputCls}
                placeholder="Studio"
              />
            </label>
            <label className="block">
              <span className={labelCls}>Başlık</span>
              <textarea
                value={current.offcanvasTitle ?? ""}
                onChange={(e) => patchCurrent({ offcanvasTitle: e.target.value })}
                rows={2}
                className={textareaCls}
                placeholder="Let's talk about&#10;your next project."
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className={labelCls}>E-posta</span>
                <input
                  value={current.offcanvasEmail ?? ""}
                  onChange={(e) =>
                    patchCurrent({ offcanvasEmail: e.target.value })
                  }
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Telefon</span>
                <input
                  value={current.offcanvasPhone ?? ""}
                  onChange={(e) =>
                    patchCurrent({ offcanvasPhone: e.target.value })
                  }
                  className={inputCls}
                />
              </label>
            </div>
            <label className="block">
              <span className={labelCls}>Meta (konum / saat)</span>
              <textarea
                value={current.offcanvasMeta ?? ""}
                onChange={(e) => patchCurrent({ offcanvasMeta: e.target.value })}
                rows={2}
                className={textareaCls}
              />
            </label>
            <p className="rounded-xl border border-black/8 bg-[#f7f7f7] px-4 py-3 text-sm text-px-body">
              Menü linkleri ayrı yönetilir —{" "}
              <a href="/admin/nav" className="font-semibold text-px-red hover:underline">
                Menü
              </a>{" "}
              editörünü kullanın.
            </p>
          </div>
        </section>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center rounded-full bg-px-black px-6 text-sm font-semibold text-white hover:bg-px-red disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
