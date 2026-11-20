"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { dict } from "@/lib/dictionaries";
import type { Lang } from "@/lib/i18n";

const NEXT = { system: "light", light: "dark", dark: "system" } as const;
const ICON = { system: Monitor, light: Sun, dark: Moon };
type Mode = keyof typeof NEXT;

const noop = () => () => {};

export function ThemeToggle({ lang }: { lang: Lang }) {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known on the client; render "system" on the server to avoid a hydration mismatch.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const mode: Mode = mounted && theme && theme in NEXT ? (theme as Mode) : "system";
  const t = dict(lang);
  const Icon = ICON[mode];
  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT[mode])}
      aria-label={`${t.nav.theme}: ${t.theme[mode]}`}
      title={`${t.nav.theme}: ${t.theme[mode]}`}
      className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-[var(--glass-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
    >
      <Icon aria-hidden className="size-5" strokeWidth={1.75} />
    </button>
  );
}
