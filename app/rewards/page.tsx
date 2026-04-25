"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
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
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

const CATEGORY_ORDER: RewardCategory[] = [
  "IMMEDIATE", "EXPERIENCE", "OUTDOOR", "SUSTAINABILITY",
  "DONATION", "SERVICE", "MERCH", "EXCLUSIVE",
];

const APPROVE_FLAG_KEY = "rastros_prima_approved";
const EXPLORER_TX = "https://testnet.monadexplorer.com/tx/";

function formatPrima(amount: bigint): string {
  return (amount / 10n ** 18n).toString();
}

function categoryFromIndex(idx: number): RewardCategory | undefined {
  return CATEGORY_ORDER[idx];
}

/* ─── Confirm Modal (Claude Design) ──────────────────────────────────────── */

function ConfirmModal({
  reward, onConfirm, onClose, isPending, errorMessage,
}: {
  reward: RewardOnChain; onConfirm: () => void; onClose: () => void;
  isPending: boolean; errorMessage: string | null;
}) {
  const catKey = categoryFromIndex(reward.category);
  const info = catKey ? CATEGORY_INFO[catKey] : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-cd-paper text-cd-ink rounded-t-[22px] md:rounded-[22px] shadow-xl p-6 font-lexend">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <h3 className="font-big-shoulders uppercase text-xl tracking-wide text-cd-ink">Confirmar canje</h3>
          <button onClick={onClose} disabled={isPending} className="text-cd-muted hover:text-cd-ink transition-colors" aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Reward info */}
        <div className="flex items-center gap-3 mb-4">
          {info && <span className="text-3xl" style={{ color: info.color }}>{info.icon}</span>}
          <div>
            <p className="font-bold text-lg text-cd-ink">{reward.name}</p>
            {info && <p className="text-xs text-cd-muted">{info.label}</p>}
          </div>
        </div>

        <p className="text-sm text-cd-muted mb-5 leading-relaxed">{reward.description}</p>

        {/* Cost card */}
        <div className="solid-card px-4 py-3 mb-5 flex items-baseline justify-between">
          <span className="text-sm text-cd-muted">Costo</span>
          <span className="font-mono font-bold text-xl text-cd-ember">
            {formatPrima(reward.costInPrima)} <span className="text-sm text-cd-muted font-lexend font-normal">{TOKEN_DISPLAY_NAME}</span>
          </span>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl p-3">{errorMessage}</div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="w-full bg-cd-ember text-white font-big-shoulders uppercase tracking-widest font-bold py-4 rounded-xl haptic-active shadow-lg disabled:opacity-50 transition-all"
          >
            {isPending ? "Procesando..." : "Confirmar canje"}
          </button>
          <button
            onClick={onClose}
            disabled={isPending}
            className="w-full border-2 border-cd-line text-cd-muted font-big-shoulders uppercase tracking-widest font-bold py-4 rounded-xl hover:border-cd-ink hover:text-cd-ink transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Voucher Modal (Claude Design) ──────────────────────────────────────── */

