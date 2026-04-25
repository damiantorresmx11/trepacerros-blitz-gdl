"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  { href: "/", label: "Map", icon: "map" },
  { href: "/hike/select", label: "Clean", icon: "potted_plant" },
  { href: "/wiki", label: "Wiki", icon: "menu_book" },
  { href: "/rewards", label: "Shop", icon: "storefront" },
  { href: "/profile/leaderboard", label: "Rank", icon: "leaderboard" },
  { href: "/profile", label: "Me", icon: "auto_graph" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav during active tracking
  if (pathname === "/hike") return null;

  return (
    <nav
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 bg-stone-50/70 backdrop-blur-2xl rounded-card border border-white/20 shadow-2xl"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center p-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-2xl transition-colors duration-200 haptic-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] ${
                isActive
                  ? "bg-white/40 text-orange-600"
                  : "text-emerald-900/40 hover:text-orange-500"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${isActive ? "icon-fill" : ""}`}
              >
                {tab.icon}
              </span>
              <span className="font-lexend text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
