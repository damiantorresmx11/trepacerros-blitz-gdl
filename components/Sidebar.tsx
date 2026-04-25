"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { usePrimaBalance } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

const tabs = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/hike", label: "Hike", icon: "hiking" },
  { href: "/wiki", label: "Wiki", icon: "menu_book" },
  { href: "/rewards", label: "Rewards", icon: "storefront" },
  { href: "/profile", label: "Profile", icon: "person" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  const { formatted, isLoading } = usePrimaBalance(address);
  const shortAddr = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#FDFCF8] border-r border-stone-200 flex-col z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-5 h-16 border-b border-stone-200">
        <span className="material-symbols-outlined text-[#2D5A27]">landscape</span>
        <span className="font-lexend font-black text-[#2D5A27] tracking-widest uppercase text-lg">
          TREPACERROS
        </span>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-orange-50 text-[#FF6B00]"
                  : "text-stone-600 hover:bg-stone-100 hover:text-tc-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-lexend text-sm font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Wallet Pill */}
      {authenticated && address && (
        <div className="px-3 pb-4">
          <Link
            href="/profile"
            className="flex items-center gap-2 bg-tc-surface-container px-3 py-3 rounded-xl border border-tc-outline-variant/30"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-space-grotesk text-[12px] text-tc-on-surface truncate">{shortAddr}</p>
              {!isLoading && (
                <p className="font-space-grotesk text-[12px] font-bold text-[#FF6B00]">
                  {Math.floor(Number(formatted))} {TOKEN_DISPLAY_NAME}
                </p>
              )}
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
