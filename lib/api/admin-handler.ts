
import type { AdminSessionPayload } from "@/lib/admin/session";
import {
  requireAdmin,
  type AdminRole,
} from "@/lib/admin/require-admin";
import { err } from "./response";

type Handler = (
  req: Request,
  ctx: { session: AdminSessionPayload; params?: Record<string, string> },
) => Promise<Response>;

type WithAdminOptions = {
  /** When set to ADMIN, EDITOR sessions receive 403. */
  role?: AdminRole;
};

/** Wraps an admin API route with auth + unified error handling. */
export function withAdmin(handler: Handler, opts?: WithAdminOptions) {
  return async (
    req: Request,
    routeCtx?: { params: Promise<Record<string, string>> },
  ) => {
    try {
      const session = await requireAdmin(
        opts?.role ? { role: opts.role } : undefined,
      );
      const params = routeCtx?.params ? await routeCtx.params : undefined;
      return await handler(req, { session, params });
    } catch (e) {
      return err(e);
    }
  };
}
