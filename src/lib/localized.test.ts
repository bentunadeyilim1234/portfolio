import { describe, expect, it } from "vitest";
import { fallbackLang, pickLocalized } from "./localized";

describe("pickLocalized", () => {
  it("returns requested language", () =>
    expect(pickLocalized({ en: "Hi", tr: "Selam" }, "tr")).toEqual({ text: "Selam", fallbackFrom: null }));
  it("falls back and reports source", () =>
    expect(pickLocalized({ tr: "Selam" }, "en")).toEqual({ text: "Selam", fallbackFrom: "tr" }));
  it("treats empty string as missing", () =>
    expect(pickLocalized({ en: "", tr: "Selam" }, "en")).toEqual({ text: "Selam", fallbackFrom: "tr" }));
  it("both missing", () => expect(pickLocalized({}, "en")).toEqual({ text: "", fallbackFrom: null }));
  it("null value", () => expect(pickLocalized(null, "tr")).toEqual({ text: "", fallbackFrom: null }));
});

describe("fallbackLang", () => {
  it("is the source language for fallback text", () => expect(fallbackLang(pickLocalized({ tr: "Selam" }, "en"))).toBe("tr"));
  it("is undefined for own-language or empty text", () => {
    expect(fallbackLang(pickLocalized({ en: "Hi" }, "en"))).toBeUndefined();
    expect(fallbackLang(pickLocalized({}, "en"))).toBeUndefined();
  });
});
