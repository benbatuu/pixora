import type { Metadata } from "next";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import ProjectForm from "@/app/components/admin/projects/ProjectForm";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = { title: "Yeni proje" };
export const dynamic = "force-dynamic";

export default async function AdminNewProjectPage() {
  const locales = await prisma.locale.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    select: { code: true, name: true, isDefault: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Yeni proje"
        description="Portföye yeni proje ekle."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Projeler", href: `${ADMIN_BASE}/projects` },
          { label: "Yeni" },
        ]}
      />
      <ProjectForm mode="create" locales={locales} />
    </div>
  );
}
