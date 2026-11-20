import type { Block, BlockSize, ContentBlockType } from "./types";

// Every other content block is always full width.
export const SIZEABLE: ReadonlySet<ContentBlockType> = new Set(["project"]);

export function effectiveSize(b: Pick<Block, "type" | "size">): BlockSize {
  return SIZEABLE.has(b.type) ? b.size : "full";
}

export function sizeClass(s: BlockSize): string {
  switch (s) {
    case "small":
      return "col-span-1 row-span-1 aspect-square";
    case "medium":
      return "col-span-2 row-span-1 h-[var(--cell)]";
    case "large":
      return "col-span-2 row-span-2 aspect-square";
    case "full":
      return "col-span-full";
  }
}
