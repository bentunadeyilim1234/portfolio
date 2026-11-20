import { describe, expect, it } from "vitest";
import { dict } from "./dictionaries";
import { isLang, LANGS, negotiateLang, resolveLang } from "./i18n";

describe("i18n", () => {
  it.each([
    ["tr-TR,tr;q=0.9,en;q=0.8", "tr"],
    ["en-US,tr;q=0.9", "en"],
    ["de-DE,tr;q=0.5", "tr"],
    ["TR", "tr"],
    ["de-DE", "en"],
    ["", "en"],
    [null, "en"],
    [";;;q=abc,,", "en"],
  ])("negotiateLang(%j) -> %s", (h, want) => expect(negotiateLang(h)).toBe(want));

  it("resolveLang prefers a valid cookie", () => expect(resolveLang("tr", "en-US")).toBe("tr"));

  it.each(["de", "", "../x", undefined])("resolveLang ignores invalid cookie %j", (c) =>
    expect(resolveLang(c, "tr-TR")).toBe("tr"));

  it("isLang only accepts supported languages", () => {
    expect(LANGS).toEqual(["en", "tr"]);
    expect(isLang("tr")).toBe(true);
    expect(isLang("de")).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });

  it("dict exposes the required copy", () => {
    expect(dict("en").onlyIn.tr).toBe("Only available in Turkish");
    expect(dict("tr").onlyIn.en).toBe("Yalnızca İngilizce mevcut");
  });
});
