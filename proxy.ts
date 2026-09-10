import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
} from "@/lib/admin/session";
import {
  COOKIE_NAME,
  LOCALE_HEADER,
  isPrefixLocale,
} from "@/lib/i18n/config";

function handleLocalePrefix(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const parts = pathname.split("/");
  // pathname like /tr/contact → ["", "tr", "contact"]
  const maybe = parts[1];
  if (!maybe || !isPrefixLocale(maybe)) return null;

  // Never locale-prefix admin/api internals
  const restParts = parts.slice(2);
  const restPath = restParts.length ? `/${restParts.join("/")}` : "/";
  if (restPath.startsWith("/admin") || restPath.startsWith("/api")) {
    return null;
  }

  const locale = maybe;
  const url = req.nextUrl.clone();
  url.pathname = restPath;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  const res = NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
  res.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public locale path prefix → rewrite + cookie + header
  const localeRes = handleLocalePrefix(req);
  if (localeRes) return localeRes;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/auth/login";
  const isPublicAuth =
    isLoginPage ||
    isLoginApi ||
    pathname === "/api/admin/auth/logout";

  if (isPublicAuth) {
    // Already signed in → skip login page
    if (isLoginPage) {
      const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      const session = await verifyAdminSession(token);
      if (session) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSession(token);

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/tr",
    "/tr/:path*",
    "/en",
    "/en/:path*",
    "/ru",
    "/ru/:path*",
  ],
};
