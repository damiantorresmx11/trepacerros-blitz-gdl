"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

const CATEGORY_ORDER: RewardCategory[] = [
  "IMMEDIATE",
  "EXPERIENCE",
  "OUTDOOR",
  "SUSTAINABILITY",
  "DONATION",
  "SERVICE",
  "MERCH",
  "EXCLUSIVE",
];

function shortAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function shortHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function loginMethodLabel(user: ReturnType<typeof usePrivy>["user"]): string | null {
  if (!user) return null;
  if (user.email?.address) return user.email.address;
  if (user.google?.email) return user.google.email;
  if (user.wallet?.address) return "Wallet conectada";
  return null;
}

interface NftStripProps {
  nfts: UserNFT[];
}

function NftStrip({ nfts }: NftStripProps) {
  const items = nfts.slice(0, 3);
  if (items.length === 0) {
    return (
      <Card className="bg-background border border-dashed border-foreground/15">
        <p className="text-sm text-foreground/60 text-center py-2">
          Aún no minteas ningún rastro.{" "}
          <Link href="/hike" className="text-primary underline">
            Inicia tu primer hike
          </Link>
          .
        </p>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((nft) => {
        const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
        return (
          <Link
            key={nft.tokenId.toString()}
            href="/gallery"
            className="block"
          >
            <Card className="p-3 bg-background border border-foreground/10 hover:border-primary/40 transition-colors">
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center text-3xl mb-2">
                <span aria-hidden="true">🥾</span>
              </div>
              <p className="font-display text-sm leading-tight">
                #{nft.tokenId.toString()}
              </p>
              <p className="text-xs text-foreground/60">{kg} kg</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

interface VoucherRowProps {
  redemption: UserRedemption;
}

function VoucherRow({ redemption }: VoucherRowProps) {
  const name =
    redemption.reward?.name ?? `Recompensa #${redemption.rewardId.toString()}`;
  const catIdx = redemption.reward?.category;
  const catKey =
    catIdx !== undefined ? CATEGORY_ORDER[catIdx] : undefined;
  const info = catKey ? CATEGORY_INFO[catKey] : null;

  return (
    <Card className="p-4 bg-background border border-foreground/10">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{
            background: info ? `${info.color}20` : "#A8A8A020",
          }}
          aria-hidden="true"
        >
          {info?.icon ?? "🎁"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base leading-snug truncate">
              {name}
            </h3>
            {redemption.claimed ? (
              <Badge variant="success" className="shrink-0">
                Reclamado
              </Badge>
            ) : (
              <Badge variant="warning" className="shrink-0">
                Pendiente
              </Badge>
            )}
          </div>
          <p className="text-xs text-foreground/60 mt-1">
            {formatDate(redemption.timestamp)}
          </p>
          <p className="text-[11px] text-foreground/55 font-mono mt-2 break-all">
            {shortHash(redemption.voucherCode)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { user, logout } = usePrivy();

  const { nfts, isLoading: isNftsLoading } = useUserNFTs(address);
  const { totalKg, hikes, isLoading: isStatsLoading } = useHikerStats(address);
  const { formatted, isLoading: isBalanceLoading } = usePrimaBalance(address);
  const {
    redemptions,
    isLoading: isRedemptionsLoading,
  } = useUserRedemptions(address);

  const [copied, setCopied] = useState(false);

  const kgFormatted = useMemo(() => {
    const kg = totalKg / 1000n;
    return kg.toString();
  }, [totalKg]);

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  const loginLabel = loginMethodLabel(user);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans pb-12">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-foreground/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm text-foreground/70 hover:text-foreground"
          >
            ← Inicio
          </Link>
          <h1 className="font-display text-lg sm:text-xl">Mi perfil</h1>
          <div className="w-12" />
        </div>
      </header>

      {!isConnected ? (
        <section className="max-w-md mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-3xl mb-3">Conecta tu wallet</h2>
          <p className="text-foreground/70 mb-8">
            Tu perfil, NFTs y vouchers viven on-chain. Conéctate para verlos.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </section>
      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Wallet card */}
          <Card className="bg-background border border-foreground/10">
            <p className="text-[11px] uppercase tracking-wide text-foreground/55 mb-1">
              Tu wallet
            </p>
            <button
              onClick={copyAddress}
              className="font-mono text-base text-foreground hover:text-primary transition-colors"
              title="Copiar dirección"
            >
              {address ? shortAddress(address) : "—"}
              <span className="ml-2 text-xs text-foreground/50">
                {copied ? "¡Copiado!" : "(toca para copiar)"}
              </span>
            </button>
            {loginLabel && (
              <p className="text-xs text-foreground/60 mt-1">
                Login: {loginLabel}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-foreground/10">
              <p className="text-[11px] uppercase tracking-wide text-foreground/55">
                Balance PRIMA
              </p>
              <p className="font-display text-4xl text-primary leading-none mt-1">
                {isBalanceLoading ? "…" : formatted}
              </p>
            </div>
          </Card>

          {/* Hiker stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-background border border-foreground/10 p-4 text-center">
              <p className="font-display text-2xl text-primary">
                {isNftsLoading ? "…" : nfts.length}
              </p>
              <p className="text-xs text-foreground/60 mt-1">NFTs</p>
            </Card>
            <Card className="bg-background border border-foreground/10 p-4 text-center">
              <p className="font-display text-2xl text-primary">
                {isStatsLoading ? "…" : kgFormatted}
              </p>
              <p className="text-xs text-foreground/60 mt-1">kg recogidos</p>
            </Card>
            <Card className="bg-background border border-foreground/10 p-4 text-center">
              <p className="font-display text-2xl text-primary">
                {isStatsLoading ? "…" : hikes.toString()}
              </p>
              <p className="text-xs text-foreground/60 mt-1">hikes</p>
            </Card>
          </div>

          {/* Recent NFTs */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl">Últimos rastros</h2>
              {nfts.length > 0 && (
                <Link
                  href="/gallery"
                  className="text-sm text-primary hover:underline"
                >
                  Ver todos
                </Link>
              )}
            </div>
            <NftStrip nfts={nfts} />
          </section>

          {/* Vouchers */}
          <section>
            <h2 className="font-display text-xl mb-3">Mis vouchers</h2>
            {isRedemptionsLoading && (
              <p className="text-sm text-foreground/60">Cargando vouchers…</p>
            )}
            {!isRedemptionsLoading && redemptions.length === 0 && (
              <Card className="bg-background border border-dashed border-foreground/15 text-center py-8">
                <p className="text-sm text-foreground/70 mb-4">
                  Aún no has canjeado recompensas — explora el catálogo.
                </p>
                <Link href="/rewards">
                  <Button variant="primary" size="md">
                    Ver recompensas
                  </Button>
                </Link>
              </Card>
            )}
            {redemptions.length > 0 && (
              <ul className="space-y-3">
                {redemptions.map((r) => (
                  <li key={r.id.toString()}>
                    <VoucherRow redemption={r} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Logout */}
          <div className="pt-4">
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                void logout();
              }}
              className="w-full"
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
