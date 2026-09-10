
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
  type AdminSessionPayload,
} from "./session";

export type AdminRole = "ADMIN" | "EDITOR";

export class AdminAuthError extends Error {
  status: number;
  constructor(message = "Unauthorized", status = 401) {
    super(message);
    this.status = status;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(token);
}

export async function requireAdmin(opts?: {
  role?: AdminRole;
}): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) throw new AdminAuthError();
  if (opts?.role === "ADMIN" && session.role !== "ADMIN") {
    throw new AdminAuthError("Yalnızca admin", 403);
  }
  return session;
}

/** Alias — require ADMIN role specifically. */
export async function requireRole(
  role: "ADMIN",
): Promise<AdminSessionPayload> {
  return requireAdmin({ role });
}
