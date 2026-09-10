import type { Metadata } from "next";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import PostForm from "@/app/components/admin/blog/PostForm";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = { title: "Yeni yazı" };
export const dynamic = "force-dynamic";

export default async function AdminNewBlogPage() {
  const locales = await prisma.locale.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    select: { code: true, name: true, isDefault: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Yeni yazı"
        description="Yeni blog yazısı oluştur."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Blog", href: `${ADMIN_BASE}/blog` },
          { label: "Yeni" },
        ]}
      />
      <PostForm mode="create" locales={locales} />
    </div>
  );
}
