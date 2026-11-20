import { createHash } from "node:crypto";

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) throw new Error("IP_HASH_SALT is not set");
  return createHash("sha256").update(salt + ip).digest("hex");
}

// Trusts the first x-forwarded-for entry: Vercel overwrites the header, but behind a proxy that
// appends to it the client can spoof this value.
export function clientIp(h: Headers): string {
  return h.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0";
}
