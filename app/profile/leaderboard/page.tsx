"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { useHikerStats } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

interface LeaderboardEntry {
  rank: number;
  name: string;
  kg: string;
  hikes: string;
  cerro: string;
  avatarGradient?: string;
}

const PLACEHOLDER_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "@chivasreciclas", kg: "142", hikes: "38", cerro: "14,820" },
  { rank: 2, name: "@gdl_huellaverde", kg: "128", hikes: "32", cerro: "12,400", avatarGradient: "linear-gradient(135deg, oklch(0.78 0.1 60), oklch(0.6 0.14 40))" },
  { rank: 3, name: "@anaila.eth", kg: "99", hikes: "27", cerro: "10,210", avatarGradient: "linear-gradient(135deg, oklch(0.78 0.07 240), oklch(0.5 0.1 250))" },
  { rank: 4, name: "@trepa_zamora", kg: "88", hikes: "24", cerro: "9,140" },
  { rank: 5, name: "@luisa_gdl", kg: "77", hikes: "20", cerro: "8,050" },
  { rank: 6, name: "@pau_trk", kg: "69", hikes: "18", cerro: "7,200" },
  { rank: 7, name: "@ana_vrd", kg: "54", hikes: "14", cerro: "5,620" },
  { rank: 8, name: "@diego_ntr", kg: "41", hikes: "11", cerro: "4,260" },
];

const SEGMENTS = ["Semana", "Mes", "Historico"];

const RANK_COLORS: Record<number, string> = {
  1: "gold",
  2: "silver",
  3: "bronze",
};

export default function LeaderboardPage() {
  const { address } = useAccount();
  const { totalKg, hikes, isLoading } = useHikerStats(address);
  const [activeSegment, setActiveSegment] = useState(2); // Historico

  const myKg = useMemo(() => (Number(totalKg) / 1000).toFixed(1), [totalKg]);

  const top3 = PLACEHOLDER_LEADERBOARD.slice(0, 3);
  const rest = PLACEHOLDER_LEADERBOARD.slice(3);

  // Podium visual order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumSizes = [
    { avatarSize: 64, avatarSizeLg: 80, rank: 2, color: "silver" },
    { avatarSize: 80, avatarSizeLg: 100, rank: 1, color: "gold" },
    { avatarSize: 64, avatarSizeLg: 80, rank: 3, color: "bronze" },
  ];

  return (
    <AppShell>
      <div className="px-[18px]">
        {/* ── Header with back arrow ── */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="font-big-shoulders text-[26px] font-black m-0" style={{ color: "var(--ink)" }}>Leaderboard</h1>
        </div>

        {/* ── Segment control ── */}
        <div className="seg w-full flex">
          {SEGMENTS.map((label, idx) => (
            <button
              key={label}
              className={activeSegment === idx ? "on" : ""}
              onClick={() => setActiveSegment(idx)}
              style={{ flex: 1 }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Podium top 3 ── */}
        <div className="card mt-4 px-4 pt-6 pb-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-3 gap-2 md:gap-6 lg:gap-10 items-end">
            {podiumOrder.map((entry, idx) => {
              const config = podiumSizes[idx];
              const isFirst = config.rank === 1;
              const borderColor =
                config.color === "gold"
                  ? "oklch(0.78 0.16 80)"
                  : config.color === "silver"
                    ? "oklch(0.7 0.02 230)"
                    : "oklch(0.6 0.12 50)";
              return (
                <div key={entry.rank} className="text-center flex flex-col items-center">
                  {/* Crown for #1 */}
                  {isFirst && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="oklch(0.78 0.16 80)" className="mb-1 lg:w-8 lg:h-8">
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
                    </svg>
                  )}
                  <div
                    className="lb-avatar transition-transform duration-200 hover:scale-110"
                    style={{
                      width: config.avatarSize,
                      height: config.avatarSize,
                      border: `3px solid ${borderColor}`,
                      background: entry.avatarGradient || undefined,
                    }}
                  />
                  <div className="mt-1.5 w-auto">
                    <span className={`lb-rank ${RANK_COLORS[entry.rank] || ""}`}>
                      {String(entry.rank).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="lb-name mt-0.5 text-[11px] md:text-xs text-center w-full truncate">
                    {entry.name}
                  </div>
                  <div className="font-mono mt-0.5" style={{ fontWeight: 700, fontSize: isFirst ? 18 : 14, color: "var(--ember)" }}>
                    {entry.cerro}
                  </div>
                  <div className="lb-meta">{entry.kg} KG &middot; {entry.hikes} TREPADAS</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Ranked list (4+) ── */}
        <div className="card mt-3 py-1.5 px-4 md:px-6 lg:px-8">
          {rest.map((entry) => (
            <div key={entry.rank} className="lb-row transition-colors duration-150 hover:bg-black/[0.03] rounded-lg md:py-3 md:px-2 lg:px-4">
              <div className={`lb-rank ${RANK_COLORS[entry.rank] || ""}`}>
                {String(entry.rank).padStart(2, "0")}
              </div>
              <div className="lb-avatar transition-transform duration-200 hover:scale-110" style={entry.avatarGradient ? { background: entry.avatarGradient } : undefined} />
              <div className="min-w-0 flex-1">
                <div className="lb-name truncate">{entry.name}</div>
                <div className="lb-meta">{entry.kg} KG &middot; {entry.hikes} TREPADAS</div>
              </div>
              <div className="font-mono shrink-0" style={{ color: "var(--ember)", fontWeight: 700 }}>{entry.cerro}</div>
            </div>
          ))}
        </div>

        {/* ── Current user highlighted row ── */}
        {address && (
          <div
            className="card mt-3 p-4 flex items-center justify-between mx-auto max-w-lg transition-shadow duration-200 hover:shadow-lg"
            style={{
              borderWidth: 2,
              borderColor: "var(--ember)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="avatar-cd m-0"
                style={{ width: 44, height: 44, fontSize: 18 }}
              >
                {(address.slice(2, 3) || "T").toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-[13px] uppercase tracking-wider" style={{ color: "var(--ink)" }}>
                  TU
                </div>
                <div className="lb-meta">
                  {isLoading ? "Cargando..." : `${myKg} KG \u00B7 ${hikes} TREPADAS`}
                </div>
              </div>
            </div>
            <Link
              href="/hike"
              className="btn btn-primary w-auto h-10 text-xs px-4 no-underline transition-transform duration-200 hover:scale-105"
            >
              TREPAR
            </Link>
          </div>
        )}

        {/* ── Footer stats ── */}
        <div className="text-center font-mono text-[10px] tracking-[0.16em] mt-8 mb-4" style={{ color: "var(--muted)" }}>
          VER TODAS LAS TX EN MONADSCAN &nearr;
        </div>
      </div>
    </AppShell>
  );
}
