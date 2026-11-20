import type { Lang } from "./i18n";

// "2024-03" -> "March 2024" / "Mart 2024". Anything that is not YYYY-MM is returned as is.
export function formatMonth(ym: string, lang: Lang): string {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(ym);
  if (!m) return ym;
  // UTC both ways, so the server's timezone cannot shift the month.
  return new Intl.DateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    Date.UTC(Number(m[1]), Number(m[2]) - 1),
  );
}
