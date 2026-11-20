import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import type { Block, BlockCtx, ContentBlockType } from "./types";

// Plain render functions, not components: BlockGrid calls them directly, so no hooks inside.
export type BlockRenderer = (p: { block: Block; lang: Lang; ctx: BlockCtx }) => ReactNode;

const todo: BlockRenderer = () => null;

// Task 6 swaps each stub body for the real block. Types not listed here (e.g. a deleted widget) render nothing.
export const registry: Record<ContentBlockType, BlockRenderer> = {
  hero: todo,
  markdown: todo,
  project: todo,
  "post-list": todo,
  skills: todo,
  languages: todo,
  contact: todo,
};
