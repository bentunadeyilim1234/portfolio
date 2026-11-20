import { notFound } from "next/navigation";

// Unmatched URLs under [lang] land here so the styled [lang]/not-found renders inside the real layout
// (without it Next serves its bare default 404). Dynamic: nothing to prerender.
export const dynamic = "force-dynamic";

export default function CatchAll(): never {
  notFound();
}
