import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import { Markdown } from "@/components/Markdown";
import type { Lang } from "@/lib/i18n";
import { pickLocalized, type Localized } from "@/lib/localized";

export type MarkdownConfig = { body: Localized };

export function MarkdownBlock({ config, lang }: { config: MarkdownConfig; lang: Lang }) {
  const body = pickLocalized(config.body, lang);
  return (
    <Glass as="section" className="px-6 py-8 sm:px-10">
      <FallbackBadge from={body.fallbackFrom} lang={lang} />
      <Markdown source={body.text} />
    </Glass>
  );
}
