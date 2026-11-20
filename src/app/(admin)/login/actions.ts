"use server";

import { and, count, eq, gt, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { adminUsers, loginAttempts } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { clientIp, hashIp } from "@/lib/ip";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
// Same scrypt cost as real hashes, so an unknown email takes as long as a wrong password.
const DUMMY_HASH = "scrypt$16384$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==";

export async function login(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const ipHash = hashIp(clientIp(await headers()));
  const since = new Date(Date.now() - WINDOW_MS);
  // Keeps the table bounded: rows outside the window no longer count.
  await db.delete(loginAttempts).where(lt(loginAttempts.createdAt, since));
  // Record before counting: parallel requests each see every earlier insert, so at most
  // MAX_ATTEMPTS of them get past this check (counting first let them all through).
  await db.insert(loginAttempts).values({ ipHash });
  const [{ n }] = await db
    .select({ n: count() })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ipHash, ipHash), gt(loginAttempts.createdAt, since)));
  if (n > MAX_ATTEMPTS) return { error: "Çok fazla deneme. 15 dakika sonra tekrar dene." };

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const [user] = email ? await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1) : [];
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !ok) return { error: "E-posta veya şifre hatalı." };

  await db.delete(loginAttempts).where(eq(loginAttempts.ipHash, ipHash));
  await createSession(user.id);
  redirect("/");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}
