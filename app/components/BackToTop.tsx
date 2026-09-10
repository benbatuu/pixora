"use client";

import { useEffect, useState } from "react";

export default function BackToTop({ label = "Back to top" }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="fixed right-6 bottom-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-white text-px-black shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-[3px]"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 3L3 8M8 3L13 8M8 3V13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
