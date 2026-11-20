import Link from "next/link";
import { Glass } from "@/components/glass/Glass";
import { dict } from "@/lib/dictionaries";
import { LANGS } from "@/lib/i18n";

// Not-found gets no params, so show both languages instead of guessing one.
export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <Glass as="section" className="px-6 py-16 text-center sm:py-24">
        <p aria-hidden className="text-7xl font-semibold tracking-tight sm:text-8xl">
          404
        </p>
        {LANGS.map((l, i) => {
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div key={l} lang={l} className="mt-4 first:mt-6">
              <Heading className="text-xl font-semibold tracking-tight sm:text-2xl">{dict(l).notFound.title}</Heading>
              <p className="mt-1 text-fg-muted">{dict(l).notFound.body}</p>
            </div>
          );
        })}
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg dark:text-neutral-950"
        >
          {LANGS.map((l) => dict(l).notFound.home).join(" / ")}
        </Link>
      </Glass>
    </main>
  );
}
