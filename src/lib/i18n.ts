export const LANGS = ["en", "tr"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(x: unknown): x is Lang {
  return typeof x === "string" && (LANGS as readonly string[]).includes(x);
}

// Highest-q supported primary subtag wins (ties: first listed); q=0 or junk q is skipped.
export function negotiateLang(acceptLanguage: string | null): Lang {
  let best: Lang = "en";
  let bestQ = 0;
  for (const part of (acceptLanguage ?? "").split(",")) {
    const [tag, ...params] = part.split(";");
    const primary = tag.trim().toLowerCase().split("-")[0];
    if (!isLang(primary)) continue;
    const qParam = params.map((p) => p.trim()).find((p) => p.toLowerCase().startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (Number.isFinite(q) && q > bestQ) {
      best = primary;
      bestQ = q;
    }
  }
  return best;
}

export function resolveLang(cookie: string | undefined, acceptLanguage: string | null): Lang {
  return isLang(cookie) ? cookie : negotiateLang(acceptLanguage);
}
