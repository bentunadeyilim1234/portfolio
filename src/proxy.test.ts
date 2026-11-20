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

  it.each(["/en", "/tr/blog"])("leaves %s untouched", (path) => {
    const res = proxy(req(path));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("still rewrites paths that merely start with a language code", () => {
    const res = proxy(req("/english"));
    expect(res.headers.get("x-middleware-rewrite")).toBe("http://localhost:3000/en/english");
  });

  it("matcher skips api, _next, admin, login and files", () => {
    const re = new RegExp(`^${config.matcher[0]}$`);
    for (const p of ["/api/x", "/_next/a", "/admin", "/login", "/favicon.ico"]) expect(re.test(p)).toBe(false);
    for (const p of ["/", "/blog/post"]) expect(re.test(p)).toBe(true);
  });
});
