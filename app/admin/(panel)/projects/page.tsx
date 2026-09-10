import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import AdminEmptyState from "@/app/components/admin/ui/AdminEmptyState";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = { title: "Projeler" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşiv",
};

function statusClass(status: string) {
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700";
  if (status === "ARCHIVED") return "bg-amber-50 text-amber-800";
  return "bg-[#f0f0f0] text-px-body";
}

async function loadProjects() {
  return prisma.project.findMany({
    include: {
      translations: { include: { locale: true } },
      images: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export default async function AdminProjectsPage() {
  let projects: Awaited<ReturnType<typeof loadProjects>> = [];
  let loadError: string | null = null;

  try {
    projects = await loadProjects();
  } catch (e) {
    console.error("[admin.projects.list]", e);
    loadError = "Veritabanından projeler yüklenemedi.";
  }

  return (
    <div>
      <AdminPageHeader
        title="Projeler"
        description="Portföy projelerini listele, ekle ve düzenle."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Projeler" },
        ]}
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

      {projects.length === 0 ? (
        <AdminEmptyState
          title="Henüz proje yok"
          description="Portföye ilk projeyi ekleyerek başla."
          action={
            <Link
              href={`${ADMIN_BASE}/projects/new`}
              className="inline-flex h-10 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red"
            >
              Yeni proje
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/8 bg-[#fafafa] text-xs uppercase tracking-[0.06em] text-px-body">
              <tr>
                <th className="px-4 py-3 font-medium">Proje</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Etiketler</th>
                <th className="px-4 py-3 font-medium">Yıl</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {projects.map((p) => {
                const tr =
                  p.translations.find((t) => t.locale.code === "en") ??
                  p.translations[0];
                const title = tr?.title ?? p.slug;
                const cover = p.coverUrl;
                return (
                  <tr key={p.id} className="hover:bg-[#fafafa]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-[#eee]">
                          {cover ? (
                            <Image
                              src={cover}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : null}
                        </div>
                        <span className="font-medium text-px-black">{title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClass(p.status)}`}
                      >
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-px-body">{p.tags.join(", ")}</td>
                    <td className="px-4 py-3 text-px-body">{p.year ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-px-body">{p.slug}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`${ADMIN_BASE}/projects/${p.slug}`}
                        className="text-xs font-semibold text-px-red hover:underline"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
