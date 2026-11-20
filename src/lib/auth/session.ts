import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { sessions } from "@/db/schema";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  await db.insert(sessions).values({
    tokenHash: sha256(token),
    userId,
    expiresAt: new Date(Date.now() + MAX_AGE * 1000),
  });
  const jar = await cookies();
  jar.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  // UI hint only: not HttpOnly, carries no authority.
  jar.set("admin_hint", "1", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<{ userId: string } | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  const [row] = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(and(eq(sessions.tokenHash, sha256(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

export async function requireAdmin(): Promise<{ userId: string }> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  if (token) await db.delete(sessions).where(eq(sessions.tokenHash, sha256(token)));
  jar.delete("session");
  jar.delete("admin_hint");
}
