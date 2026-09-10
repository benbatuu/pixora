import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/app/components/admin/ui/AdminPageHeader";
import PostForm, {
  type PostFormInitial,
  type PostTranslationFields,
} from "@/app/components/admin/blog/PostForm";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { translations: { include: { locale: true } } },
  });
  const tr =
    post?.translations.find((t) => t.locale.code === "en") ??
    post?.translations[0];
  return { title: tr ? `Blog · ${tr.title}` : "Blog" };
}

export default async function AdminEditBlogPage({ params }: Props) {
  const { slug } = await params;
  const [post, locales] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
      include: { translations: { include: { locale: true } } },
    }),
    prisma.locale.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
      select: { code: true, name: true, isDefault: true },
    }),
  ]);
  if (!post) notFound();

  const translations: Record<string, PostTranslationFields> = {};
  for (const t of post.translations) {
    translations[t.locale.code] = {
      title: t.title,
      excerpt: t.excerpt,
      body: t.body,
      seoTitle: t.seoTitle ?? "",
      seoDescription: t.seoDescription ?? "",
    };
  }

  const defaultCode =
    locales.find((l) => l.isDefault)?.code ??
    post.translations.find((t) => t.locale.code === "en")?.locale.code ??
    post.translations[0]?.locale.code ??
    "en";

  const initial: PostFormInitial = {
    id: post.id,
    slug: post.slug,
    status: post.status,
    coverUrl: post.coverUrl ?? "",
    category: post.category ?? "",
    authorName: post.authorName ?? "",
    authorRole: post.authorRole ?? "",
    readTime: post.readTime ?? "",
    comments: post.comments,
    localeCode: defaultCode,
    translations,
    translatedLocales: Object.keys(translations),
  };

  const title =
    translations[defaultCode]?.title ?? translations.en?.title ?? post.slug;

  return (
    <div>
      <AdminPageHeader
        title={title}
        description="Yazıyı dil bazlı düzenle veya sil."
        breadcrumb={[
          { label: "Admin", href: ADMIN_BASE },
          { label: "Blog", href: `${ADMIN_BASE}/blog` },
          { label: title },
        ]}
      />
      <PostForm mode="edit" initial={initial} locales={locales} />
    </div>
  );
}
