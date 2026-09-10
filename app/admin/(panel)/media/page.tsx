import type { Metadata } from "next";
import MediaLibrary from "@/app/components/admin/media/MediaLibrary";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import { ADMIN_BASE } from "@/lib/admin/constants";

export const metadata: Metadata = { title: "Medya" };

export default function AdminMediaPage() {
  return (
    <div>
      <AdminPageHeader
        title="Medya"
        description="Görseller ve videolar — yükle, alt metin düzenle, URL kopyala."
        breadcrumb={[{ label: "Admin", href: ADMIN_BASE }, { label: "Medya" }]}
      />
      <MediaLibrary />
    </div>
  );
}
