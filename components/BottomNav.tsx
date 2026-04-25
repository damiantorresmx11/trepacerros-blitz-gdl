"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/hike", label: "Hike", icon: "hiking" },
  { href: "/wiki", label: "Wiki", icon: "menu_book" },
  { href: "/rewards", label: "Rewards", icon: "storefront" },
  { href: "/profile", label: "Profile", icon: "person" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-[#FDFCF8] rounded-t-2xl border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center w-full h-20 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-90 duration-200 ${
                isActive
                  ? "text-[#FF6B00] bg-orange-50 rounded-xl"
                  : "text-stone-500 hover:text-orange-500"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {tab.icon}
              </span>
              <span className="font-[Lexend] text-[10px] font-semibold uppercase tracking-tighter mt-1">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
