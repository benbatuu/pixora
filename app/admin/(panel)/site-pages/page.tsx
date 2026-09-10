import type { Metadata } from "next";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import SitePagesManager from "@/app/components/admin/pages/SitePagesManager";
import { ADMIN_BASE } from "@/lib/admin/constants";

export const metadata: Metadata = { title: "Sayfalar" };
export const dynamic = "force-dynamic";

export default function AdminPagesIndexPage() {
  return (
    <div>
      <AdminPageHeader
        title="Sayfalar"
        description="CMS içerik sayfaları (bölümler). Projeler/Blog ayrı modüller; site menüsü Menü ekranından."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Sayfalar" },
        ]}
      />
      <SitePagesManager />
    </div>
  );
}
