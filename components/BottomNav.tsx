"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/hike/select",
    label: "Clean",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l5.5-9 4 6 3-4L21 20z" />
      </svg>
    ),
    center: true,
  },
  {
    href: "/wiki",
    label: "Wiki",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/rewards",
    label: "Rewards",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-3 pb-[18px] pt-[6px] z-40 pointer-events-none">
      <nav
        className="pointer-events-auto grid grid-cols-5 gap-[2px] rounded-3xl p-2"
        style={{
          background: "color-mix(in oklch, var(--paper) 92%, transparent)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-2)",
        }}
        aria-label="Main navigation"
      >
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const isCenter = "center" in tab && tab.center;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-[3px] py-2 px-1 rounded-2xl tap"
              style={{
                background: isActive
                  ? isCenter
                    ? "var(--ember)"
                    : "color-mix(in oklch, var(--ember) 18%, transparent)"
                  : "transparent",
                color: isActive ? (isCenter ? "#fff" : "var(--ember)") : "var(--muted)",
                transform: isActive && isCenter ? "translateY(-14px) scale(1.05)" : undefined,
                boxShadow: isActive && isCenter ? "0 8px 22px -6px var(--ember)" : undefined,
              }}
            >
              {tab.icon}
              <span className="font-lexend text-[10px] font-semibold uppercase tracking-[.05em]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
