"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { HeroIllustration } from "@/components/HeroIllustration";
import { usePrimaBalance, useHikerStats, useUserNFTs } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";
import { ConnectButton } from "@/components/ConnectButton";
import { useCountUp } from "@/hooks/useCountUp";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

/* ─── LANDING (unauthenticated) ─── */
function LandingHero() {
  const { login } = usePrivy();

  return (
    <div className="min-h-screen topo-bg flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Brand bar */}
      <div style={{ padding: "8px 20px 0" }}>
        <div className="flex items-center gap-2" style={{ fontSize: 20 }}>
          <span
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--ink)",
              color: "#fff",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
          </span>
          <span className="font-big-shoulders" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.04em" }}>TREPACERROS</span>
        </div>
      </div>

      {/* Eyebrow + headline */}
      <div style={{ padding: "0 20px", paddingBottom: 20, marginTop: 24 }}>
        <div className="eyebrow">
          <span>EST. GDL · 2026</span>
          <span className="tick" />
          <span>v1.0</span>
        </div>
        <h1
          className="h-display"
          style={{ fontSize: 72, marginTop: 12 }}
        >
          TREPA<br />EL CERRO,<br />
          <span style={{ color: "var(--ember)" }}>GANA</span><br />
          ${TOKEN_DISPLAY_NAME}.
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-2)", margin: "14px 0 0", lineHeight: 1.5, maxWidth: "32ch" }}>
          Sal, recolecta basura en los senderos de Guadalajara, y monetiza tu trepada en la red Monad.
        </p>
      </div>

      {/* Mountain hero card */}
      <div style={{ padding: "0 20px" }}>
        <div className="mtn-hero" style={{ height: 280 }}>
          <HeroIllustration className="w-full h-full" />
          {/* Coordinate chips */}
          <div style={{ position: "absolute", top: 20, left: 20, color: "#fff", font: "500 11px var(--font-mono-var)", letterSpacing: "0.04em", opacity: 0.85 }}>
            20.6736°N<br />103.3500°W
          </div>
          <div style={{ position: "absolute", top: 20, right: 30, color: "#fff", font: "500 11px var(--font-mono-var)", letterSpacing: "0.04em", opacity: 0.85, textAlign: "right" }}>
            BOSQUE LA PRIMAVERA<br />· EL DIENTE
          </div>
        </div>
      </div>

      {/* Quick stat row */}
      <div style={{ padding: "0 20px", marginTop: 16 }}>
        <div className="flex gap-2">
          <div className="card flex-1" style={{ padding: 12 }}>
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>Tokens minteados</div>
            <div className="flex items-baseline gap-1" style={{ marginTop: 8 }}>
              <span className="font-big-shoulders" style={{ fontSize: 22, fontWeight: 900 }}>142,031</span>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>${TOKEN_DISPLAY_NAME}</span>
            </div>
          </div>
          <div className="card flex-1" style={{ padding: 12 }}>
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>Basura recogida</div>
            <div className="flex items-baseline gap-1" style={{ marginTop: 8 }}>
              <span className="font-big-shoulders" style={{ fontSize: 22, fontWeight: 900 }}>2,847</span>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>KG</span>
            </div>
          </div>
          <div className="card flex-1" style={{ padding: 12 }}>
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>Trepadores</div>
            <div className="flex items-baseline gap-1" style={{ marginTop: 8 }}>
              <span className="font-big-shoulders" style={{ fontSize: 22, fontWeight: 900 }}>684</span>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>HIKERS</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 20px", marginTop: 20 }}>
        <button className="btn btn-primary" onClick={login}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h13a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M16 12h3"/><path d="M3 7l3-3h10v3"/></svg>
          CONECTAR WALLET
        </button>
        <button
          className="btn"
          style={{ height: "auto", padding: 10, marginTop: 12, background: "transparent", color: "var(--muted)", fontSize: 14 }}
        >
          Tengo dudas — ¿como funciona? →
        </button>
      </div>

      {/* How it works */}
      <div style={{ padding: "0 20px", marginTop: 24 }}>
        <div className="eyebrow">
          <span>COMO FUNCIONA</span>
          <span className="tick" />
          <span>3 PASOS</span>
        </div>
        <div className="flex flex-col" style={{ gap: 14, marginTop: 16 }}>
          {/* Step 1 */}
          <div className="card flex items-center" style={{ padding: 16, gap: 14 }}>
            <div
              className="hex-stamp"
              style={{ background: "var(--ember)", flexShrink: 0 }}
            >
              01
            </div>
            <div>
              <div className="font-big-shoulders" style={{ fontSize: 20, fontWeight: 800 }}>TREPA EL CERRO</div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: "var(--muted)" }}>Inicia tu sesion en cualquier sendero de GDL: La Primavera, El Diente, La Reina.</div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="card flex items-center" style={{ padding: 16, gap: 14 }}>
            <div
              className="hex-stamp"
              style={{ background: "var(--moss)", flexShrink: 0 }}
            >
              02
            </div>
            <div>
              <div className="font-big-shoulders" style={{ fontSize: 20, fontWeight: 800 }}>RECOLECTA BASURA</div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: "var(--muted)" }}>Toma foto de cada pieza y registra el material. Multiplicadores hasta 2x.</div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="card flex items-center" style={{ padding: 16, gap: 14 }}>
            <div
              className="hex-stamp"
              style={{ background: "var(--ink)", flexShrink: 0 }}
            >
              03
            </div>
            <div>
              <div className="font-big-shoulders" style={{ fontSize: 20, fontWeight: 800 }}>REDIME LOCAL</div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: "var(--muted)" }}>Tus ${TOKEN_DISPLAY_NAME} valen chelas, cafe y entradas en negocios aliados de Jalisco.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust footer */}
      <div style={{ padding: "0 20px", marginTop: 24, marginBottom: 20 }}>
        <div className="card flex items-center" style={{ padding: 16, gap: 12 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--bg-2)",
              color: "var(--moss)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Verificado on-chain</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Cada trepada se firma en Monad. Tu impacto, on-chain.</div>
          </div>
        </div>
        <div className="text-center font-mono" style={{ fontSize: 10, letterSpacing: "0.16em", marginTop: 24, color: "var(--muted)" }}>
          HECHO EN GDL · CON AMOR POR HUELLA VERDE
        </div>
      </div>
    </div>
  );
}

