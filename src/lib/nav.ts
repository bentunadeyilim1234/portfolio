import { PAGE_KEYS, type PageKey } from "@/blocks/types";
import { isLang } from "./i18n";

export function isPageKey(x: unknown): x is PageKey {
  return typeof x === "string" && (PAGE_KEYS as readonly string[]).includes(x);
}

export function pageHref(page: PageKey): string {
  return page === "home" ? "/" : `/${page}`;
}

// First path segment names the page ("/projects/x" -> "projects", "/" -> "home"). The proxy rewrites
// internally so browser paths are unprefixed, but a visited "/en/..." URL still resolves.
export function activePage(pathname: string): string {
  const segs = pathname.split("/").filter(Boolean);
  if (isLang(segs[0])) segs.shift();
  return segs[0] ?? "home";
}
