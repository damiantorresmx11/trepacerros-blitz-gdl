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
  cerro: string;
  delta?: string;
  avatar: string;
}

const PLACEHOLDER_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "SOFIA_ECO", kg: "214", cerro: "3,240", avatar: "https://picsum.photos/seed/lb-1/100/100" },
  { rank: 2, name: "SANTI_TRLS", kg: "128", cerro: "1,920", avatar: "https://picsum.photos/seed/lb-2/100/100" },
  { rank: 3, name: "BETO_MTB", kg: "95", cerro: "1,425", avatar: "https://picsum.photos/seed/lb-3/100/100" },
  { rank: 4, name: "MARCO_S", kg: "82", cerro: "1,230", delta: "+1.2", avatar: "https://picsum.photos/seed/lb-4/100/100" },
  { rank: 5, name: "LUISA_GDL", kg: "77", cerro: "1,155", avatar: "https://picsum.photos/seed/lb-5/100/100" },
  { rank: 6, name: "PAU_TRK", kg: "69", cerro: "1,035", delta: "+4.5", avatar: "https://picsum.photos/seed/lb-6/100/100" },
  { rank: 7, name: "ANA_VRD", kg: "54", cerro: "810", avatar: "https://picsum.photos/seed/lb-7/100/100" },
  { rank: 8, name: "DIEGO_NTR", kg: "41", cerro: "615", delta: "+2.1", avatar: "https://picsum.photos/seed/lb-8/100/100" },
];

const MEDAL_COLORS = {
  gold: "#fbbf24",
  silver: "#d1d5db",
  bronze: "#fb923c",
} as const;