/* ─── HOME (authenticated) ─── */
function AuthenticatedDashboard() {
  const { address } = useAccount();
  const { formatted } = usePrimaBalance(address);
  const { totalKg, hikes, isLoading: statsLoading } = useHikerStats(address);
  const { nfts } = useUserNFTs(address);

  const kgRaw = Number(totalKg) / 1000;
  const balanceRaw = Math.floor(Number(formatted));
  const hikesRaw = Number(hikes);

  const animatedBalance = useCountUp(balanceRaw);
  const animatedKg = useCountUp(Math.round(kgRaw * 10)) / 10;
  const animatedHikes = useCountUp(hikesRaw);

  const recentNfts = nfts.slice(0, 3);
  const greeting = getGreeting();

  const now = new Date();
  const dayNames = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const dateStr = `${dayNames[now.getDay()]} · ${now.getDate()} ${monthNames[now.getMonth()]} · ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      {/* Greeting */}
      <div style={{ padding: "0 20px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>{dateStr}</div>
            <h1 className="font-big-shoulders" style={{ fontSize: 34, fontWeight: 900, lineHeight: 1, margin: 0 }}>
              {greeting},<br />Trepador.
            </h1>
          </div>
        </div>

        {/* Weather + trail pill row */}
        <div className="flex flex-wrap" style={{ gap: 8, marginTop: 16 }}>
          <div className="chip" style={{ background: "color-mix(in oklch, var(--moss) 18%, var(--bg-2))", color: "var(--moss)" }}>
            <span>&#9728;</span> 18°C · Soleado
          </div>
          <div className="chip">AQI 42 · Limpio</div>
          <div className="chip">Viento 6 km/h</div>
        </div>

        {/* Big start card */}
        <div className="card" style={{ overflow: "hidden", padding: 0, marginTop: 16 }}>
          <div className="mtn-hero" style={{ height: 170 }}>
            <HeroIllustration className="w-full h-full" />
            <div style={{ position: "absolute", left: 18, top: 14, color: "#fff", font: "500 10px var(--font-mono-var)", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.8 }}>
              HOY · LA PRIMAVERA
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-big-shoulders" style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.05 }}>
                  ¿Listo para trepar?
                </div>
                <div style={{ fontSize: 13, marginTop: 4, color: "var(--muted)" }}>
                  El sendero te espera. Promedio 4.2km · 1h 12min
                </div>
              </div>
            </div>
            <Link href="/hike" className="btn btn-primary" style={{ marginTop: 16 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              START TREPADA
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex" style={{ gap: 8, marginTop: 16 }}>
          <div className="stat card flex-1">
            <span className="lbl">Balance</span>
            <span className="val font-mono">{animatedBalance.toLocaleString()}</span>
            <span className="sub">${TOKEN_DISPLAY_NAME}</span>
          </div>
          <div className="stat card flex-1">
            <span className="lbl">Recolectado</span>
            <span className="val font-mono">{statsLoading ? "..." : animatedKg.toFixed(1)}</span>
            <span className="sub">KG TOTAL</span>
          </div>
          <div className="stat card flex-1">
            <span className="lbl">Trepadas</span>
            <span className="val font-mono">{statsLoading ? "..." : animatedHikes.toLocaleString()}</span>
            <span className="sub">SESIONES</span>
          </div>
        </div>

        {/* Level progression */}
        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>NIVEL 03 · TREPADOR NOVATO</div>
              <div className="font-big-shoulders" style={{ fontSize: 18, fontWeight: 800 }}>Proximo: Caminante</div>
            </div>
            <div className="font-big-shoulders" style={{ fontSize: 18, fontWeight: 800, color: "var(--ember)" }}>
              320<span style={{ opacity: 0.3 }}>/500</span>
            </div>
          </div>
          <div className="progressbar" style={{ marginTop: 12 }}>
            <span style={{ width: "64%" }} />
          </div>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.12em", marginTop: 8, color: "var(--muted)" }}>
            180 XP MAS · LIMPIA 2 SENDEROS
          </div>
        </div>

        {/* Today's quests */}
        <div className="flex items-center justify-between" style={{ marginTop: 24, marginBottom: 12 }}>
          <h2 className="h-section">Retos de hoy</h2>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>VER TODOS →</span>
        </div>

        <div className="flex flex-col" style={{ gap: 10 }}>
          {/* Quest 1 */}
          <div className="card quest-card">
            <div className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--ember)", letterSpacing: "0.05em" }}>+50 ${TOKEN_DISPLAY_NAME}</div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: "color-mix(in oklch, var(--ember) 18%, var(--paper))",
                  color: "var(--ember)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              </div>
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 14 }}>Treprano</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Inicia una trepada antes de las 8:00 AM</div>
              </div>
            </div>
            <div className="progressbar"><span style={{ width: "0%" }} /></div>
          </div>

          {/* Quest 2 */}
          <div className="card quest-card">
            <div className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--moss)", letterSpacing: "0.05em" }}>+120 ${TOKEN_DISPLAY_NAME}</div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: "color-mix(in oklch, var(--moss) 18%, var(--paper))",
                  color: "var(--moss)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18l-2 13H5z"/><path d="M9 10v6M15 10v6"/></svg>
              </div>
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 14 }}>Cazador de PET</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Recolecta 10 botellas PET esta semana</div>
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--muted)" }}>3/10</div>
            </div>
            <div className="progressbar"><span style={{ width: "30%" }} /></div>
          </div>

          {/* Quest 3 */}
          <div className="card quest-card">
            <div className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--ink)", letterSpacing: "0.05em" }}>+300 ${TOKEN_DISPLAY_NAME}</div>
            <div className="flex items-center" style={{ gap: 12 }}>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: "color-mix(in oklch, var(--ink) 18%, var(--paper))",
                  color: "var(--ink)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
              </div>
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 14 }}>Conquista La Reina</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Llega a la cumbre del Cerro de la Reina</div>
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--muted)" }}>0/1</div>
            </div>
            <div className="progressbar"><span style={{ width: "0%" }} /></div>
          </div>
        </div>

        {/* Nearby trails */}
        <div className="flex items-center justify-between" style={{ marginTop: 24, marginBottom: 12 }}>
          <h2 className="h-section">Senderos cerca</h2>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>MAPA →</span>
        </div>

        <div className="flex flex-col" style={{ gap: 10 }}>
          {[
            { name: "Bosque La Primavera", info: "2.3 KM · 87 TREPADAS · 1.5x" },
            { name: "Cerro El Diente", info: "5.8 KM · 142 TREPADAS · 2x" },
            { name: "Cerro de la Reina", info: "3.1 KM · 64 TREPADAS · 1.8x" },
          ].map((trail) => (
            <Link key={trail.name} href="/hike">
              <div className="card tap flex items-center" style={{ padding: 14, gap: 14 }}>
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    background: "var(--bg-2)",
                    color: "var(--moss)",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
                </div>
                <div className="flex-1">
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{trail.name}</div>
                  <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.05em", color: "var(--muted)" }}>{trail.info}</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)" }}><path d="M9 6l6 6-6 6"/></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent trails from NFTs */}
        {recentNfts.length > 0 && (
          <>
            <div className="flex items-center justify-between" style={{ marginTop: 24, marginBottom: 12 }}>
              <h2 className="h-section">Trepadas recientes</h2>
              <Link href="/gallery" className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>
                VER TODOS →
              </Link>
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {recentNfts.map((nft) => {
                const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
                const km = (Number(nft.rastro.distanceMeters) / 1000).toFixed(1);
                return (
                  <Link key={nft.tokenId.toString()} href="/gallery">
                    <div className="card tap flex items-center" style={{ padding: 14, gap: 14 }}>
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          background: "color-mix(in oklch, var(--moss) 18%, var(--paper))",
                          color: "var(--moss)",
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontWeight: 700, fontSize: 14 }}>Trepada #{nft.tokenId.toString()}</div>
                        <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase" }}>
                          {km} KM · {kg} KG
                        </div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)" }}><path d="M9 6l6 6-6 6"/></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Community impact */}
        <div
          className="card"
          style={{
            padding: 16,
            marginTop: 24,
            background: "linear-gradient(135deg, oklch(0.96 0.02 150), oklch(0.92 0.04 145))",
            border: "1px solid color-mix(in oklch, var(--moss) 25%, transparent)",
          }}
        >
          <div className="eyebrow">IMPACTO COMUNITARIO · ESTA SEMANA</div>
          <div className="font-big-shoulders" style={{ fontSize: 34, fontWeight: 900, lineHeight: 1, marginTop: 12, color: "var(--moss)" }}>
            186 KG
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
            Recolectados por 84 trepadores en 23 senderos
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3" style={{ marginTop: 24, paddingBottom: 16 }}>
          <Link href="/rewards" className="card tap flex flex-col items-center" style={{ padding: 20, gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: "var(--ember)" }}>storefront</span>
            <span className="font-big-shoulders" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Rewards</span>
          </Link>
          <Link href="/wiki" className="card tap flex flex-col items-center" style={{ padding: 20, gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: "var(--moss)" }}>menu_book</span>
            <span className="font-big-shoulders" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Wiki</span>
          </Link>
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
