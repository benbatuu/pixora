import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";

export const GET = withAdmin(async (req) => {
  const url = new URL(req.url);
  const entityType = url.searchParams.get("entityType")?.trim() || undefined;
  const takeRaw = Number(url.searchParams.get("take") ?? "50");
  const take = Number.isFinite(takeRaw)
    ? Math.min(Math.max(Math.floor(takeRaw), 1), 200)
    : 50;

  const logs = await prisma.auditLog.findMany({
    where: entityType ? { entityType } : undefined,
    orderBy: { createdAt: "desc" },
    take,
  });

  const entityTypes = await prisma.auditLog.findMany({
    distinct: ["entityType"],
    select: { entityType: true },
    orderBy: { entityType: "asc" },
  });

  return ok({
    logs,
    entityTypes: entityTypes.map((e) => e.entityType),
  });
}, { role: "ADMIN" });
