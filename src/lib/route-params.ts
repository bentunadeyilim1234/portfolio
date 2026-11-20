import { notFound } from "next/navigation";
import { isLang, type Lang } from "./i18n";

export type LangProps = { params: Promise<{ lang: string }> };

// The layout already 404s an unknown lang; this narrows the type for pages (and extra params pass through).
export async function routeParams<T extends { lang: string }>(params: Promise<T>) {
  const p = await params;
  if (!isLang(p.lang)) notFound();
  return p as T & { lang: Lang };
}
