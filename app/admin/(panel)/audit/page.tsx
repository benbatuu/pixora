import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import AuditLogTable from "@/app/components/admin/audit/AuditLogTable";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { getAdminSession } from "@/lib/admin/require-admin";

export const metadata: Metadata = { title: "Denetim" };
export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const session = await getAdminSession();
  if (!session) redirect(`${ADMIN_BASE}/login`);
  if (session.role !== "ADMIN") {
    return (
      <div>
        <AdminPageHeader
          title="Denetim"
          description="Kim ne zaman ne değiştirdi."
          breadcrumb={[
            { label: "Admin", href: ADMIN_BASE },
            { label: "Denetim" },
          ]}
        />
        <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-px-black">Yalnızca admin</h2>
          <p className="mt-2 text-sm text-px-body">
            Denetim günlüğünü görmek için ADMIN rolü gerekir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Denetim"
        description="Yönetim paneli mutasyonlarının kaydı (en yeniden eskiye)."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Denetim" },
        ]}
      />
      <AuditLogTable />
    </div>
  );
}
