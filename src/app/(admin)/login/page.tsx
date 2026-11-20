"use client";

import { useActionState } from "react";
import { Glass } from "@/components/glass/Glass";
import { login } from "./actions";

const FIELD =
  "w-full rounded-xl bg-white/55 px-4 py-2.5 ring-1 ring-inset ring-white/60 outline-none focus-visible:ring-2 focus-visible:ring-fg dark:bg-white/10 dark:ring-white/20";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <Glass as="section" className="w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Giriş yap</h1>
        <form action={action} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              E-posta
            </label>
            <input id="email" name="email" type="email" autoComplete="username" required className={FIELD} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Şifre
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className={FIELD} />
          </div>
          {state.error && (
            <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg disabled:opacity-60 dark:text-neutral-950"
          >
            {pending ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>
        </form>
      </Glass>
    </main>
  );
}
