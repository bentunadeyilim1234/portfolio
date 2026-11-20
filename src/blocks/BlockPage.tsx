import { getPageBlocks, loadBlockCtx } from "@/data/queries";
import type { Lang } from "@/lib/i18n";
import { BlockGrid } from "./BlockGrid";
import type { PageKey } from "./types";

// The whole body of a block-driven public page.
export async function BlockPage({ page, lang }: { page: PageKey; lang: Lang }) {
  const blocks = await getPageBlocks(page);
  const ctx = await loadBlockCtx(blocks);
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <BlockGrid blocks={blocks} lang={lang} ctx={ctx} />
    </main>
  );
}
