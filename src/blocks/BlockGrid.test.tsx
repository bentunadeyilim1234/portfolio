import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BlockGrid } from "./BlockGrid";
import type { Block, BlockCtx } from "./types";

vi.mock("./registry", () => ({
  registry: {
    markdown: ({ block }: { block: Block }) => `md-${block.id}`,
    project: ({ block }: { block: Block }) => `pr-${block.id}`,
    hero: () => null,
  },
}));

const b = (id: string, position: number, type: string, size: Block["size"] = "full"): Block =>
  ({ id, page: "home", position, type, size, config: {} }) as Block;
const html = (blocks: Block[]) => renderToStaticMarkup(<BlockGrid blocks={blocks} lang="en" ctx={{} as BlockCtx} />);

describe("BlockGrid", () => {
  it("orders by position and applies size classes", () => {
    const out = html([b("b", 2, "markdown", "small"), b("a", 1, "project", "small")]);
    expect(out.indexOf("pr-a")).toBeLessThan(out.indexOf("md-b"));
    expect(out).toContain("col-span-1 row-span-1 aspect-square"); // project keeps its size
    expect(out).toContain("col-span-full"); // markdown is forced to full
  });
  it("renders nothing, wrapper included, for unknown or empty blocks", () => {
    const out = html([b("x", 1, "gone-widget"), b("y", 2, "constructor"), b("z", 3, "hero")]);
    expect(out).not.toContain("col-span");
  });
});
