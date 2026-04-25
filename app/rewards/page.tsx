"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConnectButton } from "@/components/ConnectButton";
import { usePrimaBalance } from "@/hooks/useRastros";
import {
  useRewardsList,
  useRedeemReward,
  useApprovePrima,
  type RewardOnChain,
} from "@/hooks/useRewards";
import { CATEGORY_INFO, type RewardCategory } from "@/data/rewards";
import { ipfsToGateway } from "@/lib/ipfs";

// Order matches the on-chain category enum (0..7).
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

const APPROVE_FLAG_KEY = "rastros_prima_approved";
const EXPLORER_TX = "https://testnet.monadexplorer.com/tx/";

function formatPrima(amount: bigint): string {
  // Rewards are denominated in whole PRIMA on chain (18 decimals scaled).
  // We show the integer part since costInPrima is the human-facing number.
  const whole = amount / 10n ** 18n;
  return whole.toString();
}

function categoryFromIndex(idx: number): RewardCategory | undefined {
  return CATEGORY_ORDER[idx];
}

interface ConfirmModalProps {
  reward: RewardOnChain;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
  errorMessage: string | null;
}

function ConfirmModal({
  reward,
  onConfirm,
  onClose,
  isPending,
  errorMessage,
}: ConfirmModalProps) {
  const catKey = categoryFromIndex(reward.category);
  const info = catKey ? CATEGORY_INFO[catKey] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-background text-foreground rounded-t-3xl sm:rounded-3xl shadow-xl p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-display text-2xl leading-tight">
            Confirmar canje
          </h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-foreground/50 hover:text-foreground text-2xl leading-none disabled:opacity-40"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {info && (
            <span
              className="text-3xl"
              style={{ color: info.color }}
              aria-hidden="true"
            >
              {info.icon}
            </span>
          )}
          <div>
            <p className="font-display text-lg leading-snug">{reward.name}</p>
            {info && (
              <p className="text-xs text-foreground/60">{info.label}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-foreground/75 mb-5">{reward.description}</p>

        <div className="bg-foreground/5 rounded-xl px-4 py-3 mb-5 flex items-baseline justify-between">
          <span className="text-sm text-foreground/70">Costo</span>
          <span className="font-display text-2xl text-primary">
            {formatPrima(reward.costInPrima)} <span className="text-sm text-foreground/60">PRIMA</span>
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 text-sm text-warm bg-warm/10 rounded-lg p-3">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Procesando..." : "Confirmar canje"}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isPending}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

interface VoucherModalProps {
  reward: RewardOnChain;
  txHash: `0x${string}`;
  onClose: () => void;
}

