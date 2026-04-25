"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { HeroIllustration } from "@/components/HeroIllustration";
import { usePrimaBalance, useHikerStats, useUserNFTs } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";
import { ConnectButton } from "@/components/ConnectButton";

function AuthenticatedDashboard() {
  const { address } = useAccount();
  const { formatted } = usePrimaBalance(address);
  const { totalKg, hikes, isLoading: statsLoading } = useHikerStats(address);
  const { nfts } = useUserNFTs(address);

  const kgFormatted = (Number(totalKg) / 1000).toFixed(1);
  const recentNfts = nfts.slice(0, 3);

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 md:items-start gap-6 font-lexend">
      {/* Map Hero */}
      <div className="relative aspect-[4/3] -mx-5 w-[calc(100%+40px)] md:mx-0 md:w-full md:aspect-[16/9] overflow-hidden rounded-3xl md:row-span-3">
        <HeroIllustration className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f8] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <Link
            href="/hike"
            className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl shadow-[0_8px_30px_rgba(255,107,0,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
            <span className="font-lexend text-tc-cta tracking-widest font-bold uppercase">
              START TREPADA
            </span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col items-center">
          <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Balance</span>
          <span className="font-lexend text-tc-headline-md text-tc-primary">{Math.floor(Number(formatted))}</span>
          <span className="text-[10px] font-bold text-[#FF6B00]">{TOKEN_DISPLAY_NAME}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col items-center">
          <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Recolectado</span>
          <span className="font-lexend text-tc-headline-md text-tc-primary">
            {statsLoading ? "..." : kgFormatted}
          </span>
          <span className="text-[10px] text-stone-500">KG</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col items-center">
          <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Hikes</span>
          <span className="font-lexend text-tc-headline-md text-tc-primary">
            {statsLoading ? "..." : hikes.toString()}
          </span>
          <span className="text-[10px] text-stone-500">total</span>
        </div>
      </div>

      {/* Recent Hikes */}
      {recentNfts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-lexend text-tc-headline-md text-tc-primary">Recent Trails</h2>
            <Link href="/gallery" className="font-lexend text-tc-cta text-[12px] text-stone-500 uppercase">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentNfts.map((nft) => {
              const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
              const km = (Number(nft.rastro.distanceMeters) / 1000).toFixed(1);
              return (
                <Link key={nft.tokenId.toString()} href="/gallery">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-tc-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-tc-primary text-[18px]">hiking</span>
                      </div>
                      <div>
                        <p className="font-lexend font-semibold text-sm text-tc-on-surface">
                          Trepada #{nft.tokenId.toString()}
                        </p>
                        <p className="text-[12px] text-stone-500">{km} km | {kg} kg</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-stone-400">chevron_right</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/rewards"
          className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col items-center gap-2"
        >
          <span className="material-symbols-outlined text-[#FF6B00] text-3xl">storefront</span>
          <span className="font-lexend text-tc-cta text-[12px] uppercase text-tc-primary">Rewards</span>
        </Link>
        <Link
          href="/wiki"
          className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col items-center gap-2"
        >
          <span className="material-symbols-outlined text-tc-primary text-3xl">menu_book</span>
          <span className="font-lexend text-tc-cta text-[12px] uppercase text-tc-primary">Wiki</span>
        </Link>
      </div>
    </div>
  );
}

function LandingHero() {
  const { login } = usePrivy();
  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center px-5 font-lexend">
      <div className="max-w-[480px] md:max-w-[600px] w-full text-center space-y-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#2D5A27] text-4xl">landscape</span>
          <span className="font-black text-[#2D5A27] tracking-widest uppercase text-3xl">TREPACERROS</span>
        </div>

        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
          <HeroIllustration className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white text-left">
            <h1 className="text-tc-headline-lg font-semibold leading-tight">
              Limpia el cerro,<br />gana tokens
            </h1>
            <p className="text-sm opacity-90 mt-2">
              Recolecta basura en senderos de GDL. Gana {TOKEN_DISPLAY_NAME}, redime recompensas locales.
            </p>
          </div>
        </div>

        <button
          onClick={login}
          className="w-full bg-[#FF6B00] text-white py-5 rounded-2xl shadow-[0_8px_30px_rgba(255,107,0,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
          <span className="font-bold text-tc-cta tracking-widest uppercase">CONECTAR WALLET</span>
        </button>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="material-symbols-outlined text-[#2D5A27] text-2xl">eco</span>
            <p className="text-xs text-stone-600 mt-1">Limpia senderos</p>
          </div>
          <div>
            <span className="material-symbols-outlined text-[#FF6B00] text-2xl">token</span>
            <p className="text-xs text-stone-600 mt-1">Gana {TOKEN_DISPLAY_NAME}</p>
          </div>
          <div>
            <span className="material-symbols-outlined text-[#2D5A27] text-2xl">redeem</span>
            <p className="text-xs text-stone-600 mt-1">Redime local</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { authenticated } = usePrivy();

  if (!authenticated) {
    return <LandingHero />;
  }

  return (
    <AppShell>
      <AuthenticatedDashboard />
    </AppShell>
  );
}
