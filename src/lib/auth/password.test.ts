import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("verifies the right password", async () => {
    const h = await hashPassword("correct horse");
    expect(h.startsWith("scrypt$16384$")).toBe(true);
    expect(await verifyPassword("correct horse", h)).toBe(true);
  });
  it("rejects a wrong password", async () => {
    expect(await verifyPassword("nope", await hashPassword("correct horse"))).toBe(false);
  });
  it("two hashes of the same password differ (salted)", async () => {
    expect(await hashPassword("x")).not.toBe(await hashPassword("x"));
  });
  it("returns false on a malformed stored hash", async () => {
    expect(await verifyPassword("x", "garbage")).toBe(false);
  });
});
