import { describe, expect, it } from "vitest";
import { clientIp, hashIp } from "./ip";

describe("ip", () => {
  it("hashIp is stable and does not contain the ip", () => {
    process.env.IP_HASH_SALT = "s";
    expect(hashIp("1.2.3.4")).toBe(hashIp("1.2.3.4"));
    expect(hashIp("1.2.3.4")).not.toContain("1.2.3.4");
  });
  it("clientIp takes the first forwarded address", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe("9.9.9.9");
    expect(clientIp(new Headers())).toBe("0.0.0.0");
  });
});