export default function LeaderboardPage() {
  const { address } = useAccount();
  const { totalKg, isLoading } = useHikerStats(address);

  const myKg = useMemo(() => (Number(totalKg) / 1000).toFixed(1), [totalKg]);

  const podiumRaw = PLACEHOLDER_LEADERBOARD.slice(0, 3);
  const rest = PLACEHOLDER_LEADERBOARD.slice(3);
  // Visual order: [2nd, 1st, 3rd]
  const podiumOrdered = [podiumRaw[1], podiumRaw[0], podiumRaw[2]].filter(Boolean);

  const podiumConfig = [
    { medal: MEDAL_COLORS.silver, size: "w-16 h-16", labelSize: "text-base", rank: 2 },
    { medal: MEDAL_COLORS.gold, size: "w-24 h-24", labelSize: "text-xl", rank: 1 },
    { medal: MEDAL_COLORS.bronze, size: "w-16 h-16", labelSize: "text-base", rank: 3 },
  ];

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6 md:max-w-2xl md:mx-auto">
        {/* ── Header ── */}
        <section className="flex items-center gap-3">
          <Link
            href="/profile"
            className="haptic-active w-10 h-10 rounded-[12px] border border-cd-ink/10 bg-cd-paper flex items-center justify-center text-cd-ink"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-big-shoulders text-2xl font-black uppercase tracking-wider text-cd-ink">
              Top Trepacerros GDL
            </h1>
            <p className="text-[13px] text-cd-muted">Ranked by total impact on trails</p>
          </div>
        </section>

        {/* ── Podium ── */}
        <section className="solid-card p-6 pb-4">
          <div className="grid grid-cols-3 gap-3 items-end">
            {podiumOrdered.map((entry, idx) => {
              const config = podiumConfig[idx];
              const isFirst = config.rank === 1;
              return (
                <div key={entry.rank} className="flex flex-col items-center">
                  {/* Crown for #1 */}
                  {isFirst && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={MEDAL_COLORS.gold} className="mb-1">
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
                    </svg>
                  )}

                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={`${config.size} rounded-full overflow-hidden shadow-lg`}
                      style={{ border: `3px solid ${config.medal}` }}
                    >
                      <img className="w-full h-full object-cover" src={entry.avatar} alt={entry.name} />
                    </div>
                    {/* Rank badge */}
                    <div
                      className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center font-bold text-white text-[10px] border-2 border-cd-paper"
                      style={{
                        background: config.medal,
                        width: isFirst ? "28px" : "22px",
                        height: isFirst ? "28px" : "22px",
                        fontSize: isFirst ? "12px" : "10px",
                      }}
                    >
                      {entry.rank}
                    </div>
                  </div>

                  {/* Name + KG */}
                  <p className="font-bold text-[11px] text-cd-ink text-center truncate w-full mt-2 uppercase tracking-wide">
                    {entry.name}
                  </p>
                  <span
                    className={`font-mono font-black ${config.labelSize} mt-0.5`}
                    style={{ color: isFirst ? MEDAL_COLORS.gold : "var(--color-cd-ink, #1a2e1f)" }}
                  >
                    {entry.kg} KG
                  </span>
                  <span className="font-mono text-[10px] text-cd-muted">{entry.cerro} {TOKEN_DISPLAY_NAME}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Ranked List ── */}
        <section className="solid-card overflow-hidden" style={{ padding: "4px 16px" }}>
          {/* Column header */}
          <div className="flex items-center justify-between py-2 border-b border-dashed border-cd-ink/10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-cd-muted">
              Rank / User
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-cd-muted">
              KG / {TOKEN_DISPLAY_NAME}
            </span>
          </div>

          {rest.map((entry) => (
            <div
              key={entry.rank}
              className="grid items-center gap-3 py-3 border-b border-dashed border-cd-ink/10 last:border-b-0"
              style={{ gridTemplateColumns: "28px 36px 1fr auto" }}
            >
              {/* Rank */}
              <span className="font-big-shoulders font-black text-lg text-cd-muted text-center">
                {entry.rank}
              </span>
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full overflow-hidden"
                style={{ background: "linear-gradient(135deg, oklch(0.7 0.1 145), oklch(0.5 0.12 150))" }}
              >
                <img className="w-full h-full object-cover" src={entry.avatar} alt={entry.name} />
              </div>
              {/* Name */}
              <div>
                <p className="font-semibold text-[13px] text-cd-ink">{entry.name}</p>
                {entry.delta && (
                  <span className="font-mono text-[10px]" style={{ color: "oklch(0.55 0.16 145)" }}>
                    +{entry.delta} this week
                  </span>
                )}
              </div>
              {/* Stats */}
              <div className="flex flex-col items-end">
                <span className="font-mono text-[13px] font-bold text-cd-ink">{entry.kg} KG</span>
                <span className="font-mono text-[10px] text-cd-muted">{entry.cerro}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ── Current user position ── */}
        {address && (
          <div
            className="solid-card p-4 flex items-center justify-between"
            style={{ background: "color-mix(in oklch, var(--color-cd-ember, #e85d2a) 8%, var(--color-cd-paper, #fdfcf7))", borderColor: "var(--color-cd-ember, #e85d2a)", borderWidth: "2px" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-big-shoulders font-black text-lg"
                style={{ background: "var(--color-cd-ember, #e85d2a)" }}
              >
                --
              </div>
              <div>
                <p className="font-bold text-cd-ink text-sm uppercase tracking-wide">YOU</p>
                <p className="font-mono text-[11px] text-cd-muted">
                  {isLoading ? "Loading..." : `${myKg} KG collected total`}
                </p>
              </div>
            </div>
            <Link
              href="/hike"
              className="haptic-active px-4 py-2.5 rounded-[14px] text-white font-bold text-[13px] uppercase tracking-[0.08em]"
              style={{ background: "var(--color-cd-ember, #e85d2a)" }}
            >
              CLEAN NOW
            </Link>
          </div>
        )}

        {/* ── Footer link ── */}
        <div className="text-center pb-2">
          <span className="font-mono text-[10px] tracking-[0.16em] text-cd-muted uppercase">
            VER TODAS LAS TX EN MONADSCAN &nearr;
          </span>
        </div>
      </div>
    </AppShell>
  );
}
