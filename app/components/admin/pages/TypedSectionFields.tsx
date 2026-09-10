"use client";

import MediaPickerButton from "@/app/components/admin/media/MediaPickerButton";
import type { SectionTypeId } from "@/lib/content/section-types";

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body";
const textareaClass =
  "w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2.5 text-sm outline-none focus:border-px-red focus:bg-white";

type Props = {
  type: SectionTypeId;
  payload: Record<string, unknown>;
  onPatch: (patch: Record<string, unknown>) => void;
};

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {multiline ? (
        <textarea
          className={textareaClass}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function StringArrayEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <span className={labelClass}>{label}</span>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            value={v}
            onChange={(e) => {
              const next = values.map((x, idx) => (idx === i ? e.target.value : x));
              onChange(next);
            }}
          />
          <button
            type="button"
            className="h-11 px-3 text-xs text-px-red"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
          >
            Sil
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-xs font-semibold text-px-black hover:text-px-red"
        onClick={() => onChange([...values, ""])}
      >
        + Satır ekle
      </button>
    </div>
  );
}

export default function TypedSectionFields({ type, payload, onPatch }: Props) {
  const s = (key: string) => String(payload[key] ?? "");

  if (type === "contact_hero" || type === "hero") {
    return (
      <div className="mb-4 grid gap-3">
        <Field label="Başlık" value={s("title")} onChange={(v) => onPatch({ title: v })} />
        {type === "hero" ? (
          <Field
            label="Alt başlık"
            value={s("subtitle")}
            onChange={(v) => onPatch({ subtitle: v })}
          />
        ) : null}
      </div>
    );
  }

  if (type === "home_hero") {
    const items = Array.isArray(payload.items)
      ? (payload.items as Record<string, unknown>[])
      : [];
    return (
      <div className="mb-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="CTA metni" value={s("ctaLabel")} onChange={(v) => onPatch({ ctaLabel: v })} />
          <Field label="CTA href" value={s("ctaHref")} onChange={(v) => onPatch({ ctaHref: v })} />
          <Field label="Sol alt" value={s("bottomLeft")} onChange={(v) => onPatch({ bottomLeft: v })} />
          <Field label="Sağ alt" value={s("bottomRight")} onChange={(v) => onPatch({ bottomRight: v })} />
          <Field
            label="Tagline"
            value={s("bottomTagline")}
            onChange={(v) => onPatch({ bottomTagline: v })}
          />
        </div>
        <div className="space-y-3">
          <span className={labelClass}>Hero öğeleri</span>
          {items.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-black/8 p-3 sm:grid-cols-2">
              <input
                className={inputClass}
                placeholder="Başlık"
                value={String(item.title ?? "")}
                onChange={(e) => {
                  const next = items.map((it, idx) =>
                    idx === i ? { ...it, title: e.target.value } : it,
                  );
                  onPatch({ items: next });
                }}
              />
              <input
                className={inputClass}
                placeholder="Alt başlık"
                value={String(item.subtitle ?? "")}
                onChange={(e) => {
                  const next = items.map((it, idx) =>
                    idx === i ? { ...it, subtitle: e.target.value } : it,
                  );
                  onPatch({ items: next });
                }}
              />
              <div className="flex gap-2 sm:col-span-2">
                <input
                  className={`${inputClass} flex-1`}
                  placeholder="Görsel URL"
                  value={String(item.src ?? "")}
                  onChange={(e) => {
                    const next = items.map((it, idx) =>
                      idx === i ? { ...it, src: e.target.value } : it,
                    );
                    onPatch({ items: next });
                  }}
                />
                <MediaPickerButton
                  onSelect={(url) => {
                    const next = items.map((it, idx) =>
                      idx === i ? { ...it, src: url } : it,
                    );
                    onPatch({ items: next });
                  }}
                />
                <button
                  type="button"
                  className="h-11 px-3 text-xs text-px-red"
                  onClick={() => onPatch({ items: items.filter((_, idx) => idx !== i) })}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-xs font-semibold hover:text-px-red"
            onClick={() =>
              onPatch({
                items: [
                  ...items,
                  {
                    src: "",
                    title: "",
                    subtitle: "",
                    col: "col-span-1",
                    justify: "start",
                  },
                ],
              })
            }
          >
            + Öğe ekle
          </button>
        </div>
      </div>
    );
  }

  if (type === "home_marquee" || type === "services_marquee") {
    const tags = Array.isArray(payload.tags) ? (payload.tags as string[]) : [];
    return (
      <div className="mb-4">
        <StringArrayEditor
          label="Etiketler"
          values={tags}
          onChange={(tags) => onPatch({ tags })}
        />
      </div>
    );
  }

  if (type === "home_banner") {
    return (
      <div className="mb-4 grid gap-3">
        <div>
          <span className={labelClass}>Görsel URL</span>
          <div className="flex flex-wrap gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={s("src")}
              onChange={(e) => onPatch({ src: e.target.value })}
            />
            <MediaPickerButton onSelect={(url) => onPatch({ src: url })} />
          </div>
        </div>
        <Field label="Alt metin" value={s("alt")} onChange={(v) => onPatch({ alt: v })} />
      </div>
    );
  }

  if (type === "home_about") {
    return (
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["line1Bold", "Satır 1 kalın"],
            ["line1Accent", "Satır 1 vurgu"],
            ["designLabel", "Design etiketi"],
            ["studioLabel", "Stüdyo etiketi"],
            ["aboutCtaLabel", "CTA metni"],
            ["aboutCtaHref", "CTA href"],
            ["fromLabel", "From etiketi"],
            ["gifUrl", "GIF URL"],
          ] as const
        ).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={s(key)}
            onChange={(v) => onPatch({ [key]: v })}
          />
        ))}
      </div>
    );
  }

  if (type === "home_services") {
    const items = Array.isArray(payload.items)
      ? (payload.items as Record<string, unknown>[])
      : [];
    return (
      <div className="mb-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Başlık" value={s("heading")} onChange={(v) => onPatch({ heading: v })} />
          <Field
            label="Alt başlık"
            value={s("subtitle")}
            onChange={(v) => onPatch({ subtitle: v })}
          />
        </div>
        <span className={labelClass}>Servis kartları</span>
        {items.map((item, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-black/8 p-3">
            <input
              className={inputClass}
              placeholder="Başlık"
              value={String(item.title ?? "")}
              onChange={(e) => {
                const next = items.map((it, idx) =>
                  idx === i ? { ...it, title: e.target.value } : it,
                );
                onPatch({ items: next });
              }}
            />
            <textarea
              className={textareaClass}
              rows={2}
              placeholder="Açıklama"
              value={String(item.description ?? "")}
              onChange={(e) => {
                const next = items.map((it, idx) =>
                  idx === i ? { ...it, description: e.target.value } : it,
                );
                onPatch({ items: next });
              }}
            />
            <button
              type="button"
              className="justify-self-start text-xs text-px-red"
              onClick={() => onPatch({ items: items.filter((_, idx) => idx !== i) })}
            >
              Sil
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs font-semibold hover:text-px-red"
          onClick={() =>
            onPatch({
              items: [
                ...items,
                { id: `s-${items.length + 1}`, title: "", description: "", image: "" },
              ],
            })
          }
        >
          + Kart ekle
        </button>
      </div>
    );
  }

  if (type === "home_featured") {
    return (
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Field label="Başlık" value={s("title")} onChange={(v) => onPatch({ title: v })} />
        <Field
          label="Tümü metni"
          value={s("viewAllLabel")}
          onChange={(v) => onPatch({ viewAllLabel: v })}
        />
        <Field
          label="Tümü href"
          value={s("viewAllHref")}
          onChange={(v) => onPatch({ viewAllHref: v })}
        />
      </div>
    );
  }

  if (type === "home_awards") {
    return (
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Field label="Başlık" value={s("title")} onChange={(v) => onPatch({ title: v })} />
        <Field
          label="Alt başlık"
          value={s("subtitle")}
          onChange={(v) => onPatch({ subtitle: v })}
        />
        <Field
          label="Alt başlık 2"
          value={s("subtitle2")}
          onChange={(v) => onPatch({ subtitle2: v })}
        />
      </div>
    );
  }

  if (type === "about_hero") {
    return (
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["title", "Başlık"],
            ["label", "Etiket"],
            ["ctaLabel", "CTA metni"],
            ["ctaHref", "CTA href"],
            ["lead", "Lead"],
            ["leadAccent", "Lead vurgu"],
            ["approachTitle", "Yaklaşım başlığı"],
            ["portfolioLabel", "Portföy metni"],
            ["portfolioHref", "Portföy href"],
          ] as const
        ).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={s(key)}
            onChange={(v) => onPatch({ [key]: v })}
          />
        ))}
        <div className="sm:col-span-2">
          <Field
            label="Intro"
            value={s("intro")}
            onChange={(v) => onPatch({ intro: v })}
            multiline
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Yaklaşım metni"
            value={s("approachBody")}
            onChange={(v) => onPatch({ approachBody: v })}
            multiline
          />
        </div>
      </div>
    );
  }

  if (type === "about_marquee") {
    return (
      <div className="mb-4">
        <Field label="Metin" value={s("text")} onChange={(v) => onPatch({ text: v })} />
      </div>
    );
  }

  if (type === "services_hero") {
    return (
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["titleLine1", "Başlık satır 1"],
            ["titleAccent", "Başlık vurgu"],
            ["introTitle", "Intro başlık"],
            ["introCtaLabel", "Intro CTA"],
            ["introCtaHref", "Intro CTA href"],
            ["capsulesTitle", "Kapsül başlık"],
            ["faqTitle", "SSS başlık"],
            ["brandsHeading", "Markalar başlık"],
            ["testimonialsHeading", "Yorumlar başlık"],
          ] as const
        ).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={s(key)}
            onChange={(v) => onPatch({ [key]: v })}
          />
        ))}
        <div className="sm:col-span-2">
          <Field
            label="Intro gövde"
            value={s("introBody")}
            onChange={(v) => onPatch({ introBody: v })}
            multiline
          />
        </div>
      </div>
    );
  }

  if (type === "services_cards") {
    const items = Array.isArray(payload.items)
      ? (payload.items as Record<string, unknown>[])
      : [];
    return (
      <div className="mb-4 space-y-3">
        <Field
          label="Detay metni"
          value={s("viewDetailsLabel")}
          onChange={(v) => onPatch({ viewDetailsLabel: v })}
        />
        {items.map((item, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-black/8 p-3">
            <input
              className={inputClass}
              placeholder="Başlık"
              value={String(item.title ?? "")}
              onChange={(e) => {
                const next = items.map((it, idx) =>
                  idx === i ? { ...it, title: e.target.value } : it,
                );
                onPatch({ items: next });
              }}
            />
            <textarea
              className={textareaClass}
              rows={2}
              placeholder="Gövde"
              value={String(item.body ?? "")}
              onChange={(e) => {
                const next = items.map((it, idx) =>
                  idx === i ? { ...it, body: e.target.value } : it,
                );
                onPatch({ items: next });
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === "services_faq" || type === "faq") {
    const items = Array.isArray(payload.items)
      ? (payload.items as Record<string, unknown>[])
      : [];
    const qKey = type === "faq" ? "question" : "q";
    const aKey = type === "faq" ? "answer" : "a";
    return (
      <div className="mb-4 space-y-3">
        {type === "services_faq" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Başlık" value={s("title")} onChange={(v) => onPatch({ title: v })} />
            <Field
              label="Alt başlık"
              value={s("subtitle")}
              onChange={(v) => onPatch({ subtitle: v })}
            />
          </div>
        ) : null}
        {items.map((item, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-black/8 p-3">
            <input
              className={inputClass}
              placeholder="Soru"
              value={String(item[qKey] ?? "")}
              onChange={(e) => {
                const next = items.map((it, idx) =>
                  idx === i ? { ...it, [qKey]: e.target.value } : it,
                );
                onPatch({ items: next });
              }}
            />
            <textarea
              className={textareaClass}
              rows={2}
              placeholder="Cevap"
              value={String(item[aKey] ?? "")}
              onChange={(e) => {
                const next = items.map((it, idx) =>
                  idx === i ? { ...it, [aKey]: e.target.value } : it,
                );
                onPatch({ items: next });
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // contact_inquiries / offices / socials — light typed for inquiries emails
  if (type === "contact_socials") {
    const items = Array.isArray(payload.items) ? (payload.items as string[]) : [];
    return (
      <div className="mb-4">
        <StringArrayEditor
          label="Sosyal öğeler"
          values={items}
          onChange={(items) => onPatch({ items })}
        />
      </div>
    );
  }

  return null;
}

export function hasTypedFields(type: SectionTypeId): boolean {
  return [
    "contact_hero",
    "hero",
    "home_hero",
    "home_marquee",
    "home_banner",
    "home_about",
    "home_services",
    "home_featured",
    "home_awards",
    "about_hero",
    "about_marquee",
    "services_hero",
    "services_marquee",
    "services_cards",
    "services_faq",
    "faq",
    "contact_socials",
    "not_found_hero",
    "not_found_links",
  ].includes(type);
}
