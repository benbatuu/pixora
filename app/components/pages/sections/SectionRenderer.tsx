import Link from "next/link";
import type { OrderedPageSection } from "@/lib/content/pages";

function asRecord(payload: unknown): Record<string, unknown> {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : {};
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function HeroBlock({ payload }: { payload: unknown }) {
  const p = asRecord(payload);
  const title = str(p.title) || str(p.titleLine1) || str(p.label);
  const subtitle =
    str(p.subtitle) || str(p.intro) || str(p.description) || str(p.introBody);
  return (
    <section className="px-6 py-16 md:px-16 md:py-24">
      {title ? (
        <h1 className="font-thunder text-[clamp(40px,8vw,96px)] leading-[0.95] tracking-[-0.03em]">
          {title}
          {str(p.titleAccent) ? (
            <span className="text-[var(--px-red)]"> {str(p.titleAccent)}</span>
          ) : null}
        </h1>
      ) : null}
      {subtitle ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--px-body)] md:text-lg">
          {subtitle}
        </p>
      ) : null}
      {(str(p.ctaLabel) || str(p.ctaHref)) && (
        <Link
          href={str(p.ctaHref, "/contact")}
          className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-[var(--px-red)] px-8 text-sm font-semibold uppercase tracking-wide text-white"
        >
          {str(p.ctaLabel, "Contact")}
        </Link>
      )}
    </section>
  );
}

