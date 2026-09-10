
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import { ApiError } from "@/lib/api/errors";
import { postUpdateSchema } from "@/lib/admin/post-schema";
import { writeAudit } from "@/lib/admin/audit";

async function findPost(idOrSlug: string) {
  return prisma.post.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: { translations: { include: { locale: true } } },
  });
}

export const GET = withAdmin(async (_req, { params }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);
  const post = await findPost(id);
  if (!post) throw new ApiError("Yazı bulunamadı", 404);
  return ok({ post });
});

export const PATCH = withAdmin(async (req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);
  const current = await findPost(id);
  if (!current) throw new ApiError("Yazı bulunamadı", 404);

  const body = await parseJson(req, postUpdateSchema);
  if (body.slug && body.slug !== current.slug) {
    const clash = await prisma.post.findUnique({ where: { slug: body.slug } });
    if (clash) throw new ApiError("Bu slug zaten kullanılıyor", 409);
  }

  const localeCode = body.localeCode ?? "en";
  const locale = await prisma.locale.findUnique({ where: { code: localeCode } });
  if (!locale) throw new ApiError("Locale bulunamadı", 400);

  const status = body.status ?? current.status;
  let publishedAt = current.publishedAt;
  if (body.publishedAt !== undefined) {
    publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  } else if (status === "PUBLISHED" && !publishedAt) {
    publishedAt = new Date();
  }

  const post = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: current.id },
      data: {
        ...(body.slug !== undefined ? { slug: body.slug } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.coverUrl !== undefined ? { coverUrl: body.coverUrl } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.authorName !== undefined ? { authorName: body.authorName } : {}),
        ...(body.authorRole !== undefined ? { authorRole: body.authorRole } : {}),
        ...(body.readTime !== undefined ? { readTime: body.readTime } : {}),
        ...(body.comments !== undefined ? { comments: body.comments } : {}),
        publishedAt,
      },
    });

    const hasTr =
      body.title !== undefined ||
      body.excerpt !== undefined ||
      body.body !== undefined ||
      body.seoTitle !== undefined ||
      body.seoDescription !== undefined;

    if (hasTr) {
      const existing = current.translations.find((t) => t.localeId === locale.id);
      const trData = {
        title: body.title ?? existing?.title ?? current.slug,
        excerpt: body.excerpt ?? existing?.excerpt ?? "",
        body: body.body ?? existing?.body ?? "",
        seoTitle: body.seoTitle !== undefined ? body.seoTitle : existing?.seoTitle ?? null,
        seoDescription:
          body.seoDescription !== undefined
            ? body.seoDescription
            : existing?.seoDescription ?? null,
      };
      await tx.postTranslation.upsert({
        where: {
          postId_localeId: { postId: current.id, localeId: locale.id },
        },
        update: trData,
        create: { postId: current.id, localeId: locale.id, ...trData },
      });
    }

    return tx.post.findUnique({
      where: { id: current.id },
      include: { translations: { include: { locale: true } } },
    });
  });

  const slug = post?.slug ?? current.slug;
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (body.slug && body.slug !== current.slug) {
    revalidatePath(`/blog/${current.slug}`);
  }
  await writeAudit({
    action: "post.update",
    entityType: "Post",
    entityId: current.id,
    meta: { slug },
    session,
  });
  return ok({ post });
});

export const DELETE = withAdmin(async (_req, { params, session }) => {
  const id = params?.id;
  if (!id) throw new ApiError("id gerekli", 400);
  const current = await findPost(id);
  if (!current) throw new ApiError("Yazı bulunamadı", 404);
  await prisma.post.delete({ where: { id: current.id } });
  await writeAudit({
    action: "post.delete",
    entityType: "Post",
    entityId: current.id,
    meta: { slug: current.slug },
    session,
  });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${current.slug}`);
  return ok({ ok: true });
});
