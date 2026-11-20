import { describe, expect, it } from "vitest";
import { formatMonth } from "./format-month";

describe("formatMonth", () => {
  it("formats YYYY-MM in the page language", () => {
    expect(formatMonth("2024-03", "en")).toBe("March 2024");
    expect(formatMonth("2024-03", "tr")).toBe("Mart 2024");
  });
  it("returns anything else untouched", () => {
    for (const bad of ["", "2024", "2024-13", "2024-00", "2024-3", "March 2024"]) expect(formatMonth(bad, "en")).toBe(bad);
  });
});
