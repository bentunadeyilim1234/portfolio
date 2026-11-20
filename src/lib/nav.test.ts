import { describe, expect, it } from "vitest";
import { activePage, isPageKey, pageHref } from "./nav";

describe("activePage", () => {
  it("root is home", () => expect(activePage("/")).toBe("home"));
  it("first segment", () => expect(activePage("/projects")).toBe("projects"));
  it("detail page maps to its list", () => expect(activePage("/projects/some-slug")).toBe("projects"));
  it("trailing slash", () => expect(activePage("/blog/")).toBe("blog"));
  it("strips a lang prefix", () => expect(activePage("/tr/blog/post")).toBe("blog"));
  it("bare lang prefix is home", () => expect(activePage("/en")).toBe("home"));
});

describe("pageHref / isPageKey", () => {
  it("home is root", () => expect(pageHref("home")).toBe("/"));
  it("others are prefixed", () => expect(pageHref("contact")).toBe("/contact"));
  it("rejects unknown pages", () => {
    expect(isPageKey("about")).toBe(true);
    expect(isPageKey("/evil.com")).toBe(false);
    expect(isPageKey(undefined)).toBe(false);
  });
});
