import { Glass } from "@/components/glass/Glass";
import { dict } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";

// Shown when content was served in `from` because no `lang` version exists.
// className is for additions (colour, margin, flex), not for overriding the padding/size below.
export function FallbackBadge({ from, lang, className }: { from: Lang | null; lang: Lang; className?: string }) {
  if (!from) return null;
  return (
    <Glass as="span" className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${className ?? ""}`}>
      {dict(lang).onlyIn[from]}
    </Glass>
  );
}
