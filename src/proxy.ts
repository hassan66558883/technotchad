import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { canAccessPath, hasAnyAdminAccess } from "@/lib/permissions";
import { locales, defaultLocale, isLocale } from "@/i18n/config";

function getPreferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;
  const preferred = header.split(",")[0]?.split("-")[0]?.toLowerCase();
  return preferred && isLocale(preferred) ? preferred : defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (!hasAnyAdminAccess(session.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!canAccessPath(session.role, pathname)) {
      return NextResponse.redirect(new URL("/admin?denied=1", request.url));
    }
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
