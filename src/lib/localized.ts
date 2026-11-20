import type { Lang } from "./i18n";

export type Localized = { en?: string; tr?: string };

// An empty string counts as missing; falls back to the other language and reports where it came from.
export function pickLocalized(
  v: Localized | null | undefined,
  lang: Lang,
): { text: string; fallbackFrom: Lang | null } {
  const other: Lang = lang === "en" ? "tr" : "en";
  const own = v?.[lang];
  if (own) return { text: own, fallbackFrom: null };
  const alt = v?.[other];
  if (alt) return { text: alt, fallbackFrom: other };
  return { text: "", fallbackFrom: null };
}
