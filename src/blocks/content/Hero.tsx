import Link from "next/link";
import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import type { Lang } from "@/lib/i18n";
import { pickLocalized, type Localized } from "@/lib/localized";
import type { PageKey } from "../types";

export type HeroConfig = { title: Localized; tagline: Localized; ctas?: { label: Localized; page: PageKey }[] };

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

export function Hero({ config, lang }: { config: HeroConfig; lang: Lang }) {
  const title = pickLocalized(config.title, lang);
  const tagline = pickLocalized(config.tagline, lang);
  return (
    <Glass as="section" className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
      <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
        {title.text}
      </h1>
      <FallbackBadge from={title.fallbackFrom} lang={lang} />
      {tagline.text && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty sm:text-xl">
          {tagline.text} <FallbackBadge from={tagline.fallbackFrom} lang={lang} />
        </p>
      )}
      {!!config.ctas?.length && (
        <ul className="mt-8 flex flex-wrap gap-3">
          {config.ctas.map((c, i) => {
            const label = pickLocalized(c.label, lang);
            return (
              <li key={c.page} className="flex items-center gap-2">
                <Link
                  href={c.page === "home" ? "/" : `/${c.page}`}
                  className={`inline-flex rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${FOCUS} ${
                    // First CTA is the primary action: solid, inverted.
                    i === 0
                      ? "bg-fg text-white hover:opacity-90 dark:text-neutral-950"
                      : "bg-[var(--glass-hover)] ring-1 ring-inset ring-white/50 hover:bg-white/40 dark:ring-white/20 dark:hover:bg-white/15"
                  }`}
                >
                  {label.text}
                </Link>
                <FallbackBadge from={label.fallbackFrom} lang={lang} />
              </li>
            );
          })}
        </ul>
      )}
    </Glass>
  );
}
