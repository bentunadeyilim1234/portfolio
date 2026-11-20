import type { PageKey } from "@/blocks/types";
import type { Localized } from "@/lib/localized";
import type { posts, projectImages, projects, skills } from "@/db/schema";

export type Project = typeof projects.$inferSelect;
export type ProjectImage = typeof projectImages.$inferSelect;
export type ProjectWithImages = Project & { images: ProjectImage[] };

export type Post = typeof posts.$inferSelect;
export type PostSummary = Pick<Post, "id" | "slug" | "title" | "excerpt" | "coverUrl" | "publishedAt">;

export type Skill = typeof skills.$inferSelect;

export type NavTab = { page: PageKey; icon: string; label: Localized; visible: boolean };
export type SiteSettings = {
  nav: NavTab[];
  email: string;
  ownerName: string;
  socials: { kind: string; url: string }[];
};
