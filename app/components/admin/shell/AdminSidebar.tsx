"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FileText,
  FolderKanban,
  List,
  Image as ImageIcon,
  Inbox,
  Languages,
  LayoutDashboard,
  LayoutTemplate,
  Newspaper,
  Search,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { SITE_SETTINGS } from "@/app/data/site";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  FolderKanban,
  List,
  Newspaper,
  Image: ImageIcon,
  Inbox,
  Languages,
  LayoutTemplate,
  Search,
  Settings,
  ScrollText,
};

function isActive(pathname: string, href: string) {
  if (href === ADMIN_BASE) return pathname === ADMIN_BASE;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || "A").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

export default function AdminSidebar({
  role = "ADMIN",
  userName,
  userEmail,
}: {
  role?: string;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [logoUrl, setLogoUrl] = useState(SITE_SETTINGS.brand.logoLightUrl);
  const [logoAlt, setLogoAlt] = useState(SITE_SETTINGS.brand.logoAlt);
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) return;
        const data = await res.json();
        const brand = data.settings?.brand;
        if (brand?.logoLightUrl) setLogoUrl(brand.logoLightUrl);
        if (brand?.logoAlt) setLogoAlt(brand.logoAlt);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const navItems = useMemo(
    () => ADMIN_NAV.filter((item) => isAdmin || !item.adminOnly),
    [isAdmin],
  );

  const loadUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages/unread-count");
      if (!res.ok) return;
      const data = await res.json();
      setUnread(typeof data.count === "number" ? data.count : 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadUnread();
    const onChange = () => void loadUnread();
    window.addEventListener("admin:messages-changed", onChange);
    const id = window.setInterval(() => void loadUnread(), 60_000);
    return () => {
      window.removeEventListener("admin:messages-changed", onChange);
      window.clearInterval(id);
    };
  }, [loadUnread]);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace(`${ADMIN_BASE}/login`);
    router.refresh();
  }

  const displayName = userName?.trim() || userEmail?.split("@")[0] || "Admin";
  const roleLabel = isAdmin ? "Admin" : "Editör";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-svh w-[260px] flex-col overflow-hidden border-r border-black/8 bg-white">
      <div className="flex h-16 items-center border-b border-black/8 px-5">
        <Link href={ADMIN_BASE} className="inline-flex items-center">
          <Image
            src={logoUrl}
            alt="Pixora"
            width={110}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-px-body">
          Yönetim
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon] ?? LayoutDashboard;
            const active = isActive(pathname, item.href);
            const badge =
              item.badgeKey === "messages" && unread > 0 ? unread : null;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-px-black text-white"
                      : "text-px-black/80 hover:bg-[#f7f7f7]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  {badge !== null ? (
                    <span className="min-w-[1.25rem] rounded-full bg-px-red px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-black/8 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#f7f7f7] px-3 py-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-px-black text-xs font-semibold text-white">
            {initials(userName, userEmail)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-px-black">
              {displayName}
            </p>
            <p className="truncate text-xs text-px-body">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-medium text-px-body hover:text-px-red"
          >
            Çıkış
          </button>
        </div>
      </div>
    </aside>
  );
}
