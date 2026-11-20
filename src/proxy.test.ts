import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "./proxy";

const req = (path: string, headers: Record<string, string> = {}) =>
  new NextRequest(`http://localhost:3000${path}`, { headers });

describe("proxy", () => {
  it("rewrites to the negotiated language and sets the lang cookie", () => {
    const res = proxy(req("/blog?x=1", { "accept-language": "tr-TR,tr;q=0.9" }));
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/tr/blog?x=1");
    expect(res.cookies.get("lang")?.value).toBe("tr");
    expect(res.cookies.get("lang")?.sameSite).toBe("lax");
    expect(res.cookies.get("lang")?.maxAge).toBe(31536000);
  });

  it("uses a valid cookie over accept-language, without re-setting it", () => {
    const res = proxy(req("/", { cookie: "lang=tr", "accept-language": "en-US" }));
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/tr");
    expect(res.cookies.get("lang")).toBeUndefined();
  });

  it("replaces an invalid cookie", () => {
    const res = proxy(req("/about", { cookie: "lang=de", "accept-language": "de" }));
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/en/about");
    expect(res.cookies.get("lang")?.value).toBe("en");
  });

  it.each([
    ["/en", "http://localhost:3000/", "en"],
    ["/tr/blog/post?x=1", "http://localhost:3000/blog/post?x=1", "tr"],
  ])("redirects prefixed %s to the bare path and pins the language", (path, location, lang) => {
    const res = proxy(req(path, { cookie: "lang=de" }));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(location);
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.cookies.get("lang")?.value).toBe(lang);
    expect(res.cookies.get("lang")?.maxAge).toBe(31536000);
  });

  it.each([
    ["/en//evil.com", "/evil.com"],
    ["/en///evil.com/x", "/evil.com/x"],
    ["/tr/%2F%2Fevil.com", "/%2F%2Fevil.com"],
    ["/en/\\evil.com", "/evil.com"],
    ["/en/projects?x=1", "/projects?x=1"],
  ])("keeps the redirect for %s on the same origin", (path, target) => {
    const location = proxy(req(path)).headers.get("location")!;
    expect(location.startsWith("//")).toBe(false);
    const url = new URL(location, "http://localhost:3000");
    expect(url.origin).toBe("http://localhost:3000");
    expect(url.pathname + url.search).toBe(target);
  });

  it("still rewrites paths that merely start with a language code", () => {
    const res = proxy(req("/english"));
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/en/english");
  });

  it("matcher skips api, _next, admin, login and files, on segment boundaries", () => {
    const re = new RegExp(`^${config.matcher[0]}$`);
    for (const p of ["/api", "/api/x", "/_next/a", "/admin", "/admin/x", "/login", "/favicon.ico", "/wallpaper.webp"])
      expect(re.test(p), p).toBe(false);
    for (const p of ["/", "/blog/post", "/administrator", "/apis", "/login-help", "/blog/next.js-16", "/en/projects"])
      expect(re.test(p), p).toBe(true);
  });

  it.each(["/administrator", "/blog/next.js-16"])("rewrites %s", (path) => {
    const res = proxy(req(path, { cookie: "lang=en" }));
    expect(res.headers.get("x-middleware-rewrite")).toBe(`http://localhost:3000/en${path}`);
  });
});
