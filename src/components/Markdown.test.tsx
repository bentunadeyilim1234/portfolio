import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Markdown } from "./Markdown";

const html = (source: string) => renderToStaticMarkup(<Markdown source={source} />);

describe("Markdown", () => {
  it("renders GFM", () => {
    const out = html("| a |\n|---|\n| 1 |\n\n- [x] done");
    expect(out).toContain("<table>");
    expect(out).toContain('type="checkbox"');
  });
  it("strips scripts, raw html and javascript: links", () => {
    const out = html('<script>alert(1)</script><img src=x onerror="alert(1)">\n\n[hi](javascript:alert(1))');
    expect(out).not.toMatch(/<script|onerror|javascript:/i);
    expect(out).toContain("hi");
  });
});
