import type { Lang } from "@/lib/i18n";
import { effectiveSize, sizeClass } from "./grid";
import { registry } from "./registry";
import type { Block, BlockCtx } from "./types";

// Rows are content-sized so full-width blocks hug their content. --cell (one square cell, from the container
// width in cqw, hence the @container wrapper) only fixes the height of medium blocks; small/large use aspect-square.
// Gap is 1rem (gap-4): 2 cols -> (100cqw - 1rem) / 2, 4 cols -> (100cqw - 3rem) / 4. Keep in sync with grid-cols.
const GRID =
  "grid grid-cols-2 lg:grid-cols-4 gap-4 " +
  "[--cell:calc((100cqw_-_1rem)/2)] lg:[--cell:calc((100cqw_-_3rem)/4)]";

export function BlockGrid({ blocks, lang, ctx }: { blocks: Block[]; lang: Lang; ctx: BlockCtx }) {
  return (
    <div className="@container w-full">
      <div className={GRID}>
        {[...blocks]
          .sort((a, b) => a.position - b.position)
          .map((block) => {
            // hasOwn: a stale type like "constructor" must not hit Object.prototype.
            const render = Object.hasOwn(registry, block.type) ? registry[block.type] : undefined;
            const node = render?.({ block, lang, ctx });
            // No wrapper for nothing: an empty cell would still open a row and its gap.
            if (node == null || node === false) return null;
            return (
              <div key={block.id} className={sizeClass(effectiveSize(block))}>
                {node}
              </div>
            );
          })}
      </div>
    </div>
  );
}
