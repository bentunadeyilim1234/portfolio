import { describe, expect, it, vi } from "vitest";

// Stand-in for the drizzle chain select().from().where().orderBy(); the real db throws without DATABASE_URL.
const rows = vi.hoisted(() => ({ value: [] as unknown[] }));
vi.mock("@/db", () => ({
  db: { select: () => ({ from: () => ({ where: () => ({ orderBy: async () => rows.value }) }) }) },
}));

import { getPageBlocks } from "./queries";

const row = (id: string, config: unknown) => ({ id, page: "home", position: 0, type: "markdown", size: "full", config });

describe("getPageBlocks", () => {
  it("normalises a non-object config to {}", async () => {
    rows.value = [row("a", null), row("b", [1, 2]), row("c", "x"), row("d", 3)];
    expect((await getPageBlocks("home")).map((b) => b.config)).toEqual([{}, {}, {}, {}]);
  });
  it("keeps an object config as is", async () => {
    rows.value = [row("a", { body: { en: "hi" } })];
    expect((await getPageBlocks("home"))[0].config).toEqual({ body: { en: "hi" } });
  });
});
