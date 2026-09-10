"use client";

import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";

type Props = {
  title?: string;
};

export default function AdminTopbar({ title = "Admin" }: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-black/8 bg-white px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-px-black">{title}</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="relative hidden md:block">
          <span className="sr-only">Ara</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-px-body"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Ara…"
            className="h-10 w-56 rounded-full border border-black/10 bg-[#f7f7f7] pr-4 pl-9 text-sm outline-none focus:border-px-red focus:bg-white"
          />
        </label>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 px-4 text-sm font-medium text-px-black transition hover:border-px-black"
        >
          Siteyi görüntüle
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
