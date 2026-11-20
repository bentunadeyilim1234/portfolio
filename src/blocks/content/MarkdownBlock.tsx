import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import { Markdown } from "@/components/Markdown";
import type { Lang } from "@/lib/i18n";
import { fallbackLang, pickLocalized, type Localized } from "@/lib/localized";

export type MarkdownConfig = { body: Localized };

export function MarkdownBlock({ config, lang }: { config: MarkdownConfig; lang: Lang }) {
  const body = pickLocalized(config.body, lang);
  return (
    <Glass as="section" className="px-6 py-8 sm:px-10">
      <FallbackBadge from={body.fallbackFrom} lang={lang} />
      <div lang={fallbackLang(body)}>
        <Markdown source={body.text} />
      </div>
    </Glass>
  );
}
