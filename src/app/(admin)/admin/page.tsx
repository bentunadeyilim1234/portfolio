import { Glass } from "@/components/glass/Glass";
import { requireAdmin } from "@/lib/auth/session";
import { logout } from "../login/actions";

export default async function AdminPage() {
  await requireAdmin();
  return (
    <main className="mx-auto max-w-3xl px-4 pt-10">
      <Glass as="section" className="flex flex-col items-start gap-6 p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Yönetim paneli — Plan 2&apos;de</h1>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg dark:text-neutral-950"
          >
            Çıkış yap
          </button>
        </form>
      </Glass>
    </main>
  );
}
