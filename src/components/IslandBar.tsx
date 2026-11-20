"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { PageKey } from "@/blocks/types";
import { Glass } from "@/components/glass/Glass";
import { Refraction } from "@/components/glass/GlassFilter";
import { LangToggle } from "@/components/LangToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Lang } from "@/lib/i18n";
import { activePage, pageHref } from "@/lib/nav";
import { pillMap } from "@/lib/refract-map";

// The icon arrives pre-rendered from the server so lucide's full icon index stays out of the client bundle.
export type IslandTab = { page: PageKey; label: string; icon: ReactNode };

const RIM_PX = 18;
const SQUISH: Keyframe[] = [{ scale: "1 1" }, { scale: "1.14 0.86", offset: 0.35 }, { scale: "0.97 1.04", offset: 0.7 }, { scale: "1 1" }];

export function IslandBar({ tabs, lang, label }: { tabs: IslandTab[]; lang: Lang; label: string }) {
  const active = activePage(usePathname());
  const barRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const squishRef = useRef<HTMLSpanElement>(null);
  const lastPage = useRef<string | null>(null);
  const [drop, setDrop] = useState<{ x: number; w: number; slide: boolean } | null>(null);
  const [map, setMap] = useState<string | null>(null);

  // Droplet follows the active tab's box. It slides only when the active tab changes; resizes snap.
  // `tabs` is a dependency so a reorder from the server re-measures even when the page is the same.
  useEffect(() => {
    const list = listRef.current;
    const scroller = list?.parentElement;
    const el = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !scroller || !el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ro = new ResizeObserver(() => {
      const slide = lastPage.current !== null && lastPage.current !== active;
      lastPage.current = active;
      setDrop({ x: el.offsetLeft, w: el.offsetWidth, slide });
      // When the tabs overflow and scroll, keep the active one centred in view.
      const left = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
      scroller.scrollTo({ left, behavior: slide && !reduce ? "smooth" : "auto" });
      // On the inner span: `scale` on the translated span would scale its translation too and drift it sideways.
      if (slide && !reduce) squishRef.current?.animate(SQUISH, { duration: 560, easing: "ease-out" });
    });
    ro.observe(list);
    ro.observe(el);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [active, tabs]);

  // Refract tier: a displacement map drawn at the bar's exact px size, so the rim band stays a fixed
  // width and bends radially around the round ends instead of stretching with the pill.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || document.documentElement.dataset.glass !== "refract") return;
    const canvas = document.createElement("canvas");
    const ro = new ResizeObserver(() => {
      const w = bar.offsetWidth;
      const h = bar.offsetHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.putImageData(new ImageData(pillMap(w, h, RIM_PX), w, h), 0, 0);
      setMap(canvas.toDataURL());
    });
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  const hasActiveTab = tabs.some((t) => t.page === active);

  return (
    <>
      {map && (
        <svg aria-hidden="true" focusable="false" width="0" height="0" className="pointer-events-none absolute">
          <Refraction id="lg-refract-bar" scale={44}>
            <feImage href={map} preserveAspectRatio="none" result="map" />
          </Refraction>
        </svg>
      )}
      <Glass
        as="nav"
        ref={barRef}
        aria-label={label}
        data-refract={map ? "bar" : undefined}
        className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit max-w-[calc(100vw-1rem)] items-center rounded-full p-1"
      >
        {tabs.length > 0 && (
          <>
            {/* Scrolls sideways when the tabs don't fit; the negative margin + padding give the droplet's
                shadow room inside the clip without changing the bar's size. */}
            <div className="relative -my-1 -ml-1 min-w-0 overflow-x-auto py-1 pl-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span
                aria-hidden="true"
                data-slide={drop?.slide || undefined}
                className="glass-drop"
                style={{ transform: `translateX(${drop?.x ?? 0}px)`, width: drop?.w ?? 0, opacity: drop && hasActiveTab ? 1 : 0 }}
              >
                <span ref={squishRef} className="glass-drop-fill" />
              </span>
              <ul ref={listRef} className="flex items-center">
                {tabs.map((t) => (
                  <li key={t.page}>
                    <Link
                      href={pageHref(t.page)}
                      aria-label={t.label}
                      aria-current={t.page === active ? "page" : undefined}
                      className="relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current aria-[current=page]:text-fg lg:px-4"
                    >
                      {t.icon}
                      <span className="hidden whitespace-nowrap lg:inline">{t.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-current opacity-15" />
          </>
        )}
        {/* Right-side controls: Plan 2 adds Edit, Plan 6 the coffee button. */}
        <div className="flex shrink-0 items-center">
          <LangToggle lang={lang} />
          <ThemeToggle lang={lang} />
        </div>
      </Glass>
    </>
  );
}
