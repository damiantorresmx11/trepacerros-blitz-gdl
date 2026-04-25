"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { HikeMap } from "@/components/HikeMap";
import { SubmitHike } from "@/components/SubmitHike";
import { useHikeTracker } from "@/hooks/useHikeTracker";
import { useGPSValidation } from "@/hooks/useGPSValidation";
import { ConnectButton } from "@/components/ConnectButton";

function formatDuration(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function HikePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const tracker = useHikeTracker();
  const { isTracking, points, stats, error, start, stop, reset } = tracker;

  const validation = useGPSValidation({
    distanceMeters: stats.distanceMeters,
    durationSeconds: stats.durationSeconds,
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const hasPoints = points.length > 0;
  const hikeFinished = !isTracking && hasPoints;
  const mapPoints = points.map((p) => ({ lat: p.lat, lng: p.lng }));

  const handleMintClick = () => {
    if (!validation.valid) return;
    setShowSubmitModal(true);
  };

  const handleMinted = (_txHash: `0x${string}`) => {
    void _txHash;
    setShowSubmitModal(false);
    reset();
    router.push("/gallery");
  };

  const handleCancelModal = () => {
    setShowSubmitModal(false);
  };

  const handleDiscard = () => {
    if (confirm("¿Descartar este hike? Se perderán los datos.")) {
      reset();
    }
  };

  return (
    <AppShell>
      <div className="font-lexend flex flex-col md:grid md:grid-cols-5 gap-4">
        {!isConnected || !address ? (
          <div className="flex flex-col items-center gap-6 py-12 text-center md:col-span-5">
            <span className="material-symbols-outlined text-tc-primary text-5xl">hiking</span>
            <h2 className="text-tc-headline-md font-semibold text-tc-primary">Conecta tu wallet</h2>
            <p className="text-sm text-tc-on-surface-variant">
              Para iniciar un hike y mintear tu rastro necesitas estar conectado.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Map */}
            <div className="relative -mx-5 -mt-4 md:mx-0 md:mt-0 md:col-span-3 md:row-span-2">
              <div className="w-full aspect-square md:aspect-[4/3] md:rounded-2xl md:overflow-hidden">
                <HikeMap
                  points={mapPoints}
                  height={400}
                  className="w-full h-full"
                />
              </div>

              {/* Live indicator */}
              {isTracking && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="font-lexend text-tc-cta text-xs text-tc-on-surface uppercase tracking-widest">
                    Live Mission
                  </span>
                </div>
              )}
            </div>

            {/* Stats Glass Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-stone-200/60 flex flex-col gap-6 -mt-16 md:mt-0 relative z-10 mx-0 md:col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-stone-600 font-space-grotesk text-xs uppercase tracking-wider">Distance</span>
                  <span className="font-fraunces font-black text-4xl text-tc-primary leading-none mt-1">
                    {(stats.distanceMeters / 1000).toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-600 mt-1">KM</span>
                </div>
                <div className="flex flex-col items-center border-x border-stone-200/60">
                  <span className="text-stone-600 font-space-grotesk text-xs uppercase tracking-wider">Duration</span>
                  <span className="font-fraunces font-black text-4xl text-tc-primary leading-none mt-1">
                    {formatDuration(stats.durationSeconds)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-stone-600 font-space-grotesk text-xs uppercase tracking-wider">Elevation</span>
                  <span className="font-fraunces font-black text-4xl text-[#7b4100] leading-none mt-1">
                    +{Math.round(stats.elevationGain)}
                  </span>
                  <span className="text-xs text-stone-600 mt-1">M</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-[#ffdad6] text-[#93000a] rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Validation badge */}
              {hikeFinished && (
                <div className="flex justify-center">
                  {validation.valid ? (
                    <div className="bg-tc-primary-fixed text-tc-primary px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      Hike valido — listo para mintear
                    </div>
                  ) : (
                    <div className="bg-[#ffdcc3] text-[#5a2e00] px-4 py-2 rounded-full text-sm font-semibold">
                      {validation.reason ?? "Hike invalido"}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {!isTracking && !hasPoints && (
                <button
                  onClick={start}
                  className="w-full bg-[#FF6B00] text-white font-lexend font-bold py-5 rounded-2xl shadow-[0_8px_30px_rgba(255,107,0,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-3 uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                  START TREPADA
                </button>
              )}

              {isTracking && (
                <button
                  onClick={stop}
                  className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-lexend font-bold py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined">stop_circle</span>
                  END TREPADA
                </button>
              )}

              {hikeFinished && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleMintClick}
                    disabled={!validation.valid}
                    className="w-full bg-[#FF6B00] text-white font-lexend font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mintear NFT
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="w-full border-2 border-tc-primary-container text-tc-primary-container font-lexend font-bold py-4 rounded-2xl uppercase tracking-widest hover:bg-tc-primary-container/5 transition-colors"
                  >
                    Descartar
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[480px] md:max-w-lg min-h-screen md:min-h-0 md:max-h-[90vh] md:overflow-y-auto bg-[#fcf9f8] rounded-none md:rounded-3xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 sticky top-0 bg-[#fcf9f8] z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tc-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
                <h2 className="font-lexend text-tc-headline-md font-semibold text-tc-primary uppercase tracking-tight">
                  Proof-of-Clean
                </h2>
              </div>
              <button
                onClick={handleCancelModal}
                className="text-stone-500 hover:text-tc-on-surface p-1"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5">
              <SubmitHike
                stats={stats}
                points={mapPoints}
                onMinted={handleMinted}
                onCancel={handleCancelModal}
              />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
