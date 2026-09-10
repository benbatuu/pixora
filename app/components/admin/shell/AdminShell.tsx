import type { ReactNode } from "react";
import AdminProviders from "@/app/components/admin/ui/AdminProviders";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({
  children,
  topbarTitle,
  role = "ADMIN",
  userName,
  userEmail,
}: {
  children: ReactNode;
  topbarTitle?: string;
  role?: string;
  userName?: string | null;
  userEmail?: string | null;
}) {
  return (
    <AdminProviders>
      <div className="min-h-svh bg-[#f7f7f7] text-px-black">
        <AdminSidebar
          role={role}
          userName={userName}
          userEmail={userEmail}
        />
        <div className="flex min-h-svh min-w-0 flex-col pl-[260px]">
          <AdminTopbar title={topbarTitle} />
          <main className="flex-1 overflow-x-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AdminProviders>
  );
}
