"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ADMIN_BASE } from "@/lib/admin/constants";
import MediaPickerButton from "@/app/components/admin/media/MediaPickerButton";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import { useConfirm } from "@/app/components/admin/ui/ConfirmDialog";

export type ProjectTranslationFields = {
  title: string;
  about: string;
  client: string;
  expertise: string;
  duration: string;
  designer: string;
  services: string[];
  metrics: { value: string; label: string }[];
  nextSlug?: string;
  nextTitle?: string;
  nextMeta?: string;
};

export type ProjectFormInitial = {
  id: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  year: string;
  coverUrl: string;
  siteUrl: string;
  tags: string[];
  gallery: string[];
  sortOrder: number;
  localeCode: string;
  translations: Record<string, ProjectTranslationFields>;
  translatedLocales: string[];
};

type LocaleOption = {
  code: string;
  name: string;
  isDefault?: boolean;
};

type Props = {
  mode: "create" | "edit";
  initial?: ProjectFormInitial;
  locales?: LocaleOption[];
};

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body";
const textareaClass =
  "w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2.5 text-sm outline-none focus:border-px-red focus:bg-white";

function emptyMetrics() {
  return [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ];
}

function emptyTranslation(): ProjectTranslationFields {
  return {
    title: "",
    about: "",
    client: "",
    expertise: "",
    duration: "",
    designer: "",
    services: [],
    metrics: emptyMetrics(),
    nextSlug: "",
    nextTitle: "",
    nextMeta: "",
  };
}

function normalizeMetrics(m?: { value: string; label: string }[]) {
  const next = m?.length ? [...m] : emptyMetrics();
  while (next.length < 3) next.push({ value: "", label: "" });
  return next.slice(0, 3);
}

