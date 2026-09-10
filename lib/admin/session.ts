
import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "pixora_admin_session";
const SESSION_TTL = "7d";

export type AdminSessionPayload = {
  sub: string;
  email: string;
  role: string;
  name?: string | null;
};

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET is missing or too short");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(payload: AdminSessionPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    name: payload.name ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecretKey());
}

export async function verifyAdminSession(
  token: string | undefined | null,
): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const role = typeof payload.role === "string" ? payload.role : null;
    if (!sub || !email || !role) return null;
    return {
      sub,
      email,
      role,
      name: typeof payload.name === "string" ? payload.name : null,
    };
  } catch {
    return null;
  }
}

export function adminSessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
