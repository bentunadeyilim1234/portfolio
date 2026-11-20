import { FolderGit2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FallbackBadge } from "@/components/FallbackBadge";
import { Glass } from "@/components/glass/Glass";
import { projectCover } from "@/data/project-cover";
import type { ProjectWithImages } from "@/data/types";
import { dict } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";
import { pickLocalized } from "@/lib/localized";
import type { BlockSize } from "../types";

export type ProjectConfig = { projectId: string };

// Rendered cover widths per size; assumes the grid tops out around 1150px (2 cols on mobile, 4 from lg).
const SIZES: Record<BlockSize, string> = {
  small: "(min-width: 1024px) 290px, 50vw",
  medium: "(min-width: 1024px) 290px, 50vw",
  large: "(min-width: 1024px) 580px, 100vw",
  full: "(min-width: 1024px) 460px, 40vw",
};

// small: cover fills the square, title over a scrim. medium/full: cover left, text right. large: cover on top.
const ROOT: Record<BlockSize, string> = {
  small: "block h-full",
  medium: "flex h-full",
  large: "flex h-full flex-col",
  full: "flex",
};

const COVER: Record<BlockSize, string> = {
  small: "absolute inset-0",
  medium: "relative aspect-square h-full shrink-0",
  large: "relative h-1/2 shrink-0 sm:h-3/5",
  full: "relative min-h-40 w-2/5 shrink-0 sm:min-h-56",
};

export function ProjectCard({ project, size, lang }: { project: ProjectWithImages; size: BlockSize; lang: Lang }) {
  const title = pickLocalized(project.title, lang);
  const summary = pickLocalized(project.summary, lang);
  const cover = projectCover(project);

  return (
    <Glass className="group h-full overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className={`${ROOT[size]} relative rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-fg`}
      >
        <div className={`${COVER[size]} overflow-hidden`}>
          {/* alt="": decorative, the link is already named by the title. */}
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes={SIZES[size]}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/35 to-white/5 dark:from-white/10 dark:to-transparent">
              <FolderGit2 aria-hidden className="size-10 text-fg-muted" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {size === "small" ? (
          // Scrim + dark badge chip keep title and badge readable on any cover at ~170px.
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 pt-10">
            <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">{title.text}</h2>
            <FallbackBadge from={title.fallbackFrom} lang={lang} className="mt-1 bg-black/55 text-white" />
          </div>
        ) : (
          // Fixed-height cells: everything above the summary is shrink-0 and the summary goes last,
          // so overflow only ever trims summary lines, never a title or its fallback badge.
          <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start gap-1.5 overflow-hidden p-3 sm:gap-2 sm:p-5">
            <span className="shrink-0 rounded-full bg-[var(--glass-hover)] px-2.5 py-0.5 text-xs font-medium text-fg-muted ring-1 ring-inset ring-white/40 dark:ring-white/15">
              {dict(lang).projects.status[project.status]}
            </span>
            <h2 className={`${size === "full" ? "" : "line-clamp-2"} shrink-0 text-base font-semibold leading-snug tracking-tight sm:text-xl`}>
              {title.text}
            </h2>
            <FallbackBadge from={title.fallbackFrom} lang={lang} className="shrink-0" />
            {summary.text && (
              // Medium on phones has no room for a summary; its badge goes with it.
              <div className={`min-h-0 flex-col items-start gap-1.5 sm:gap-2 ${size === "medium" ? "hidden sm:flex" : "flex"}`}>
                {/* Same source language as the title: the title's badge already says it. */}
                {summary.fallbackFrom !== title.fallbackFrom && (
                  <FallbackBadge from={summary.fallbackFrom} lang={lang} className="shrink-0" />
                )}
                <p
                  className={`min-h-0 text-sm leading-relaxed text-fg-muted ${size === "full" ? "" : "line-clamp-2 sm:line-clamp-3"}`}
                >
                  {summary.text}
                </p>
              </div>
            )}
          </div>
        )}
      </Link>
    </Glass>
  );
}
