import type { Metadata } from "next";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import SeoSettingsForm from "@/app/components/admin/seo/SeoSettingsForm";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { getAdminSession } from "@/lib/admin/require-admin";

export const metadata: Metadata = { title: "SEO & AI" };
export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const session = await getAdminSession();
  const isAdmin = session?.role === "ADMIN";

  return (
    <div>
      <AdminPageHeader
        title="SEO & AI"
        description="Arama motoru, yerel (GEO) ve LLM / AI crawler ayarları."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "SEO & AI" },
        ]}
      />
      {isAdmin ? (
        <SeoSettingsForm />
      ) : (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-px-black">Yalnızca admin</h2>
          <p className="mt-2 text-sm text-px-body">
            SEO ve AI ayarlarını görüntülemek ve düzenlemek için ADMIN rolü gerekir.
          </p>
        </div>
      )}
    </div>
  );
}