function MarqueeBlock({ payload }: { payload: unknown }) {
  const p = asRecord(payload);
  const tags = Array.isArray(p.tags) ? (p.tags as unknown[]).map(String) : [];
  const text = str(p.text);
  const items = tags.length ? tags : text ? [text] : [];
  if (!items.length) return null;
  return (
    <section className="overflow-hidden border-y border-black/10 py-6">
      <div className="flex flex-wrap gap-4 px-6 md:px-16">
        {items.map((t) => (
          <span
            key={t}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function FaqBlock({ payload }: { payload: unknown }) {
  const p = asRecord(payload);
  const items = Array.isArray(p.items) ? (p.items as Record<string, unknown>[]) : [];
  if (!items.length) return null;
  return (
    <section className="px-6 py-16 md:px-16">
      {str(p.title) || str(p.heading) ? (
        <h2 className="mb-8 font-thunder text-[clamp(32px,4vw,48px)] leading-none">
          {str(p.title) || str(p.heading)}
        </h2>
      ) : null}
      <div className="space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="rounded-2xl border border-black/10 bg-[#fafafa] p-5"
          >
            <summary className="cursor-pointer text-base font-semibold">
              {str(item.question) || str(item.q) || `Item ${i + 1}`}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--px-body)]">
              {str(item.answer) || str(item.a)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CardsBlock({ payload }: { payload: unknown }) {
  const p = asRecord(payload);
  const items = Array.isArray(p.items) ? (p.items as Record<string, unknown>[]) : [];
  if (!items.length) return null;
  return (
    <section className="px-6 py-16 md:px-16">
      {str(p.heading) || str(p.title) ? (
        <h2 className="mb-8 font-thunder text-[clamp(32px,4vw,48px)] leading-none">
          {str(p.heading) || str(p.title)}
        </h2>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-black/10 p-6">
            <h3 className="text-lg font-semibold">
              {str(item.title) || str(item.name) || str(item.label)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--px-body)]">
              {str(item.description) || str(item.body) || str(item.role)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function JsonFallback({ section }: { section: OrderedPageSection }) {
  return (
    <section className="px-6 py-10 md:px-16">
      <div className="rounded-2xl border border-dashed border-black/20 bg-[#fafafa] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--px-body)]">
          {section.type} · {section.sectionKey}
        </p>
        <pre className="mt-3 max-h-64 overflow-auto text-[11px] leading-relaxed text-[var(--px-black)]">
          {JSON.stringify(section.payload ?? {}, null, 2)}
        </pre>
      </div>
    </section>
  );
}

const HERO_TYPES = new Set([
  "hero",
  "contact_hero",
  "home_hero",
  "about_hero",
  "services_hero",
  "not_found_hero",
  "home_about",
  "home_featured",
]);

const MARQUEE_TYPES = new Set([
  "home_marquee",
  "about_marquee",
  "services_marquee",
]);

const FAQ_TYPES = new Set(["faq", "services_faq"]);

const CARDS_TYPES = new Set([
  "home_services",
  "home_awards",
  "about_stats",
  "about_solutions",
  "about_team",
  "about_awards",
  "services_cards",
  "services_capsules",
  "services_testimonials",
  "contact_inquiries",
  "contact_offices",
  "contact_socials",
  "not_found_links",
]);

export default function SectionRenderer({
  sections,
}: {
  sections: OrderedPageSection[];
}) {
  if (!sections.length) {
    return (
      <div className="px-6 py-24 text-center text-[var(--px-body)] md:px-16">
        Bu sayfada henüz bölüm yok.
      </div>
    );
  }

  return (
    <div className="bg-white text-[var(--px-black)] pt-[100px] pb-20">
      {sections.map((section) => {
        const key = `${section.sectionKey}-${section.sortOrder}`;
        if (HERO_TYPES.has(section.type)) {
          // home_hero uses items array — still show CTA/bottom strings
          if (section.type === "home_hero") {
            const p = asRecord(section.payload);
            return (
              <section key={key} className="px-6 py-16 md:px-16 md:py-24">
                <p className="text-sm text-[var(--px-body)]">
                  {str(p.bottomLeft)} {str(p.bottomTagline)}
                </p>
                <h1 className="mt-4 font-thunder text-[clamp(40px,8vw,96px)] leading-[0.95]">
                  {str(p.bottomRight) || "Pixora"}
                </h1>
                {Array.isArray(p.items) && (p.items as unknown[]).length > 0 ? (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(p.items as Record<string, unknown>[]).map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-black/10 p-4 text-sm"
                      >
                        <p className="font-semibold">{str(item.title)}</p>
                        <p className="text-[var(--px-body)]">{str(item.subtitle)}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {str(p.ctaLabel) ? (
                  <Link
                    href={str(p.ctaHref, "/projects")}
                    className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-[var(--px-red)] px-8 text-sm font-semibold uppercase tracking-wide text-white"
                  >
                    {str(p.ctaLabel)}
                  </Link>
                ) : null}
              </section>
            );
          }
          return <HeroBlock key={key} payload={section.payload} />;
        }
        if (MARQUEE_TYPES.has(section.type)) {
          return <MarqueeBlock key={key} payload={section.payload} />;
        }
        if (FAQ_TYPES.has(section.type)) {
          return <FaqBlock key={key} payload={section.payload} />;
        }
        if (CARDS_TYPES.has(section.type)) {
          const p = asRecord(section.payload);
          // contact_socials / brands use string arrays
          if (Array.isArray(p.items) && typeof (p.items as unknown[])[0] === "string") {
            return (
              <MarqueeBlock
                key={key}
                payload={{ tags: p.items }}
              />
            );
          }
          if (Array.isArray(p.links)) {
            return (
              <section key={key} className="px-6 py-10 md:px-16">
                <div className="flex flex-wrap gap-3">
                  {(p.links as Record<string, unknown>[]).map((l, i) => (
                    <Link
                      key={i}
                      href={str(l.href, "/")}
                      className="rounded-full border border-black/15 px-5 py-2 text-sm font-medium hover:border-[var(--px-red)]"
                    >
                      {str(l.label, "Link")}
                    </Link>
                  ))}
                </div>
              </section>
            );
          }
          if (Array.isArray(p.offices)) {
            return <CardsBlock key={key} payload={{ items: p.offices, title: str(p.heading) }} />;
          }
          if (Array.isArray(p.urls)) {
            return <MarqueeBlock key={key} payload={{ tags: p.urls }} />;
          }
          return <CardsBlock key={key} payload={section.payload} />;
        }
        return <JsonFallback key={key} section={section} />;
      })}
    </div>
  );
}
