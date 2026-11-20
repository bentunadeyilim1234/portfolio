import { Mail } from "lucide-react";
import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import { dict } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";
import { pickLocalized, type Localized } from "@/lib/localized";

export type ContactConfig = { title: Localized };

export function ContactCard({ config, email, lang }: { config: ContactConfig; email: string; lang: Lang }) {
  const title = pickLocalized(config.title, lang);
  return (
    <Glass as="section" className="flex flex-col items-start gap-4 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title.text}</h2>
      <FallbackBadge from={title.fallbackFrom} lang={lang} />
      <p className="break-all text-fg-muted">{email}</p>
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg dark:text-neutral-950"
      >
        <Mail aria-hidden className="size-4" />
        {dict(lang).contact.emailMe}
      </a>
    </Glass>
  );
}
