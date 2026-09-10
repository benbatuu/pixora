"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  SiteGeoSettings,
  SiteLlmSettings,
  SiteSettings,
  SiteSeoSettings,
  SeoPageLocaleCopy,
  SeoPageOverride,
  LlmBotRule,
} from "@/lib/admin/types";
import { SEO_PAGE_KEYS } from "@/lib/admin/settings-schema";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import MediaPickerButton from "@/app/components/admin/media/MediaPickerButton";
import {
  formatDocumentTitle,
  resolvePageSeo,
} from "@/lib/seo/metadata";

type Tab = "seo" | "geo" | "llm";

type LocaleRow = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
};

const FALLBACK_LOCALES: LocaleRow[] = [
  { id: "en", code: "en", name: "English", isDefault: true, isActive: true },
  { id: "tr", code: "tr", name: "Türkçe", isDefault: false, isActive: true },
  { id: "ru", code: "ru", name: "Русский", isDefault: false, isActive: true },
];

const PAGE_LABELS: Record<string, string> = {
  home: "Ana sayfa",
  about: "About",
  services: "Services",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact",
  "not-found": "404 / Bulunamadı",
};

const BOT_FIELDS: {
  key: keyof NonNullable<SiteLlmSettings["robots"]>;
  label: string;
  help: string;
}[] = [
  { key: "gptBot", label: "GPTBot", help: "OpenAI eğitim botu" },
  { key: "chatGptUser", label: "ChatGPT-User", help: "ChatGPT tarama (sohbet)" },
  { key: "googleExtended", label: "Google-Extended", help: "Gemini / AI Overviews eğitim" },
  { key: "claudeBot", label: "ClaudeBot", help: "Anthropic Claude" },
  { key: "perplexityBot", label: "PerplexityBot", help: "Perplexity" },
  { key: "bytespider", label: "Bytespider", help: "ByteDance" },
  { key: "anthropicAi", label: "Anthropic-AI", help: "Anthropic AI" },
];

const inputCls =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const labelCls = "mb-1.5 block text-xs font-medium text-px-body";
const sectionCls = "rounded-2xl border border-black/8 bg-white p-5";

const defaultSeo: SiteSeoSettings = {
  defaultTitle: "",
  defaultDescription: "",
  titleTemplate: "%s | Pixora",
  keywords: [],
  canonicalBaseUrl: "",
  ogImageUrl: "",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterHandle: "",
  robotsIndex: true,
  robotsFollow: true,
  googleSiteVerification: "",
  bingSiteVerification: "",
  pages: {},
};

const defaultGeo: SiteGeoSettings = {
  enabled: true,
  placename: "",
  region: "",
  latitude: undefined,
  longitude: undefined,
  icbm: "",
  organizationType: "ProfessionalService",
  legalName: "",
  streetAddress: "",
  addressLocality: "",
  addressRegion: "",
  postalCode: "",
  addressCountry: "",
  areaServed: [],
  priceRange: "",
  openingHours: [],
};

const defaultLlm: SiteLlmSettings = {
  enabled: true,
  title: "",
  summary: "",
  llmsTxt: "",
  contactEmail: "",
  allowTraining: true,
  robots: {
    gptBot: "allow",
    chatGptUser: "allow",
    googleExtended: "allow",
    claudeBot: "allow",
    perplexityBot: "allow",
    bytespider: "allow",
    anthropicAi: "allow",
  },
};

