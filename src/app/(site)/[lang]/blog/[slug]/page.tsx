import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import { Markdown } from "@/components/Markdown";
import { getPostBySlug, getPublishedPosts } from "@/data/queries";
import { dict } from "@/lib/dictionaries";
import { LANGS } from "@/lib/i18n";
import { pickLocalized } from "@/lib/localized";
import { routeParams } from "@/lib/route-params";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Layout sets false for [lang]; posts published after the build render on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return LANGS.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await routeParams(params);
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: pickLocalized(post.title, lang).text,
    description: pickLocalized(post.excerpt, lang).text || undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await routeParams(params);
  // Drafts and future-dated posts are filtered out by the query.
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const title = pickLocalized(post.title, lang);
  const body = pickLocalized(post.body, lang);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-4 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {dict(lang).common.back}
        </Link>

        <Glass className="overflow-hidden">
          {post.coverUrl && (
            <div className="relative aspect-[16/9]">
              {/* Column is max-w-3xl (768px) minus the px-4 gutters. */}
              {/* alt="": decorative, the title right below says what the post is about. */}
              <Image
                src={post.coverUrl}
                alt=""
                fill
                preload
                sizes="(min-width: 800px) 768px, calc(100vw - 2rem)"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col items-start gap-2 p-6 sm:p-10">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()} className="text-sm text-fg-muted">
                {new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(post.publishedAt)}
              </time>
            )}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">{title.text}</h1>
            <FallbackBadge from={title.fallbackFrom} lang={lang} />
            {body.text && (
              <div className="mt-4 w-full">
                <FallbackBadge from={body.fallbackFrom} lang={lang} className="mb-4" />
                <Markdown source={body.text} />
              </div>
            )}
          </div>
        </Glass>
      </article>
    </main>
  );
}
