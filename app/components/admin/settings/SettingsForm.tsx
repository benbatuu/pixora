"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/admin/types";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import MediaPickerButton from "@/app/components/admin/media/MediaPickerButton";

const empty: SiteSettings = {
  studioName: "",
  email: "",
  phone: "",
  address: "",
  socials: [{ label: "", href: "" }],
  seo: { defaultTitle: "", defaultDescription: "" },
  brand: {
    logoLightUrl: "/assets/img/logo/logo-red-uppercase.png",
    logoAlt: "PIXORA",
  },
  footerTagline: "",
  footerContactEmail: "",
  footerContactPhone: "",
  footerAddress: "",
};

export default function SettingsForm() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [form, setForm] = useState<SiteSettings>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yüklenemedi");
        const s = data.settings as SiteSettings;
        setForm({
          ...empty,
          ...s,
          brand: { ...empty.brand, ...(s.brand ?? {}) },
          seo: { ...empty.seo, ...(s.seo ?? {}) },
          socials: s.socials?.length ? s.socials : empty.socials,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Hata");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi");
      const saved = data.settings as SiteSettings;
      setForm({
        ...empty,
        ...saved,
        brand: { ...empty.brand, ...(saved.brand ?? {}) },
        seo: { ...empty.seo, ...(saved.seo ?? {}) },
        socials: saved.socials?.length ? saved.socials : empty.socials,
      });
      toastSuccess("Ayarlar kaydedildi");
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
      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Studio
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ["studioName", "Studio adı"],
              ["email", "E-posta"],
              ["phone", "Telefon"],
              ["address", "Adres"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-xs font-medium text-px-body">{label}</span>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
                required
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
            Sosyal
          </h2>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                socials: [...form.socials, { label: "", href: "" }],
              })
            }
            className="text-xs font-semibold text-px-red hover:underline"
          >
            + Ekle
          </button>
        </div>
        <div className="space-y-3">
          {form.socials.map((s, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
              <input
                value={s.label}
                placeholder="Instagram"
                onChange={(e) => {
                  const socials = [...form.socials];
                  socials[i] = { ...socials[i], label: e.target.value };
                  setForm({ ...form, socials });
                }}
                className="h-11 rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
                required
              />
              <input
                value={s.href}
                placeholder="https://"
                onChange={(e) => {
                  const socials = [...form.socials];
                  socials[i] = { ...socials[i], href: e.target.value };
                  setForm({ ...form, socials });
                }}
                className="h-11 rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    socials: form.socials.filter((_, idx) => idx !== i),
                  })
                }
                className="h-11 rounded-full border border-black/10 px-4 text-xs font-medium text-px-body hover:text-px-red"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </section>


      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Marka / Logo
        </h2>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-px-body">Logo (açık / header)</span>
            <div className="flex flex-wrap gap-2">
              <input
                value={form.brand?.logoLightUrl ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand: {
                      ...(form.brand ?? { logoLightUrl: "", logoAlt: "PIXORA" }),
                      logoLightUrl: e.target.value,
                    },
                  })
                }
                className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
                required
              />
              <MediaPickerButton
                onSelect={(url) =>
                  setForm({
                    ...form,
                    brand: {
                      ...(form.brand ?? { logoLightUrl: "", logoAlt: "PIXORA" }),
                      logoLightUrl: url,
                    },
                  })
                }
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-px-body">Logo (koyu / opsiyonel)</span>
            <div className="flex flex-wrap gap-2">
              <input
                value={form.brand?.logoDarkUrl ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand: {
                      ...(form.brand ?? { logoLightUrl: "", logoAlt: "PIXORA" }),
                      logoDarkUrl: e.target.value || undefined,
                    },
                  })
                }
                className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
              />
              <MediaPickerButton
                onSelect={(url) =>
                  setForm({
                    ...form,
                    brand: {
                      ...(form.brand ?? { logoLightUrl: "", logoAlt: "PIXORA" }),
                      logoDarkUrl: url,
                    },
                  })
                }
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-px-body">Logo alt metni</span>
            <input
              value={form.brand?.logoAlt ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  brand: {
                    ...(form.brand ?? { logoLightUrl: "", logoAlt: "" }),
                    logoAlt: e.target.value,
                  },
                })
              }
              className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-px-body">Favicon URL</span>
            <input
              value={form.brand?.faviconUrl ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  brand: {
                    ...(form.brand ?? { logoLightUrl: "", logoAlt: "PIXORA" }),
                    faviconUrl: e.target.value || undefined,
                  },
                })
              }
              className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-px-body">Footer slogan</span>
            <textarea
              value={form.footerTagline ?? ""}
              onChange={(e) => setForm({ ...form, footerTagline: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2 text-sm outline-none focus:border-px-red focus:bg-white"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-px-body">Footer e-posta</span>
              <input
                value={form.footerContactEmail ?? ""}
                onChange={(e) => setForm({ ...form, footerContactEmail: e.target.value })}
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-px-body">Footer telefon</span>
              <input
                value={form.footerContactPhone ?? ""}
                onChange={(e) => setForm({ ...form, footerContactPhone: e.target.value })}
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
              />
            </label>
          </div>
        </div>
      </section>

      <p className="rounded-xl border border-black/8 bg-[#f7f7f7] px-4 py-3 text-sm text-px-body">
        Footer / menü metinleri →{" "}
        <a href="/admin/components" className="font-semibold text-px-red hover:underline">
          Bileşenler
        </a>
        . SEO, GEO ve LLM / AI crawler ayarları için{" "}
        <a href="/admin/seo" className="font-semibold text-px-red hover:underline">
          SEO &amp; AI
        </a>{" "}
        sayfasını kullanın.
      </p>

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
