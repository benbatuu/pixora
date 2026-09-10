"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  localizedPath,
  localeFromPathname,
  stripLocalePrefix,
} from "@/lib/i18n/path";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

export type SwitcherLocale = {
  code: string;
  name: string;
  isDefault?: boolean;
};

type Variant = "header" | "footer" | "menu";

type Props = {
  locale: string;
  locales: SwitcherLocale[];
  defaultLocale?: string;
  className?: string;
  variant?: Variant;
  label?: string;
};

export default function LanguageSwitcher({
  locale,
  locales,
  defaultLocale = DEFAULT_LOCALE,
  className = "",
  variant = "header",
  label = "Language",
}: Props) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Prefer URL prefix so the trigger updates before RSC props arrive
  const pathLocale = localeFromPathname(pathname);
  const activeLocale = pathLocale || locale;

  const current =
    locales.find((l) => l.code === activeLocale) ??
    locales.find((l) => l.code === locale) ??
    locales[0] ??
    null;

  useEffect(() => {
    setOpen(false);
  }, [pathname, activeLocale]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!locales?.length || !current) return null;

  function switchTo(code: string) {
    setOpen(false);
    if (code === activeLocale) return;

    const bare = stripLocalePrefix(pathname);
    const next = localizedPath(bare, code, defaultLocale);

    startTransition(() => {
      void (async () => {
        try {
          await fetch("/api/public/locale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
        } catch {
          document.cookie = `pixora_locale=${encodeURIComponent(code)};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
        }
        router.push(next);
        // Required: locale prefix is rewritten to the same page tree, so soft
        // nav reuses the previous layout RSC (old locale) without refresh.
        router.refresh();
      })();
    });
  }

  const isLight = variant === "header";

  const trigger = isLight
    ? "border-black/12 bg-white/85 text-[#1e1e1e] shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:border-black/25"
    : "border-white/18 bg-white/8 text-white hover:border-white/35 hover:bg-white/12";

  const panel = isLight
    ? "border-black/10 bg-white text-[#1e1e1e] shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
    : "border-white/15 bg-[#141414] text-white shadow-[0_16px_40px_rgba(0,0,0,0.45)]";

  const itemIdle = isLight
    ? "text-[#1e1e1e]/70 hover:bg-black/[0.04] hover:text-[#1e1e1e]"
    : "text-white/70 hover:bg-white/8 hover:text-white";

  const itemActive = isLight
    ? "bg-px-black text-white"
    : "bg-px-red text-white";

  const menuAlign = variant === "footer" ? "left-0" : "right-0";

  return (
    <div
      ref={rootRef}
      className={`pointer-events-auto relative inline-flex ${className} ${pending ? "opacity-70" : ""}`}
    >
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.14em] backdrop-blur-md transition-[border-color,background,color] duration-200 ${trigger}`}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={pending}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className={`absolute ${menuAlign} top-[calc(100%+8px)] z-[120] min-w-[10.5rem] overflow-hidden rounded-2xl border py-1 ${panel}`}
        >
          {locales.map((l) => {
            const active = l.code === activeLocale;
            return (
              <li key={l.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => switchTo(l.code)}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[12px] font-medium tracking-[0.02em] transition-colors ${
                    active ? itemActive : itemIdle
                  }`}
                >
                  <span>{l.name}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      active ? "opacity-80" : "opacity-45"
                    }`}
                  >
                    {l.code}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
