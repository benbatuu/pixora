"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SECTION_REGISTRY,
  SECTION_TYPE_IDS,
  type SectionTypeId,
} from "@/lib/content/section-types";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import { useConfirm } from "@/app/components/admin/ui/ConfirmDialog";
import MediaPickerButton from "@/app/components/admin/media/MediaPickerButton";
import TypedSectionFields, {
  hasTypedFields,
} from "@/app/components/admin/pages/TypedSectionFields";

type Locale = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
};

type SectionRow = {
  id?: string;
  sectionKey: string;
  type: SectionTypeId;
  sortOrder: number;
  /** All known locale payloads kept client-side (no refetch on tab switch). */
  payloadsByLocale: Record<string, unknown>;
  payload: unknown;
  payloadText: string;
  /** Locale codes that already have a translation in DB */
  translatedLocales: string[];
  missingActive: boolean;
};

type Props = {
  pageKey: string;
  pageLabel: string;
};

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body";
const textareaClass =
  "w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2.5 font-mono text-xs outline-none focus:border-px-red focus:bg-white";

function clonePayload(payload: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(payload ?? {}));
  } catch {
    return {};
  }
}

function payloadToText(payload: unknown): string {
  return JSON.stringify(payload ?? {}, null, 2);
}

function parsePayloadText(text: string): unknown {
  return JSON.parse(text);
}

function resolvePayloadForLocale(
  payloadsByLocale: Record<string, unknown>,
  code: string,
  defaultCode: string,
  type: SectionTypeId,
): { payload: unknown; missing: boolean; clonedFromDefault: boolean } {
  if (Object.prototype.hasOwnProperty.call(payloadsByLocale, code)) {
    return {
      payload: payloadsByLocale[code],
      missing: false,
      clonedFromDefault: false,
    };
  }
  if (Object.prototype.hasOwnProperty.call(payloadsByLocale, defaultCode)) {
    return {
      payload: clonePayload(payloadsByLocale[defaultCode]),
      missing: true,
      clonedFromDefault: true,
    };
  }
  const firstKey = Object.keys(payloadsByLocale)[0];
  if (firstKey) {
    return {
      payload: clonePayload(payloadsByLocale[firstKey]),
      missing: true,
      clonedFromDefault: true,
    };
  }
  const entry = SECTION_REGISTRY[type];
  return {
    payload: clonePayload(entry?.defaultPayload ?? {}),
    missing: true,
    clonedFromDefault: false,
  };
}

function buildRowFromApi(
  s: {
    id?: string;
    sectionKey: string;
    type: string;
    sortOrder: number;
    translations: { payload: unknown; locale: { code: string } }[];
  },
  activeCode: string,
  defaultCode: string,
): SectionRow {
  const type = (SECTION_TYPE_IDS.includes(s.type as SectionTypeId)
    ? s.type
    : "hero") as SectionTypeId;
  const payloadsByLocale: Record<string, unknown> = {};
  const codes: string[] = [];
  for (const t of s.translations ?? []) {
    const code = t.locale.code;
    codes.push(code);
    payloadsByLocale[code] = t.payload ?? {};
  }
  const resolved = resolvePayloadForLocale(
    payloadsByLocale,
    activeCode,
    defaultCode,
    type,
  );
  if (resolved.missing) {
    payloadsByLocale[activeCode] = resolved.payload;
  }
  return {
    id: s.id,
    sectionKey: s.sectionKey,
    type,
    sortOrder: s.sortOrder,
    payloadsByLocale,
    payload: resolved.payload,
    payloadText: payloadToText(resolved.payload),
    translatedLocales: codes,
    missingActive: resolved.missing,
  };
}

