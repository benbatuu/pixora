
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { created, ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { postInputSchema } from "@/lib/admin/post-schema";
import { writeAudit } from "@/lib/admin/audit";

export const GET = withAdmin(async () => {
  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { translations: { include: { locale: true } } },
  });
  return ok({ posts });
});

export const POST = withAdmin(async (req, { session }) => {
  const body = await parseJson(req, postInputSchema);
  const slug = body.slug.trim().toLowerCase();
  const exists = await prisma.post.findUnique({ where: { slug } });
  if (exists) throw new ApiError("Bu slug zaten kullanılıyor", 409);

  const locale = await prisma.locale.findUnique({
    where: { code: body.localeCode },
  });
  if (!locale) throw new ApiError("Locale bulunamadı", 400);

  const post = await prisma.post.create({
    data: {
      slug,
      status: body.status,
      coverUrl: body.coverUrl ?? null,
      category: body.category ?? null,
      authorName: body.authorName ?? null,
      authorRole: body.authorRole ?? null,
      readTime: body.readTime ?? null,
      comments: body.comments,
      publishedAt:
        body.status === "PUBLISHED"
          ? body.publishedAt
            ? new Date(body.publishedAt)
            : new Date()
          : body.publishedAt
            ? new Date(body.publishedAt)
            : null,
      translations: {
        create: {
          localeId: locale.id,
          title: body.title,
          excerpt: body.excerpt,
          body: body.body,
          seoTitle: body.seoTitle ?? null,
          seoDescription: body.seoDescription ?? null,
        },
      },
    },
    include: { translations: { include: { locale: true } } },
  });

  await writeAudit({
    action: "post.create",
    entityType: "Post",
    entityId: post.id,
    meta: { slug: post.slug },
    session,
  });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return created({ post });
});
