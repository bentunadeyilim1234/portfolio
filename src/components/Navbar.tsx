"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, /*PenTool, */ User, Mail } from "lucide-react";

const navItems = [
  { name: "Ana Sayfa", path: "/", icon: Home },
  { name: "Projeler", path: "/projects", icon: Briefcase },
  //{ name: "Blog", path: "/blog", icon: PenTool },
  { name: "Hakkımda", path: "/about", icon: User },
  { name: "İletişim", path: "/contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-[50vw] -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-1.5 py-1.5 rounded-full border border-white/20 bg-white/60 dark:bg-black/60 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-black/5">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                hover:scale-105 active:scale-95
                ${isActive
                  ? "text-black dark:text-white bg-white/50 dark:bg-white/10 shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/5"
                }
              `}
            >
              <span className="hidden md:block">{item.name}</span>
              <Icon className="w-5 h-5 md:hidden" strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
