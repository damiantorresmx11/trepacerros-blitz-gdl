"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { useHikerStats } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

interface LeaderboardEntry {
  rank: number;
  name: string;
  kg: string;
  delta?: string;
  avatar: string;
}

// Placeholder leaderboard data — in production this would come from on-chain event aggregation
const PLACEHOLDER_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "SOFIA_ECO", kg: "214", avatar: "https://picsum.photos/seed/lb-1/100/100" },
  { rank: 2, name: "SANTI_TRLS", kg: "128", avatar: "https://picsum.photos/seed/lb-2/100/100" },
  { rank: 3, name: "BETO_MTB", kg: "95", avatar: "https://picsum.photos/seed/lb-3/100/100" },
  { rank: 4, name: "MARCO_S", kg: "82", delta: "+1.2", avatar: "https://picsum.photos/seed/lb-4/100/100" },
  { rank: 5, name: "LUISA_GDL", kg: "77", avatar: "https://picsum.photos/seed/lb-5/100/100" },
  { rank: 6, name: "PAU_TRK", kg: "69", delta: "+4.5", avatar: "https://picsum.photos/seed/lb-6/100/100" },
];

const PODIUM_STYLES = [
  { border: "border-amber-400", bg: "bg-amber-400", ring: "ring-4 ring-amber-400/20", size: "w-24 h-24" },
  { border: "border-slate-300", bg: "bg-slate-400", ring: "", size: "w-16 h-16" },
  { border: "border-amber-700", bg: "bg-amber-700", ring: "", size: "w-16 h-16" },
];

export default function LeaderboardPage() {
  const { address } = useAccount();
  const { totalKg, isLoading } = useHikerStats(address);

  const myKg = useMemo(() => (Number(totalKg) / 1000).toFixed(1), [totalKg]);

  const podium = PLACEHOLDER_LEADERBOARD.slice(0, 3);
  const rest = PLACEHOLDER_LEADERBOARD.slice(3);
  // Reorder for visual: [2nd, 1st, 3rd]
  const podiumOrdered = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6 md:max-w-2xl md:mx-auto">
        <section>
          <h1 className="text-tc-headline-lg font-semibold text-tc-primary mb-1">Top Trepacerros GDL</h1>
          <p className="text-tc-body-md text-tc-on-surface-variant">The local guardians of our trails. Ranked by total impact.</p>
        </section>

        {/* Podium */}
        <section className="grid grid-cols-3 gap-3 items-end">
          {podiumOrdered.map((entry, idx) => {
            const style = PODIUM_STYLES[idx === 1 ? 0 : idx === 0 ? 1 : 2];
            const isFirst = idx === 1;
            return (
              <div key={entry.rank} className="flex flex-col items-center">
                <div className={`relative mb-2 ${isFirst ? "scale-110" : ""}`}>
                  <div className={`${style.size} rounded-full border-4 ${style.border} ${style.ring} overflow-hidden shadow-lg`}>
                    <img className="w-full h-full object-cover" src={entry.avatar} alt={entry.name} />
                  </div>
                  {isFirst && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="material-symbols-outlined text-amber-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 ${style.bg} text-white rounded-full ${isFirst ? "w-8 h-8 text-[14px]" : "w-6 h-6 text-[10px]"} flex items-center justify-center font-bold border-2 border-white`}>
                    {entry.rank}
                  </div>
                </div>
                <p className="font-bold text-[12px] text-center truncate w-full">{entry.name}</p>
                {isFirst ? (
                  <div className="bg-amber-100 px-3 py-0.5 rounded-full mt-1">
                    <p className="font-space-grotesk text-[#FF6B00] font-black">{entry.kg} KG</p>
                  </div>
                ) : (
                  <p className="font-space-grotesk text-tc-primary font-bold">{entry.kg} KG</p>
                )}
              </div>
            );
          })}
        </section>

        {/* Ranking List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-4 pb-2 text-[12px] font-bold text-tc-on-surface-variant uppercase tracking-widest border-b border-tc-outline-variant/30">
            <span>Rank / User</span>
            <span>Total Collected</span>
          </div>
          {rest.map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3">
                <span className="font-space-grotesk text-tc-on-surface-variant font-bold w-4">{entry.rank}</span>
                <div className="w-10 h-10 rounded-full bg-tc-surface-container overflow-hidden">
                  <img className="w-full h-full object-cover" src={entry.avatar} alt={entry.name} />
                </div>
                <p className="font-bold text-sm">{entry.name}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-space-grotesk font-bold text-tc-primary">{entry.kg} KG</span>
                {entry.delta && (
                  <span className="text-[10px] text-green-600">+{entry.delta} this week</span>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Your Position */}
        {address && (
          <div className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FF6B00] flex items-center justify-center text-white font-black">
                --
              </div>
              <div>
                <p className="font-bold text-tc-primary">YOU</p>
                <p className="text-[12px] text-tc-on-surface-variant">
                  {isLoading ? "Loading..." : `${myKg} KG collected total`}
                </p>
              </div>
            </div>
            <Link
              href="/hike"
              className="bg-[#FF6B00] text-white px-4 py-2 rounded-xl font-bold text-[14px] active:scale-95 transition-transform"
            >
              CLEAN NOW
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
