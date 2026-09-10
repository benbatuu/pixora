import type { Metadata } from "next";
import MessagesInbox from "@/app/components/admin/messages/MessagesInbox";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import { ADMIN_BASE } from "@/lib/admin/constants";

export const metadata: Metadata = { title: "Mesajlar" };

export default function AdminMessagesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Mesajlar"
        description="Contact formundan gelen talepler."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Mesajlar" },
        ]}
      />
      <MessagesInbox />
    </div>
  );
}
