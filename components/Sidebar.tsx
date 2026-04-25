"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.body.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.body.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 flex-col z-40 p-6 overflow-y-auto"
      style={{
        background: "var(--paper)",
        borderRight: "1px solid var(--line)",
        boxShadow: "var(--shadow-2)",
      }}
    >
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 mb-10 focus-visible:outline-none">
        <div
          className="w-7 h-7 rounded-lg grid place-items-center"
          style={{ background: "var(--ink)", color: "var(--bg)", boxShadow: "var(--shadow-1)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20l5.5-9 4 6 3-4L21 20z" /></svg>
        </div>
        <div>
          <span
            className="font-big-shoulders font-extrabold text-[22px] tracking-[.04em]"
            style={{ color: "var(--ink)" }}
          >
            TREPACERROS
          </span>
          <p
            className="font-mono text-[9px] tracking-[.18em] uppercase"
            style={{ color: "var(--moss)" }}
          >
            HIGH-ALTITUDE TECH
          </p>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1" aria-label="Main navigation">
        {tabs.map((tab, i) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
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
                className="flex items-center gap-3 px-4 py-3 rounded-2xl tap"
                style={{
                  background: isActive ? "color-mix(in oklch, var(--ember) 18%, transparent)" : "transparent",
                  color: isActive ? "var(--ember)" : "var(--muted)",
                }}
              >
                <span className={`material-symbols-outlined text-[22px] ${isActive ? "icon-fill" : ""}`}>
                  {tab.icon}
                </span>
                <span className="font-lexend font-semibold uppercase tracking-[.05em] text-[10px]">
                  {tab.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl tap mb-3"
        style={{ color: "var(--muted)" }}
      >
        <span className="material-symbols-outlined text-[22px]">
          {dark ? "light_mode" : "dark_mode"}
        </span>
        <span className="font-lexend font-semibold uppercase tracking-[.05em] text-[10px]">
          {dark ? "Modo claro" : "Modo oscuro"}
        </span>
      </button>

      {/* CTA Button */}
      <Link
        href="/hike"
        className="btn btn-primary w-full text-center font-big-shoulders text-[15px] font-bold uppercase tracking-[.02em]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20l5.5-9 4 6 3-4L21 20z" /></svg>
        Start Trepada
      </Link>
    </aside>
  );
}
