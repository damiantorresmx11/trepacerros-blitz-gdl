"use client";

import { useMemo, useState } from "react";
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

const CATEGORY_ORDER: RewardCategory[] = [
  "IMMEDIATE", "EXPERIENCE", "OUTDOOR", "SUSTAINABILITY",
  "DONATION", "SERVICE", "MERCH", "EXCLUSIVE",
];

function shortHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Badge definitions ── */
const BADGES = [
  { icon: "\u{1F331}", name: "Brote", unlocked: true },
  { icon: "\u{1F97E}", name: "1ra Trepada", unlocked: true },
  { icon: "\u267B\uFE0F", name: "PET x10", unlocked: true },
  { icon: "\u{1F3D4}\uFE0F", name: "Cumbre", unlocked: false },
  { icon: "\u{1F305}", name: "Madruga", unlocked: false },
  { icon: "\u{1F4AA}", name: "10 KG", unlocked: false },
];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { user, logout } = usePrivy();

  const { nfts, isLoading: isNftsLoading } = useUserNFTs(address);
  const { totalKg, hikes, isLoading: isStatsLoading } = useHikerStats(address);
  const { formatted, isLoading: isBalanceLoading } = usePrimaBalance(address);
  const { redemptions, isLoading: isRedemptionsLoading } = useUserRedemptions(address);

  const [copied, setCopied] = useState(false);

  const kgFormatted = useMemo(() => {
    return (Number(totalKg) / 1000).toFixed(1);
  }, [totalKg]);

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const displayName = user?.email?.address?.split("@")[0] || shortAddr;

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6">
        {!isConnected ? (
          /* ── Not connected ── */
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-cd-paper border border-cd-ink/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-cd-muted text-4xl">person</span>
            </div>
            <h2 className="font-big-shoulders text-2xl font-black uppercase tracking-wider text-cd-ink">
              Conecta tu wallet
            </h2>
            <p className="text-sm text-cd-muted max-w-[280px]">
              Tu perfil, NFTs y vouchers viven on-chain. Conectate para verlos.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* ── Profile Header ── */}
            <div className="flex flex-col items-center text-center pt-4">
              <div className="relative mb-2">
                {/* Avatar */}
                <div
                  className="w-24 h-24 rounded-full border-[3px] border-cd-paper shadow-lg flex items-center justify-center text-white font-big-shoulders font-black text-4xl"
                  style={{ background: "linear-gradient(135deg, oklch(0.75 0.09 145), oklch(0.55 0.12 150))" }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                {/* Rank pill */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 bg-cd-ember text-white px-3.5 py-1.5 rounded-full shadow-lg"
                  style={{ boxShadow: "0 8px 18px -6px var(--color-cd-ember, #e85d2a)" }}
                >
                  <span className="font-bold text-[11px] uppercase tracking-[0.18em] whitespace-nowrap">
                    TREPADOR LV3
                  </span>
                </div>
              </div>

              <h1 className="font-big-shoulders text-2xl font-black text-cd-ink mt-5 uppercase tracking-wide">
                {displayName}
              </h1>

              <div className="flex items-center gap-2 mt-1">
                <span className="coordinate-chip flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
                  </svg>
                  VERIFIED ON MONAD
                </span>
              </div>
            </div>

            {/* ── Balance Card ── */}
            <div className="solid-card p-5 flex items-center gap-4">
              <div className="flex-1">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-cd-muted block mb-1">
                  Balance Total
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-black leading-none text-cd-ink">
                    {isBalanceLoading ? "..." : Math.floor(Number(formatted))}
                  </span>
                  <span className="font-mono text-sm font-bold text-cd-ember">{TOKEN_DISPLAY_NAME}</span>
                </div>
              </div>
              <button
                onClick={copyAddress}
                className="haptic-active w-12 h-12 rounded-[14px] border border-cd-ink/10 bg-cd-paper flex items-center justify-center text-cd-ink hover:bg-cd-ink/5 transition-colors"
                title="Copy address"
              >
                <span className="material-symbols-outlined text-xl">
                  {copied ? "check" : "content_copy"}
                </span>
              </button>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-3 gap-3">
              <div className="solid-card p-4 bg-cd-ink! text-white" style={{ background: "var(--color-cd-ink, #1a2e1f)", borderColor: "transparent" }}>
                <span className="font-mono text-3xl font-black leading-none block">
                  {isStatsLoading ? "..." : kgFormatted}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] opacity-60 mt-2 block">
                  KG Recolectados
                </span>
              </div>
              <div className="solid-card p-4">
                <span className="font-mono text-3xl font-black leading-none text-cd-ink block">
                  {isStatsLoading ? "..." : hikes.toString()}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-cd-muted mt-2 block">
                  Trepadas
                </span>
              </div>
              <div className="solid-card p-4">
                <span className="font-mono text-3xl font-black leading-none text-cd-ink block">
                  {isNftsLoading ? "..." : nfts.length.toString()}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-cd-muted mt-2 block">
                  NFTs Minted
                </span>
              </div>
            </div>

            {/* ── Leaderboard CTA ── */}
            <Link
              href="/profile/leaderboard"
              className="haptic-active solid-card p-4 flex items-center justify-between bg-cd-ember! text-white"
              style={{ background: "var(--color-cd-ember, #e85d2a)", borderColor: "transparent" }}
            >
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M8 3h8l-1 7h-6z" /><path d="M5 6h-2a3 3 0 0 0 3 3M19 6h2a3 3 0 0 1-3 3" /><path d="M9 14h6v6H9z" />
                </svg>
                <span className="font-bold text-sm uppercase tracking-[0.12em]">Ver Leaderboard</span>
              </div>
              <span className="font-mono text-xs font-semibold opacity-80">#214</span>
            </Link>

            {/* ── Passport Stamps ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-big-shoulders text-lg font-black uppercase tracking-wider text-cd-ink">
                  Insignias
                </h2>
                <span className="font-mono text-[11px] tracking-[0.1em] text-cd-muted">
                  {BADGES.filter((b) => b.unlocked).length} / {BADGES.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {BADGES.map((badge) => (
                  <div
                    key={badge.name}
                    className={`aspect-square rounded-[14px] flex flex-col items-center justify-center gap-1 text-center ${
                      badge.unlocked
                        ? "bg-cd-ink/[0.04] border border-cd-ink/10 text-cd-ink"
                        : "border border-dashed border-cd-ink/10 text-cd-muted"
                    }`}
                  >
                    <span className="text-2xl">{badge.unlocked ? badge.icon : "\u{1F512}"}</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.08em]">{badge.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── On-Chain Activity ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-big-shoulders text-lg font-black uppercase tracking-wider text-cd-ink">
                  Actividad On-Chain
                </h2>
                <span className="font-mono text-[11px] tracking-[0.1em] text-cd-muted">MONAD</span>
              </div>

              {isNftsLoading ? (
                <p className="text-sm text-cd-muted">Cargando...</p>
              ) : nfts.length === 0 && redemptions.length === 0 ? (
                <div className="solid-card p-6 text-center border-dashed!">
                  <p className="text-sm text-cd-muted mb-3">Aun no tienes actividad on-chain.</p>
                  <Link href="/hike" className="text-cd-ember font-semibold text-sm underline">
                    Inicia tu primer hike
                  </Link>
                </div>
              ) : (
                <div className="solid-card overflow-hidden" style={{ padding: "6px 16px" }}>
                  {/* NFT mints */}
                  {nfts.slice(0, 5).map((nft) => {
                    const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
                    return (
                      <div
                        key={`nft-${nft.tokenId.toString()}`}
                        className="grid items-center gap-3 py-3 border-b border-dashed border-cd-ink/10 last:border-b-0"
                        style={{ gridTemplateColumns: "auto 1fr auto" }}
                      >
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                          style={{ background: "color-mix(in oklch, var(--color-cd-moss, #2d5a3e) 16%, var(--color-cd-paper, #fdfcf7))", color: "var(--color-cd-moss, #2d5a3e)" }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 20l5.5-9 4 6 3-4L21 20z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-[13px] text-cd-ink">
                            Trepada #{nft.tokenId.toString()} - {kg} kg
                          </p>
                          <p className="font-mono text-[11px] text-cd-muted">NFT Minted</p>
                        </div>
                        <span className="font-mono text-[13px] font-bold" style={{ color: "oklch(0.55 0.16 145)" }}>
                          +{Math.floor(Number(nft.rastro.trashGrams) / 5)}
                        </span>
                      </div>
                    );
                  })}

                  {/* Voucher redemptions */}
                  {redemptions.slice(0, 5).map((r) => {
                    const name = r.reward?.name ?? `Recompensa #${r.rewardId.toString()}`;
                    const catIdx = r.reward?.category;
                    const catKey = catIdx !== undefined ? CATEGORY_ORDER[catIdx] : undefined;
                    const info = catKey ? CATEGORY_INFO[catKey] : null;
                    return (
                      <div
                        key={`red-${r.id.toString()}`}
                        className="grid items-center gap-3 py-3 border-b border-dashed border-cd-ink/10 last:border-b-0"
                        style={{ gridTemplateColumns: "auto 1fr auto" }}
                      >
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                          style={{ background: "color-mix(in oklch, var(--color-cd-ember, #e85d2a) 16%, var(--color-cd-paper, #fdfcf7))", color: "var(--color-cd-ember, #e85d2a)" }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18l-2 13H5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-[13px] text-cd-ink">{name}</p>
                          <p className="font-mono text-[11px] text-cd-muted">{formatDate(r.timestamp)}</p>
                        </div>
                        <span className="font-mono text-[13px] font-bold text-cd-ember">
                          {r.claimed ? "Claimed" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {nfts.length > 5 && (
                <Link href="/gallery" className="block text-center text-sm font-mono text-cd-muted mt-3 tracking-[0.1em] uppercase">
                  Ver todos ({nfts.length}) &rarr;
                </Link>
              )}
            </section>

            {/* ── Logout ── */}
            <button
              onClick={() => { void logout(); }}
              className="haptic-active w-full solid-card py-4 text-cd-muted font-bold text-sm uppercase tracking-[0.16em] hover:text-cd-ink transition-colors"
            >
              Cerrar Sesion
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
}
