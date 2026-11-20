import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { ContactCard, type ContactConfig } from "./content/ContactCard";
import { Hero, type HeroConfig } from "./content/Hero";
import { Languages } from "./content/Languages";
import type { LevelsConfig } from "./content/Levels";
import { MarkdownBlock, type MarkdownConfig } from "./content/MarkdownBlock";
import { PostList, type PostListConfig } from "./content/PostList";
import { ProjectCard, type ProjectConfig } from "./content/ProjectCard";
import { Skills } from "./content/Skills";
import { effectiveSize } from "./grid";
import type { Block, BlockCtx, ContentBlockType } from "./types";

// Plain render functions, not components: BlockGrid calls them directly, so no hooks inside,
// and "nothing to show" must be a direct null so the grid skips the cell wrapper.
export type BlockRenderer = (p: { block: Block; lang: Lang; ctx: BlockCtx }) => ReactNode;

// Types not listed here (e.g. a deleted widget) render nothing.
export const registry: Record<ContentBlockType, BlockRenderer> = {
  hero: ({ block, lang }) => <Hero config={block.config as HeroConfig} lang={lang} />,
  markdown: ({ block, lang }) => <MarkdownBlock config={block.config as MarkdownConfig} lang={lang} />,
  project: ({ block, lang, ctx }) => {
    const p = ctx.projects.get((block.config as ProjectConfig).projectId);
    return p?.published ? <ProjectCard project={p} size={effectiveSize(block)} lang={lang} /> : null;
  },
  "post-list": ({ block, lang, ctx }) => {
    const { limit } = block.config as PostListConfig;
    return <PostList posts={limit ? ctx.posts.slice(0, limit) : ctx.posts} lang={lang} />;
  },
  skills: ({ block, lang, ctx }) => <Skills config={block.config as LevelsConfig} skills={ctx.skills} lang={lang} />,
  languages: ({ block, lang, ctx }) => (
    <Languages config={block.config as LevelsConfig} skills={ctx.skills} lang={lang} />
  ),
  contact: ({ block, lang, ctx }) =>
    ctx.settings.email ? (
      <ContactCard config={block.config as ContactConfig} email={ctx.settings.email} lang={lang} />
    ) : null,
};
