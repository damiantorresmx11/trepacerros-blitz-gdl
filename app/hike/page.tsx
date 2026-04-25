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
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = Math.floor(safe % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
    if (confirm("Descartar este hike? Se perderan los datos.")) {
      reset();
    }
  };

  /* ─── NOT CONNECTED ─── */
  if (!isConnected || !address) {
    return (
      <AppShell hideNav>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          {/* Mountain icon */}
          <div className="w-20 h-20 rounded-full bg-cd-moss/10 flex items-center justify-center mb-8">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cd-moss">
              <path d="M3 20l5.5-9 4 6 3-4L21 20z" />
            </svg>
          </div>

          <h1 className="font-big-shoulders text-4xl font-bold uppercase tracking-tight text-cd-ink">
            Conecta tu wallet
          </h1>
          <p className="font-lexend text-sm text-cd-muted mt-3 max-w-xs leading-relaxed">
            Para iniciar una trepada y mintear tu rastro necesitas estar conectado.
          </p>

          <div className="mt-8">
            <ConnectButton />
          </div>

          <p className="font-mono text-[10px] text-cd-muted/60 uppercase tracking-widest mt-6">
            Monad Testnet
          </p>
        </div>
      </AppShell>
    );
  }

  /* ─── ENDED STATE ─── */
  if (hikeFinished) {
    return (
      <AppShell hideNav>
        <div className="flex flex-col min-h-screen bg-cd-bg">
          {/* Header */}
          <div className="text-center pt-10 pb-4 px-6">
            <span className="font-lexend text-xs uppercase tracking-widest text-cd-muted">
              Trepada completada
            </span>
            <h1 className="font-big-shoulders text-5xl font-bold uppercase text-cd-ink mt-2 leading-[0.9]">
              Buena<br />trepada!
            </h1>
            <p className="font-mono text-[11px] text-cd-muted tracking-wider mt-3 uppercase">
              {formatDuration(stats.durationSeconds)}
            </p>
          </div>

          {/* Map preview */}
          <div className="mx-4 rounded-card overflow-hidden border border-cd-line">
            <HikeMap points={mapPoints} height={200} className="w-full h-[200px]" />
          </div>

          {/* Summary stats grid */}
          <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
            <div className="solid-card p-4 flex flex-col items-center">
              <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">Distancia</span>
              <span className="font-mono font-bold text-3xl text-cd-ink mt-1">
                {(stats.distanceMeters / 1000).toFixed(2)}
              </span>
              <span className="font-mono text-[10px] text-cd-muted uppercase tracking-wider">KM</span>
            </div>
            <div className="solid-card p-4 flex flex-col items-center">
              <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">Tiempo</span>
              <span className="font-mono font-bold text-3xl text-cd-ink mt-1">
                {formatDuration(stats.durationSeconds)}
              </span>
              <span className="font-mono text-[10px] text-cd-muted uppercase tracking-wider">HH:MM</span>
            </div>
            <div className="solid-card p-4 flex flex-col items-center">
              <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">Elevacion</span>
              <span className="font-mono font-bold text-3xl text-cd-ember mt-1">
                +{Math.round(stats.elevationGain)}
              </span>
              <span className="font-mono text-[10px] text-cd-muted uppercase tracking-wider">MTS</span>
            </div>
            <div className="solid-card p-4 flex flex-col items-center">
              <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">Puntos GPS</span>
              <span className="font-mono font-bold text-3xl text-cd-ink mt-1">
                {points.length}
              </span>
              <span className="font-mono text-[10px] text-cd-muted uppercase tracking-wider">COORDS</span>
            </div>
          </div>

          {/* Validation badge */}
          <div className="flex justify-center mt-5 px-4">
            {validation.valid ? (
              <div className="flex items-center gap-2 bg-cd-moss/10 text-cd-moss px-5 py-2.5 rounded-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-lexend text-sm font-semibold">Hike valido — listo para mintear</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-cd-ember/10 text-cd-ember px-5 py-2.5 rounded-pill">
                <span className="font-lexend text-sm font-semibold">{validation.reason ?? "Hike invalido"}</span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-4 mt-4 bg-red-50 text-red-700 rounded-xl p-3 text-sm font-lexend">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 mx-4 mt-6 pb-10">
            <button
              onClick={handleMintClick}
              disabled={!validation.valid}
              className="w-full bg-cd-ember text-white font-big-shoulders font-bold text-lg py-4 rounded-xl uppercase tracking-wider shadow-[0_8px_24px_rgba(212,116,42,0.35)] haptic-active transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mintear NFT
            </button>
            <button
              onClick={handleDiscard}
              className="w-full border-2 border-cd-moss text-cd-moss font-big-shoulders font-bold text-lg py-4 rounded-xl uppercase tracking-wider haptic-active transition-colors hover:bg-cd-moss/5"
            >
              Descartar
            </button>
          </div>
        </div>

        {/* Submit Modal */}
        {showSubmitModal && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-[480px] md:max-w-lg min-h-screen md:min-h-0 md:max-h-[90vh] md:overflow-y-auto bg-cd-paper rounded-none md:rounded-card shadow-premium">
              <div className="flex items-center justify-between px-5 py-4 border-b border-cd-line sticky top-0 bg-cd-paper z-10">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cd-moss">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <h2 className="font-big-shoulders text-xl font-bold text-cd-ink uppercase tracking-tight">
                    Proof-of-Clean
                  </h2>
                </div>
                <button
                  onClick={handleCancelModal}
                  className="text-cd-muted hover:text-cd-ink p-1 transition-colors"
                  aria-label="Cerrar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
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

  /* ─── IDLE + ACTIVE STATES ─── */
  return (
    <AppShell hideNav>
      <div className="flex flex-col min-h-screen bg-cd-bg">
        {/* ─── Map area ─── */}
        <div className="relative w-full">
          <div className={`w-full ${isTracking ? "h-[55vh]" : "h-[320px]"} transition-all duration-500`}>
            <HikeMap points={mapPoints} height={isTracking ? 500 : 320} className="w-full h-full" />
          </div>

          {/* Live indicator (tracking only) */}
          {isTracking && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 solid-card px-3 py-1.5 !rounded-pill shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cd-ember opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cd-ember" />
              </span>
              <span className="font-lexend text-[10px] text-cd-ink uppercase tracking-widest font-semibold">
                Live Mission
              </span>
            </div>
          )}

          {/* GPS locked badge (tracking only) */}
          {isTracking && (
            <div className="absolute top-4 right-4 z-10 solid-card px-3 py-1.5 !rounded-pill shadow-lg flex items-center gap-1.5 gps-glow">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
              <span className="font-mono text-[10px] text-cd-moss uppercase tracking-wider font-semibold">GPS</span>
            </div>
          )}

          {/* Timer chip over map (tracking only) */}
          {isTracking && (
            <div className="absolute bottom-4 right-4 z-10 solid-card px-3 py-1.5 !rounded-pill shadow-lg">
              <span className="font-mono text-sm font-bold text-cd-ink">{formatDuration(stats.durationSeconds)}</span>
            </div>
          )}
        </div>

        {/* ─── Content below map ─── */}
        <div className="flex-1 px-4 pb-10 -mt-6 relative z-10">

          {/* ──── IDLE STATE ──── */}
          {!isTracking && !hasPoints && (
            <div className="flex flex-col">
              {/* Trail info card */}
              <div className="solid-card p-6">
                <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">
                  Sendero seleccionado
                </span>
                <h1 className="font-big-shoulders text-4xl font-bold uppercase text-cd-ink mt-2 leading-[0.95]">
                  Trepada libre
                </h1>
                <p className="font-mono text-[11px] text-cd-muted tracking-wider mt-3 uppercase">
                  GPS auto-tracking · Distancia libre · Sin limite
                </p>

                {/* Trail meta chips */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <span className="coordinate-chip">GPS ACTIVO</span>
                  <span className="coordinate-chip">MONAD TESTNET</span>
                </div>
              </div>

              {/* Info hints */}
              <div className="solid-card p-4 mt-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cd-moss/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cd-moss">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                  </svg>
                </div>
                <div>
                  <p className="font-lexend text-sm text-cd-ink font-medium">Como funciona</p>
                  <p className="font-lexend text-xs text-cd-muted mt-1 leading-relaxed">
                    El GPS registrara tu ruta automaticamente. Al terminar podras mintear un NFT como prueba de tu trepada.
                  </p>
                </div>
              </div>

              {/* Start CTA */}
              <button
                onClick={start}
                className="w-full bg-cd-ember text-white font-big-shoulders font-bold text-xl py-5 rounded-xl mt-6 shadow-[0_8px_30px_rgba(212,116,42,0.4)] haptic-active transition-transform flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Iniciar trepada
              </button>

              <p className="font-mono text-[10px] text-cd-muted/60 text-center mt-4 uppercase tracking-widest">
                El GPS empezara a registrar tu ruta
              </p>
            </div>
          )}

          {/* ──── ACTIVE (TRACKING) STATE ──── */}
          {isTracking && (
            <div className="flex flex-col">
              {/* Live stats HUD */}
              <div className="solid-card p-5">
                <div className="grid grid-cols-3 gap-3">
                  {/* Distance */}
                  <div className="flex flex-col items-center">
                    <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">
                      Distancia
                    </span>
                    <span className="font-mono font-bold text-3xl text-cd-ink leading-none mt-1">
                      {(stats.distanceMeters / 1000).toFixed(2)}
                    </span>
                    <span className="font-mono text-[10px] text-cd-muted uppercase tracking-wider mt-0.5">KM</span>
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col items-center border-x border-cd-line">
                    <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">
                      Duracion
                    </span>
                    <span className="font-mono font-bold text-3xl text-cd-ink leading-none mt-1">
                      {formatDuration(stats.durationSeconds)}
                    </span>
                  </div>

                  {/* Elevation */}
                  <div className="flex flex-col items-center">
                    <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted">
                      Elevacion
                    </span>
                    <span className="font-mono font-bold text-3xl text-cd-ember leading-none mt-1">
                      +{Math.round(stats.elevationGain)}
                    </span>
                    <span className="font-mono text-[10px] text-cd-muted uppercase tracking-wider mt-0.5">MTS</span>
                  </div>
                </div>
              </div>

              {/* Pickup counter bar */}
              <div className="solid-card p-4 mt-3 flex items-center justify-between">
                <div>
                  <span className="font-lexend text-[10px] uppercase tracking-widest text-cd-muted block">
                    Puntos GPS
                  </span>
                  <span className="font-mono font-bold text-2xl text-cd-ink">{points.length}</span>
                  <span className="font-mono text-[10px] text-cd-muted ml-1">coords</span>
                </div>
                <div className="coordinate-chip flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 gps-glow" />
                  <span>TRACKING</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="solid-card mt-3 p-3 !border-red-200 !bg-red-50 text-red-700 text-sm font-lexend">
                  {error}
                </div>
              )}

              {/* End CTA */}
              <button
                onClick={stop}
                className="w-full bg-cd-ember text-white font-big-shoulders font-bold text-xl py-5 rounded-xl mt-6 shadow-[0_8px_30px_rgba(212,116,42,0.4)] haptic-active transition-transform flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                Terminar trepada
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
