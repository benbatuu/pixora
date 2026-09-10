import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import AdminEmptyState from "@/app/components/admin/ui/AdminEmptyState";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = { title: "Blog" };
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

function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function loadPosts() {
  return prisma.post.findMany({
    include: { translations: { include: { locale: true } } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export default async function AdminBlogPage() {
  let posts: Awaited<ReturnType<typeof loadPosts>> = [];
  let loadError: string | null = null;

  try {
    posts = await loadPosts();
  } catch (e) {
    console.error("[admin.blog.list]", e);
    loadError = "Veritabanından yazılar yüklenemedi.";
  }

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Yazıları listele, ekle ve düzenle."
        breadcrumb={[{ label: "Admin", href: ADMIN_BASE }, { label: "Blog" }]}
        actions={
          <Link
            href={`${ADMIN_BASE}/blog/new`}
            className="inline-flex h-10 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red"
          >
            Yeni yazı
          </Link>
        }
      />

      {loadError ? (
        <p className="mb-4 rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {loadError}
        </p>
      ) : null}

      {posts.length === 0 ? (
        <AdminEmptyState
          title="Henüz yazı yok"
          description="İlk blog yazısını ekleyerek başla."
          action={
            <Link
              href={`${ADMIN_BASE}/blog/new`}
              className="inline-flex h-10 items-center rounded-full bg-px-black px-5 text-sm font-semibold text-white hover:bg-px-red"
            >
              Yeni yazı
            </Link>
          }
        />
      ) : (
      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/8 bg-[#fafafa] text-xs uppercase tracking-[0.06em] text-px-body">
              <tr>
                <th className="px-4 py-3 font-medium">Yazı</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {posts.map((post) => {
                const tr =
                  post.translations.find((t) => t.locale.code === "en") ??
                  post.translations[0];
                const title = tr?.title ?? post.slug;
                const cover = post.coverUrl;
                return (
                  <tr key={post.id} className="hover:bg-[#fafafa]">
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
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClass(post.status)}`}
                      >
                        {STATUS_LABEL[post.status] ?? post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-px-body">{post.category ?? "—"}</td>
                    <td className="px-4 py-3 text-px-body">
                      {formatDate(post.publishedAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-px-body">
                      {post.slug}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`${ADMIN_BASE}/blog/${post.slug}`}
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
