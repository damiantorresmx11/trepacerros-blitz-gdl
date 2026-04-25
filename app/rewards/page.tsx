"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
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
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";

const CATEGORY_ORDER: RewardCategory[] = [
  "IMMEDIATE", "EXPERIENCE", "OUTDOOR", "SUSTAINABILITY",
  "DONATION", "SERVICE", "MERCH", "EXCLUSIVE",
];

const FILTER_LABELS = [
  "Todos", "Chelas y Cafe", "Comida", "Eventos", "Equipo Outdoor", "Donaciones",
];

const APPROVE_FLAG_KEY = "rastros_prima_approved";
const EXPLORER_TX = "https://testnet.monadexplorer.com/tx/";

const CATEGORY_EMOJIS: Record<string, string> = {
  IMMEDIATE: "\u{1F37A}",
  EXPERIENCE: "\u{1F3AF}",
  OUTDOOR: "\u{1F392}",
  SUSTAINABILITY: "\u{1F331}",
  DONATION: "\u{1F49A}",
  SERVICE: "\u2615",
  MERCH: "\u{1F455}",
  EXCLUSIVE: "\u2B50",
};

function RewardEmoji({ category }: { category: number }) {
  const catKey = CATEGORY_ORDER[category];
  const emoji = catKey ? (CATEGORY_EMOJIS[catKey] ?? "\u{1F381}") : "\u{1F381}";
  return <span className="text-[48px] relative z-[1]">{emoji}</span>;
}

function formatPrima(amount: bigint): string {
  return (amount / 10n ** 18n).toString();
}

function categoryFromIndex(idx: number): RewardCategory | undefined {
  return CATEGORY_ORDER[idx];
}

