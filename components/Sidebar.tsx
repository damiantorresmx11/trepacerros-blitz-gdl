"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "Map Dashboard", icon: "map" },
  { href: "/hike/select", label: "Clean", icon: "potted_plant" },
  { href: "/wiki", label: "Eco-Wiki", icon: "menu_book" },
  { href: "/rewards", label: "Marketplace", icon: "storefront" },
  { href: "/profile/leaderboard", label: "Leaderboard", icon: "leaderboard" },
  { href: "/profile", label: "My Impact", icon: "auto_graph" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 flex-col z-40 bg-white/30 backdrop-blur-2xl border-r border-white/10 shadow-2xl shadow-black/5 p-6">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-3 mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] rounded-lg"
      >
        <div className="w-10 h-10 rounded-lg bg-tc-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">landscape</span>
        </div>
        <div>
          <h1 className="font-fraunces text-xl font-black text-green-900 tracking-tighter leading-none">
            Trepacerros
          </h1>
          <p className="font-space-grotesk text-tc-caption text-tc-outline mt-0.5">
            HIGH-ALTITUDE TECH
          </p>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1" aria-label="Main navigation">
        {tabs.map((tab, i) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <motion.div
              key={tab.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2, ease: "easeOut" }}
            >
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] ${
                  isActive
                    ? "bg-white/50 text-orange-600 shadow-inner-sm"
                    : "text-green-900/70 hover:text-green-900 hover:translate-x-1"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl ${isActive ? "icon-fill" : ""}`}
                >
                  {tab.icon}
                </span>
                <span className="font-lexend font-semibold uppercase tracking-widest text-[11px]">
                  {tab.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* CTA Button */}
      <Link
        href="/hike"
        className="mt-auto w-full py-3 px-4 bg-[#FF6B00] text-white rounded-xl font-lexend text-tc-label font-semibold uppercase tracking-widest text-center shadow-lg border border-white/20 hover:opacity-90 transition-opacity duration-200 haptic-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
      >
        Start Expedition
      </Link>
    </aside>
  );
}
