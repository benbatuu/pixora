import type { Metadata } from "next";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import LocalesManager from "@/app/components/admin/locales/LocalesManager";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { getAdminSession } from "@/lib/admin/require-admin";

export const metadata: Metadata = { title: "Diller" };
export const dynamic = "force-dynamic";

export default async function AdminLocalesPage() {
  const session = await getAdminSession();
  const isAdmin = session?.role === "ADMIN";

  return (
    <div>
      <AdminPageHeader
        title="Diller"
        description="Site içerik dillerini ekle, aktif/pasif yap veya varsayılan seç."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Diller" },
        ]}
      />
      {isAdmin ? (
        <LocalesManager />
      ) : (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-px-black">Yalnızca admin</h2>
          <p className="mt-2 text-sm text-px-body">
            Dil yönetimini kullanmak için ADMIN rolü gerekir.
          </p>
        </div>
      )}
    </div>
  );
}
