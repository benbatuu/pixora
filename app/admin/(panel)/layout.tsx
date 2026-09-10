export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { AdminShell } from "@/app/components/admin/shell";
import { getAdminSession } from "@/lib/admin/require-admin";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      role={session.role}
      userName={session.name}
      userEmail={session.email}
    >
      {children}
    </AdminShell>
  );
}
