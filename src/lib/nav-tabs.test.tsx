import { Circle, icons } from "lucide-react";
import { describe, expect, it } from "vitest";
import type { NavTab } from "@/data/types";
import { navIcon, resolveTabs } from "./nav-tabs";

const tab = (page: string, extra: Partial<NavTab> = {}) =>
  ({ page, icon: "House", label: { en: page.toUpperCase() }, visible: true, ...extra }) as NavTab;

describe("navIcon", () => {
  it("resolves a lucide name", () => expect(navIcon("Briefcase").type).toBe(icons.Briefcase));
  it("unknown name falls back to Circle", () => expect(navIcon("NoSuchIcon").type).toBe(Circle));
  it("prototype keys fall back to Circle", () => expect(navIcon("constructor").type).toBe(Circle));
  it("non-string falls back to Circle", () => expect(navIcon(42).type).toBe(Circle));
});

describe("resolveTabs", () => {
  it("keeps visible known pages in order, first duplicate wins", () => {
    const nav = [tab("blog"), tab("home"), tab("blog", { label: { en: "Dup" } }), tab("nope"), tab("about", { visible: false })];
    expect(resolveTabs(nav, "en").map((t) => [t.page, t.label])).toEqual([
      ["blog", "BLOG"],
      ["home", "HOME"],
    ]);
  });
  it("skips null entries", () => expect(resolveTabs([null as unknown as NavTab, tab("home")], "en")).toHaveLength(1));
  it("falls back to the other language, then the page key", () => {
    const nav = [tab("home", { label: { tr: "Ana" } }), tab("blog", { label: {} })];
    expect(resolveTabs(nav, "en").map((t) => t.label)).toEqual(["Ana", "blog"]);
    expect(resolveTabs(nav, "en").map((t) => t.lang)).toEqual(["tr", undefined]);
  });
});
