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

function formatPace(distMeters: number, durSeconds: number): string {
  if (distMeters <= 0 || durSeconds <= 0) return "--'--\"";
  const km = distMeters / 1000;
  const totalMin = durSeconds / 60;
  const paceMin = totalMin / km;
  const mins = Math.floor(paceMin);
  const secs = Math.round((paceMin - mins) * 60);
  return `${mins}'${secs.toString().padStart(2, "0")}"`;
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
  const [pickCount, setPickCount] = useState(0);

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
      setPickCount(0);
    }
  };

  /* ─── NOT CONNECTED ─── */
  if (!isConnected || !address) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
            style={{ background: "color-mix(in oklch, var(--moss) 10%, var(--paper))" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--moss)" }}>
              <path d="M3 20l5.5-9 4 6 3-4L21 20z" />
            </svg>
          </div>
          <h1 className="h-display text-4xl">Conecta tu wallet</h1>
          <p className="mt-3 max-w-[280px] leading-relaxed text-sm" style={{ fontFamily: "var(--font-ui)", color: "var(--muted)" }}>
            Para iniciar una trepada y mintear tu rastro necesitas estar conectado.
          </p>
          <div className="mt-8">
            <ConnectButton />
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] opacity-60" style={{ fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
            Monad Testnet
          </p>
        </div>
      </AppShell>
    );
  }

  /* ─── ENDED STATE ─── */
  if (hikeFinished) {
    const distKm = (stats.distanceMeters / 1000).toFixed(2);
    const durFormatted = formatDuration(stats.durationSeconds);
    const elevGain = Math.round(stats.elevationGain);
    const cerroEarned = Math.round(pickCount * 12 + elevGain * 0.2);

    return (
      <AppShell>
        <div className="flex flex-col min-h-[80vh] px-[18px] lg:px-0">

          {/* Header — centered */}
          <div className="text-center mt-4 lg:mt-8">
            <div className="eyebrow justify-center">
              <span>TREPADA COMPLETADA</span>
            </div>
            <h1 className="h-display text-5xl mt-3 leading-[0.9] lg:text-6xl">
              ¡Buena<br />trepada!
            </h1>
            <div className="mt-2 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
              EL DIENTE · {new Date().toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()} · {durFormatted}
            </div>
          </div>

          {/* Desktop 2-col: reward+stats left, breakdown+actions right */}
          <div className="mt-5 lg:grid lg:grid-cols-2 lg:gap-8 lg:mt-8">

            {/* Left column */}
            <div>
              {/* Big reward card */}
              <div className="card p-6 text-center mt-0 transition-shadow duration-300 hover:shadow-premium" style={{ background: "linear-gradient(180deg, oklch(0.96 0.04 80), oklch(0.92 0.06 60))" }}>
                <div className="eyebrow justify-center"><span>RECOMPENSA MINTEADA</span></div>
                <div className="h-display mt-2 leading-none text-[64px]" style={{ color: "var(--ember)" }}>+{cerroEarned}</div>
                <div className="font-semibold text-sm" style={{ fontFamily: "var(--font-mono-var)", color: "var(--ember)" }}>$CERRO</div>
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                  <span className="chip">+38 XP</span>
                  <span className="chip chip-moss">2x MULTIPLIER</span>
                  <span className="chip chip-ember">TX FIRMADA</span>
                </div>
              </div>

              {/* Summary stats — 2x2 grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                  <span className="lbl">Distancia</span>
                  <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>{distKm}</span>
                  <span className="sub">KM</span>
                </div>
                <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                  <span className="lbl">Tiempo</span>
                  <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>{durFormatted}</span>
                  <span className="sub">HORAS</span>
                </div>
                <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                  <span className="lbl">Recogido</span>
                  <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>{pickCount}</span>
                  <span className="sub">PIEZAS</span>
                </div>
                <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                  <span className="lbl">Elevacion</span>
                  <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>+{elevGain}</span>
                  <span className="sub">METROS</span>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Material breakdown */}
              <div className="card p-4 mt-4 lg:mt-0 transition-shadow duration-300 hover:shadow-premium">
                <div className="eyebrow mb-3"><span>DESGLOSE DE MATERIALES</span></div>
                <div className="flex flex-col gap-3">
                  {/* PET */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <div className="wiki-icon w-8 h-8 rounded-[10px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 2h6l-1 5h-4z" /><rect x="7" y="7" width="10" height="14" rx="2" /></svg>
                      </div>
                      <span className="font-semibold text-[13px]">Botellas PET</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="mult">x1.5</span>
                      <span className="font-bold text-[13px]" style={{ fontFamily: "var(--font-mono-var)" }}>{Math.ceil(pickCount * 0.57)} · +{Math.ceil(pickCount * 0.57) * 12}</span>
                    </div>
                  </div>
                  {/* Latas */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <div className="wiki-icon w-8 h-8 rounded-[10px]" style={{ background: "color-mix(in oklch, var(--ember) 18%, var(--paper))", color: "var(--ember)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="3" width="12" height="18" rx="2" /></svg>
                      </div>
                      <span className="font-semibold text-[13px]">Latas aluminio</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="mult">x2.0</span>
                      <span className="font-bold text-[13px]" style={{ fontFamily: "var(--font-mono-var)" }}>{Math.floor(pickCount * 0.29)} · +{Math.floor(pickCount * 0.29) * 16}</span>
                    </div>
                  </div>
                  {/* Vidrio */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <div className="wiki-icon w-8 h-8 rounded-[10px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l4-5h6l4 5v13H5z" /></svg>
                      </div>
                      <span className="font-semibold text-[13px]">Vidrio</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="mult">x1.5</span>
                      <span className="font-bold text-[13px]" style={{ fontFamily: "var(--font-mono-var)" }}>{Math.floor(pickCount * 0.14)} · +{Math.floor(pickCount * 0.14) * 12}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation error */}
              {error && (
                <div className="card p-3.5 mt-3 text-[13px]" style={{ borderColor: "oklch(0.55 0.18 25 / .3)", background: "oklch(0.95 0.02 25)", color: "oklch(0.4 0.18 25)" }}>
                  {error}
                </div>
              )}

              {/* Validation feedback */}
              {!validation.valid && validation.reason && (
                <div className="card p-4 mt-4 flex items-center gap-3" style={{ borderColor: "var(--ember)", background: "var(--ember-soft)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--ember)", flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--ember)" }}>No se puede mintear</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--ink)" }}>{validation.reason}</div>
                  </div>
                </div>
              )}
              {validation.valid && (
                <div className="card p-4 mt-4 flex items-center gap-3" style={{ borderColor: "var(--moss)", background: "color-mix(in oklch, var(--moss) 10%, var(--paper))" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "var(--moss)", flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div className="font-bold text-sm" style={{ color: "var(--moss)" }}>Hike valido — listo para mintear</div>
                </div>
              )}

              {/* Actions — centered on desktop */}
              <div className="lg:max-w-md lg:mx-auto mt-4">
                <button className="btn btn-primary w-full" onClick={handleMintClick} disabled={!validation.valid}>
                  MINTEAR NFT
                </button>
                <button className="btn btn-secondary w-full mt-3 mb-10 lg:mb-0" onClick={handleDiscard}>
                  Descartar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Modal */}
        {showSubmitModal && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
            style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)" }}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-[480px] min-h-screen" style={{ background: "var(--paper)" }}>
              <div className="flex items-center justify-between px-5 py-4 sticky top-0 z-10" style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--moss)" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <h2 className="m-0 text-xl font-extrabold uppercase tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                    Proof-of-Clean
                  </h2>
                </div>
                <button onClick={handleCancelModal} className="p-1 bg-transparent border-0 cursor-pointer" style={{ color: "var(--muted)" }} aria-label="Cerrar">
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
    <AppShell hideNav={isTracking}>
      <div className={`flex flex-col ${isTracking ? "min-h-screen" : "min-h-[80vh]"}`}>

        {/* ──── IDLE STATE ──── */}
        {!isTracking && !hasPoints && (
          <div className="px-[18px] lg:px-0">

            {/* Desktop: 2-panel layout */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">

              {/* Left panel: Map preview + trail info */}
              <div>
                {/* Eyebrow */}
                <div className="eyebrow mt-4">
                  <span>SENDERO SELECCIONADO</span>
                  <span className="tick" />
                  <span>2X</span>
                </div>

                {/* Title */}
                <h1 className="h-display text-4xl mt-2 leading-[0.95] lg:text-5xl">
                  Cerro<br />El Diente
                </h1>

                {/* Subtitle meta */}
                <div className="mt-2 text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
                  5.8 KM · DIFICULTAD MEDIA · ~1H 45M
                </div>

                {/* Map stage */}
                <div className="map-stage mt-4 h-60 lg:h-80">
                  <div className="map-grid" />
                  <svg className="absolute inset-0" viewBox="0 0 400 240" preserveAspectRatio="none">
                    <ellipse cx={120} cy={180} rx={110} ry={60} fill="oklch(0.85 0.08 145 / .55)" />
                    <ellipse cx={290} cy={80} rx={100} ry={50} fill="oklch(0.85 0.08 145 / .55)" />
                    <path d="M40 200 Q100 140 180 130 T 360 50" stroke="oklch(0.78 0.02 150)" strokeWidth="3" fill="none" />
                    <path d="M40 200 Q100 140 180 130 T 360 50" stroke="var(--ember)" strokeWidth="3" fill="none" strokeDasharray="6 6" opacity={0.6} />
                    <circle cx={40} cy={200} r={6} fill="var(--moss)" />
                    <circle cx={360} cy={50} r={8} fill="var(--ember)" />
                  </svg>
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex gap-2 justify-between">
                    <div className="chip" style={{ background: "rgba(255,255,255,.8)" }}>
                      <span style={{ fontFamily: "var(--font-mono-var)" }}>START</span>
                    </div>
                    <div className="chip chip-ember">
                      <span style={{ fontFamily: "var(--font-mono-var)" }}>CUMBRE 1,820m</span>
                    </div>
                  </div>
                </div>

                {/* Elevation profile */}
                <div className="card p-3.5 mt-3 transition-shadow duration-300 hover:shadow-premium">
                  <div className="eyebrow mb-2">
                    <span>PERFIL ELEVACION</span>
                    <span className="tick" />
                    <span style={{ fontFamily: "var(--font-mono-var)" }}>+420M</span>
                  </div>
                  <svg viewBox="0 0 320 80" className="w-full h-20">
                    <defs>
                      <linearGradient id="ele" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="oklch(0.7 0.1 145)" stopOpacity={0.6} />
                        <stop offset="1" stopColor="oklch(0.7 0.1 145)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path d="M0 70 L20 60 L50 50 L90 30 L130 38 L170 22 L210 28 L250 14 L290 6 L320 12 L320 80 L0 80 Z" fill="url(#ele)" />
                    <path d="M0 70 L20 60 L50 50 L90 30 L130 38 L170 22 L210 28 L250 14 L290 6 L320 12" fill="none" stroke="var(--moss)" strokeWidth="2" />
                  </svg>
                  <div className="flex justify-between text-[10px] tracking-[0.1em]" style={{ fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
                    <span>1,400 M</span>
                    <span>1,820 M</span>
                  </div>
                </div>
              </div>

              {/* Right panel: Stats + badges + buddies + CTA */}
              <div className="lg:pt-12">

                {/* Chip badges */}
                <div className="flex gap-2 mt-3 lg:mt-0">
                  <div className="chip chip-moss">DIFICULTAD MEDIA</div>
                  <div className="chip chip-ember">MULTIPLICADOR x2</div>
                </div>

                {/* Trail stats cards — desktop premium */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3 lg:mt-5">
                  <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                    <span className="lbl">Distancia</span>
                    <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>5.8</span>
                    <span className="sub">KM</span>
                  </div>
                  <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                    <span className="lbl">Elevacion</span>
                    <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>+420</span>
                    <span className="sub">METROS</span>
                  </div>
                  <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                    <span className="lbl">Tiempo est.</span>
                    <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>1:45</span>
                    <span className="sub">HORAS</span>
                  </div>
                  <div className="card stat transition-shadow duration-300 hover:shadow-premium">
                    <span className="lbl">Recompensa</span>
                    <span className="val" style={{ fontFamily: "var(--font-mono-var)", color: "var(--ember)" }}>x2</span>
                    <span className="sub">MULTIPLIER</span>
                  </div>
                </div>

                {/* Trepadores cerca */}
                <div className="flex justify-between items-center mt-5 mb-2">
                  <h2 className="m-0 font-extrabold text-xl" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>Trepadores cerca</h2>
                  <span className="chip chip-moss">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                    3 ACTIVOS
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="buddy transition-shadow duration-300 hover:shadow-premium">
                    <div className="av" />
                    <div className="flex-1">
                      <div className="font-bold text-[13px]">@chivasreciclas</div>
                      <div className="text-[10px] tracking-[0.05em]" style={{ fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>EN RUTA · 1.2 KM</div>
                    </div>
                    <button className="h-8 px-3 text-[11px] rounded-full cursor-pointer" style={{ border: "1px solid var(--line)", background: "var(--paper)" }}>SALUDAR</button>
                  </div>
                  <div className="buddy transition-shadow duration-300 hover:shadow-premium">
                    <div className="av b" />
                    <div className="flex-1">
                      <div className="font-bold text-[13px]">@gdl_huellaverde</div>
                      <div className="text-[10px] tracking-[0.05em]" style={{ fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>CUMBRE · 0.4 KM</div>
                    </div>
                    <button className="h-8 px-3 text-[11px] rounded-full cursor-pointer" style={{ border: "1px solid var(--line)", background: "var(--paper)" }}>SALUDAR</button>
                  </div>
                </div>

                {/* Start button */}
                <button className="btn btn-primary mt-5 w-full" onClick={start}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  INICIAR TREPADA
                </button>
                <div className="text-center mt-2 text-[11px] pb-10 lg:pb-0" style={{ color: "var(--muted)" }}>
                  El GPS empezara a registrar tu ruta y bolsas recolectadas.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──── ACTIVE (TRACKING) STATE ──── */}
        {isTracking && (
          <div className="flex flex-col lg:flex-row lg:min-h-screen">

            {/* Left: Full map — 60% on desktop */}
            <div className="lg:w-3/5 lg:relative lg:min-h-screen">
              <div className="map-stage h-[340px] rounded-none lg:h-full lg:rounded-none">
                <div className="liveheader">
                  <div className="live-tag">
                    <span className="pulse" />
                    EN VIVO
                  </div>
                  <div className="chip" style={{ background: "rgba(255,255,255,.85)" }}>
                    <span style={{ fontFamily: "var(--font-mono-var)" }}>{formatDuration(stats.durationSeconds)}</span>
                  </div>
                </div>

                <HikeMap points={mapPoints} height={340} className="w-full h-full" />

                {/* Pulse dot */}
                <div className="pulse-dot absolute left-[53%] top-[53%]" />

                {/* Elevation chip */}
                <div className="absolute bottom-3 right-3.5">
                  <div className="chip" style={{ background: "rgba(255,255,255,.85)", fontFamily: "var(--font-mono-var)" }}>
                    +{Math.round(stats.elevationGain)}M
                  </div>
                </div>
              </div>
            </div>

            {/* Right: HUD controls — 40% on desktop */}
            <div className="px-[18px] lg:w-2/5 lg:px-6 lg:py-6 lg:overflow-y-auto lg:max-h-screen">

              {/* Desktop-only header */}
              <div className="hidden lg:flex lg:items-center lg:gap-3 lg:mb-4">
                <div className="live-tag">
                  <span className="pulse" />
                  TRACKING
                </div>
                <div className="flex-1" />
                <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono-var)", color: "var(--ink)" }}>
                  {formatDuration(stats.durationSeconds)}
                </div>
              </div>

              {/* Live HUD */}
              <div className="flex gap-2 mt-3 lg:mt-0">
                <div className="card stat flex-1 transition-shadow duration-300 hover:shadow-premium">
                  <span className="lbl">Distancia</span>
                  <span className="hud-num" style={{ fontFamily: "var(--font-mono-var)" }}>{(stats.distanceMeters / 1000).toFixed(2)}</span>
                  <span className="sub">KM</span>
                </div>
                <div className="card stat flex-1 transition-shadow duration-300 hover:shadow-premium">
                  <span className="lbl">Pace</span>
                  <span className="hud-num" style={{ fontFamily: "var(--font-mono-var)" }}>{formatPace(stats.distanceMeters, stats.durationSeconds)}</span>
                  <span className="sub">MIN/KM</span>
                </div>
                <div className="card stat flex-1 transition-shadow duration-300 hover:shadow-premium">
                  <span className="lbl">Elevacion</span>
                  <span className="hud-num" style={{ fontFamily: "var(--font-mono-var)" }}>+{Math.round(stats.elevationGain)}</span>
                  <span className="sub">MTS</span>
                </div>
              </div>

              {/* Pickup counter (pickbar) */}
              <div className="pickbar mt-3">
                <div>
                  <div className="small">RECOLECTADO</div>
                  <div className="flex gap-2 items-center">
                    <span className="count">{pickCount}</span>
                    <span className="text-[11px] opacity-60" style={{ fontFamily: "var(--font-mono-var)" }}>x{(pickCount * 0.17).toFixed(1)}KG</span>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="text-right">
                  <div className="small opacity-50">GANADO HOY</div>
                  <div className="flex gap-1 items-center justify-end">
                    <span className="count text-[30px]" style={{ color: "var(--ember)" }}>+{pickCount * 12}</span>
                    <span className="text-[11px] opacity-60 pb-1.5" style={{ fontFamily: "var(--font-mono-var)" }}>$CERRO</span>
                  </div>
                </div>
                <button className="pick-btn" onClick={() => setPickCount((c) => c + 1)}>+1</button>
              </div>

              {/* Last pickup card */}
              {pickCount > 0 && (
                <div className="card p-3.5 mt-3 transition-shadow duration-300 hover:shadow-premium">
                  <div className="flex justify-between items-center mb-3">
                    <span className="eyebrow"><span>ULTIMA RECOLECCION</span></span>
                    <span className="mult">x1.5</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="photo w-[72px] h-[72px] shrink-0">FOTO</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Botella PET — 600ml</div>
                      <div className="text-[11px] tracking-[0.05em]" style={{ fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
                        HACE {pickCount} MIN · {points.length > 0 ? `${points[points.length - 1].lat.toFixed(4)}°N` : "GPS"}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="chip chip-ember" style={{ fontFamily: "var(--font-mono-var)" }}>+12 $CERRO</span>
                        <span className="chip">PET #{pickCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="card p-3.5 mt-3 text-[13px]" style={{ borderColor: "oklch(0.55 0.18 25 / .3)", background: "oklch(0.95 0.02 25)", color: "oklch(0.4 0.18 25)" }}>
                  {error}
                </div>
              )}

              {/* End button */}
              <button className="btn btn-danger mt-5 mb-10 lg:mb-6 w-full" onClick={stop}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                TERMINAR TREPADA
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
