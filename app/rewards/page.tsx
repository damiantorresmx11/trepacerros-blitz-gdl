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

/* ─── Confirm Modal (Stitch style) ───────────────────────────────────────── */

function ConfirmModal({
  reward, onConfirm, onClose, isPending, errorMessage,
}: {
  reward: RewardOnChain; onConfirm: () => void; onClose: () => void;
  isPending: boolean; errorMessage: string | null;
}) {
  const catKey = categoryFromIndex(reward.category);
  const info = catKey ? CATEGORY_INFO[catKey] : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-[#fcf9f8] text-tc-on-surface rounded-t-3xl md:rounded-3xl shadow-xl p-6 font-lexend">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-tc-headline-md font-semibold">Confirmar canje</h3>
          <button onClick={onClose} disabled={isPending} className="text-stone-400 hover:text-tc-on-surface" aria-label="Cerrar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {info && <span className="text-3xl" style={{ color: info.color }}>{info.icon}</span>}
          <div>
            <p className="font-semibold text-lg">{reward.name}</p>
            {info && <p className="text-xs text-tc-on-surface-variant">{info.label}</p>}
          </div>
        </div>

        <p className="text-sm text-tc-on-surface-variant mb-5">{reward.description}</p>

        <div className="bg-tc-surface-container rounded-xl px-4 py-3 mb-5 flex items-baseline justify-between">
          <span className="text-sm text-tc-on-surface-variant">Costo</span>
          <span className="text-tc-headline-md font-semibold text-tc-primary">
            {formatPrima(reward.costInPrima)} <span className="text-sm text-tc-on-surface-variant">{TOKEN_DISPLAY_NAME}</span>
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 text-sm text-[#93000a] bg-[#ffdad6] rounded-lg p-3">{errorMessage}</div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="w-full bg-[#FF6B00] text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {isPending ? "Procesando..." : "Confirmar canje"}
          </button>
          <button onClick={onClose} disabled={isPending} className="w-full border-2 border-tc-primary-container text-tc-primary-container font-bold py-4 rounded-xl uppercase tracking-widest">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Voucher Modal (Stitch style) ───────────────────────────────────────── */

function VoucherModal({ reward, txHash, onClose }: { reward: RewardOnChain; txHash: `0x${string}`; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-[480px] bg-[#fcf9f8] text-tc-on-surface rounded-t-3xl md:rounded-3xl shadow-xl p-6 font-lexend">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-[#FF6B00] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <h3 className="text-tc-headline-md font-semibold">Canje exitoso</h3>
        </div>
        <p className="text-sm text-tc-on-surface-variant mb-5">
          Quemaste <strong className="text-tc-primary">{formatPrima(reward.costInPrima)} {TOKEN_DISPLAY_NAME}</strong> por <strong>{reward.name}</strong>.
        </p>
        <a href={`${EXPLORER_TX}${txHash}`} target="_blank" rel="noopener noreferrer"
          className="block bg-tc-surface-container rounded-xl px-4 py-3 mb-4 hover:bg-tc-surface-container-high transition-colors">
          <p className="text-[10px] text-tc-on-surface-variant uppercase mb-1">Tx hash</p>
          <p className="font-['Space_Grotesk'] text-xs text-tc-primary break-all">{txHash}</p>
        </a>
        <div className="flex flex-col gap-2">
          <button onClick={() => router.push("/profile")} className="w-full bg-[#FF6B00] text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg active:scale-95 transition-transform">
            Ir a mi perfil
          </button>
          <button onClick={onClose} className="w-full border-2 border-tc-primary-container text-tc-primary-container font-bold py-4 rounded-xl uppercase tracking-widest">
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reward Card (Stitch Marketplace style) ─────────────────────────────── */

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
      className={`text-left w-full ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md transition-shadow"}`}
    >
      <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full">
        <div
          className="h-40 w-full flex items-center justify-center text-5xl overflow-hidden"
          style={{ background: info ? `${info.color}20` : "#A8A8A020" }}
        >
          {showImage ? (
            <img src={imgSrc} alt={reward.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <span>{info?.icon ?? "🎁"}</span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col font-lexend">
          <h3 className="font-semibold text-sm text-tc-on-surface mb-1">{reward.name}</h3>
          <p className="text-xs text-tc-on-surface-variant line-clamp-2 mb-3">{reward.description}</p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 text-[#FF6B00] font-bold">
              <span className="material-symbols-outlined text-[18px]">token</span>
              <span>{formatPrima(reward.costInPrima)} {TOKEN_DISPLAY_NAME}</span>
            </div>
            {outOfStock && <span className="text-[10px] text-stone-500 uppercase">Agotado</span>}
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
          <div className="flex flex-col items-center gap-6 py-12 text-center">
            <span className="material-symbols-outlined text-[#FF6B00] text-5xl">storefront</span>
            <h2 className="text-tc-headline-md font-semibold text-tc-primary">Conecta tu wallet</h2>
            <p className="text-sm text-tc-on-surface-variant">
              Para ver tu balance y canjear recompensas, conectate primero.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Leaderboard link */}
            <div className="flex items-center justify-between">
              <h1 className="text-tc-headline-md font-semibold text-tc-primary">Marketplace</h1>
              <Link href="/profile/leaderboard" className="text-[12px] text-tc-on-surface-variant hover:text-[#FF6B00] transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">military_tech</span>
                Leaderboard
              </Link>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-none px-4 py-2 rounded-xl font-bold text-sm border transition-colors ${
                  selectedCategory === null
                    ? "bg-tc-primary-container text-white border-tc-primary-container"
                    : "bg-white text-tc-on-surface-variant border-tc-outline-variant hover:border-tc-primary-container"
                }`}
              >
                All
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
                        ? "text-white border-transparent"
                        : "bg-white text-tc-on-surface-variant border-tc-outline-variant hover:border-tc-primary-container"
                    }`}
                    style={active ? { backgroundColor: info.color } : undefined}
                  >
                    {info.icon} {info.label}
                  </button>
                );
              })}
            </div>

            {/* Catalog */}
            {isRewardsLoading && (
              <p className="text-center text-tc-on-surface-variant py-12">Cargando catalogo...</p>
            )}
            {rewardsError && (
              <p className="text-center text-[#ba1a1a] py-12">Error: {rewardsError.message}</p>
            )}
            {!isRewardsLoading && !rewardsError && filtered.length === 0 && (
              <p className="text-center text-tc-on-surface-variant py-12">No hay recompensas en esta categoria.</p>
            )}
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((r) => (
                  <RewardCard key={r.id.toString()} reward={r} balance={balance} onClick={setSelectedReward} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
