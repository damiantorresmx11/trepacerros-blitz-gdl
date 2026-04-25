"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { usePrimaBalance } from "@/hooks/useRastros";
import { useCountUp } from "@/hooks/useCountUp";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

function CerroBalancePillInner() {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  const { formatted, isLoading } = usePrimaBalance(address);

  const rawValue = Math.floor(Number(formatted));
  const animatedValue = useCountUp(rawValue, 600);

  if (pathname === "/hike" || !authenticated || !address) return null;

  const shortAddr = `${address.slice(0, 6)}…${address.slice(-4)}`;

  return (
    <button
      onClick={() => router.push("/profile")}
      className="wallet-chip fixed top-4 right-4 md:top-6 md:right-8 z-50 tap"
      aria-label={`${TOKEN_DISPLAY_NAME} balance: ${rawValue}. Tap to view profile.`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: "oklch(0.7 0.18 145)",
          boxShadow: "0 0 0 3px oklch(0.7 0.18 145 / .25)",
          animation: "wallet-pulse 2s infinite",
        }}
      />
      <span className="font-mono text-[11px]" style={{ color: "var(--ink)" }}>
        {shortAddr}
      </span>
      <span style={{ opacity: 0.3 }}>|</span>
      <span className="font-mono text-[11px] font-semibold" style={{ color: "var(--ember)" }}>
        {isLoading ? "..." : animatedValue.toLocaleString()} {TOKEN_DISPLAY_NAME}
      </span>
    </button>
  );
}

export const CerroBalancePill = React.memo(CerroBalancePillInner);
