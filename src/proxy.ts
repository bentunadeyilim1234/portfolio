import { NextResponse, type NextRequest } from "next/server";
import { isLang, LANGS, resolveLang } from "@/lib/i18n";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (LANGS.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();

  const cookie = req.cookies.get("lang")?.value;
  const lang = resolveLang(cookie, req.headers.get("accept-language"));
  // "/" -> "/tr", not "/tr/", so the rewrite hits the same route as a direct visit.
  const res = NextResponse.rewrite(new URL(`/${lang}${pathname === "/" ? "" : pathname}${search}`, req.url));
  if (!isLang(cookie)) {
    res.cookies.set("lang", lang, { maxAge: 60 * 60 * 24 * 365, sameSite: "lax", path: "/" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|admin|login|.*\\..*).*)"],
};
