import { ArrowLeft, Code, ExternalLink, FolderGit2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import { Markdown } from "@/components/Markdown";
import { projectCover } from "@/data/project-cover";
import { getProjectBySlug, getPublishedProjects } from "@/data/queries";
import { dict } from "@/lib/dictionaries";
import { formatMonth } from "@/lib/format-month";
import { LANGS } from "@/lib/i18n";
import { fallbackLang, pickLocalized } from "@/lib/localized";
import { routeParams } from "@/lib/route-params";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Projects published after the build render on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return LANGS.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await routeParams(params);
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: pickLocalized(project.title, lang).text,
    description: pickLocalized(project.summary, lang).text || undefined,
  };
}

// Admin-written URLs: only http(s) becomes a link.
const httpUrl = (u: string | null) => (u && /^https?:\/\//i.test(u) ? u : null);

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";
const LABEL = "text-xs font-medium uppercase tracking-wide text-fg-muted";

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await routeParams(params);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const t = dict(lang);
  const title = pickLocalized(project.title, lang);
  const category = pickLocalized(project.category, lang);
  const summary = pickLocalized(project.summary, lang);
  const body = pickLocalized(project.body, lang);
  const cover = projectCover(project);
  const coverAlt = pickLocalized(project.images.find((i) => i.url === cover)?.alt, lang);
  const gallery = project.images.filter((i) => i.url !== cover);
  const since = project.startedAt ? formatMonth(project.startedAt, lang) : null;
  const site = httpUrl(project.link);
  const repo = httpUrl(project.repoUrl);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <Link
        href="/projects"
        className={`mb-4 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-fg-muted hover:text-fg ${FOCUS}`}
      >
        <ArrowLeft aria-hidden className="size-4" />
        {t.common.back}
      </Link>

      <article>
        <Glass as="header" className="overflow-hidden">
          {cover ? (
            <div className="relative aspect-[16/9] sm:aspect-[21/9]">
              {/* Container is max-w-6xl minus the px-4 gutters. */}
              <Image
                src={cover}
                alt={coverAlt.text}
                lang={fallbackLang(coverAlt)}
                fill
                preload
                sizes="(min-width: 1152px) 1120px, calc(100vw - 2rem)"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-white/35 to-white/5 dark:from-white/10 dark:to-transparent">
              <FolderGit2 aria-hidden className="size-12 text-fg-muted" strokeWidth={1.5} />
            </div>
          )}
          <div className="flex flex-col items-start gap-2 p-6 sm:p-10">
            {category.text && (
              <p lang={fallbackLang(category)} className="text-sm font-medium text-fg-muted">
                {category.text}
              </p>
            )}
            {/* One badge per fallback language in this group: later items skip a language already badged. */}
            <FallbackBadge from={category.fallbackFrom} lang={lang} />
            <h1
              lang={fallbackLang(title)}
              className="text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl"
            >
              {title.text}
            </h1>
            <FallbackBadge from={title.fallbackFrom === category.fallbackFrom ? null : title.fallbackFrom} lang={lang} />
            {summary.text && (
              <p lang={fallbackLang(summary)} className="mt-2 max-w-3xl text-lg leading-relaxed text-fg-muted text-pretty">
                {summary.text}
              </p>
            )}
            <FallbackBadge
              from={[category.fallbackFrom, title.fallbackFrom].includes(summary.fallbackFrom) ? null : summary.fallbackFrom}
              lang={lang}
            />
          </div>
        </Glass>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="flex min-w-0 flex-col gap-4">
            {gallery.length > 0 && (
              // Focusable so keyboard users can scroll it.
              <div
                role="region"
                aria-label={t.projects.gallery}
                tabIndex={0}
                className={`-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 ${FOCUS}`}
              >
                {gallery.map((img) => {
                  const alt = pickLocalized(img.alt, lang);
                  return (
                    <Glass key={img.id} className="relative h-48 w-72 shrink-0 snap-start overflow-hidden sm:h-64 sm:w-96">
                      <Image
                        src={img.url}
                        alt={alt.text}
                        lang={fallbackLang(alt)}
                        fill
                        sizes="(min-width: 640px) 384px, 288px"
                        className="object-cover"
                      />
                    </Glass>
                  );
                })}
              </div>
            )}

            {body.text && (
              <Glass as="section" className="p-6 sm:p-8">
                <FallbackBadge from={body.fallbackFrom} lang={lang} className="mb-4" />
                <div lang={fallbackLang(body)}>
                  <Markdown source={body.text} />
                </div>
              </Glass>
            )}
          </div>

          <Glass as="aside" className="p-6">
            <dl className="flex flex-col gap-5">
              <div>
                <dt className={LABEL}>{t.projects.statusLabel}</dt>
                <dd className="mt-1 font-medium">{t.projects.status[project.status]}</dd>
              </div>
              {since && (
                <div>
                  <dt className={LABEL}>{t.projects.since}</dt>
                  <dd className="mt-1 font-medium">{since}</dd>
                </div>
              )}
              {project.technologies.length > 0 && (
                <div>
                  <dt className={LABEL}>{t.projects.tech}</dt>
                  <dd>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full bg-[var(--glass-hover)] px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-white/40 dark:ring-white/15"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
            {(site || repo) && (
              <div className="mt-6 flex flex-col gap-2">
                {site && (
                  <a
                    href={site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:text-neutral-950 ${FOCUS}`}
                  >
                    {t.projects.visit}
                    <ExternalLink aria-hidden className="size-4" />
                  </a>
                )}
                {repo && (
                  <a
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[var(--glass-hover)] px-5 py-2.5 text-sm font-semibold ring-1 ring-inset ring-white/50 transition-colors hover:bg-white/40 dark:ring-white/20 dark:hover:bg-white/15 ${FOCUS}`}
                  >
                    {t.projects.repo}
                    <Code aria-hidden className="size-4" />
                  </a>
                )}
              </div>
            )}
          </Glass>
        </div>
      </article>
    </main>
  );
}
