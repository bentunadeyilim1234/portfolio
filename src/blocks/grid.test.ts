import { describe, expect, it } from "vitest";
import { effectiveSize, sizeClass } from "./grid";

describe("grid sizing", () => {
  it("only project is sizeable", () => {
    expect(effectiveSize({ type: "project", size: "large" })).toBe("large");
    expect(effectiveSize({ type: "markdown", size: "small" })).toBe("full");
  });
  it("sizeClass maps sizes", () => {
    expect(sizeClass("small")).toContain("col-span-1");
    expect(sizeClass("full")).toBe("col-span-full");
  });
});

describe("row sizing", () => {
  // Rows are content-sized (no min row height), so medium pins its own one-cell height.
  it("medium has an explicit one-cell height", () => {
    expect(sizeClass("medium")).toContain("h-[var(--cell)]");
  });
});