export default function PageSectionsEditor({ pageKey, pageLabel }: Props) {
  const { success: toastSuccess, error: toastError } = useToast();
  const { confirmDelete } = useConfirm();
  const [locales, setLocales] = useState<Locale[]>([]);
  const [localeCode, setLocaleCode] = useState("en");
  const [defaultLocaleCode, setDefaultLocaleCode] = useState("en");
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addType, setAddType] = useState<SectionTypeId>("hero");
  const [advancedJson, setAdvancedJson] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState(false);
  const [cloneBanner, setCloneBanner] = useState(false);
  const localeCodeRef = useRef(localeCode);
  localeCodeRef.current = localeCode;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageRes = await fetch(`/api/admin/pages/${pageKey}`);
      const pageData = await pageRes.json();
      if (!pageRes.ok) throw new Error(pageData.error || "Sayfa yüklenemedi");

      let localesList: Locale[] = (pageData.locales as Locale[] | undefined) ?? [];
      if (!localesList.length) {
        const locRes = await fetch("/api/admin/locales");
        if (locRes.ok) {
          const locData = await locRes.json();
          localesList = (locData.locales as Locale[] | undefined) ?? [];
        }
      }
      if (!localesList.length) {
        localesList = [
          { id: "en", code: "en", name: "English", isDefault: true, isActive: true },
        ];
      }

      setLocales(localesList);
      const activeDefault =
        localesList.find((l) => l.isDefault)?.code ??
        localesList[0]?.code ??
        "en";
      setDefaultLocaleCode(activeDefault);

      const current = localeCodeRef.current;
      const activeCode = localesList.some((l) => l.code === current)
        ? current
        : activeDefault;
      setLocaleCode(activeCode);

      const rows = (pageData.page?.sections ?? []).map(
        (s: {
          id: string;
          sectionKey: string;
          type: string;
          sortOrder: number;
          translations: { payload: unknown; locale: { code: string } }[];
        }) => buildRowFromApi(s, activeCode, activeDefault),
      );
      setSections(rows);
      setDirty(false);
      setCloneBanner(rows.some((r: SectionRow) => r.missingActive));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const registryOptions = useMemo(
    () =>
      SECTION_TYPE_IDS.map((id) => ({
        id,
        label: SECTION_REGISTRY[id].label,
      })),
    [],
  );

  function flushCurrentIntoMap(rows: SectionRow[], code: string): SectionRow[] {
    return rows.map((row) => {
      let payload: unknown;
      try {
        payload = parsePayloadText(row.payloadText);
      } catch {
        payload = row.payload ?? {};
      }
      return {
        ...row,
        payload,
        payloadsByLocale: {
          ...row.payloadsByLocale,
          [code]: payload,
        },
      };
    });
  }

  function showLocaleOnRows(
    rows: SectionRow[],
    next: string,
    defaultCode: string,
  ): { rows: SectionRow[]; anyCloned: boolean } {
    let anyCloned = false;
    const nextRows = rows.map((row) => {
      const resolved = resolvePayloadForLocale(
        row.payloadsByLocale,
        next,
        defaultCode,
        row.type,
      );
      if (resolved.clonedFromDefault || resolved.missing) {
        anyCloned = true;
      }
      const payloadsByLocale = { ...row.payloadsByLocale };
      if (!Object.prototype.hasOwnProperty.call(payloadsByLocale, next)) {
        payloadsByLocale[next] = resolved.payload;
      }
      return {
        ...row,
        payloadsByLocale,
        payload: resolved.payload,
        payloadText: payloadToText(resolved.payload),
        missingActive:
          resolved.missing || !row.translatedLocales.includes(next),
      };
    });
    return { rows: nextRows, anyCloned };
  }

  async function switchLocale(next: string) {
    if (next === localeCode) return;
    if (dirty) {
      const ok = window.confirm(
        "Kaydedilmemiş değişiklikler var. Dil değiştirirsen bu dildeki düzenlemeler bellekte kalır; Kaydet’e basana kadar DB’ye yazılmaz. Devam?",
      );
      if (!ok) return;
    }
    const flushed = flushCurrentIntoMap(sections, localeCode);
    const { rows, anyCloned } = showLocaleOnRows(
      flushed,
      next,
      defaultLocaleCode,
    );
    setSections(rows);
    setLocaleCode(next);
    setCloneBanner(anyCloned);
  }

  function updateRow(index: number, patch: Partial<SectionRow>) {
    setSections((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
    setDirty(true);
  }

  function parsePayload(row: SectionRow): unknown {
    try {
      return JSON.parse(row.payloadText);
    } catch {
      throw new Error(`Geçersiz JSON: ${row.sectionKey}`);
    }
  }

  function patchPayload(index: number, patch: Record<string, unknown>) {
    const row = sections[index];
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(row.payloadText) as Record<string, unknown>;
    } catch {
      payload = {};
    }
    const next = { ...payload, ...patch };
    updateRow(index, {
      payload: next,
      payloadText: JSON.stringify(next, null, 2),
      payloadsByLocale: {
        ...row.payloadsByLocale,
        [localeCode]: next,
      },
      missingActive: false,
    });
    setCloneBanner(false);
  }

  function parseRowPayload(row: SectionRow): Record<string, unknown> {
    try {
      return JSON.parse(row.payloadText) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const flushed = flushCurrentIntoMap(sections, localeCode);
      const body = {
        localeCode,
        sections: flushed.map((row) => ({
          sectionKey: row.sectionKey.trim(),
          type: row.type,
          sortOrder: Number(row.sortOrder) || 0,
          payload: parsePayload(row),
        })),
      };
      const res = await fetch(`/api/admin/pages/${pageKey}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kaydedilemedi");

      // Merge saved locale into client map without destructive full reload.
      const savedSections = (data.page?.sections ?? data.sections ?? []) as {
        id?: string;
        sectionKey: string;
        type: string;
        sortOrder: number;
        translations?: { payload: unknown; locale: { code: string } }[];
        payload?: unknown;
      }[];

      setSections((prev) => {
        const byKey = new Map(
          flushed.map((r) => [r.sectionKey.trim(), r] as const),
        );
        if (Array.isArray(savedSections) && savedSections.length) {
          return savedSections.map((s) => {
            const prevRow = byKey.get(s.sectionKey);
            const type = (SECTION_TYPE_IDS.includes(s.type as SectionTypeId)
              ? s.type
              : prevRow?.type ?? "hero") as SectionTypeId;
            const payloadsByLocale = {
              ...(prevRow?.payloadsByLocale ?? {}),
            };
            let translatedLocales = [
              ...(prevRow?.translatedLocales ?? []),
            ];
            if (s.translations?.length) {
              for (const t of s.translations) {
                payloadsByLocale[t.locale.code] = t.payload ?? {};
                if (!translatedLocales.includes(t.locale.code)) {
                  translatedLocales.push(t.locale.code);
                }
              }
            } else if (s.payload !== undefined) {
              payloadsByLocale[localeCode] = s.payload;
            } else if (prevRow) {
              try {
                payloadsByLocale[localeCode] = JSON.parse(prevRow.payloadText);
              } catch {
                payloadsByLocale[localeCode] = prevRow.payload;
              }
            }
            if (!translatedLocales.includes(localeCode)) {
              translatedLocales = [...translatedLocales, localeCode];
            }
            const activePayload =
              payloadsByLocale[localeCode] ??
              prevRow?.payload ??
              SECTION_REGISTRY[type]?.defaultPayload ??
              {};
            return {
              id: s.id ?? prevRow?.id,
              sectionKey: s.sectionKey,
              type,
              sortOrder: s.sortOrder,
              payloadsByLocale,
              payload: activePayload,
              payloadText: payloadToText(activePayload),
              translatedLocales,
              missingActive: false,
            } satisfies SectionRow;
          });
        }
        // Fallback: mark current locale as translated on flushed rows
        return flushed.map((row) => {
          let payload: unknown;
          try {
            payload = JSON.parse(row.payloadText);
          } catch {
            payload = row.payload;
          }
          const translatedLocales = row.translatedLocales.includes(localeCode)
            ? row.translatedLocales
            : [...row.translatedLocales, localeCode];
          return {
            ...row,
            payload,
            payloadsByLocale: {
              ...row.payloadsByLocale,
              [localeCode]: payload,
            },
            translatedLocales,
            missingActive: false,
          };
        });
      });

      setDirty(false);
      setCloneBanner(false);
      toastSuccess(`Kaydedildi (${localeCode}) — public sayfa yenilenecek`);

      // Light refresh of translation keys only (non-destructive).
      try {
        const pageRes = await fetch(`/api/admin/pages/${pageKey}`);
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          const apiSections = (pageData.page?.sections ?? []) as {
            sectionKey: string;
            translations: { locale: { code: string } }[];
          }[];
          if (apiSections.length) {
            const keyToCodes = new Map(
              apiSections.map((s) => [
                s.sectionKey,
                s.translations.map((t) => t.locale.code),
              ]),
            );
            setSections((prev) =>
              prev.map((row) => {
                const codes = keyToCodes.get(row.sectionKey);
                if (!codes) return row;
                return {
                  ...row,
                  translatedLocales: codes,
                  missingActive: !codes.includes(localeCode),
                };
              }),
            );
          }
        }
      } catch {
        /* ignore light reload errors */
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  function addSection() {
    const entry = SECTION_REGISTRY[addType];
    const baseKey = addType.replace(/^contact_/, "");
    let sectionKey = baseKey;
    let n = 2;
    while (sections.some((s) => s.sectionKey === sectionKey)) {
      sectionKey = `${baseKey}_${n++}`;
    }
    const maxSort = sections.reduce((m, s) => Math.max(m, s.sortOrder), -1);
    const payload = clonePayload(entry.defaultPayload);
    setSections((prev) => [
      ...prev,
      {
        sectionKey,
        type: addType,
        sortOrder: maxSort + 1,
        payloadsByLocale: { [localeCode]: payload },
        payload,
        payloadText: payloadToText(payload),
        translatedLocales: [],
        missingActive: true,
      },
    ]);
    setDirty(true);
  }

  async function removeSection(index: number) {
    const ok = await confirmDelete(
      "Bu bölümü listeden kaldırmak istediğine emin misin?",
    );
    if (!ok) return;
    setSections((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  }

  if (loading) {
    return (
      <p className="rounded-2xl border border-black/8 bg-white px-5 py-8 text-sm text-px-body">
        Yükleniyor…
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}
      {cloneBanner ? (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Bu dilde çeviri yok — varsayılandan kopyalandı. Kaydet = bu dile yazar.
        </p>
      ) : null}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white p-5">
        <div className="min-w-[200px]">
          <span className={labelClass}>Dil</span>
          <div className="flex flex-wrap gap-1">
            {locales.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => void switchLocale(l.code)}
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
        <div className="flex-1 text-sm text-px-body">
          <span className="font-medium text-px-black">{pageLabel}</span>
          <span className="mx-2">·</span>
          <code className="text-xs">{pageKey}</code>
          <span className="mx-2">·</span>
          {sections.length} bölüm
          <span className="mx-2">·</span>
          Kaydet yalnızca <strong>{localeCode}</strong> çevirisini yazar
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="inline-flex h-11 items-center rounded-full bg-px-black px-6 text-sm font-semibold text-white transition hover:bg-px-red disabled:opacity-50"
        >
          {busy ? "Kaydediliyor…" : `Kaydet (${localeCode})`}
        </button>
      </div>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/15 bg-white px-5 py-10 text-center text-sm text-px-body">
            Henüz bölüm yok. Aşağıdan ekleyebilirsin.
          </p>
        ) : null}

        {sections.map((row, index) => {
          const typeLabel = SECTION_REGISTRY[row.type]?.label ?? row.type;

          return (
            <div
              key={`${row.sectionKey}-${index}`}
              className="rounded-2xl border border-black/8 bg-white p-5"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-px-black">{typeLabel}</p>
                    {row.missingActive ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                        eksik çeviri ({localeCode})
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-800">
                        {localeCode} ✓
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-px-body">
                    Anahtar: <code>{row.sectionKey}</code>
                    {row.translatedLocales.length > 0 ? (
                      <>
                        {" "}
                        · Çeviriler:{" "}
                        {row.translatedLocales
                          .map((c) => c.toUpperCase())
                          .join(", ")}
                      </>
                    ) : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void removeSection(index)}
                  className="text-xs font-medium text-px-red hover:underline"
                >
                  Kaldır
                </button>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <label>
                  <span className={labelClass}>Section key</span>
                  <input
                    className={inputClass}
                    value={row.sectionKey}
                    onChange={(e) =>
                      updateRow(index, { sectionKey: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span className={labelClass}>Tip</span>
                  <select
                    className={inputClass}
                    value={row.type}
                    onChange={(e) => {
                      const type = e.target.value as SectionTypeId;
                      const def = SECTION_REGISTRY[type].defaultPayload;
                      updateRow(index, {
                        type,
                        payload: def,
                        payloadText: JSON.stringify(def, null, 2),
                        payloadsByLocale: {
                          ...row.payloadsByLocale,
                          [localeCode]: def,
                        },
                      });
                    }}
                  >
                    {registryOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Sıra</span>
                  <input
                    type="number"
                    className={inputClass}
                    value={row.sortOrder}
                    onChange={(e) =>
                      updateRow(index, {
                        sortOrder: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
              </div>

              <TypedSectionFields
                type={row.type}
                payload={parseRowPayload(row)}
                onPatch={(patch) => patchPayload(index, patch)}
              />

              {row.type === "not_found_hero" && (() => {
                const p = parseRowPayload(row);
                return (
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className={labelClass}>Kod (örn. 404)</span>
                      <input
                        className={inputClass}
                        value={String(p.code ?? "")}
                        onChange={(e) =>
                          patchPayload(index, { code: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span className={labelClass}>Başlık</span>
                      <input
                        className={inputClass}
                        value={String(p.title ?? "")}
                        onChange={(e) =>
                          patchPayload(index, { title: e.target.value })
                        }
                      />
                    </label>
                    <label className="sm:col-span-2">
                      <span className={labelClass}>Açıklama</span>
                      <textarea
                        className={`${textareaClass} font-sans`}
                        rows={3}
                        value={String(p.description ?? "")}
                        onChange={(e) =>
                          patchPayload(index, { description: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span className={labelClass}>Birincil CTA metni</span>
                      <input
                        className={inputClass}
                        value={String(p.ctaLabel ?? "")}
                        onChange={(e) =>
                          patchPayload(index, { ctaLabel: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span className={labelClass}>Birincil CTA href</span>
                      <input
                        className={inputClass}
                        value={String(p.ctaHref ?? "")}
                        onChange={(e) =>
                          patchPayload(index, { ctaHref: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span className={labelClass}>İkincil CTA metni</span>
                      <input
                        className={inputClass}
                        value={String(p.secondaryCtaLabel ?? "")}
                        onChange={(e) =>
                          patchPayload(index, {
                            secondaryCtaLabel: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      <span className={labelClass}>İkincil CTA href</span>
                      <input
                        className={inputClass}
                        value={String(p.secondaryCtaHref ?? "")}
                        onChange={(e) =>
                          patchPayload(index, {
                            secondaryCtaHref: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      <span className={labelClass}>Arka plan</span>
                      <select
                        className={inputClass}
                        value={String(p.background ?? "light")}
                        onChange={(e) =>
                          patchPayload(index, { background: e.target.value })
                        }
                      >
                        <option value="light">Açık (light)</option>
                        <option value="dark">Koyu (dark)</option>
                        <option value="red">Kırmızı (red)</option>
                      </select>
                    </label>
                    <label>
                      <span className={labelClass}>Hizalama</span>
                      <select
                        className={inputClass}
                        value={String(p.align ?? "center")}
                        onChange={(e) =>
                          patchPayload(index, { align: e.target.value })
                        }
                      >
                        <option value="center">Ortala</option>
                        <option value="left">Sola</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={p.showCode !== false}
                        onChange={(e) =>
                          patchPayload(index, { showCode: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-black/20"
                      />
                      <span className="text-sm text-px-black">Kodu göster (404)</span>
                    </label>
                    <div className="sm:col-span-2">
                      <span className={labelClass}>Görsel URL</span>
                      <div className="flex flex-wrap gap-2">
                        <input
                          className={`${inputClass} flex-1`}
                          value={String(p.imageUrl ?? "")}
                          onChange={(e) =>
                            patchPayload(index, { imageUrl: e.target.value })
                          }
                          placeholder="/assets/…"
                        />
                        <MediaPickerButton
                          onSelect={(url) =>
                            patchPayload(index, { imageUrl: url })
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {row.type === "not_found_links" && (() => {
                const p = parseRowPayload(row);
                const links = Array.isArray(p.links)
                  ? (p.links as { label?: string; href?: string }[])
                  : [];
                return (
                  <div className="mb-4 space-y-3">
                    <span className={labelClass}>Hızlı linkler</span>
                    {links.map((link, li) => (
                      <div key={li} className="grid gap-2 sm:grid-cols-2">
                        <input
                          className={inputClass}
                          placeholder="Etiket"
                          value={link.label ?? ""}
                          onChange={(e) => {
                            const next = links.map((l, i) =>
                              i === li ? { ...l, label: e.target.value } : l,
                            );
                            patchPayload(index, { links: next });
                          }}
                        />
                        <div className="flex gap-2">
                          <input
                            className={`${inputClass} flex-1`}
                            placeholder="/path"
                            value={link.href ?? ""}
                            onChange={(e) => {
                              const next = links.map((l, i) =>
                                i === li ? { ...l, href: e.target.value } : l,
                              );
                              patchPayload(index, { links: next });
                            }}
                          />
                          <button
                            type="button"
                            className="h-11 shrink-0 px-3 text-xs text-px-red"
                            onClick={() => {
                              patchPayload(index, {
                                links: links.filter((_, i) => i !== li),
                              });
                            }}
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-xs font-semibold text-px-black hover:text-px-red"
                      onClick={() =>
                        patchPayload(index, {
                          links: [...links, { label: "", href: "/" }],
                        })
                      }
                    >
                      + Link ekle
                    </button>
                  </div>
                );
              })()}

              <div className="mb-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="text-xs font-semibold text-px-body hover:text-px-black"
                  onClick={() =>
                    setAdvancedJson((prev) => ({
                      ...prev,
                      [row.sectionKey]: !prev[row.sectionKey],
                    }))
                  }
                >
                  {advancedJson[row.sectionKey] || !hasTypedFields(row.type)
                    ? "▾ Gelişmiş JSON"
                    : "▸ Gelişmiş JSON (fallback)"}
                </button>
              </div>

              {(advancedJson[row.sectionKey] || !hasTypedFields(row.type)) && (
              <label className="block">
                <span className={labelClass}>Payload (JSON)</span>
                <textarea
                  className={textareaClass}
                  rows={row.type === "contact_offices" ? 14 : 8}
                  value={row.payloadText}
                  onChange={(e) => {
                    updateRow(index, {
                      payloadText: e.target.value,
                      missingActive: false,
                    });
                    setCloneBanner(false);
                  }}
                  spellCheck={false}
                />
              </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white p-5">
        <label className="min-w-[200px] flex-1">
          <span className={labelClass}>Yeni bölüm tipi</span>
          <select
            className={inputClass}
            value={addType}
            onChange={(e) => setAddType(e.target.value as SectionTypeId)}
          >
            {registryOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex h-11 items-center rounded-full border border-black/15 bg-white px-5 text-sm font-semibold text-px-black transition hover:border-px-black"
        >
          Bölüm ekle
        </button>
      </div>
    </div>
  );
}
