import { describe, expect, it } from "vitest";
import { projectCover } from "./project-cover";
import type { ProjectImage } from "./types";

const img = (id: string, position: number) => ({ id, url: `/${id}.png`, position }) as ProjectImage;

describe("projectCover", () => {
  it("uses the chosen cover", () =>
    expect(projectCover({ coverImageId: "b", images: [img("a", 0), img("b", 1)] })).toBe("/b.png"));
  it("falls back to first by position when cover is missing", () =>
    expect(projectCover({ coverImageId: "gone", images: [img("b", 1), img("a", 0)] })).toBe("/a.png"));
  it("null when no images", () => expect(projectCover({ coverImageId: null, images: [] })).toBeNull());
});
