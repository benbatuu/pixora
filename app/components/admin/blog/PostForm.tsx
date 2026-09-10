"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ADMIN_BASE } from "@/lib/admin/constants";
import MediaPickerButton from "@/app/components/admin/media/MediaPickerButton";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import { useConfirm } from "@/app/components/admin/ui/ConfirmDialog";

export type PostTranslationFields = {
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
};

export type PostFormInitial = {
  id: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverUrl: string;
  category: string;
  authorName: string;
  authorRole: string;
  readTime: string;
  comments: number;
  localeCode: string;
  translations: Record<string, PostTranslationFields>;
  translatedLocales: string[];
};

type LocaleOption = {
  code: string;
  name: string;
  isDefault?: boolean;
};

type Props = {
  mode: "create" | "edit";
  initial?: PostFormInitial;
  locales?: LocaleOption[];
};

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body";
const textareaClass =
  "w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2.5 text-sm outline-none focus:border-px-red focus:bg-white";

function emptyTranslation(): PostTranslationFields {
  return {
    title: "",
    excerpt: "",
    body: "",
    seoTitle: "",
    seoDescription: "",
  };
}

export default function PostForm({ mode, initial, locales: localesProp }: Props) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const { confirmDelete } = useConfirm();
  const [locales, setLocales] = useState<LocaleOption[]>(localesProp ?? []);
  const [localeCode, setLocaleCode] = useState(
    initial?.localeCode ?? localesProp?.find((l) => l.isDefault)?.code ?? "en",
  );
  const [translations, setTranslations] = useState<Record<string, PostTranslationFields>>(
    () => ({ ...(initial?.translations ?? {}) }),
  );
  const [translatedLocales, setTranslatedLocales] = useState<string[]>(
    initial?.translatedLocales ?? Object.keys(initial?.translations ?? {}),
  );

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    initial?.status ?? "DRAFT",
  );
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "");
  const [authorRole, setAuthorRole] = useState(initial?.authorRole ?? "");
  const [readTime, setReadTime] = useState(initial?.readTime ?? "");
  const [comments, setComments] = useState(String(initial?.comments ?? 0));
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
    const flushed: PostTranslationFields = {
      ...(translations[localeCode] ?? emptyTranslation()),
      ...active,
    };
    const nextMap: Record<string, PostTranslationFields> = {
      ...translations,
      [localeCode]: flushed,
    };
    if (!nextMap[next]) {
      nextMap[next] = emptyTranslation();
    }
    setTranslations(nextMap);
    setLocaleCode(next);
  }

  function patchActive(patch: Partial<PostTranslationFields>) {
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
      const flushed: PostTranslationFields = {
        ...(translations[localeCode] ?? emptyTranslation()),
        ...active,
      };
      const nextMap: Record<string, PostTranslationFields> = {
        ...translations,
        [localeCode]: flushed,
      };
      setTranslations(nextMap);
      const payload = {
        slug: slug.trim().toLowerCase(),
        status,
        title: flushed.title.trim(),
        excerpt: flushed.excerpt,
        body: flushed.body,
        coverUrl: coverUrl.trim() || null,
        category: category.trim() || null,
        authorName: authorName.trim() || null,
        authorRole: authorRole.trim() || null,
        readTime: readTime.trim() || null,
        comments: Number.parseInt(comments, 10) || 0,
        seoTitle: flushed.seoTitle.trim() || null,
        seoDescription: flushed.seoDescription.trim() || null,
        localeCode: localeCode.trim() || "en",
      };
      const res =
        mode === "create"
          ? await fetch("/api/admin/posts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/posts/${initial!.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi");
      success(
        mode === "create" ? "Yazı oluşturuldu" : `Yazı kaydedildi (${localeCode})`,
      );
      if (mode === "edit" && data.post?.translations) {
        const map: Record<string, PostTranslationFields> = {};
        const codes: string[] = [];
        for (const t of data.post.translations as {
          locale: { code: string };
          title: string;
          excerpt: string;
          body: string;
          seoTitle?: string | null;
          seoDescription?: string | null;
        }[]) {
          codes.push(t.locale.code);
          map[t.locale.code] = {
            title: t.title,
            excerpt: t.excerpt,
            body: t.body,
            seoTitle: t.seoTitle ?? "",
            seoDescription: t.seoDescription ?? "",
          };
        }
        setTranslations(map);
        setTranslatedLocales(codes);
      } else {
        router.push(`${ADMIN_BASE}/blog`);
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
    const ok = await confirmDelete("Bu yazıyı silmek istediğine emin misin?");
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/posts/${initial.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      success("Yazı silindi");
      router.push(`${ADMIN_BASE}/blog`);
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
          const has =
            translatedLocales.includes(l.code) || Boolean(translations[l.code]?.title);
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
          <label className="block md:col-span-2">
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
              placeholder="keep-goals-in-sight"
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
            <span className={labelClass}>Kategori</span>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
        </div>
      </section>

      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          İçerik ({localeCode})
        </h2>
        <div className="grid gap-4">
          <label className="block">
            <span className={labelClass}>Özet</span>
            <textarea
              value={active.excerpt}
              onChange={(e) => patchActive({ excerpt: e.target.value })}
              rows={3}
              className={textareaClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Gövde (Markdown)</span>
            <textarea
              value={active.body}
              onChange={(e) => patchActive({ body: e.target.value })}
              rows={14}
              className={`${textareaClass} font-mono text-xs`}
              placeholder={"## Başlık\n\nParagraf...\n\n- madde\n- madde\n\n> alıntı\n\n`kod`"}
              spellCheck={false}
            />
            <span className="mt-1.5 block text-[11px] leading-relaxed text-px-body">
              Markdown desteklenir: <code>## başlık</code>, <code>**kalın**</code>,{" "}
              <code>*italik*</code>, listeler, <code>[link](url)</code>,{" "}
              <code>`kod`</code>, alıntı (<code>&gt;</code>). Ham HTML / script
              public tarafta render edilmez (güvenli Markdown).
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Yazar & meta
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Yazar adı</span>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Yazar rolü</span>
            <input
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Okuma süresi</span>
            <input
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="4 min read"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Yorum sayısı</span>
            <input
              type="number"
              min={0}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>SEO başlık ({localeCode})</span>
            <input
              value={active.seoTitle}
              onChange={(e) => patchActive({ seoTitle: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>SEO açıklama ({localeCode})</span>
            <input
              value={active.seoDescription}
              onChange={(e) => patchActive({ seoDescription: e.target.value })}
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
