import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectWithImages } from "@/data/types";

const found = vi.hoisted(() => ({ value: null as unknown }));
vi.mock("@/data/queries", () => ({ getProjectBySlug: async () => found.value, getPublishedProjects: async () => [] }));

import ProjectPage from "./page";

const img = (id: string, position: number, url: string) => ({ id, projectId: "p1", url, alt: { en: `alt ${id}` }, position });
const project = (over: Partial<ProjectWithImages> = {}) =>
  ({
    id: "p1",
    slug: "demo",
    title: { en: "Demo" },
    category: {},
    summary: {},
    body: { en: "Hello **world**" },
    status: "in_progress",
    startedAt: "2024-03",
    technologies: ["Next.js", "Postgres"],
    link: "https://example.com",
    repoUrl: "javascript:alert(1)",
    coverImageId: "c",
    published: true,
    images: [img("c", 0, "/cover.png"), img("g1", 1, "/one.png"), img("g2", 2, "/two.png")],
    ...over,
  }) as ProjectWithImages;

const render = async () =>
  renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ lang: "en", slug: "demo" }) }));

describe("project page", () => {
  beforeEach(() => {
    found.value = project();
  });

  it("renders the side panel and keeps the cover out of the gallery", async () => {
    const html = await render();
    expect(html).toContain("In progress");
    expect(html).toContain("March 2024");
    expect(html).toContain("Postgres");
    expect(html).toContain("<strong>world</strong>");
    const gallery = html.split('role="region"')[1].split("</div></div>")[0];
    expect(gallery.match(/<img/g)).toHaveLength(2);
    expect(gallery).not.toContain("cover.png");
  });

  it("links out only over http(s), with noopener", async () => {
    const html = await render();
    expect(html).toContain('href="https://example.com" target="_blank" rel="noopener noreferrer"');
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("Source code");
  });

  it("404s when the project is missing or unpublished", async () => {
    found.value = null;
    await expect(render()).rejects.toThrow();
  });
});
