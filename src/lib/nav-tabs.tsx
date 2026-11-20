import { Circle, icons } from "lucide-react";
import type { IslandTab } from "@/components/IslandBar";
import type { NavTab } from "@/data/types";
import type { Lang } from "./i18n";
import { pickLocalized } from "./localized";
import { isPageKey } from "./nav";

// Server-only: `icons` is lucide's full index. hasOwn keeps names like "constructor" off the prototype.
export function navIcon(name: unknown) {
  const Icon = typeof name === "string" && Object.hasOwn(icons, name) ? icons[name as keyof typeof icons] : Circle;
  return <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />;
}

// Admin-written nav: drops hidden, malformed, unknown-page and duplicate-page entries (first one wins).
export function resolveTabs(nav: NavTab[], lang: Lang): IslandTab[] {
  const seen = new Set<string>();
  return nav
    .filter((t) => {
      if (!t?.visible || !isPageKey(t.page) || seen.has(t.page)) return false;
      seen.add(t.page);
      return true;
    })
    .map((t) => ({ page: t.page, label: pickLocalized(t.label, lang).text || t.page, icon: navIcon(t.icon) }));
}
