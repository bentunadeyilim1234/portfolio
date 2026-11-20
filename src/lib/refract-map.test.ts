import { describe, expect, it } from "vitest";
import { pillMap } from "./refract-map";

const W = 200;
const H = 50;
const map = pillMap(W, H, 16);
const px = (x: number, y: number) => Array.from(map.slice((y * W + x) * 4, (y * W + x) * 4 + 4));

describe("pillMap", () => {
  it("is w*h RGBA", () => expect(map.length).toBe(W * H * 4));
  it("leaves the middle undisplaced", () => expect(px(100, 25)).toEqual([128, 128, 128, 255]));
  it("leaves pixels just past the 16px band undisplaced", () => expect(px(100, 17)).toEqual([128, 128, 128, 255]));
  it("top edge pushes down (G high), no x shift", () => {
    const [r, g] = px(100, 0);
    expect(r).toBe(128);
    expect(g).toBeGreaterThan(230);
  });
  it("bottom edge pushes up (G low)", () => expect(px(100, H - 1)[1]).toBeLessThan(30));
  it("left cap pushes right (R high), right cap pushes left (R low)", () => {
    expect(px(0, 25)[0]).toBeGreaterThan(230);
    expect(px(W - 1, 25)[0]).toBeLessThan(30);
  });
  it("rim band is the same in px on the round ends as on the long sides", () => {
    // 4 px in from the left end and 4 px in from the top edge give the same push.
    expect(px(4, 25)[0]).toBeGreaterThan(128);
    expect(px(4, 25)[0]).toBe(px(100, 4)[1]);
  });
});
