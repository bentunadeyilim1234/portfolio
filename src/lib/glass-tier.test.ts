import { describe, expect, it } from "vitest";
import { detectGlassTier, glassTierScript } from "./glass-tier";

describe("detectGlassTier", () => {
  const base = { isChromium: true, cores: 8, memoryGb: 8, reducedTransparency: false, reducedMotion: false, supportsBackdrop: true };
  it("strong chromium -> refract", () => expect(detectGlassTier(base)).toBe("refract"));
  it("non-chromium -> blur", () => expect(detectGlassTier({ ...base, isChromium: false })).toBe("blur"));
  it("weak cpu chromium -> blur", () => expect(detectGlassTier({ ...base, cores: 4 })).toBe("blur"));
  it("low memory -> blur", () => expect(detectGlassTier({ ...base, memoryGb: 2 })).toBe("blur"));
  it("unknown memory does not block refract", () => expect(detectGlassTier({ ...base, memoryGb: null })).toBe("refract"));
  it("reduced motion -> blur", () => expect(detectGlassTier({ ...base, reducedMotion: true })).toBe("blur"));
  it("reduced transparency -> solid", () => expect(detectGlassTier({ ...base, reducedTransparency: true })).toBe("solid"));
  it("no backdrop-filter -> solid", () => expect(detectGlassTier({ ...base, isChromium: false, supportsBackdrop: false })).toBe("solid"));
  it("very weak device -> solid", () => expect(detectGlassTier({ ...base, isChromium: false, cores: 2, memoryGb: 1 })).toBe("solid"));
});

describe("glassTierScript", () => {
  type Fake = { chrome?: boolean; brands?: { brand: string }[]; cores?: number; memory?: number; media?: string[]; supports?: string[] };

  // Runs the inline script string against a fake browser and returns what it wrote to <html data-glass>.
  function run(f: Fake) {
    const dataset: Record<string, string> = {};
    const window = { chrome: f.chrome ? {} : undefined, matchMedia: (q: string) => ({ matches: (f.media ?? []).includes(q) }) };
    const navigator = { hardwareConcurrency: f.cores, deviceMemory: f.memory, userAgentData: f.brands && { brands: f.brands } };
    const document = { documentElement: { dataset } };
    const CSS = { supports: (p: string) => (f.supports ?? []).includes(p) };
    new Function("window", "navigator", "document", "CSS", glassTierScript)(window, navigator, document, CSS);
    return dataset.glass;
  }

  it("embeds detectGlassTier source instead of duplicating it", () => {
    expect(glassTierScript).toContain(detectGlassTier.toString());
  });
  it("strong chromium (window.chrome) -> refract", () => {
    expect(run({ chrome: true, cores: 8, memory: 8, supports: ["backdrop-filter"] })).toBe("refract");
  });
  it("chromium via userAgentData brands, unknown memory -> refract", () => {
    expect(run({ brands: [{ brand: "Chromium" }], cores: 8, supports: ["backdrop-filter"] })).toBe("refract");
  });
  it("safari with prefixed backdrop -> blur", () => {
    expect(run({ cores: 8, supports: ["-webkit-backdrop-filter"] })).toBe("blur");
  });
  it("reduced transparency -> solid", () => {
    expect(run({ chrome: true, cores: 8, supports: ["backdrop-filter"], media: ["(prefers-reduced-transparency: reduce)"] })).toBe("solid");
  });
  it("no backdrop support -> solid", () => {
    expect(run({ chrome: true, cores: 8 })).toBe("solid");
  });
});
