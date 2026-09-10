import { prisma } from "@/lib/db/prisma";
import type { AdminSessionPayload } from "@/lib/admin/session";
import type { Prisma } from "@prisma/client";

export type WriteAuditInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  meta?: Prisma.InputJsonValue;
  session?: AdminSessionPayload | null;
};

/** Best-effort audit write — never throws to callers. */
export async function writeAudit(input: WriteAuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        meta: input.meta ?? undefined,
        actorId: input.session?.sub ?? null,
        actorEmail: input.session?.email ?? null,
      },
    });
  } catch (e) {
    console.error("[audit]", e);
  }
}
