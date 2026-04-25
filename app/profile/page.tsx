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

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6 md:max-w-4xl">
        {!isConnected ? (
          <div className="flex flex-col items-center gap-6 py-12 text-center">
            <span className="material-symbols-outlined text-tc-primary text-5xl">person</span>
            <h2 className="text-tc-headline-md font-semibold text-tc-primary">Conecta tu wallet</h2>
            <p className="text-sm text-tc-on-surface-variant">
              Tu perfil, NFTs y vouchers viven on-chain. Conectate para verlos.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-tc-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-tc-primary text-4xl">person</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white px-4 py-1 rounded-full shadow-md">
                  <span className="font-bold text-[12px] uppercase tracking-wider">Hiker</span>
                </div>
              </div>
              <h1 className="text-tc-headline-lg font-semibold text-tc-primary mb-1">
                {user?.email?.address?.split("@")[0] || shortAddr}
              </h1>
              <div className="flex items-center gap-2 text-tc-on-surface-variant">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="font-space-grotesk text-tc-label-web3 text-xs uppercase tracking-widest">Verified on Monad</span>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-tc-surface-container-highest">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[10px] uppercase text-stone-500 block mb-1">Total Balance</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-tc-display font-bold text-tc-primary">
                      {isBalanceLoading ? "..." : Math.floor(Number(formatted))}
                    </span>
                    <span className="font-space-grotesk text-sm font-bold text-[#FF6B00]">{TOKEN_DISPLAY_NAME}</span>
                  </div>
                </div>
                <button onClick={copyAddress} className="bg-tc-primary-container text-white p-3 rounded-2xl shadow-sm">
                  <span className="material-symbols-outlined">
                    {copied ? "check" : "account_balance_wallet"}
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-tc-primary-container text-white p-5 rounded-[24px] shadow-sm">
                <span className="text-tc-headline-md font-semibold leading-none">
                  {isStatsLoading ? "..." : kgFormatted} <small className="text-xs">KG</small>
                </span>
                <span className="font-bold text-[10px] uppercase opacity-80 mt-1 block">Collected</span>
              </div>
              <div className="bg-white p-5 rounded-[24px] shadow-sm border border-tc-surface-container-highest">
                <span className="text-tc-headline-md font-semibold leading-none text-tc-primary">
                  {isStatsLoading ? "..." : hikes.toString()}
                </span>
                <span className="font-bold text-[10px] uppercase text-stone-500 mt-1 block">Hikes</span>
              </div>
            </div>

            {/* Leaderboard Button */}
            <Link
              href="/profile/leaderboard"
              className="bg-[#FF6B00] text-white p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">military_tech</span>
                <span className="font-bold uppercase tracking-wider text-sm">Leaderboard</span>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>

            {/* On-Chain Activity */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-tc-headline-md font-semibold text-tc-primary">On-Chain Activity</h2>
              </div>

              {/* Recent NFTs */}
              {isNftsLoading ? (
                <p className="text-sm text-tc-on-surface-variant">Cargando...</p>
              ) : nfts.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-dashed border-stone-300 text-center">
                  <p className="text-sm text-tc-on-surface-variant mb-3">
                    Aun no minteas ningun rastro.
                  </p>
                  <Link href="/hike" className="text-tc-primary font-semibold text-sm underline">
                    Inicia tu primer hike
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {nfts.slice(0, 5).map((nft) => {
                    const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
                    return (
                      <div key={nft.tokenId.toString()} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <span className="material-symbols-outlined">token</span>
                          </div>
                          <div>
                            <p className="font-bold text-[12px] text-tc-primary">
                              Trepada #{nft.tokenId.toString()} - {kg} kg
                            </p>
                            <p className="text-[10px] text-stone-400">NFT minted</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-md">
                          <span className="material-symbols-outlined text-[10px] text-stone-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          <span className="font-space-grotesk text-[8px] text-stone-400 uppercase">Monad</span>
                        </div>
                      </div>
                    );
                  })}
                  {nfts.length > 5 && (
                    <Link href="/gallery" className="text-center text-sm text-tc-primary font-semibold">
                      Ver todos ({nfts.length})
                    </Link>
                  )}
                </div>
              )}
            </section>

            {/* Vouchers */}
            {redemptions.length > 0 && (
              <section>
                <h2 className="text-tc-headline-md font-semibold text-tc-primary mb-4">Mis Vouchers</h2>
                <div className="flex flex-col gap-3">
                  {redemptions.map((r) => {
                    const name = r.reward?.name ?? `Recompensa #${r.rewardId.toString()}`;
                    const catIdx = r.reward?.category;
                    const catKey = catIdx !== undefined ? CATEGORY_ORDER[catIdx] : undefined;
                    const info = catKey ? CATEGORY_INFO[catKey] : null;
                    return (
                      <div key={r.id.toString()} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                            <span className="text-xl">{info?.icon ?? "🎁"}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[12px] text-tc-primary">{name}</p>
                            <p className="text-[10px] text-stone-400">{formatDate(r.timestamp)}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                          r.claimed ? "bg-green-50 text-green-700" : "bg-orange-50 text-[#FF6B00]"
                        }`}>
                          {r.claimed ? "Claimed" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Logout */}
            <button
              onClick={() => { void logout(); }}
              className="w-full border-2 border-stone-300 text-stone-500 font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-stone-50 transition-colors"
            >
              Cerrar sesion
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
}
