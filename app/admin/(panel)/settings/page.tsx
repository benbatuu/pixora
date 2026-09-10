import type { Metadata } from "next";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import SettingsForm from "@/app/components/admin/settings/SettingsForm";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { getAdminSession } from "@/lib/admin/require-admin";

export const metadata: Metadata = { title: "Ayarlar" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  const isAdmin = session?.role === "ADMIN";

  return (
    <div>
      <AdminPageHeader
        title="Ayarlar"
        description="Studio iletişim, sosyal linkler ve marka. SEO için SEO & AI menüsünü kullanın."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Ayarlar" },
        ]}
      />
      {isAdmin ? (
        <SettingsForm />
      ) : (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-px-black">Yalnızca admin</h2>
          <p className="mt-2 text-sm text-px-body">
            Site ayarlarını görüntülemek ve düzenlemek için ADMIN rolü gerekir.
          </p>
        </div>
      )}
    </div>
  );
}
