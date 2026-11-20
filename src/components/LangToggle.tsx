"use client";

import { dict } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";

// The proxy picks the language from the `lang` cookie, so set it and reload the same URL.
export function LangToggle({ lang }: { lang: Lang }) {
  const next: Lang = lang === "en" ? "tr" : "en";
  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `lang=${next};path=/;max-age=31536000;samesite=lax`;
        location.reload();
      }}
      aria-label={dict(lang).nav.switchLang}
      className="grid h-11 min-w-11 place-items-center rounded-full px-2 text-sm font-semibold tracking-wide text-fg transition-colors hover:bg-[var(--glass-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
    >
      {/* The visible code is in the target language; the button's name is in the current one. */}
      <span lang={next}>{next.toUpperCase()}</span>
    </button>
  );
}
