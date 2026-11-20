import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ProjectWithImages } from "@/data/types";
import { registry } from "./registry";
import type { Block, BlockCtx, ContentBlockType } from "./types";

const project = (over: Partial<ProjectWithImages> = {}) =>
  ({
    id: "p1",
    slug: "demo",
    title: { tr: "Demo TR" },
    summary: { en: "Sum" },
    status: "completed",
    coverImageId: null,
    images: [],
    published: true,
    ...over,
  }) as ProjectWithImages;

const ctx = (over: Partial<BlockCtx> = {}): BlockCtx => ({
  projects: new Map(),
  posts: [],
  skills: [],
  settings: { nav: [], email: "", ownerName: "", socials: [] },
  ...over,
});
const block = (type: ContentBlockType, config: Record<string, unknown>, size: Block["size"] = "full"): Block => ({
  id: "b",
  page: "home",
  position: 0,
  type,
  size,
  config,
});
const render = (b: Block, c: BlockCtx = ctx()) => registry[b.type]({ block: b, lang: "en", ctx: c });
const html = (b: Block, c?: BlockCtx) => renderToStaticMarkup(<>{render(b, c)}</>);

describe("registry", () => {
  it("project: null (not an element) when missing or unpublished", () => {
    expect(render(block("project", { projectId: "p1" }))).toBeNull();
    const c = ctx({ projects: new Map([["p1", project({ published: false })]]) });
    expect(render(block("project", { projectId: "p1" }), c)).toBeNull();
  });

  it("project: links to the slug, shows fallback badge, placeholder icon without cover", () => {
    const c = ctx({ projects: new Map([["p1", project()]]) });
    const out = html(block("project", { projectId: "p1" }, "medium"), c);
    expect(out).toContain('href="/projects/demo"');
    expect(out).toContain("Demo TR");
    expect(out).toContain("Only available in Turkish");
    expect(out).toContain("Completed");
    expect(out).toContain("<svg");
  });

  it("project small: cover and title only, no status or summary", () => {
    const c = ctx({ projects: new Map([["p1", project()]]) });
    const out = html(block("project", { projectId: "p1" }, "small"), c);
    expect(out).toContain("Demo TR");
    expect(out).not.toContain("Completed");
    expect(out).not.toContain("Sum");
  });

  it("hero: CTA links go to / for home, /{page} otherwise", () => {
    const out = html(
      block("hero", {
        title: { en: "Ali" },
        tagline: { en: "Hi" },
        ctas: [
          { label: { en: "Home" }, page: "home" },
          { label: { en: "Work" }, page: "projects" },
        ],
      }),
    );
    expect(out).toContain("<h1");
    expect(out).toContain('href="/"');
    expect(out).toContain('href="/projects"');
  });

  it("hero: survives a non-array ctas and skips null / page-less items", () => {
    const hero = (ctas: unknown) => html(block("hero", { title: { en: "Ali" }, tagline: {}, ctas }));
    expect(hero("oops")).not.toContain("<a");
    const out = hero([null, { label: { en: "x" } }, { label: { en: "Blog" }, page: "blog" }]);
    expect(out.match(/<a /g)).toHaveLength(1);
    expect(out).toContain('href="/blog"');
  });

  it("project: cover image is decorative (alt empty), link named by the title", () => {
    const p = project({ coverImageId: "i", images: [{ id: "i", url: "/c.png", position: 0 } as never] });
    const out = html(block("project", { projectId: "p1" }, "large"), ctx({ projects: new Map([["p1", p]]) }));
    expect(out).toContain('alt=""');
  });

  it("post-list: empty message, and limit is applied", () => {
    expect(html(block("post-list", {}))).toContain("No posts yet.");
    const post = (id: string) => ({ id, slug: id, title: { en: id }, excerpt: {}, coverUrl: null, publishedAt: null });
    const out = html(block("post-list", { limit: 1 }), ctx({ posts: [post("one"), post("two")] }));
    expect(out).toContain('href="/blog/one"');
    expect(out).not.toContain("/blog/two");
  });

  it("skills / languages split by kind", () => {
    const s = (id: string, kind: "tech" | "language") =>
      ({ id, kind, name: { en: id }, level: { en: "x" }, percentage: 50, position: 0 }) as const;
    const c = ctx({ skills: [s("TS", "tech"), s("French", "language")] });
    const tech = html(block("skills", { title: { en: "Skills" } }), c);
    expect(tech).toContain("TS");
    expect(tech).not.toContain("French");
    expect(html(block("languages", { title: { en: "Langs" } }), c)).toContain("French");
  });

  it("contact: mailto link, null without an email", () => {
    expect(render(block("contact", { title: { en: "Hi" } }))).toBeNull();
    const c = ctx({ settings: { nav: [], email: "a@b.co", ownerName: "", socials: [] } });
    const out = html(block("contact", { title: { en: "Hi" } }), c);
    expect(out).toContain('href="mailto:a@b.co"');
    expect(out).toContain("Email me");
  });
});
