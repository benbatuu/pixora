import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import PageSectionsEditor from "@/app/components/admin/pages/PageSectionsEditor";
import { ADMIN_BASE, metaForPageKey } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ pageKey: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageKey } = await params;
  const meta = metaForPageKey(pageKey);
  return { title: `Sayfa · ${meta.label}` };
}

export default async function AdminPageEditorPage({ params }: Props) {
  const { pageKey } = await params;
  const row = await prisma.page.findUnique({ where: { key: pageKey } });
  if (!row) notFound();

  const meta = metaForPageKey(pageKey);

  return (
    <div>
      <AdminPageHeader
        title={meta.label}
        description={`Bölüm içeriklerini düzenle. Public path: ${meta.publicPath}${
          meta.hasPublicRoute
            ? ""
            : " — uyarı: public Next route henüz yok; CMS içeriği gelecek rota için saklanır."
        }`}
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Sayfalar", href: `${ADMIN_BASE}/site-pages` },
          { label: meta.label },
        ]}
      />
      <PageSectionsEditor pageKey={pageKey} pageLabel={meta.label} />
    </div>
  );
}
