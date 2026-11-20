import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number },
) => Promise<Buffer>;

const N = 16384;
const KEYLEN = 64;

// Stored format: scrypt$<N>$<saltB64>$<hashB64>
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(plain, salt, KEYLEN, { N });
  return `scrypt$${N}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const [scheme, n, saltB64, hashB64] = stored.split("$");
  const cost = Number(n);
  if (scheme !== "scrypt" || !Number.isInteger(cost) || cost < 2 || !saltB64 || !hashB64) {
    return false;
  }
  const expected = Buffer.from(hashB64, "base64");
  if (expected.length === 0) return false;
  try {
    const actual = await scryptAsync(plain, Buffer.from(saltB64, "base64"), expected.length, {
      N: cost,
    });
    return timingSafeEqual(actual, expected);
  } catch {
    return false; // invalid scrypt params in a corrupt stored hash
  }
}
