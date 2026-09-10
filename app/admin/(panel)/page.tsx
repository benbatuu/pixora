import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import AdminStatCard from "@/app/components/admin/ui/AdminStatCard";
import AdminEmptyState from "@/app/components/admin/ui/AdminEmptyState";
import { ADMIN_BASE, ADMIN_PAGE_KEYS } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
};
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let projectCount = 0;
  let postCount = 0;
  let unreadCount = 0;
  let pageCount = ADMIN_PAGE_KEYS.length;
  let recentProjects: {
    id: string;
    slug: string;
    tags: string[];
    title: string;
  }[] = [];
  let recentMessages: {
    id: string;
    subject: string;
    name: string;
    email: string;
    readAt: Date | null;
  }[] = [];
  let loadError: string | null = null;

  try {
    const [projectsN, postsN, unreadN, pagesN, projects, messages] =
      await Promise.all([
        prisma.project.count(),
        prisma.post.count(),
        prisma.contactMessage.count({
          where: { readAt: null, archivedAt: null },
        }),
        prisma.page.count(),
        prisma.project.findMany({
          take: 5,
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          include: {
            translations: { include: { locale: true } },
          },
        }),
        prisma.contactMessage.findMany({
          take: 5,
          where: { archivedAt: null },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            subject: true,
            name: true,
            email: true,
            readAt: true,
          },
        }),
      ]);

    projectCount = projectsN;
    postCount = postsN;
    unreadCount = unreadN;
    pageCount = pagesN || ADMIN_PAGE_KEYS.length;
    recentProjects = projects.map((p) => {
      const tr =
        p.translations.find((t) => t.locale.code === "en") ??
        p.translations[0];
      return {
        id: p.id,
        slug: p.slug,
        tags: p.tags,
        title: tr?.title ?? p.slug,
      };
    });
    recentMessages = messages;
  } catch (e) {
    console.error("[admin.dashboard]", e);
    loadError = "Dashboard verileri yüklenemedi.";
  }

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Pixora sitesini uçtan uca yönet — içerik, medya ve ayarlar."
        breadcrumb={[{ label: "Admin" }, { label: "Dashboard" }]}
        actions={
          <Link
            href={`${ADMIN_BASE}/projects/new`}
            className="inline-flex h-10 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red"
          >
            Yeni proje
          </Link>
        }
      />

      {loadError ? (
        <p className="mb-4 rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {loadError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Projeler" value={projectCount} />
        <AdminStatCard label="Blog yazıları" value={postCount} />
        <AdminStatCard
          label="Yeni mesajlar"
          value={unreadCount}
          hint="Okunmamış · arşiv dışı"
        />
        <AdminStatCard label="Sayfalar" value={pageCount} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-px-body">
          Hızlı işlemler
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: `${ADMIN_BASE}/projects/new`, label: "Yeni proje" },
            { href: `${ADMIN_BASE}/blog/new`, label: "Yeni yazı" },
            { href: `${ADMIN_BASE}/media`, label: "Medya yükle" },
            { href: `${ADMIN_BASE}/site-pages`, label: "Sayfa düzenle" },
            { href: `${ADMIN_BASE}/settings`, label: "Ayarlar" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-medium text-px-black transition hover:border-px-black"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/8 bg-white p-5">
          <h2 className="text-sm font-semibold text-px-black">Son projeler</h2>
          {recentProjects.length === 0 ? (
            <div className="mt-4">
              <AdminEmptyState
                title="Henüz proje yok"
                description="İlk portföy projeni ekleyerek başla."
                action={
                  <Link
                    href={`${ADMIN_BASE}/projects/new`}
                    className="inline-flex h-10 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red"
                  >
                    Yeni proje
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-black/6">
              {recentProjects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-px-black">
                      {p.title}
                    </p>
                    <p className="text-xs text-px-body">
                      {p.tags.length ? p.tags.join(" · ") : p.slug}
                    </p>
                  </div>
                  <Link
                    href={`${ADMIN_BASE}/projects/${p.slug}`}
                    className="text-xs font-medium text-px-red hover:underline"
                  >
                    Düzenle
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-5">
          <h2 className="text-sm font-semibold text-px-black">Gelen mesajlar</h2>
          {recentMessages.length === 0 ? (
            <div className="mt-4">
              <AdminEmptyState
                title="Mesaj yok"
                description="İletişim formundan gelenler burada görünür."
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-black/6">
              {recentMessages.map((m) => (
                <li
                  key={m.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-px-black">
                      {!m.readAt ? (
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-px-red" />
                      ) : null}
                      {m.subject}
                    </p>
                    <p className="truncate text-xs text-px-body">
                      {m.name} · {m.email}
                    </p>
                  </div>
                  <Link
                    href={`${ADMIN_BASE}/messages`}
                    className="shrink-0 text-xs font-medium text-px-red hover:underline"
                  >
                    Aç
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
