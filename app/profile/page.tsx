"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { AppShell } from "@/components/AppShell";
import { ConnectButton } from "@/components/ConnectButton";
import {
  useUserNFTs,
  useHikerStats,
  usePrimaBalance,
  type UserNFT,
} from "@/hooks/useRastros";
import {
  useUserRedemptions,
  type UserRedemption,
} from "@/hooks/useRewards";
import { CATEGORY_INFO, type RewardCategory } from "@/data/rewards";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";
import { useCountUp } from "@/hooks/useCountUp";

const CATEGORY_ORDER: RewardCategory[] = [
  "IMMEDIATE", "EXPERIENCE", "OUTDOOR", "SUSTAINABILITY",
  "DONATION", "SERVICE", "MERCH", "EXCLUSIVE",
];

function formatDate(ts: bigint): string {
  const ms = Number(ts) * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

/* -- Badge definitions (matches HTML design exactly) -- */
const BADGES = [
  { icon: "\u{1F331}", name: "Brote", unlocked: true },
  { icon: "\u{1F97E}", name: "1ra trepada", unlocked: true },
  { icon: "\u267B", name: "PET \u00D710", unlocked: true },
  { icon: "\u{1F512}", name: "Cumbre", unlocked: false },
  { icon: "\u{1F512}", name: "Madruga", unlocked: false },
  { icon: "\u{1F512}", name: "10 KG", unlocked: false },
  { icon: "\u{1F512}", name: "Veterano", unlocked: false },
  { icon: "\u{1F512}", name: "7 dias", unlocked: false },
];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { user, logout } = usePrivy();

  const { nfts, isLoading: isNftsLoading } = useUserNFTs(address);
  const { totalKg, hikes, isLoading: isStatsLoading } = useHikerStats(address);
  const { formatted, isLoading: isBalanceLoading } = usePrimaBalance(address);
  const { redemptions, isLoading: isRedemptionsLoading } = useUserRedemptions(address);

  const kgFormatted = useMemo(() => (Number(totalKg) / 1000).toFixed(1), [totalKg]);

  const animatedBalance = useCountUp(Math.floor(Number(formatted)));
  const shortAddr = address ? `${address.slice(0, 6)}\u2026${address.slice(-4)}` : "";
  const displayName = user?.email?.address?.split("@")[0] || shortAddr;

  return (
    <AppShell>
      {!isConnected ? (
        <div className="flex flex-col items-center gap-6 py-16 text-center font-lexend">
          <div className="w-20 h-20 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--muted)" }}>
              <circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>
            </svg>
          </div>
          <h2 className="font-big-shoulders text-2xl font-black uppercase tracking-wider" style={{ color: "var(--ink)" }}>
            Conecta tu wallet
          </h2>
          <p className="text-sm max-w-[280px]" style={{ color: "var(--muted)" }}>
            Tu perfil, NFTs y vouchers viven on-chain. Conectate para verlos.
          </p>
          <ConnectButton />
        </div>
      ) : (
        <div className="px-[18px] md:px-0">
          {/* -- 2-column desktop layout -- */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* ===== LEFT COLUMN ===== */}
            <div>
              {/* -- Avatar + Rank -- */}
              <div className="text-center lg:text-left mt-3">
                <div className="avatar-cd lg:mx-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="rank-pill lg:mx-0 lg:inline-block">TREPADOR &middot; LV3</div>
                <div className="font-big-shoulders text-2xl font-black mt-3" style={{ color: "var(--ink)" }}>
                  {shortAddr}
                </div>
                <div className="flex gap-2 items-center justify-center lg:justify-start mt-2">
                  <span className="chip chip-moss">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>
                    </svg>
                    VERIFIED ON MONAD
                  </span>
                </div>
              </div>

              {/* -- Balance Card -- */}
              <div className="card mt-5 p-[18px] flex items-center gap-3.5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div>
                  <div className="eyebrow"><span>BALANCE TOTAL</span></div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-big-shoulders text-[42px] font-black leading-none" style={{ color: "var(--ink)" }}>
                      {isBalanceLoading ? "..." : animatedBalance.toLocaleString()}
                    </span>
                    <span className="font-mono font-bold" style={{ color: "var(--ember)" }}>{TOKEN_DISPLAY_NAME}</span>
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>&asymp; $0.00 MXN</div>
                </div>
                <div className="flex-1" />
                <div className="flex flex-col gap-2">
                  <button className="h-9 px-3 text-[11px] rounded-[10px] border font-bold cursor-pointer" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                    DEPOSITAR
                  </button>
                  <button className="h-9 px-3 text-[11px] rounded-[10px] border font-bold cursor-pointer" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
                    RETIRAR
                  </button>
                </div>
              </div>

              {/* -- KG / Trepadas stat row -- */}
              <div className="flex gap-2 mt-3">
                <div className="card stat flex-1 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "var(--ink)", color: "#fff", borderColor: "transparent" }}>
                  <span className="lbl" style={{ color: "rgba(255,255,255,0.6)" }}>KG Recolectados</span>
                  <span className="val mono" style={{ color: "#fff" }}>
                    {isStatsLoading ? "..." : kgFormatted}
                  </span>
                  <span className="sub" style={{ color: "oklch(0.7 0.18 145)" }}>MEDIO AMBIENTE</span>
                </div>
                <div className="card stat flex-1 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="lbl">Trepadas</span>
                  <span className="val mono">
                    {isStatsLoading ? "..." : hikes.toString()}
                  </span>
                  <span className="sub">SESIONES</span>
                </div>
              </div>

              {/* -- Leaderboard CTA -- */}
              <Link href="/profile/leaderboard" className="btn btn-primary mt-4 no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M8 3h8l-1 7h-6z"/><path d="M5 6h-2a3 3 0 0 0 3 3M19 6h2a3 3 0 0 1-3 3"/><path d="M9 14h6v6H9z"/>
                </svg>
                VER LEADERBOARD
                <span className="font-mono font-semibold text-xs opacity-85 ml-auto">#214</span>
              </Link>

              {/* -- Logout (desktop: stays at bottom of left col) -- */}
              <div className="hidden lg:block mt-6">
                <button
                  onClick={() => { void logout(); }}
                  className="btn btn-secondary w-full transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Cerrar Sesion
                </button>
              </div>
            </div>

            {/* ===== RIGHT COLUMN ===== */}
            <div>
              {/* -- Badges -- */}
              <div className="flex justify-between items-center mt-6 lg:mt-3 mb-3">
                <h2 className="h-section">Insignias</h2>
                <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: "var(--muted)" }}>
                  {BADGES.filter((b) => b.unlocked).length} / {BADGES.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {BADGES.map((badge) => (
                  <div
                    key={badge.name}
                    className={`badge-cd transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg${badge.unlocked ? "" : " locked"}`}
                  >
                    <div className={badge.unlocked ? "text-2xl" : "text-[22px]"}>{badge.icon}</div>
                    <span className="b-name">{badge.name}</span>
                  </div>
                ))}
              </div>

              {/* -- On-chain activity -- */}
              <div className="flex justify-between items-center mt-6 mb-3">
                <h2 className="h-section">Actividad on-chain</h2>
                <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: "var(--muted)" }}>MONAD</span>
              </div>

              {isNftsLoading ? (
                <p className="text-sm" style={{ color: "var(--muted)" }}>Cargando...</p>
              ) : nfts.length === 0 && redemptions.length === 0 ? (
                <div className="card p-6 text-center border-dashed transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>Aun no tienes actividad on-chain.</p>
                  <Link href="/hike" className="font-semibold text-sm underline" style={{ color: "var(--ember)" }}>
                    Inicia tu primer hike
                  </Link>
                </div>
              ) : (
                <div className="card px-4 py-1.5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  {/* NFT mints as ledger rows */}
                  {nfts.slice(0, 5).map((nft) => {
                    const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
                    return (
                      <div key={`nft-${nft.tokenId.toString()}`} className="ledger-row">
                        <div className="ledger-icon" style={{ background: "color-mix(in oklch, var(--moss) 16%, var(--paper))", color: "var(--moss)" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 20l5.5-9 4 6 3-4L21 20z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-[13px]">Trepada #{nft.tokenId.toString()} - {kg} kg</div>
                          <div className="lb-meta">NFT Minted</div>
                        </div>
                        <div className="ledger-amt pos">+{Math.floor(Number(nft.rastro.trashGrams) / 5)}</div>
                      </div>
                    );
                  })}

                  {/* Voucher redemptions */}
                  {redemptions.slice(0, 5).map((r) => {
                    const name = r.reward?.name ?? `Recompensa #${r.rewardId.toString()}`;
                    return (
                      <div key={`red-${r.id.toString()}`} className="ledger-row">
                        <div className="ledger-icon" style={{ background: "color-mix(in oklch, var(--ember) 16%, var(--paper))", color: "var(--ember)" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18l-2 13H5z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-[13px]">{name}</div>
                          <div className="lb-meta">{formatDate(r.timestamp)}</div>
                        </div>
                        <div className="ledger-amt" style={{ color: r.claimed ? "var(--muted)" : "var(--moss)" }}>{r.claimed ? "Canjeado" : "Activo"}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* -- MonadScan link -- */}
              <div className="text-center font-mono text-[10px] tracking-[0.16em] mt-8 mb-4" style={{ color: "var(--muted)" }}>
                VER TODAS LAS TX EN MONADSCAN &nearr;
              </div>
            </div>
          </div>

          {/* -- Logout (mobile only) -- */}
          <div className="lg:hidden mt-4 mb-4">
            <button
              onClick={() => { void logout(); }}
              className="btn btn-secondary w-full"
            >
              Cerrar Sesion
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