/* --- Confirm Modal ------------------------------------------ */

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
        <div className="card flex items-baseline justify-between px-4 py-3 mb-5">
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
            className="btn btn-primary"
          >
            {isPending ? "Procesando..." : "Confirmar canje"}
          </button>
          <button
            onClick={onClose}
            disabled={isPending}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Voucher Modal ------------------------------------------ */

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
          className="block card hover:border-cd-moss transition-colors group px-4 py-3 mb-5">
          <p className="eyebrow mb-1">Tx hash</p>
          <p className="font-mono text-xs text-cd-moss break-all group-hover:underline">{txHash}</p>
        </a>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/profile")}
            className="btn btn-primary"
          >
            Ir a mi perfil
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Main Page ---------------------------------------------- */

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const { balance, formatted, isLoading: isBalanceLoading, refetch: refetchBalance } = usePrimaBalance(address);
  const { rewards, isLoading: isRewardsLoading, error: rewardsError } = useRewardsList();
  const { redeem, isPending: isRedeemPending } = useRedeemReward();
  const { approve } = useApprovePrima();

  const [selectedFilter, setSelectedFilter] = useState(0); // 0 = Todos
  const [selectedReward, setSelectedReward] = useState<RewardOnChain | null>(null);
  const [voucher, setVoucher] = useState<{ reward: RewardOnChain; txHash: `0x${string}` } | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = useMemo(() => {
    if (selectedFilter === 0) return rewards;
    const catIdx = selectedFilter - 1;
    return rewards.filter((r) => r.category === catIdx);
  }, [rewards, selectedFilter]);

  // Featured = first reward with stock
  const featured = useMemo(() => rewards.find((r) => r.stock > 0n), [rewards]);

  useEffect(() => {
    if (!selectedReward) setConfirmError(null);
  }, [selectedReward]);

  const { toast } = useToast();

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
      toast(`Voucher canjeado: ${selectedReward.name}`, "success");
      setSelectedReward(null);
      refetchBalance();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo completar el canje.";
      setConfirmError(msg);
      toast(msg, "error");
    } finally {
      setIsProcessing(false);
    }
  }

  const canAfford = (r: RewardOnChain) => balance >= r.costInPrima;
  const outOfStock = (r: RewardOnChain) => r.stock === 0n;

  return (
    <AppShell>
      {!isConnected ? (
        <div className="flex flex-col items-center gap-6 py-16 text-center font-lexend">
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
          {/* -- Hero + Balance: flex-col mobile, flex-row on lg -- */}
          <div className="px-[18px] md:px-0 lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div>
              <h1 className="font-big-shoulders font-black leading-[0.95] m-0 text-[36px] lg:text-[48px]" style={{ color: "var(--ink)" }}>
                Marketplace<br/>Local
              </h1>
              <p className="text-[13px] mt-2.5 max-w-[36ch]" style={{ color: "var(--muted)" }}>
                Tus $CERRO valen aqui. Negocios aliados de Jalisco aceptan tu trepada como pago.
              </p>
            </div>

            {/* Balance card inline on desktop */}
            <div className="mt-4 lg:mt-0 lg:min-w-[320px]">
              <div className="card flex items-center gap-3.5 p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div>
                  <div className="eyebrow"><span>SALDO DISPONIBLE</span></div>
                  <div className="font-big-shoulders mt-1 text-[30px] font-black leading-none" style={{ color: "var(--ember)" }}>
                    {isBalanceLoading ? "..." : formatPrima(balance)}{" "}
                    <span className="text-sm opacity-60 font-bold">{TOKEN_DISPLAY_NAME}</span>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="text-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--moss)" }}>
                    <path d="M8 3h8l-1 7h-6z"/><path d="M5 6h-2a3 3 0 0 0 3 3"/><path d="M19 6h2a3 3 0 0 1-3 3"/><path d="M9 14h6v2H9z"/><path d="M7 21h10v-3H7z"/>
                  </svg>
                  <div className="font-mono text-[9px] tracking-[0.16em] mt-1" style={{ color: "var(--muted)" }}>RANKING<br/>#214</div>
                </div>
              </div>
            </div>
          </div>

          {/* -- Filter chips -- */}
          <div className="hscroll mt-4">
            {FILTER_LABELS.map((label, idx) => (
              <button
                key={label}
                onClick={() => setSelectedFilter(idx)}
                className="chip shrink-0"
                style={selectedFilter === idx
                  ? { background: "var(--ink)", color: "var(--bg)", borderColor: "transparent" }
                  : undefined
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* -- Loading / Error / Empty states -- */}
          {isRewardsLoading && (
            <p className="text-center font-mono text-sm py-12" style={{ color: "var(--muted)" }}>Cargando catalogo...</p>
          )}
          {rewardsError && (
            <p className="text-center text-red-700 py-12 text-sm">Error: {rewardsError.message}</p>
          )}
          {!isRewardsLoading && !rewardsError && filtered.length === 0 && (
            <p className="text-center text-sm py-12" style={{ color: "var(--muted)" }}>No hay recompensas en esta categoria.</p>
          )}

          {/* -- Featured deal card -- */}
          {featured && selectedFilter === 0 && (
            <div className="px-[18px] md:px-0 pt-5">
              <button
                type="button"
                onClick={() => !outOfStock(featured) && canAfford(featured) && setSelectedReward(featured)}
                className="w-full text-left"
                disabled={outOfStock(featured) || !canAfford(featured)}
              >
                <div className="card mp-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="mp-photo photo flex items-center justify-center max-h-[240px]">
                    <RewardEmoji category={featured.category} />
                    <div className="price">{formatPrima(featured.costInPrima)} {TOKEN_DISPLAY_NAME}</div>
                    <div className="absolute top-3 left-3">
                      <span className="chip border-0 text-[10px] tracking-[0.16em]" style={{ background: "rgba(255,255,255,0.9)" }}>DESTACADO</span>
                    </div>
                  </div>
                  <div className="mp-body">
                    <h3 className="font-big-shoulders text-[22px] font-extrabold m-0" style={{ color: "var(--ink)" }}>{featured.name}</h3>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{featured.description}</div>
                    <div className="flex gap-2 mt-2">
                      {(() => {
                        const catKey = categoryFromIndex(featured.category);
                        const info = catKey ? CATEGORY_INFO[catKey] : null;
                        return info ? <span className="chip chip-moss text-[10px]">{info.label}</span> : null;
                      })()}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* -- Responsive reward grid: 2-col / 3-col md / 4-col lg -- */}
          {filtered.length > 0 && (
            <div className="px-[18px] md:px-0 pt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
                {filtered
                  .filter((r) => selectedFilter === 0 ? r !== featured : true)
                  .map((r) => {
                    const catKey = categoryFromIndex(r.category);
                    const info = catKey ? CATEGORY_INFO[catKey] : null;
                    const disabled = outOfStock(r) || !canAfford(r);
                    return (
                      <button
                        key={r.id.toString()}
                        type="button"
                        onClick={() => !disabled && setSelectedReward(r)}
                        disabled={disabled}
                        className={`text-left w-full ${disabled ? "opacity-60" : ""}`}
                      >
                        <div className="card mp-card h-full transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                          <div className="mp-photo photo h-[120px] flex items-center justify-center">
                            <RewardEmoji category={r.category} />
                            <div className="price text-[11px] px-2.5 py-1">
                              {formatPrima(r.costInPrima)}
                            </div>
                          </div>
                          <div className="mp-body p-3">
                            <div className="font-bold text-[13px]" style={{ color: "var(--ink)" }}>{r.name}</div>
                            <div className="text-[11px]" style={{ color: "var(--muted)" }}>{r.description}</div>
                            {info && (
                              <span className="chip text-[10px] px-2 py-[3px] self-start mt-1">
                                {info.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* -- Top trepadores mini-leaderboard -- */}
          <div className="px-[18px] md:px-0 pt-6 pb-3">
            <h2 className="h-section">Top trepadores</h2>
          </div>
          <div className="px-[18px] md:px-0 pb-4">
            <div className="card px-4 py-1.5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="lb-row">
                <div className="lb-rank gold">01</div>
                <div className="lb-avatar" />
                <div>
                  <div className="lb-name">@chivasreciclas</div>
                  <div className="lb-meta">142 KG &middot; 38 TREPADAS</div>
                </div>
                <div className="font-mono" style={{ color: "var(--ember)", fontWeight: 700 }}>14,820</div>
              </div>
              <div className="lb-row">
                <div className="lb-rank silver">02</div>
                <div className="lb-avatar" style={{ background: "linear-gradient(135deg, oklch(0.78 0.1 60), oklch(0.6 0.14 40))" }} />
                <div>
                  <div className="lb-name">@gdl_huellaverde</div>
                  <div className="lb-meta">128 KG &middot; 32 TREPADAS</div>
                </div>
                <div className="font-mono" style={{ color: "var(--ember)", fontWeight: 700 }}>12,400</div>
              </div>
              <div className="lb-row">
                <div className="lb-rank bronze">03</div>
                <div className="lb-avatar" style={{ background: "linear-gradient(135deg, oklch(0.78 0.07 240), oklch(0.5 0.1 250))" }} />
                <div>
                  <div className="lb-name">@anaila.eth</div>
                  <div className="lb-meta">99 KG &middot; 27 TREPADAS</div>
                </div>
                <div className="font-mono" style={{ color: "var(--ember)", fontWeight: 700 }}>10,210</div>
              </div>
              <div className="lb-row" style={{ borderBottom: 0 }}>
                <div className="lb-rank">04</div>
                <div className="lb-avatar" />
                <div>
                  <div className="lb-name">@trepa_zamora</div>
                  <div className="lb-meta">88 KG &middot; 24 TREPADAS</div>
                </div>
                <div className="font-mono" style={{ color: "var(--ember)", fontWeight: 700 }}>9,140</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* -- Modals -- */}
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
    </AppShell>
  );
}