function VoucherModal({ reward, txHash, onClose }: { reward: RewardOnChain; txHash: `0x${string}`; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-cd-paper text-cd-ink rounded-t-[22px] md:rounded-[22px] shadow-xl p-6 font-lexend">
        {/* Success header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-cd-moss/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-cd-moss"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h3 className="font-big-shoulders uppercase text-xl tracking-wide text-cd-ink">Canje exitoso</h3>
        </div>

        <p className="text-sm text-cd-muted mb-5 leading-relaxed">
          Quemaste <strong className="text-cd-ember font-mono">{formatPrima(reward.costInPrima)} {TOKEN_DISPLAY_NAME}</strong> por <strong className="text-cd-ink">{reward.name}</strong>.
        </p>

        {/* Tx hash card */}
        <a href={`${EXPLORER_TX}${txHash}`} target="_blank" rel="noopener noreferrer"
          className="block solid-card px-4 py-3 mb-5 hover:border-cd-moss transition-colors group">
          <p className="text-[10px] font-big-shoulders uppercase tracking-widest text-cd-muted mb-1">Tx hash</p>
          <p className="font-mono text-xs text-cd-moss break-all group-hover:underline">{txHash}</p>
        </a>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/profile")}
            className="w-full bg-cd-ember text-white font-big-shoulders uppercase tracking-widest font-bold py-4 rounded-xl haptic-active shadow-lg transition-all"
          >
            Ir a mi perfil
          </button>
          <button
            onClick={onClose}
            className="w-full border-2 border-cd-line text-cd-muted font-big-shoulders uppercase tracking-widest font-bold py-4 rounded-xl hover:border-cd-ink hover:text-cd-ink transition-colors"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reward Card (Claude Design) ────────────────────────────────────────── */

function RewardCard({ reward, balance, onClick }: { reward: RewardOnChain; balance: bigint; onClick: (r: RewardOnChain) => void }) {
  const [imgError, setImgError] = useState(false);
  const catKey = categoryFromIndex(reward.category);
  const info = catKey ? CATEGORY_INFO[catKey] : null;
  const canAfford = balance >= reward.costInPrima;
  const outOfStock = reward.stock === 0n;
  const disabled = !canAfford || outOfStock;

  const imgSrc = reward.imageURI ? ipfsToGateway(reward.imageURI) : "";
  const showImage = Boolean(imgSrc) && !imgError;

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick(reward)}
      disabled={disabled}
      className={`text-left w-full group ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <div className="solid-card overflow-hidden flex flex-col h-full relative transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
        {/* Price badge */}
        <div className="absolute top-3 right-3 z-10 bg-cd-ember text-white font-mono font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8"/></svg>
          {formatPrima(reward.costInPrima)}
        </div>

        {/* Out of stock badge */}
        {outOfStock && (
          <div className="absolute top-3 left-3 z-10 bg-cd-ink text-white font-big-shoulders uppercase text-[10px] tracking-widest px-3 py-1 rounded-full">
            Agotado
          </div>
        )}

        {/* Image area */}
        <div
          className="aspect-[16/9] w-full flex items-center justify-center text-5xl overflow-hidden"
          style={{ background: info ? `${info.color}15` : "rgba(168,168,160,0.1)" }}
        >
          {showImage ? (
            <img src={imgSrc} alt={reward.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <span className="opacity-70">{info?.icon ?? "🎁"}</span>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex-1 flex flex-col font-lexend">
          <h3 className="font-big-shoulders uppercase text-base font-bold text-cd-ink tracking-wide mb-1 leading-tight">{reward.name}</h3>
          {info && (
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 w-fit"
              style={{ backgroundColor: `${info.color}15`, color: info.color }}
            >
              {info.label}
            </span>
          )}
          <p className="text-xs text-cd-muted line-clamp-2 mb-3 leading-relaxed">{reward.description}</p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-cd-ember">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10h8"/></svg>
              <span>{formatPrima(reward.costInPrima)}</span>
            </div>
            {!disabled && (
              <span className="text-[10px] font-big-shoulders uppercase tracking-widest text-cd-moss opacity-0 group-hover:opacity-100 transition-opacity">
                Canjear
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const { balance, formatted, isLoading: isBalanceLoading, refetch: refetchBalance } = usePrimaBalance(address);
  const { rewards, isLoading: isRewardsLoading, error: rewardsError } = useRewardsList();
  const { redeem, isPending: isRedeemPending } = useRedeemReward();
  const { approve } = useApprovePrima();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedReward, setSelectedReward] = useState<RewardOnChain | null>(null);
  const [voucher, setVoucher] = useState<{ reward: RewardOnChain; txHash: `0x${string}` } | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = useMemo(() => {
    if (selectedCategory === null) return rewards;
    return rewards.filter((r) => r.category === selectedCategory);
  }, [rewards, selectedCategory]);

  useEffect(() => {
    if (!selectedReward) setConfirmError(null);
  }, [selectedReward]);

  async function handleConfirm() {
    if (!selectedReward) return;
    setIsProcessing(true);
    setConfirmError(null);
    try {
      const alreadyApproved = typeof window !== "undefined" && window.sessionStorage.getItem(APPROVE_FLAG_KEY) === "1";
      if (!alreadyApproved) {
        try {
          await approve();
          if (typeof window !== "undefined") window.sessionStorage.setItem(APPROVE_FLAG_KEY, "1");
        } catch (err) {
          console.warn("PRIMA approve failed (non-fatal):", err);
          if (typeof window !== "undefined") window.sessionStorage.setItem(APPROVE_FLAG_KEY, "1");
        }
      }
      const txHash = await redeem(selectedReward.id);
      setVoucher({ reward: selectedReward, txHash });
      setSelectedReward(null);
      refetchBalance();
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : "No se pudo completar el canje.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6">
        {!isConnected ? (
          /* ── Not connected state ── */
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-cd-ember/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-cd-ember">
                <path d="M3 20l5.5-9 4 6 3-4L21 20z"/>
              </svg>
            </div>
            <h2 className="font-big-shoulders uppercase text-2xl tracking-wide text-cd-ink">Conecta tu wallet</h2>
            <p className="text-sm text-cd-muted max-w-[28ch]">
              Para ver tu balance y canjear recompensas, conectate primero.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* ── Page title ── */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-big-shoulders uppercase text-4xl font-black text-cd-ink leading-none tracking-wide">
                  Marketplace<br/>
                  <span className="text-cd-moss">Local</span>
                </h1>
                <p className="text-sm text-cd-muted mt-2 max-w-[36ch] leading-relaxed">
                  Tus $CERRO valen aqui. Negocios aliados de Jalisco aceptan tu trepada como pago.
                </p>
              </div>
              <Link
                href="/profile/leaderboard"
                className="coordinate-chip text-[11px] text-cd-muted hover:text-cd-moss transition-colors flex items-center gap-1.5 shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3h8l-1 7h-6z"/><path d="M9 14h6v2H9z"/><path d="M7 21h10v-3H7z"/></svg>
                Ranking
              </Link>
            </div>

            {/* ── Balance card ── */}
            <div className="solid-card p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-big-shoulders uppercase tracking-[0.16em] text-cd-muted mb-1">Saldo disponible</p>
                <div className="font-mono font-bold text-4xl text-cd-ember leading-none">
                  {isBalanceLoading ? (
                    <span className="text-cd-muted text-2xl">...</span>
                  ) : (
                    <>
                      {formatPrima(balance)}
                      <span className="text-sm text-cd-muted font-lexend font-normal ml-2">$CERRO</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-cd-moss mx-auto">
                  <path d="M8 3h8l-1 7h-6z"/><path d="M5 6h-2a3 3 0 0 0 3 3"/><path d="M19 6h2a3 3 0 0 1-3 3"/><path d="M9 14h6v2H9z"/><path d="M7 21h10v-3H7z"/>
                </svg>
                <p className="font-mono text-[9px] tracking-[0.16em] text-cd-muted mt-1 uppercase">Ranking</p>
              </div>
            </div>

            {/* ── Category filter pills ── */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-none px-4 py-2 rounded-xl font-bold text-sm border transition-colors ${
                  selectedCategory === null
                    ? "bg-cd-ink text-white border-transparent"
                    : "bg-cd-paper text-cd-muted border-cd-line hover:border-cd-ink"
                }`}
              >
                Todos
              </button>
              {CATEGORY_ORDER.map((key, idx) => {
                const info = CATEGORY_INFO[key];
                const active = selectedCategory === idx;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(idx)}
                    className={`flex-none px-4 py-2 rounded-xl font-bold text-sm border transition-colors ${
                      active
                        ? "bg-cd-moss text-white border-transparent"
                        : "bg-cd-paper text-cd-muted border-cd-line hover:border-cd-ink"
                    }`}
                  >
                    {info.icon} {info.label}
                  </button>
                );
              })}
            </div>

            {/* ── Catalog grid ── */}
            {isRewardsLoading && (
              <p className="text-center text-cd-muted py-12 font-mono text-sm">Cargando catalogo...</p>
            )}
            {rewardsError && (
              <p className="text-center text-red-700 py-12 text-sm">Error: {rewardsError.message}</p>
            )}
            {!isRewardsLoading && !rewardsError && filtered.length === 0 && (
              <p className="text-center text-cd-muted py-12 text-sm">No hay recompensas en esta categoria.</p>
            )}
            {filtered.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((r) => (
                  <RewardCard key={r.id.toString()} reward={r} balance={balance} onClick={setSelectedReward} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
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
        <VoucherModal reward={voucher.reward} txHash={voucher.txHash} onClose={() => setVoucher(null)} />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AppShell>
  );
}