export default function ProjectForm({ mode, initial, locales: localesProp }: Props) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const { confirmDelete } = useConfirm();
  const [locales, setLocales] = useState<LocaleOption[]>(localesProp ?? []);
  const [localeCode, setLocaleCode] = useState(
    initial?.localeCode ?? localesProp?.find((l) => l.isDefault)?.code ?? "en",
  );
  const [translations, setTranslations] = useState<Record<string, ProjectTranslationFields>>(
    () => ({ ...(initial?.translations ?? {}) }),
  );
  const [translatedLocales, setTranslatedLocales] = useState<string[]>(
    initial?.translatedLocales ?? Object.keys(initial?.translations ?? {}),
  );

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    initial?.status ?? "DRAFT",
  );
  const [year, setYear] = useState(initial?.year ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [siteUrl, setSiteUrl] = useState(initial?.siteUrl ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [gallery, setGallery] = useState((initial?.gallery ?? []).join("\n"));
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [servicesDraft, setServicesDraft] = useState(
    ((initial?.translations?.[initial?.localeCode ?? "en"]?.services) ?? []).join("\n"),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = translations[localeCode] ?? emptyTranslation();

  useEffect(() => {
    if (localesProp?.length) {
      setLocales(localesProp);
      return;
    }
    void (async () => {
      try {
        const res = await fetch("/api/admin/locales");
        if (!res.ok) return;
        const data = await res.json();
        const list = (data.locales as LocaleOption[] | undefined) ?? [];
        if (list.length) setLocales(list);
      } catch {
        /* ignore */
      }
    })();
  }, [localesProp]);

  const localeTabs = useMemo(() => {
    if (locales.length) return locales;
    return [{ code: "en", name: "English", isDefault: true }];
  }, [locales]);

  function switchLocale(next: string) {
    if (next === localeCode) return;
    const services = servicesDraft
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const flushed: ProjectTranslationFields = {
      ...(translations[localeCode] ?? emptyTranslation()),
      title: active.title,
      about: active.about,
      client: active.client,
      expertise: active.expertise,
      duration: active.duration,
      designer: active.designer,
      services,
      metrics: active.metrics,
      nextSlug: active.nextSlug,
      nextTitle: active.nextTitle,
      nextMeta: active.nextMeta,
    };
    const nextMap: Record<string, ProjectTranslationFields> = {
      ...translations,
      [localeCode]: flushed,
    };
    const nextTr = nextMap[next] ?? emptyTranslation();
    if (!nextMap[next]) {
      nextMap[next] = nextTr;
    }
    setTranslations(nextMap);
    setServicesDraft((nextTr.services ?? []).join("\n"));
    setLocaleCode(next);
  }

  function patchActive(patch: Partial<ProjectTranslationFields>) {
    setTranslations((prev) => {
      const cur = prev[localeCode] ?? emptyTranslation();
      return { ...prev, [localeCode]: { ...cur, ...patch } };
    });
  }


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const services = servicesDraft
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const flushed: ProjectTranslationFields = {
        ...(translations[localeCode] ?? emptyTranslation()),
        title: active.title,
        about: active.about,
        client: active.client,
        expertise: active.expertise,
        duration: active.duration,
        designer: active.designer,
        services,
        metrics: active.metrics,
        nextSlug: active.nextSlug,
        nextTitle: active.nextTitle,
        nextMeta: active.nextMeta,
      };
      const nextMap: Record<string, ProjectTranslationFields> = {
        ...translations,
        [localeCode]: flushed,
      };
      setTranslations(nextMap);

      const body = {
        slug: slug.trim().toLowerCase(),
        status,
        title: flushed.title.trim(),
        year: year.trim() || null,
        coverUrl: coverUrl.trim() || null,
        siteUrl: siteUrl.trim() || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        about: flushed.about,
        client: flushed.client,
        expertise: flushed.expertise,
        duration: flushed.duration,
        designer: flushed.designer,
        services,
        gallery: gallery
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean),
        sortOrder: Number.parseInt(sortOrder, 10) || 0,
        localeCode: localeCode.trim() || "en",
        metrics: (flushed.metrics ?? []).filter((m) => m.value.trim() || m.label.trim()),
        nextSlug: flushed.nextSlug?.trim() || null,
        nextTitle: flushed.nextTitle?.trim() || null,
        nextMeta: flushed.nextMeta?.trim() || null,
      };

      const res =
        mode === "create"
          ? await fetch("/api/admin/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
          : await fetch(`/api/admin/projects/${initial!.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi");
      success(
        mode === "create"
          ? "Proje oluşturuldu"
          : `Proje kaydedildi (${localeCode})`,
      );
      if (mode === "edit" && data.project?.translations) {
        const map: Record<string, ProjectTranslationFields> = {};
        const codes: string[] = [];
        for (const t of data.project.translations as {
          locale: { code: string };
          title: string;
          about: string;
          client: string;
          expertise: string;
          duration: string;
          designer: string;
          services: string[];
          metrics: { value: string; label: string }[] | null;
          nextSlug?: string | null;
          nextTitle?: string | null;
          nextMeta?: string | null;
        }[]) {
          codes.push(t.locale.code);
          map[t.locale.code] = {
            title: t.title,
            about: t.about,
            client: t.client,
            expertise: t.expertise,
            duration: t.duration,
            designer: t.designer,
            services: t.services ?? [],
            metrics: normalizeMetrics(
              Array.isArray(t.metrics) ? t.metrics : [],
            ),
            nextSlug: t.nextSlug ?? "",
            nextTitle: t.nextTitle ?? "",
            nextMeta: t.nextMeta ?? "",
          };
        }
        setTranslations(map);
        setTranslatedLocales(codes);
        const kept = map[localeCode] ?? emptyTranslation();
        setServicesDraft((kept.services ?? []).join("\n"));
      } else {
        router.push(`${ADMIN_BASE}/projects`);
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!initial?.id) return;
    const ok = await confirmDelete("Bu projeyi silmek istediğine emin misin?");
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${initial.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      success("Proje silindi");
      router.push(`${ADMIN_BASE}/projects`);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/8 bg-white p-4">
        <span className="text-xs font-medium uppercase tracking-[0.06em] text-px-body">
          Çeviri:
        </span>
        {localeTabs.map((l) => {
          const has = translatedLocales.includes(l.code) || Boolean(translations[l.code]?.title);
          const activeTab = localeCode === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => switchLocale(l.code)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                activeTab
                  ? "bg-px-black text-white"
                  : "bg-[#f7f7f7] text-px-body hover:text-px-black"
              }`}
            >
              {l.code} {has ? "✓" : "✗"}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-px-body">
          Kaydet yalnızca seçili dil çevirisini upsert eder
        </span>
      </div>

      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Temel
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Başlık ({localeCode})</span>
            <input
              value={active.title}
              onChange={(e) => patchActive({ title: e.target.value })}
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="electro-hub"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Durum</span>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED")
              }
              className={inputClass}
            >
              <option value="DRAFT">Taslak</option>
              <option value="PUBLISHED">Yayında</option>
              <option value="ARCHIVED">Arşiv</option>
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Yıl</span>
            <input value={year} onChange={(e) => setYear(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Sıra</span>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="block md:col-span-2">
            <span className={labelClass}>Kapak URL</span>
            <div className="flex flex-wrap gap-2">
              <input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className={`${inputClass} min-w-0 flex-1`}
              />
              <MediaPickerButton onSelect={setCoverUrl} />
            </div>
          </div>
          <label className="block md:col-span-2">
            <span className={labelClass}>Site URL</span>
            <input
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block md:col-span-2">
            <span className={labelClass}>Etiketler (virgülle)</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Web Design, Branding"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          İçerik ({localeCode})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className={labelClass}>Hakkında</span>
            <textarea
              value={active.about}
              onChange={(e) => patchActive({ about: e.target.value })}
              rows={4}
              className={textareaClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Müşteri</span>
            <input
              value={active.client}
              onChange={(e) => patchActive({ client: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Uzmanlık</span>
            <input
              value={active.expertise}
              onChange={(e) => patchActive({ expertise: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Süre</span>
            <input
              value={active.duration}
              onChange={(e) => patchActive({ duration: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Tasarımcı</span>
            <input
              value={active.designer}
              onChange={(e) => patchActive({ designer: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block md:col-span-2">
            <span className={labelClass}>Hizmetler (satır veya virgül)</span>
            <textarea
              value={servicesDraft}
              onChange={(e) => setServicesDraft(e.target.value)}
              rows={4}
              className={textareaClass}
            />
          </label>
          <label className="block md:col-span-2">
            <span className={labelClass}>Galeri URL’leri (satır başına bir)</span>
            <textarea
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
              rows={5}
              className={textareaClass}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Metrikler ({localeCode})
        </h2>
        <div className="space-y-3">
          {normalizeMetrics(active.metrics).map((m, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Değer</span>
                <input
                  value={m.value}
                  onChange={(e) => {
                    const next = normalizeMetrics(active.metrics);
                    next[i] = { ...next[i], value: e.target.value };
                    patchActive({ metrics: next });
                  }}
                  placeholder="6%"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Etiket</span>
                <input
                  value={m.label}
                  onChange={(e) => {
                    const next = normalizeMetrics(active.metrics);
                    next[i] = { ...next[i], label: e.target.value };
                    patchActive({ metrics: next });
                  }}
                  placeholder="Increase in conversions"
                  className={inputClass}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Sonraki proje ({localeCode})
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className={labelClass}>Slug</span>
            <input
              value={active.nextSlug ?? ""}
              onChange={(e) => patchActive({ nextSlug: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Başlık</span>
            <input
              value={active.nextTitle ?? ""}
              onChange={(e) => patchActive({ nextTitle: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Meta</span>
            <input
              value={active.nextMeta ?? ""}
              onChange={(e) => patchActive({ nextMeta: e.target.value })}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center rounded-full bg-px-black px-6 text-sm font-semibold text-white hover:bg-px-red disabled:opacity-60"
        >
          {busy ? "Kaydediliyor…" : mode === "create" ? "Oluştur" : `Kaydet (${localeCode})`}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void onDelete()}
            className="inline-flex h-11 items-center rounded-full border border-px-red/40 px-6 text-sm font-semibold text-px-red hover:bg-[#e11010]/5 disabled:opacity-60"
          >
            Sil
          </button>
        ) : null}
      </div>
    </form>
  );
}
