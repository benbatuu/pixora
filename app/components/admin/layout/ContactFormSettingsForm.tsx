"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContactFormLocale, SiteSettings } from "@/lib/admin/types";
import { SITE_SETTINGS } from "@/app/data/site";
import { useToast } from "@/app/components/admin/ui/ToastProvider";

type LocaleRow = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
};

const emptyForm: SiteContactFormLocale = {
  submitLabel: "",
  successTitle: "",
  successBody: "",
  sendAnother: "",
  fields: {
    email: { placeholder: "" },
    name: { placeholder: "" },
    phone: { placeholder: "" },
    company: { placeholder: "" },
    budget: { placeholder: "" },
    message: { placeholder: "" },
  },
};

const inputCls =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const textareaCls =
  "w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2 text-sm outline-none focus:border-px-red focus:bg-white";
const labelCls = "mb-1.5 block text-xs font-medium text-px-body";
const sectionCls = "rounded-2xl border border-black/8 bg-white p-5";

function seedForLocale(code: string): SiteContactFormLocale {
  const seeded = SITE_SETTINGS.contactForm?.[code];
  return {
    ...emptyForm,
    ...(seeded ?? {}),
    fields: {
      ...emptyForm.fields,
      ...(seeded?.fields ?? {}),
      email: { ...emptyForm.fields?.email, ...(seeded?.fields?.email ?? {}) },
      name: { ...emptyForm.fields?.name, ...(seeded?.fields?.name ?? {}) },
      phone: { ...emptyForm.fields?.phone, ...(seeded?.fields?.phone ?? {}) },
      company: { ...emptyForm.fields?.company, ...(seeded?.fields?.company ?? {}) },
      budget: { ...emptyForm.fields?.budget, ...(seeded?.fields?.budget ?? {}) },
      message: { ...emptyForm.fields?.message, ...(seeded?.fields?.message ?? {}) },
    },
  };
}

export default function ContactFormSettingsForm() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [base, setBase] = useState<SiteSettings | null>(null);
  const [forms, setForms] = useState<Record<string, SiteContactFormLocale>>({});
  const [locales, setLocales] = useState<LocaleRow[]>([]);
  const [localeCode, setLocaleCode] = useState("en");
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

      const merged: Record<string, SiteContactFormLocale> = {
        ...(SITE_SETTINGS.contactForm ?? {}),
        ...(s.contactForm ?? {}),
      };
      for (const l of active.length ? active : localesList) {
        merged[l.code] = {
          ...seedForLocale(l.code),
          ...(merged[l.code] ?? {}),
          fields: {
            ...seedForLocale(l.code).fields,
            ...(merged[l.code]?.fields ?? {}),
          },
        };
      }
      setForms(merged);

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

  const current = forms[localeCode] ?? seedForLocale(localeCode);

  function patchCurrent(patch: Partial<SiteContactFormLocale>) {
    setForms((prev) => ({
      ...prev,
      [localeCode]: {
        ...(prev[localeCode] ?? seedForLocale(localeCode)),
        ...patch,
        fields: {
          ...(prev[localeCode]?.fields ?? seedForLocale(localeCode).fields),
          ...(patch.fields ?? {}),
        },
      },
    }));
  }

  function patchField(
    key: keyof NonNullable<SiteContactFormLocale["fields"]>,
    placeholder: string,
  ) {
    patchCurrent({
      fields: {
        ...(current.fields ?? {}),
        [key]: {
          ...(current.fields?.[key] ?? {}),
          placeholder,
        },
      },
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!base) return;
    setSaving(true);
    setError(null);
    try {
      const cleaned: Record<string, SiteContactFormLocale> = {};
      for (const [code, row] of Object.entries(forms)) {
        const next: SiteContactFormLocale = {};
        if (row.submitLabel?.trim()) next.submitLabel = row.submitLabel.trim();
        if (row.successTitle?.trim()) next.successTitle = row.successTitle.trim();
        if (row.successBody?.trim()) next.successBody = row.successBody.trim();
        if (row.sendAnother?.trim()) next.sendAnother = row.sendAnother.trim();
        const fields: NonNullable<SiteContactFormLocale["fields"]> = {};
        for (const k of ["email", "name", "phone", "company", "budget", "message"] as const) {
          const ph = row.fields?.[k]?.placeholder?.trim();
          const lb = row.fields?.[k]?.label?.trim();
          if (ph || lb) {
            fields[k] = {};
            if (ph) fields[k]!.placeholder = ph;
            if (lb) fields[k]!.label = lb;
          }
        }
        if (Object.keys(fields).length) next.fields = fields;
        cleaned[code] = next;
      }

      const payload: SiteSettings = {
        ...base,
        contactForm: cleaned,
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
      setForms({
        ...(SITE_SETTINGS.contactForm ?? {}),
        ...(saved.contactForm ?? {}),
      });
      toastSuccess("İletişim formu metinleri kaydedildi");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-px-body">Yükleniyor…</p>;
  }

  const fieldKeys = [
    { key: "email" as const, label: "E-posta placeholder" },
    { key: "name" as const, label: "Ad placeholder" },
    { key: "phone" as const, label: "Telefon placeholder" },
    { key: "company" as const, label: "Şirket placeholder" },
    { key: "budget" as const, label: "Bütçe placeholder" },
    { key: "message" as const, label: "Mesaj placeholder" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

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
          Form etiketleri ve başarı mesajları dil bazında. Boş alanlar UI sözlüğüne
          düşer.
        </p>
      </div>

      <section className={sectionCls}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          İletişim formu · {localeCode.toUpperCase()}
        </h2>
        <div className="grid gap-4">
          <label className="block">
            <span className={labelCls}>Gönder butonu</span>
            <input
              value={current.submitLabel ?? ""}
              onChange={(e) => patchCurrent({ submitLabel: e.target.value })}
              className={inputCls}
              placeholder="Send Message"
            />
          </label>
          <label className="block">
            <span className={labelCls}>Başarı başlığı</span>
            <input
              value={current.successTitle ?? ""}
              onChange={(e) => patchCurrent({ successTitle: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Başarı metni</span>
            <textarea
              value={current.successBody ?? ""}
              onChange={(e) => patchCurrent({ successBody: e.target.value })}
              rows={2}
              className={textareaCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Yeni mesaj butonu</span>
            <input
              value={current.sendAnother ?? ""}
              onChange={(e) => patchCurrent({ sendAnother: e.target.value })}
              className={inputCls}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            {fieldKeys.map((f) => (
              <label key={f.key} className="block">
                <span className={labelCls}>{f.label}</span>
                <input
                  value={current.fields?.[f.key]?.placeholder ?? ""}
                  onChange={(e) => patchField(f.key, e.target.value)}
                  className={inputCls}
                />
              </label>
            ))}
          </div>
        </div>
      </section>

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
