"use client";

import { useState } from "react";
import LayoutChromeForm from "./LayoutChromeForm";
import ContactFormSettingsForm from "./ContactFormSettingsForm";

type Tab = "chrome" | "contactForm";

export default function ComponentsTabs() {
  const [tab, setTab] = useState<Tab>("chrome");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("chrome")}
          className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
            tab === "chrome"
              ? "bg-px-black text-white"
              : "border border-black/10 bg-white text-px-black hover:border-px-red"
          }`}
        >
          Footer & menü paneli
        </button>
        <button
          type="button"
          onClick={() => setTab("contactForm")}
          className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
            tab === "contactForm"
              ? "bg-px-black text-white"
              : "border border-black/10 bg-white text-px-black hover:border-px-red"
          }`}
        >
          İletişim formu
        </button>
      </div>
      {tab === "chrome" ? <LayoutChromeForm /> : <ContactFormSettingsForm />}
    </div>
  );
}
