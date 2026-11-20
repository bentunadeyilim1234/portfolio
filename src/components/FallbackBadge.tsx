import { Glass } from "@/components/glass/Glass";
import { dict } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";

// Shown when content was served in `from` because no `lang` version exists.
export function FallbackBadge({ from, lang }: { from: Lang | null; lang: Lang }) {
  if (!from) return null;
  return (
    <Glass as="span" className="inline-flex rounded-full px-3 py-1 text-xs font-medium">
      {dict(lang).onlyIn[from]}
    </Glass>
  );
}
