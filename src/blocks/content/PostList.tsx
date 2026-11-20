import Image from "next/image";
import Link from "next/link";
import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import type { PostSummary } from "@/data/types";
import { dict } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";
import { pickLocalized } from "@/lib/localized";

export type PostListConfig = { limit?: number };

export function PostList({ posts, lang }: { posts: PostSummary[]; lang: Lang }) {
  const t = dict(lang);
  if (posts.length === 0) {
    return (
      <Glass as="p" className="px-6 py-8 text-center text-fg-muted">
        {t.blog.empty}
      </Glass>
    );
  }
  const date = new Intl.DateTimeFormat(lang, { dateStyle: "medium" });
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {posts.map((p) => {
        const title = pickLocalized(p.title, lang);
        const excerpt = pickLocalized(p.excerpt, lang);
        return (
          <li key={p.id}>
            <Glass as="article" className="group h-full overflow-hidden">
              <Link
                href={`/blog/${p.slug}`}
                className="flex h-full flex-col rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-fg"
              >
                {/* alt="": decorative, the link is already named by the title. */}
                {p.coverUrl && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.coverUrl}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col items-start gap-2 p-5">
                  {p.publishedAt && (
                    <time dateTime={p.publishedAt.toISOString()} className="text-xs text-fg-muted">
                      {date.format(p.publishedAt)}
                    </time>
                  )}
                  <h2 className="text-lg font-semibold leading-snug tracking-tight">{title.text}</h2>
                  <FallbackBadge from={title.fallbackFrom} lang={lang} />
                  {excerpt.text && <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">{excerpt.text}</p>}
                  <FallbackBadge from={excerpt.fallbackFrom} lang={lang} />
                  <span aria-hidden className="mt-auto pt-2 text-sm font-medium">
                    {t.blog.readMore} &rarr;
                  </span>
                </div>
              </Link>
            </Glass>
          </li>
        );
      })}
    </ul>
  );
}