export default function SeoSettingsForm() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [tab, setTab] = useState<Tab>("seo");
  const [base, setBase] = useState<SiteSettings | null>(null);
  const [seo, setSeo] = useState<SiteSeoSettings>(defaultSeo);
  const [geo, setGeo] = useState<SiteGeoSettings>(defaultGeo);
  const [llm, setLlm] = useState<SiteLlmSettings>(defaultLlm);
  const [keywordsText, setKeywordsText] = useState("");
  const [areaServedText, setAreaServedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locales, setLocales] = useState<LocaleRow[]>(FALLBACK_LOCALES);
  const [pageLocale, setPageLocale] = useState("en");

  useEffect(() => {
    void (async () => {
      try {
        const [settingsRes, localesRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/locales"),
        ]);
        const data = await settingsRes.json();
        if (!settingsRes.ok) throw new Error(data.error || "Yüklenemedi");
        const s = data.settings as SiteSettings;
        setBase(s);
        setSeo({ ...defaultSeo, ...(s.seo ?? {}), pages: { ...(defaultSeo.pages ?? {}), ...(s.seo?.pages ?? {}) } });
        setGeo({ ...defaultGeo, ...(s.geo ?? {}) });
        setLlm({
          ...defaultLlm,
          ...(s.llm ?? {}),
          robots: { ...(defaultLlm.robots ?? {}), ...(s.llm?.robots ?? {}) },
        });
        setKeywordsText((s.seo?.keywords ?? []).join(", "));
        setAreaServedText((s.geo?.areaServed ?? []).join(", "));

        let localesList: LocaleRow[] = FALLBACK_LOCALES;
        if (localesRes.ok) {
          const locData = await localesRes.json();
          const raw = (locData.locales as LocaleRow[] | undefined) ?? [];
          if (raw.length) localesList = raw;
        }
        const active = localesList.filter((l) => l.isActive !== false);
        const list = active.length ? active : localesList;
        setLocales(list);
        const def =
          list.find((l) => l.isDefault)?.code ?? list[0]?.code ?? "en";
        setPageLocale((prev) => (list.some((l) => l.code === prev) ? prev : def));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Hata");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tabs = useMemo(
    () =>
      [
        { id: "seo" as const, label: "SEO" },
        { id: "geo" as const, label: "GEO" },
        { id: "llm" as const, label: "LLM" },
      ] as const,
    [],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!base) return;
    setSaving(true);
    setError(null);
    try {
      const keywords = keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const areaServed = areaServedText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const pages: Record<string, SeoPageOverride> = {};
      for (const [key, page] of Object.entries(seo.pages ?? {})) {
        const en = page.i18n?.en;
        const next: SeoPageOverride = {
          ...page,
          i18n: page.i18n ? { ...page.i18n } : undefined,
        };
        if (en) {
          if (en.title !== undefined) next.title = en.title;
          if (en.subtitle !== undefined) next.subtitle = en.subtitle;
          if (en.description !== undefined) next.description = en.description;
          if (en.ogImageUrl !== undefined) next.ogImageUrl = en.ogImageUrl;
        }
        pages[key] = next;
      }

      const payload: SiteSettings = {
        ...base,
        seo: {
          ...seo,
          keywords,
          canonicalBaseUrl: seo.canonicalBaseUrl?.replace(/\/+$/, "") || "",
          pages,
        },
        geo: {
          ...geo,
          areaServed,
          latitude:
            geo.latitude === undefined || Number.isNaN(geo.latitude)
              ? undefined
              : Number(geo.latitude),
          longitude:
            geo.longitude === undefined || Number.isNaN(geo.longitude)
              ? undefined
              : Number(geo.longitude),
        },
        llm: {
          ...llm,
          robots: { ...(llm.robots ?? {}) },
        },
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
      setSeo({ ...defaultSeo, ...(saved.seo ?? {}), pages: { ...(saved.seo?.pages ?? {}) } });
      setGeo({ ...defaultGeo, ...(saved.geo ?? {}) });
      setLlm({
        ...defaultLlm,
        ...(saved.llm ?? {}),
        robots: { ...(defaultLlm.robots ?? {}), ...(saved.llm?.robots ?? {}) },
      });
      setKeywordsText((saved.seo?.keywords ?? []).join(", "));
      setAreaServedText((saved.geo?.areaServed ?? []).join(", "));
      toastSuccess("SEO ayarları kaydedildi");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  }

  function patchPage(key: string, patch: Partial<SeoPageOverride>) {
    setSeo((prev) => ({
      ...prev,
      pages: {
        ...(prev.pages ?? {}),
        [key]: { ...(prev.pages?.[key] ?? {}), ...patch },
      },
    }));
  }

  function patchPageLocale(
    key: string,
    locale: string,
    patch: Partial<SeoPageLocaleCopy>,
  ) {
    setSeo((prev) => {
      const page = prev.pages?.[key] ?? {};
      const i18n = { ...(page.i18n ?? {}) };
      const row = { ...(i18n[locale] ?? {}), ...patch };
      i18n[locale] = row;
      const next: SeoPageOverride = { ...page, i18n };
      if (locale === "en") {
        if (patch.title !== undefined) next.title = patch.title;
        if (patch.subtitle !== undefined) next.subtitle = patch.subtitle;
        if (patch.description !== undefined) next.description = patch.description;
        if (patch.ogImageUrl !== undefined) next.ogImageUrl = patch.ogImageUrl;
      }
      return {
        ...prev,
        pages: { ...(prev.pages ?? {}), [key]: next },
      };
    });
  }

  function localeCopyFor(
    page: SeoPageOverride,
    locale: string,
  ): SeoPageLocaleCopy {
    const fromI18n = page.i18n?.[locale];
    if (fromI18n) return fromI18n;
    if (locale === "en") {
      return {
        title: page.title,
        subtitle: page.subtitle,
        description: page.description,
        ogImageUrl: page.ogImageUrl,
      };
    }
    return {};
  }

  function setBot(key: keyof NonNullable<SiteLlmSettings["robots"]>, value: LlmBotRule) {
    setLlm((prev) => ({
      ...prev,
      robots: { ...(prev.robots ?? {}), [key]: value },
    }));
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
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-px-black text-white"
                : "border border-black/10 bg-white text-px-black hover:border-px-red"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "seo" ? (
        <div className="space-y-6">
          <section className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
              Genel SEO
            </h2>
            <div className="grid gap-4">
              <label className="block">
                <span className={labelCls}>Varsayılan title</span>
                <input
                  className={inputCls}
                  value={seo.defaultTitle}
                  onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className={labelCls}>Varsayılan description</span>
                <textarea
                  className={`${inputCls} h-auto py-2`}
                  rows={3}
                  value={seo.defaultDescription}
                  onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                  required
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>Title template</span>
                  <input
                    className={inputCls}
                    placeholder="%s | Pixora"
                    value={seo.titleTemplate ?? ""}
                    onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Canonical base URL</span>
                  <input
                    className={inputCls}
                    placeholder="https://example.com"
                    value={seo.canonicalBaseUrl ?? ""}
                    onChange={(e) => setSeo({ ...seo, canonicalBaseUrl: e.target.value })}
                  />
                  <span className="mt-1 block text-[11px] text-px-body">
                    Sondaki slash olmadan (örn. https://getpixoria.com). Boş bırakılırsa{" "}
                    <code className="text-[10px]">NEXT_PUBLIC_SITE_URL</code> env
                    değeri kullanılır; o da yoksa canonical/sitemap göreli kalır.
                  </span>
                </label>
              </div>
              <label className="block">
                <span className={labelCls}>Keywords (virgülle)</span>
                <input
                  className={inputCls}
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder="design, branding, motion"
                />
              </label>
              <label className="block">
                <span className={labelCls}>OG image URL</span>
                <div className="flex flex-wrap gap-2">
                  <input
                    className={`${inputCls} min-w-0 flex-1`}
                    value={seo.ogImageUrl ?? ""}
                    onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
                  />
                  <MediaPickerButton
                    onSelect={(url) => setSeo({ ...seo, ogImageUrl: url })}
                  />
                </div>
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className={labelCls}>OG type</span>
                  <input
                    className={inputCls}
                    value={seo.ogType ?? "website"}
                    onChange={(e) => setSeo({ ...seo, ogType: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Twitter card</span>
                  <select
                    className={inputCls}
                    value={seo.twitterCard ?? "summary_large_image"}
                    onChange={(e) =>
                      setSeo({
                        ...seo,
                        twitterCard: e.target.value as SiteSeoSettings["twitterCard"],
                      })
                    }
                  >
                    <option value="summary">summary</option>
                    <option value="summary_large_image">summary_large_image</option>
                  </select>
                </label>
                <label className="block">
                  <span className={labelCls}>Twitter handle</span>
                  <input
                    className={inputCls}
                    placeholder="@pixora"
                    value={seo.twitterHandle ?? ""}
                    onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-px-black">
                  <input
                    type="checkbox"
                    checked={seo.robotsIndex !== false}
                    onChange={(e) => setSeo({ ...seo, robotsIndex: e.target.checked })}
                  />
                  robots index
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-px-black">
                  <input
                    type="checkbox"
                    checked={seo.robotsFollow !== false}
                    onChange={(e) => setSeo({ ...seo, robotsFollow: e.target.checked })}
                  />
                  robots follow
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>Google site verification</span>
                  <input
                    className={inputCls}
                    value={seo.googleSiteVerification ?? ""}
                    onChange={(e) =>
                      setSeo({ ...seo, googleSiteVerification: e.target.value })
                    }
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Bing site verification</span>
                  <input
                    className={inputCls}
                    value={seo.bingSiteVerification ?? ""}
                    onChange={(e) =>
                      setSeo({ ...seo, bingSiteVerification: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
              Sayfa override&apos;ları
            </h2>
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <div className="min-w-[200px]">
                <span className={labelCls}>Dil</span>
                <div className="flex flex-wrap gap-1">
                  {locales.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setPageLocale(l.code)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        pageLocale === l.code
                          ? "bg-px-black text-white"
                          : "bg-[#f7f7f7] text-px-body hover:text-px-black"
                      }`}
                    >
                      {l.code}
                    </button>
                  ))}
                </div>
              </div>
              <p className="flex-1 text-xs text-px-body">
                Her dil için title / subtitle / description / OG image. EN kaydı
                legacy alanlara da yazılır. noindex tüm diller için ortaktır.
              </p>
            </div>
            <div className="space-y-4">
              {SEO_PAGE_KEYS.map((key) => {
                const page = seo.pages?.[key] ?? {};
                const copy = localeCopyFor(page, pageLocale);
                const resolved = resolvePageSeo(page, pageLocale, "en");
                const docTitle = formatDocumentTitle(
                  resolved.title,
                  seo.titleTemplate,
                  seo.defaultTitle || "Pixora",
                );
                const subtitleLine =
                  resolved.subtitle?.trim() ||
                  base?.studioName ||
                  "Pixora";
                const favicon = base?.brand?.faviconUrl;
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-black/8 bg-[#fafafa] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-px-black">
                        {PAGE_LABELS[key] ?? key}
                        <span className="ml-2 text-xs font-normal uppercase text-px-body">
                          · {pageLocale}
                        </span>
                      </p>
                      <label className="inline-flex items-center gap-2 text-xs text-px-body">
                        <input
                          type="checkbox"
                          checked={page.noindex === true}
                          onChange={(e) =>
                            patchPage(key, { noindex: e.target.checked })
                          }
                        />
                        noindex
                      </label>
                    </div>

                    {/* Chrome tab preview */}
                    <div className="mb-4 overflow-hidden rounded-lg border border-black/10 bg-[#dee1e6] shadow-sm">
                      <div className="flex items-end gap-1 px-2 pt-2">
                        <div className="flex max-w-[280px] items-center gap-2 rounded-t-lg bg-white px-3 py-1.5 shadow-sm">
                          {favicon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={favicon}
                              alt=""
                              className="h-3.5 w-3.5 shrink-0 rounded-sm object-contain"
                            />
                          ) : (
                            <span className="inline-block h-3.5 w-3.5 shrink-0 rounded-sm bg-px-red/80" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium leading-tight text-[#202124]">
                              {docTitle}
                            </p>
                            <p className="truncate text-[10px] leading-tight text-[#5f6368]">
                              {subtitleLine}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] text-[#5f6368]" aria-hidden>
                            ✕
                          </span>
                        </div>
                        <div className="mb-0.5 h-3 flex-1 rounded-tr-md bg-[#c7cad0]/60" />
                      </div>
                      <div className="border-t border-black/5 bg-white px-3 py-1.5">
                        <p className="truncate font-mono text-[10px] text-px-body">
                          {seo.canonicalBaseUrl?.replace(/\/+$/, "") ||
                            "https://example.com"}
                          {pageLocale === "en"
                            ? key === "home"
                              ? "/"
                              : `/${key}`
                            : key === "home"
                              ? `/${pageLocale}`
                              : `/${pageLocale}/${key}`}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="block">
                        <span className={labelCls}>Title</span>
                        <input
                          className={inputCls}
                          value={copy.title ?? ""}
                          onChange={(e) =>
                            patchPageLocale(key, pageLocale, {
                              title: e.target.value,
                            })
                          }
                          placeholder={
                            pageLocale === "en"
                              ? "About  veya  About | Pixora"
                              : undefined
                          }
                        />
                      </label>
                      <label className="block">
                        <span className={labelCls}>Subtitle</span>
                        <input
                          className={inputCls}
                          value={copy.subtitle ?? ""}
                          onChange={(e) =>
                            patchPageLocale(key, pageLocale, {
                              subtitle: e.target.value,
                            })
                          }
                          placeholder="Önizlemede title altında"
                        />
                      </label>
                    </div>
                    <label className="mt-3 block">
                      <span className={labelCls}>Description</span>
                      <textarea
                        className={`${inputCls} h-auto py-2`}
                        rows={2}
                        value={copy.description ?? ""}
                        onChange={(e) =>
                          patchPageLocale(key, pageLocale, {
                            description: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="mt-3 block">
                      <span className={labelCls}>OG image</span>
                      <div className="flex flex-wrap gap-2">
                        <input
                          className={`${inputCls} min-w-0 flex-1`}
                          value={copy.ogImageUrl ?? ""}
                          onChange={(e) =>
                            patchPageLocale(key, pageLocale, {
                              ogImageUrl: e.target.value,
                            })
                          }
                        />
                        <MediaPickerButton
                          onSelect={(url) =>
                            patchPageLocale(key, pageLocale, {
                              ogImageUrl: url,
                            })
                          }
                        />
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      ) : null}

      {tab === "geo" ? (
        <section className={sectionCls}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
              Yerel / GEO (JSON-LD)
            </h2>
            <label className="inline-flex items-center gap-2 text-sm text-px-black">
              <input
                type="checkbox"
                checked={geo.enabled !== false}
                onChange={(e) => setGeo({ ...geo, enabled: e.target.checked })}
              />
              Etkin
            </label>
          </div>
          <p className="mb-4 text-xs text-px-body">
            Studio adı, e-posta, telefon, adres, sosyal linkler ve logo Ayarlar&apos;dan
            JSON-LD&apos;ye eklenir.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Placename</span>
              <input
                className={inputCls}
                value={geo.placename ?? ""}
                onChange={(e) => setGeo({ ...geo, placename: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Region (örn. US-NC)</span>
              <input
                className={inputCls}
                value={geo.region ?? ""}
                onChange={(e) => setGeo({ ...geo, region: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Latitude</span>
              <input
                type="number"
                step="any"
                className={inputCls}
                value={geo.latitude ?? ""}
                onChange={(e) =>
                  setGeo({
                    ...geo,
                    latitude: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="block">
              <span className={labelCls}>Longitude</span>
              <input
                type="number"
                step="any"
                className={inputCls}
                value={geo.longitude ?? ""}
                onChange={(e) =>
                  setGeo({
                    ...geo,
                    longitude: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="block md:col-span-2">
              <span className={labelCls}>ICBM (lat, long)</span>
              <input
                className={inputCls}
                value={geo.icbm ?? ""}
                onChange={(e) => setGeo({ ...geo, icbm: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Organizasyon tipi</span>
              <select
                className={inputCls}
                value={geo.organizationType ?? "ProfessionalService"}
                onChange={(e) =>
                  setGeo({
                    ...geo,
                    organizationType: e.target.value as SiteGeoSettings["organizationType"],
                  })
                }
              >
                <option value="Organization">Organization</option>
                <option value="LocalBusiness">LocalBusiness</option>
                <option value="ProfessionalService">ProfessionalService</option>
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>Legal name</span>
              <input
                className={inputCls}
                value={geo.legalName ?? ""}
                onChange={(e) => setGeo({ ...geo, legalName: e.target.value })}
              />
            </label>
            <label className="block md:col-span-2">
              <span className={labelCls}>Street address</span>
              <input
                className={inputCls}
                value={geo.streetAddress ?? ""}
                onChange={(e) => setGeo({ ...geo, streetAddress: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>City (locality)</span>
              <input
                className={inputCls}
                value={geo.addressLocality ?? ""}
                onChange={(e) => setGeo({ ...geo, addressLocality: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>State / region</span>
              <input
                className={inputCls}
                value={geo.addressRegion ?? ""}
                onChange={(e) => setGeo({ ...geo, addressRegion: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Postal code</span>
              <input
                className={inputCls}
                value={geo.postalCode ?? ""}
                onChange={(e) => setGeo({ ...geo, postalCode: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Country (ISO)</span>
              <input
                className={inputCls}
                placeholder="US"
                value={geo.addressCountry ?? ""}
                onChange={(e) => setGeo({ ...geo, addressCountry: e.target.value })}
              />
            </label>
            <label className="block md:col-span-2">
              <span className={labelCls}>Area served (virgülle)</span>
              <input
                className={inputCls}
                value={areaServedText}
                onChange={(e) => setAreaServedText(e.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Price range</span>
              <input
                className={inputCls}
                placeholder="$$"
                value={geo.priceRange ?? ""}
                onChange={(e) => setGeo({ ...geo, priceRange: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Opening hours (virgülle, schema.org)</span>
              <input
                className={inputCls}
                placeholder="Mo-Fr 09:00-18:00"
                value={(geo.openingHours ?? []).join(", ")}
                onChange={(e) =>
                  setGeo({
                    ...geo,
                    openingHours: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </div>
        </section>
      ) : null}

      {tab === "llm" ? (
        <div className="space-y-6">
          <section className={sectionCls}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
                LLM / AI crawler
              </h2>
              <label className="inline-flex items-center gap-2 text-sm text-px-black">
                <input
                  type="checkbox"
                  checked={llm.enabled !== false}
                  onChange={(e) => setLlm({ ...llm, enabled: e.target.checked })}
                />
                llms.txt sun
              </label>
            </div>
            <p className="mb-4 text-xs text-px-body">
              Varsayılan: botlar <strong>allow</strong>. &quot;Eğitime izin ver&quot; kapalıysa
              eğitim odaklı botlar (GPTBot, Google-Extended) robots.txt&apos;te block edilir;
              ChatGPT-User allow kalır. Açık seçim her zaman önceliklidir.
            </p>
            <div className="grid gap-4">
              <label className="block">
                <span className={labelCls}>Başlık</span>
                <input
                  className={inputCls}
                  value={llm.title ?? ""}
                  onChange={(e) => setLlm({ ...llm, title: e.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Özet (AI için)</span>
                <textarea
                  className={`${inputCls} h-auto py-2`}
                  rows={3}
                  value={llm.summary ?? ""}
                  onChange={(e) => setLlm({ ...llm, summary: e.target.value })}
                />
              </label>
              <label className="block">
                <span className={labelCls}>llms.txt gövdesi (markdown)</span>
                <textarea
                  className={`${inputCls} h-auto py-2 font-mono text-xs`}
                  rows={10}
                  value={llm.llmsTxt ?? ""}
                  onChange={(e) => setLlm({ ...llm, llmsTxt: e.target.value })}
                  placeholder="Boş bırakılırsa özet + sayfa listesinden otomatik üretilir"
                />
              </label>
              <label className="block">
                <span className={labelCls}>İletişim e-posta (llms.txt)</span>
                <input
                  className={inputCls}
                  value={llm.contactEmail ?? ""}
                  onChange={(e) => setLlm({ ...llm, contactEmail: e.target.value })}
                />
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-px-black">
                <input
                  type="checkbox"
                  checked={llm.allowTraining !== false}
                  onChange={(e) => setLlm({ ...llm, allowTraining: e.target.checked })}
                />
                Eğitime izin ver (allowTraining)
              </label>
            </div>
          </section>

          <section className={sectionCls}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
              Bot kuralları
            </h2>
            <div className="space-y-3">
              {BOT_FIELDS.map((bot) => (
                <div
                  key={bot.key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-px-black">{bot.label}</p>
                    <p className="text-xs text-px-body">{bot.help}</p>
                  </div>
                  <select
                    className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-px-red"
                    value={llm.robots?.[bot.key] ?? "allow"}
                    onChange={(e) => setBot(bot.key, e.target.value as LlmBotRule)}
                  >
                    <option value="allow">allow</option>
                    <option value="block">block</option>
                  </select>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

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
