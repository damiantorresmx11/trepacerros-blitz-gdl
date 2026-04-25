"use client";

import React, { useEffect, useRef, useDeferredValue } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { usePrimaBalance } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

function CerroBalancePillInner() {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  const { formatted, isLoading } = usePrimaBalance(address);

  const currentValue = Math.floor(Number(formatted));
  const deferredValue = useDeferredValue(currentValue);
  const prevRef = useRef(deferredValue);

  useEffect(() => {
    prevRef.current = deferredValue;
  }, [deferredValue]);

  // Hide on tracking page and when not authenticated
  if (pathname === "/hike" || !authenticated || !address) return null;

  return (
    <button
      onClick={() => router.push("/profile")}
      className="fixed top-4 right-4 md:top-6 md:right-8 z-50 glass-pill rounded-full px-4 py-2 flex items-center gap-2 haptic-active cursor-pointer hover:bg-white/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
      aria-label={`${TOKEN_DISPLAY_NAME} balance: ${deferredValue}. Tap to view profile.`}
    >
      <span className="material-symbols-outlined text-[#FF6B00] text-lg icon-fill">toll</span>
      <span className="font-space-grotesk font-bold text-sm text-tc-on-surface tabular-nums">
        {isLoading ? "..." : deferredValue.toLocaleString()}
      </span>
      <span className="font-space-grotesk text-xs text-tc-on-surface-variant">
        {TOKEN_DISPLAY_NAME}
      </span>
    </button>
  );
}

export const CerroBalancePill = React.memo(CerroBalancePillInner);