function VoucherModal({ reward, txHash, onClose }: VoucherModalProps) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-background text-foreground rounded-t-3xl sm:rounded-3xl shadow-xl p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl" aria-hidden="true">
            🎉
          </span>
          <h3 className="font-display text-2xl">¡Canje exitoso!</h3>
        </div>

        <p className="text-sm text-foreground/75 mb-5">
          Quemaste{" "}
          <strong className="text-primary">
            {formatPrima(reward.costInPrima)} PRIMA
          </strong>{" "}
          por{" "}
          <strong className="text-foreground">{reward.name}</strong>.
        </p>

        <a
          href={`${EXPLORER_TX}${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-foreground/5 hover:bg-foreground/10 rounded-xl px-4 py-3 mb-4 transition-colors"
        >
          <p className="text-xs text-foreground/60 mb-1">Tx hash</p>
          <p className="font-mono text-xs text-primary break-all">
            {txHash}
          </p>
        </a>

        <p className="text-xs text-foreground/60 mb-5">
          Tu voucher quedó registrado on-chain. Lo encuentras en{" "}
          <Link href="/profile" className="text-primary underline">
            /profile
          </Link>
          .
        </p>

        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/profile")}
            className="w-full"
          >
            Ir a mi perfil
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className="w-full"
          >
            Seguir explorando
          </Button>
        </div>
      </div>
    </div>
  );
}

interface RewardCardProps {
  reward: RewardOnChain;
  balance: bigint;
  onClick: (r: RewardOnChain) => void;
}

function RewardCard({ reward, balance, onClick }: RewardCardProps) {
  const [imgError, setImgError] = useState(false);
  const catKey = categoryFromIndex(reward.category);
  const info = catKey ? CATEGORY_INFO[catKey] : null;
  const canAfford = balance >= reward.costInPrima;
  const lowStock = reward.stock < 50n && reward.stock > 0n;
  const outOfStock = reward.stock === 0n;
  const disabled = !canAfford || outOfStock;

  const imgSrc = reward.imageURI ? ipfsToGateway(reward.imageURI) : "";
  const showImage = Boolean(imgSrc) && !imgError;

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick(reward)}
      disabled={disabled}
      className={`text-left w-full ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.01] transition-transform"}`}
    >
      <Card className="bg-background border border-foreground/10 overflow-hidden p-0 h-full flex flex-col">
        <div
          className="aspect-[4/3] w-full flex items-center justify-center text-5xl"
          style={{
            background: info ? `${info.color}20` : "#A8A8A020",
            color: info?.color ?? "#1A1A1A",
          }}
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={reward.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span aria-hidden="true">{info?.icon ?? "🎁"}</span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-base leading-snug text-foreground">
              {reward.name}
            </h3>
            {lowStock && (
              <Badge variant="warning" className="shrink-0">
                Quedan {reward.stock.toString()}
              </Badge>
            )}
            {outOfStock && (
              <Badge variant="default" className="shrink-0">
                Agotado
              </Badge>
            )}
          </div>
          <p className="text-xs text-foreground/65 leading-snug mb-3 line-clamp-2">
            {reward.description}
          </p>
          <div className="mt-auto flex items-baseline justify-between">
            <span className="font-display text-xl text-primary">
              {formatPrima(reward.costInPrima)}{" "}
              <span className="text-xs text-foreground/60">PRIMA</span>
            </span>
            {!canAfford && !outOfStock && (
              <span className="text-xs text-warm">Te faltan PRIMA</span>
            )}
          </div>
        </div>
      </Card>
    </button>
  );
}

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const {
    balance,
    formatted,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = usePrimaBalance(address);
  const {
    rewards,
    isLoading: isRewardsLoading,
    error: rewardsError,
  } = useRewardsList();
  const { redeem, isPending: isRedeemPending } = useRedeemReward();
  const { approve } = useApprovePrima();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedReward, setSelectedReward] = useState<RewardOnChain | null>(
    null,
  );
  const [voucher, setVoucher] = useState<{
    reward: RewardOnChain;
    txHash: `0x${string}`;
  } | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = useMemo(() => {
    if (selectedCategory === null) return rewards;
    return rewards.filter((r) => r.category === selectedCategory);
  }, [rewards, selectedCategory]);

  // Reset transient error when modal closes/opens
  useEffect(() => {
    if (!selectedReward) setConfirmError(null);
  }, [selectedReward]);

  async function handleConfirm() {
    if (!selectedReward) return;
    setIsProcessing(true);
    setConfirmError(null);
    try {
      // PrimaToken.burnFrom is a custom burner-only fn that does NOT consume ERC20 allowance,
      // so this approve is functionally a no-op; we attempt it once per session and ignore failure.
      const alreadyApproved =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(APPROVE_FLAG_KEY) === "1";
      if (!alreadyApproved) {
        try {
          await approve();
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(APPROVE_FLAG_KEY, "1");
          }
        } catch (err) {
          // Non-fatal: PrimaToken.burnFrom skips allowance check.
          console.warn("PRIMA approve failed (non-fatal):", err);
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(APPROVE_FLAG_KEY, "1");
          }
        }
      }

      const txHash = await redeem(selectedReward.id);
      setVoucher({ reward: selectedReward, txHash });
      setSelectedReward(null);
      refetchBalance();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "No se pudo completar el canje.";
      setConfirmError(msg);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-foreground/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm text-foreground/70 hover:text-foreground"
          >
            ← Inicio
          </Link>
          <h1 className="font-display text-lg sm:text-xl absolute left-1/2 -translate-x-1/2">
            Recompensas
          </h1>
          <div className="text-right">
            {isConnected ? (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground/55 leading-none">
                  Tu balance
                </p>
                <p className="font-display text-base text-primary leading-tight">
                  {isBalanceLoading ? "…" : `${formatted} PRIMA`}
                </p>
              </div>
            ) : (
              <span className="text-xs text-foreground/55">Sin conectar</span>
            )}
          </div>
        </div>
      </header>

      {!isConnected ? (
        <section className="max-w-md mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-3xl mb-3">Conecta tu wallet</h2>
          <p className="text-foreground/70 mb-8">
            Para ver tu balance de PRIMA y canjear recompensas, conéctate
            primero.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </section>
      ) : (
        <>
          {/* Category filter pills */}
          <div className="border-b border-foreground/10 bg-background sticky top-[57px] z-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedCategory === null
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground/70 border-foreground/15 hover:border-foreground/30"
                  }`}
                >
                  <span className="mr-1">🔥</span> Todas
                </button>
                {CATEGORY_ORDER.map((key, idx) => {
                  const info = CATEGORY_INFO[key];
                  const active = selectedCategory === idx;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(idx)}
                      className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        active
                          ? "text-background border-transparent"
                          : "bg-background text-foreground/70 border-foreground/15 hover:border-foreground/30"
                      }`}
                      style={
                        active
                          ? { backgroundColor: info.color }
                          : undefined
                      }
                    >
                      <span className="mr-1">{info.icon}</span>
                      {info.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Catalog */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            {isRewardsLoading && (
              <p className="text-center text-foreground/60 py-12">
                Cargando catálogo…
              </p>
            )}
            {rewardsError && (
              <p className="text-center text-warm py-12">
                Error al cargar recompensas: {rewardsError.message}
              </p>
            )}
            {!isRewardsLoading && !rewardsError && filtered.length === 0 && (
              <p className="text-center text-foreground/60 py-12">
                No hay recompensas en esta categoría todavía.
              </p>
            )}
            {filtered.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map((r) => (
                  <RewardCard
                    key={r.id.toString()}
                    reward={r}
                    balance={balance}
                    onClick={setSelectedReward}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {selectedReward && (
        <ConfirmModal
          reward={selectedReward}
          onConfirm={handleConfirm}
          onClose={() => setSelectedReward(null)}
          isPending={isProcessing || isRedeemPending}
          errorMessage={confirmError}
        />
      )}

      {voucher && (
        <VoucherModal
          reward={voucher.reward}
          txHash={voucher.txHash}
          onClose={() => setVoucher(null)}
        />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
