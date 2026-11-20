import { NextResponse, type NextRequest } from "next/server";
import { isLang, resolveLang } from "@/lib/i18n";

const COOKIE = { maxAge: 60 * 60 * 24 * 365, sameSite: "lax", path: "/" } as const;

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // A visited "/en/x" redirects to "/x" and pins that language, so the toggle keeps working there.
  // Only external requests reach this: the rewrite below does not re-enter the proxy.
  const [, first, ...rest] = pathname.split("/");
  if (isLang(first)) {
    // 307, not 308: a cached permanent redirect would skip setting the cookie on later visits.
    // Strip extra leading slashes: Next sends same-origin Locations relative, and "//evil.com" would leave the site.
    const url = req.nextUrl.clone();
    url.pathname = "/" + rest.join("/").replace(/^[/\\]+/, "");
    const res = NextResponse.redirect(url, 307);
    res.cookies.set("lang", first, COOKIE);
    return res;
  }

  const cookie = req.cookies.get("lang")?.value;
  const lang = resolveLang(cookie, req.headers.get("accept-language"));
  // "/" -> "/tr", not "/tr/", so the rewrite hits the same route as a direct visit.
  const res = NextResponse.rewrite(new URL(`/${lang}${pathname === "/" ? "" : pathname}${search}`, req.url));
  if (!isLang(cookie)) res.cookies.set("lang", lang, COOKIE);
  return res;
}

export const config = {
  // Skips whole segments api, _next, admin, login, and files: a last segment ending in ".ext" (letters/digits only).
  // shortcut: a page slug ending in ".abc" would be treated as a file; reject such slugs if that ever matters.
  matcher: ["/((?!(?:api|_next|admin|login)(?:/|$))(?!.*\\.\\w+$).*)"],
};
