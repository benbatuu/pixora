import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";

export const GET = withAdmin(async () => {
  const count = await prisma.contactMessage.count({
    where: { readAt: null, archivedAt: null },
  });
  return ok({ count });
});
