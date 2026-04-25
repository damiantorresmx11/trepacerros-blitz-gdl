"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { usePrimaBalance } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

export function TopNav() {
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  const { formatted, isLoading } = usePrimaBalance(address);

  const shortAddr = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  return (
    <header className="md:hidden bg-[#FDFCF8] border-b border-stone-200 shadow-sm fixed top-0 z-50 w-full max-w-[480px] left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-center px-4 h-16">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] rounded-lg">
          <span className="material-symbols-outlined text-[#2D5A27]">
            landscape
          </span>
          <span className="font-[Lexend] font-black text-[#2D5A27] tracking-widest uppercase text-lg">
            TREPACERROS
          </span>
        </Link>

        {authenticated && address ? (
          <Link
            href="/profile"
            className="bg-[#f0eded] px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#c2c9bb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8]"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-['Space_Grotesk'] text-[14px] font-medium tracking-[0.05em] text-[#1b1b1c]">
              {shortAddr}
              {!isLoading && (
                <span className="ml-1">
                  | {Math.floor(Number(formatted))} {TOKEN_DISPLAY_NAME}
                </span>
              )}
            </span>
          </Link>
        ) : null}
      </div>
    </header>
  );
}
