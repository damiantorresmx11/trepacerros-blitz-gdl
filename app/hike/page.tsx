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
      <AppShell hideNav>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "color-mix(in oklch, var(--moss) 10%, var(--paper))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--moss)" }}>
              <path d="M3 20l5.5-9 4 6 3-4L21 20z" />
            </svg>
          </div>
          <h1 className="h-display" style={{ fontSize: 36 }}>Conecta tu wallet</h1>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--muted)", marginTop: 12, maxWidth: 280, lineHeight: 1.5 }}>
            Para iniciar una trepada y mintear tu rastro necesitas estar conectado.
          </p>
          <div style={{ marginTop: 32 }}>
            <ConnectButton />
          </div>
          <p style={{ fontFamily: "var(--font-mono-var)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.18em", marginTop: 24, opacity: 0.6 }}>
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
      <AppShell hideNav>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)", padding: "0 18px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              <span>TREPADA COMPLETADA</span>
            </div>
            <h1 className="h-display" style={{ fontSize: 48, marginTop: 12, lineHeight: 0.9 }}>
              ¡Buena<br />trepada!
            </h1>
            <div style={{ fontFamily: "var(--font-mono-var)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", marginTop: 8, textTransform: "uppercase" }}>
              EL DIENTE · {new Date().toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()} · {durFormatted}
            </div>
          </div>

          {/* Big reward card */}
          <div className="card" style={{ padding: 24, textAlign: "center", marginTop: 20, background: "linear-gradient(180deg, oklch(0.96 0.04 80), oklch(0.92 0.06 60))" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}><span>RECOMPENSA MINTEADA</span></div>
            <div className="h-display" style={{ fontSize: 64, marginTop: 8, lineHeight: 1, color: "var(--ember)" }}>+{cerroEarned}</div>
            <div style={{ fontFamily: "var(--font-mono-var)", fontSize: 14, fontWeight: 600, color: "var(--ember)" }}>$CERRO</div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <span className="chip">+38 XP</span>
              <span className="chip chip-moss">2x MULTIPLIER</span>
              <span className="chip chip-ember">TX FIRMADA</span>
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <div className="card stat" style={{ flex: 1, minWidth: "42%" }}>
              <span className="lbl">Distancia</span>
              <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>{distKm}</span>
              <span className="sub">KM</span>
            </div>
            <div className="card stat" style={{ flex: 1, minWidth: "42%" }}>
              <span className="lbl">Tiempo</span>
              <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>{durFormatted}</span>
              <span className="sub">HORAS</span>
            </div>
            <div className="card stat" style={{ flex: 1, minWidth: "42%" }}>
              <span className="lbl">Recogido</span>
              <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>{pickCount}</span>
              <span className="sub">PIEZAS</span>
            </div>
            <div className="card stat" style={{ flex: 1, minWidth: "42%" }}>
              <span className="lbl">Elevacion</span>
              <span className="val" style={{ fontFamily: "var(--font-mono-var)" }}>+{elevGain}</span>
              <span className="sub">METROS</span>
            </div>
          </div>

          {/* Material breakdown */}
          <div className="card" style={{ padding: 16, marginTop: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}><span>DESGLOSE DE MATERIALES</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="wiki-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 2h6l-1 5h-4z" /><rect x="7" y="7" width="10" height="14" rx="2" /></svg>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Botellas PET</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="mult">x1.5</span>
                  <span style={{ fontFamily: "var(--font-mono-var)", fontSize: 13, fontWeight: 700 }}>{Math.ceil(pickCount * 0.57)} · +{Math.ceil(pickCount * 0.57) * 12}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="wiki-icon" style={{ width: 32, height: 32, borderRadius: 10, background: "color-mix(in oklch, var(--ember) 18%, var(--paper))", color: "var(--ember)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="3" width="12" height="18" rx="2" /></svg>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Latas aluminio</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="mult">x2.0</span>
                  <span style={{ fontFamily: "var(--font-mono-var)", fontSize: 13, fontWeight: 700 }}>{Math.floor(pickCount * 0.29)} · +{Math.floor(pickCount * 0.29) * 16}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="wiki-icon" style={{ width: 32, height: 32, borderRadius: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l4-5h6l4 5v13H5z" /></svg>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Vidrio</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="mult">x1.5</span>
                  <span style={{ fontFamily: "var(--font-mono-var)", fontSize: 13, fontWeight: 700 }}>{Math.floor(pickCount * 0.14)} · +{Math.floor(pickCount * 0.14) * 12}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validation */}
          {error && (
            <div className="card" style={{ padding: 14, marginTop: 12, borderColor: "oklch(0.55 0.18 25 / .3)", background: "oklch(0.95 0.02 25)", color: "oklch(0.4 0.18 25)", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleMintClick} disabled={!validation.valid}>
            MINTEAR NFT
          </button>
          <button className="btn btn-secondary" style={{ marginTop: 12, marginBottom: 40 }} onClick={handleDiscard}>
            Descartar
          </button>
        </div>

        {/* Submit Modal */}
        {showSubmitModal && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto" }}
            role="dialog"
            aria-modal="true"
          >
            <div style={{ width: "100%", maxWidth: 480, minHeight: "100vh", background: "var(--paper)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, background: "var(--paper)", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--moss)" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.01em", margin: 0 }}>
                    Proof-of-Clean
                  </h2>
                </div>
                <button onClick={handleCancelModal} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--muted)", padding: 4 }} aria-label="Cerrar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div style={{ padding: 20 }}>
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
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>

        {/* ──── IDLE STATE ──── */}
        {!isTracking && !hasPoints && (
          <div style={{ padding: "0 18px" }}>

            {/* Eyebrow */}
            <div className="eyebrow" style={{ marginTop: 16 }}>
              <span>SENDERO SELECCIONADO</span>
              <span className="tick" />
              <span>2X</span>
            </div>

            {/* Title */}
            <h1 className="h-display" style={{ fontSize: 36, marginTop: 8, lineHeight: 0.95 }}>
              Cerro<br />El Diente
            </h1>

            {/* Subtitle meta */}
            <div style={{ fontFamily: "var(--font-mono-var)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", marginTop: 8, textTransform: "uppercase" }}>
              5.8 KM · DIFICULTAD MEDIA · ~1H 45M
            </div>

            {/* Map stage */}
            <div className="map-stage" style={{ height: 240, marginTop: 16 }}>
              <div className="map-grid" />
              <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 400 240" preserveAspectRatio="none">
                <ellipse cx={120} cy={180} rx={110} ry={60} fill="oklch(0.85 0.08 145 / .55)" />
                <ellipse cx={290} cy={80} rx={100} ry={50} fill="oklch(0.85 0.08 145 / .55)" />
                <path d="M40 200 Q100 140 180 130 T 360 50" stroke="oklch(0.78 0.02 150)" strokeWidth="3" fill="none" />
                <path d="M40 200 Q100 140 180 130 T 360 50" stroke="var(--ember)" strokeWidth="3" fill="none" strokeDasharray="6 6" opacity={0.6} />
                <circle cx={40} cy={200} r={6} fill="var(--moss)" />
                <circle cx={360} cy={50} r={8} fill="var(--ember)" />
              </svg>
              <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", gap: 8, justifyContent: "space-between" }}>
                <div className="chip" style={{ background: "rgba(255,255,255,.8)" }}>
                  <span style={{ fontFamily: "var(--font-mono-var)" }}>START</span>
                </div>
                <div className="chip chip-ember">
                  <span style={{ fontFamily: "var(--font-mono-var)" }}>CUMBRE 1,820m</span>
                </div>
              </div>
            </div>

            {/* Elevation profile */}
            <div className="card" style={{ padding: 14, marginTop: 12 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                <span>PERFIL ELEVACION</span>
                <span className="tick" />
                <span style={{ fontFamily: "var(--font-mono-var)" }}>+420M</span>
              </div>
              <svg viewBox="0 0 320 80" style={{ width: "100%", height: 80 }}>
                <defs>
                  <linearGradient id="ele" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="oklch(0.7 0.1 145)" stopOpacity={0.6} />
                    <stop offset="1" stopColor="oklch(0.7 0.1 145)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d="M0 70 L20 60 L50 50 L90 30 L130 38 L170 22 L210 28 L250 14 L290 6 L320 12 L320 80 L0 80 Z" fill="url(#ele)" />
                <path d="M0 70 L20 60 L50 50 L90 30 L130 38 L170 22 L210 28 L250 14 L290 6 L320 12" fill="none" stroke="var(--moss)" strokeWidth="2" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono-var)", color: "var(--muted)", fontSize: 10, letterSpacing: "0.1em" }}>
                <span>1,400 M</span>
                <span>1,820 M</span>
              </div>
            </div>

            {/* Chip badges */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <div className="chip chip-moss">DIFICULTAD MEDIA</div>
              <div className="chip chip-ember">MULTIPLICADOR x2</div>
            </div>

            {/* Trepadores cerca */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 8 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", margin: 0 }}>Trepadores cerca</h2>
              <span className="chip chip-moss">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                3 ACTIVOS
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="buddy">
                <div className="av" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>@chivasreciclas</div>
                  <div style={{ fontFamily: "var(--font-mono-var)", fontSize: 10, letterSpacing: "0.05em", color: "var(--muted)" }}>EN RUTA · 1.2 KM</div>
                </div>
                <button className="btn-secondary" style={{ height: 32, padding: "0 12px", fontSize: 11, borderRadius: 99, border: "1px solid var(--line)", background: "var(--paper)", cursor: "pointer" }}>SALUDAR</button>
              </div>
              <div className="buddy">
                <div className="av b" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>@gdl_huellaverde</div>
                  <div style={{ fontFamily: "var(--font-mono-var)", fontSize: 10, letterSpacing: "0.05em", color: "var(--muted)" }}>CUMBRE · 0.4 KM</div>
                </div>
                <button className="btn-secondary" style={{ height: 32, padding: "0 12px", fontSize: 11, borderRadius: 99, border: "1px solid var(--line)", background: "var(--paper)", cursor: "pointer" }}>SALUDAR</button>
              </div>
            </div>

            {/* Start button */}
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={start}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              INICIAR TREPADA
            </button>
            <div style={{ color: "var(--muted)", textAlign: "center", marginTop: 8, fontSize: 11, paddingBottom: 40 }}>
              El GPS empezara a registrar tu ruta y bolsas recolectadas.
            </div>
          </div>
        )}

        {/* ──── ACTIVE (TRACKING) STATE ──── */}
        {isTracking && (
          <div style={{ display: "flex", flexDirection: "column" }}>

            {/* Map stage with live header */}
            <div className="map-stage" style={{ height: 340, borderRadius: 0 }}>
              <div className="liveheader">
                <div className="live-tag">
                  <span className="pulse" />
                  EN VIVO
                </div>
                <div className="chip" style={{ background: "rgba(255,255,255,.85)" }}>
                  <span style={{ fontFamily: "var(--font-mono-var)" }}>{formatDuration(stats.durationSeconds)}</span>
                </div>
              </div>

              {/* HikeMap inside map-stage */}
              <HikeMap points={mapPoints} height={340} className="w-full h-full" />

              {/* Pulse dot */}
              <div className="pulse-dot" style={{ position: "absolute", left: "53%", top: "53%" }} />

              {/* Elevation chip */}
              <div style={{ position: "absolute", bottom: 12, right: 14 }}>
                <div className="chip" style={{ background: "rgba(255,255,255,.85)", fontFamily: "var(--font-mono-var)" }}>
                  +{Math.round(stats.elevationGain)}M
                </div>
              </div>
            </div>

            {/* Content pad */}
            <div style={{ padding: "0 18px" }}>

              {/* Live HUD */}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <div className="card stat" style={{ flex: 1 }}>
                  <span className="lbl">Distancia</span>
                  <span className="hud-num" style={{ fontFamily: "var(--font-mono-var)" }}>{(stats.distanceMeters / 1000).toFixed(2)}</span>
                  <span className="sub">KM</span>
                </div>
                <div className="card stat" style={{ flex: 1 }}>
                  <span className="lbl">Pace</span>
                  <span className="hud-num" style={{ fontFamily: "var(--font-mono-var)" }}>{formatPace(stats.distanceMeters, stats.durationSeconds)}</span>
                  <span className="sub">MIN/KM</span>
                </div>
                <div className="card stat" style={{ flex: 1 }}>
                  <span className="lbl">Elevacion</span>
                  <span className="hud-num" style={{ fontFamily: "var(--font-mono-var)" }}>+{Math.round(stats.elevationGain)}</span>
                  <span className="sub">MTS</span>
                </div>
              </div>

              {/* Pickup counter (pickbar) */}
              <div className="pickbar" style={{ marginTop: 12 }}>
                <div>
                  <div className="small">RECOLECTADO</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="count">{pickCount}</span>
                    <span style={{ fontFamily: "var(--font-mono-var)", fontSize: 11, opacity: 0.6 }}>x{(pickCount * 0.17).toFixed(1)}KG</span>
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ textAlign: "right" }}>
                  <div className="small" style={{ opacity: 0.5 }}>GANADO HOY</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "flex-end" }}>
                    <span className="count" style={{ fontSize: 30, color: "var(--ember)" }}>+{pickCount * 12}</span>
                    <span style={{ fontFamily: "var(--font-mono-var)", fontSize: 11, opacity: 0.6, paddingBottom: 6 }}>$CERRO</span>
                  </div>
                </div>
                <button className="pick-btn" onClick={() => setPickCount((c) => c + 1)}>+1</button>
              </div>

              {/* Last pickup card */}
              {pickCount > 0 && (
                <div className="card" style={{ padding: 14, marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="eyebrow"><span>ULTIMA RECOLECCION</span></span>
                    <span className="mult">x1.5</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="photo" style={{ width: 72, height: 72, flexShrink: 0 }}>FOTO</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Botella PET — 600ml</div>
                      <div style={{ fontFamily: "var(--font-mono-var)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.05em" }}>
                        HACE {pickCount} MIN · {points.length > 0 ? `${points[points.length - 1].lat.toFixed(4)}°N` : "GPS"}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <span className="chip chip-ember" style={{ fontFamily: "var(--font-mono-var)" }}>+12 $CERRO</span>
                        <span className="chip">PET #{pickCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="card" style={{ padding: 14, marginTop: 12, borderColor: "oklch(0.55 0.18 25 / .3)", background: "oklch(0.95 0.02 25)", color: "oklch(0.4 0.18 25)", fontSize: 13 }}>
                  {error}
                </div>
              )}

              {/* End button */}
              <button className="btn btn-danger" style={{ marginTop: 20, marginBottom: 40 }} onClick={stop}>
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
