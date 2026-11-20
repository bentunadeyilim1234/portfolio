import type { ProjectWithImages, PostSummary, SiteSettings, Skill } from "@/data/types";

export type PageKey = "home" | "projects" | "blog" | "about" | "contact" | "guestbook";
export type BlockSize = "small" | "medium" | "large" | "full";
// Widget types join this union in Plan 6 (as BlockType).
export type ContentBlockType = "hero" | "markdown" | "project" | "post-list" | "skills" | "languages" | "contact";

export type Block = {
  id: string;
  page: PageKey;
  position: number;
  type: ContentBlockType;
  size: BlockSize;
  config: Record<string, unknown>;
};

export type BlockCtx = {
  projects: Map<string, ProjectWithImages>;
  posts: PostSummary[];
  skills: Skill[];
  settings: SiteSettings;
};
