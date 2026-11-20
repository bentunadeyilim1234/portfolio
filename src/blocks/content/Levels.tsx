import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import type { Skill } from "@/data/types";
import type { Lang } from "@/lib/i18n";
import { pickLocalized, type Localized } from "@/lib/localized";

export type LevelsConfig = { title: Localized };

// Shared body of Skills and Languages: a titled list of labelled level bars.
export function Levels(p: { config: LevelsConfig; items: Skill[]; lang: Lang; listClass: string; barClass: string }) {
  const title = pickLocalized(p.config.title, p.lang);
  return (
    <Glass as="section" className="p-6 sm:p-8">
      <h2 className="text-xl font-bold">{title.text}</h2>
      <FallbackBadge from={title.fallbackFrom} lang={p.lang} />
      <ul className={`mt-6 ${p.listClass}`}>
        {p.items.map((s) => {
          const name = pickLocalized(s.name, p.lang);
          const level = pickLocalized(s.level, p.lang);
          return (
            <li key={s.id}>
              <div className="mb-2 flex items-end justify-between gap-3">
                <span className="font-medium">{name.text}</span>
                <span className="text-right text-sm text-fg-muted">{level.text}</span>
              </div>
              {/* The level text carries the meaning; the bar is decoration. */}
              <div aria-hidden className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
                <div
                  className={`h-full rounded-full ${p.barClass}`}
                  style={{ width: `${Math.min(100, Math.max(0, s.percentage))}%` }}
                />
              </div>
              {/* One badge per row: name and level are one record, two badges per bar would drown the list. */}
              <FallbackBadge from={name.fallbackFrom ?? level.fallbackFrom} lang={p.lang} />
            </li>
          );
        })}
      </ul>
    </Glass>
  );
}
