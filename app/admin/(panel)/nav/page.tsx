import type { Metadata } from "next";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import NavManager from "@/app/components/admin/nav/NavManager";
import { ADMIN_BASE } from "@/lib/admin/constants";

export const metadata: Metadata = { title: "Menü" };
export const dynamic = "force-dynamic";

export default function AdminNavPage() {
  return (
    <div>
      <AdminPageHeader
        title="Menü"
        description="Header ve footer navigasyon öğelerini dil bazlı düzenle. Site menü etiketleri ve sırası buradan gelir."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Menü" },
        ]}
      />
      <NavManager />
    </div>
  );
}
