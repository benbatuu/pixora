import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { messagesFilterSchema } from "@/lib/admin/contact-schema";
import type { Prisma } from "@prisma/client";

export const GET = withAdmin(async (req) => {
  const url = new URL(req.url);
  const rawFilter = url.searchParams.get("filter") ?? "inbox";
  const filterParsed = messagesFilterSchema.safeParse(rawFilter);
  const filter = filterParsed.success ? filterParsed.data : "inbox";

  const where: Prisma.ContactMessageWhereInput =
    filter === "inbox"
      ? { archivedAt: null }
      : filter === "archived"
        ? { archivedAt: { not: null } }
        : {};

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return ok({ messages });
});
