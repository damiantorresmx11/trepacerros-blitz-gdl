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
      <div className="px-5 pt-2">
        <div className="flex items-center gap-2 text-xl">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: "var(--ink)", color: "#fff" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
          </span>
          <span className="font-big-shoulders font-[800] tracking-[0.04em]" style={{ fontSize: 22 }}>TREPACERROS</span>
        </div>
      </div>

      {/* Eyebrow + headline */}
      <section className="animate-fade-in px-5 pb-5 mt-6">
        <div className="eyebrow">
          <span>EST. GDL · 2026</span>
          <span className="tick" />
          <span>v1.0</span>
        </div>
        <h1
          className="h-display text-[48px] md:text-[56px] lg:text-[64px] mt-3"
        >
          TREPA<br />EL CERRO,<br />
          <span style={{ color: "var(--ember)" }}>GANA</span><br />
          ${TOKEN_DISPLAY_NAME}.
        </h1>
        <p className="text-[15px] mt-3.5 leading-relaxed max-w-[32ch]" style={{ color: "var(--ink-2)" }}>
          Sal, recolecta basura en los senderos de Guadalajara, y monetiza tu trepada en la red Monad.
        </p>
      </section>

      {/* Mountain hero card */}
      <div className="animate-fade-in px-5">
        <div className="mtn-hero h-[280px] lg:h-[340px]">
          <HeroIllustration className="w-full h-full" />
          {/* Coordinate chips */}
          <div className="absolute top-5 left-5" style={{ color: "#fff", font: "500 11px var(--font-mono-var)", letterSpacing: "0.04em", opacity: 0.85 }}>
            20.6736°N<br />103.3500°W
          </div>
          <div className="absolute top-5 right-[30px] text-right" style={{ color: "#fff", font: "500 11px var(--font-mono-var)", letterSpacing: "0.04em", opacity: 0.85 }}>
            BOSQUE LA PRIMAVERA<br />· EL DIENTE
          </div>
        </div>
      </div>

      {/* Quick stat row */}
      <div className="animate-fade-in px-5 mt-4">
        <div className="flex gap-2">
          {[
            { label: "Tokens minteados", value: "142,031", unit: `$${TOKEN_DISPLAY_NAME}` },
            { label: "Basura recogida", value: "2,847", unit: "KG" },
            { label: "Trepadores", value: "684", unit: "HIKERS" },
          ].map((s) => (
            <div
              key={s.label}
              className="card flex-1 p-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--muted)" }}>{s.label}</div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-big-shoulders font-[900]" style={{ fontSize: 22 }}>{s.value}</span>
                <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="animate-fade-in px-5 mt-5">
        <button className="btn btn-primary" onClick={login}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h13a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M16 12h3"/><path d="M3 7l3-3h10v3"/></svg>
          CONECTAR WALLET
        </button>
        <button
          className="btn mt-3"
          style={{ height: "auto", padding: 10, background: "transparent", color: "var(--muted)", fontSize: 14 }}
        >
          Tengo dudas — ¿como funciona? →
        </button>
      </div>

      {/* How it works */}
      <section className="animate-fade-in px-5 mt-6">
        <div className="eyebrow">
          <span>COMO FUNCIONA</span>
          <span className="tick" />
          <span>3 PASOS</span>
        </div>
        <div className="flex flex-col gap-3.5 mt-4 lg:flex-row">
          {/* Step 1 */}
          <div className="card flex items-center p-4 gap-3.5 flex-1 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div
              className="hex-stamp shrink-0"
              style={{ background: "var(--ember)" }}
            >
              01
            </div>
            <div>
              <div className="font-big-shoulders font-[800]" style={{ fontSize: 20 }}>TREPA EL CERRO</div>
              <div className="text-[13px] leading-[1.45]" style={{ color: "var(--muted)" }}>Inicia tu sesion en cualquier sendero de GDL: La Primavera, El Diente, La Reina.</div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="card flex items-center p-4 gap-3.5 flex-1 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div
              className="hex-stamp shrink-0"
              style={{ background: "var(--moss)" }}
            >
              02
            </div>
            <div>
              <div className="font-big-shoulders font-[800]" style={{ fontSize: 20 }}>RECOLECTA BASURA</div>
              <div className="text-[13px] leading-[1.45]" style={{ color: "var(--muted)" }}>Toma foto de cada pieza y registra el material. Multiplicadores hasta 2x.</div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="card flex items-center p-4 gap-3.5 flex-1 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div
              className="hex-stamp shrink-0"
              style={{ background: "var(--ink)" }}
            >
              03
            </div>
            <div>
              <div className="font-big-shoulders font-[800]" style={{ fontSize: 20 }}>REDIME LOCAL</div>
              <div className="text-[13px] leading-[1.45]" style={{ color: "var(--muted)" }}>Tus ${TOKEN_DISPLAY_NAME} valen chelas, cafe y entradas en negocios aliados de Jalisco.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust footer */}
      <section className="animate-fade-in px-5 mt-6 mb-5">
        <div className="card flex items-center p-4 gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div
            className="flex items-center justify-center w-[42px] h-[42px] rounded-xl"
            style={{ background: "var(--bg-2)", color: "var(--moss)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div className="leading-snug">
            <div className="font-bold text-[13px]">Verificado on-chain</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Cada trepada se firma en Monad. Tu impacto, on-chain.</div>
          </div>
        </div>
        <div className="text-center font-mono mt-6" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--muted)" }}>
          HECHO EN GDL · CON AMOR POR HUELLA VERDE
        </div>
      </section>
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
    <div className="flex flex-col px-5 lg:px-8">
      {/* Greeting — full width */}
      <section className="animate-fade-in mb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="eyebrow mb-1.5">{dateStr}</div>
            <h1 className="font-big-shoulders font-[900] text-[34px] lg:text-[40px] leading-none m-0">
              {greeting},<br />Trepador.
            </h1>
          </div>
        </div>

        {/* Weather + trail pill row */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="chip" style={{ background: "color-mix(in oklch, var(--moss) 18%, var(--bg-2))", color: "var(--moss)" }}>
            <span>&#9728;</span> 18°C · Soleado
          </div>
          <div className="chip">AQI 42 · Limpio</div>
          <div className="chip">Viento 6 km/h</div>
        </div>
      </section>

      {/* Big start card — full width, max-h on desktop */}
      <section className="animate-fade-in">
        <div className="card overflow-hidden p-0 mt-4 lg:max-h-[300px]">
          <div className="mtn-hero h-[170px]">
            <HeroIllustration className="w-full h-full" />
            <div className="absolute left-[18px] top-3.5 uppercase" style={{ color: "#fff", font: "500 10px var(--font-mono-var)", letterSpacing: "0.18em", opacity: 0.8 }}>
              HOY · LA PRIMAVERA
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-big-shoulders font-[900] text-2xl leading-[1.05]">
                  ¿Listo para trepar?
                </div>
                <div className="text-[13px] mt-1" style={{ color: "var(--muted)" }}>
                  El sendero te espera. Promedio 4.2km · 1h 12min
                </div>
              </div>
            </div>
            <Link href="/hike" className="btn btn-primary mt-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              START TREPADA
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row — 3-col grid */}
      <section className="animate-fade-in">
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="stat card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <span className="lbl">Balance</span>
            <span className="val font-mono">{animatedBalance.toLocaleString()}</span>
            <span className="sub">${TOKEN_DISPLAY_NAME}</span>
          </div>
          <div className="stat card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <span className="lbl">Recolectado</span>
            <span className="val font-mono">{statsLoading ? "..." : animatedKg.toFixed(1)}</span>
            <span className="sub">KG TOTAL</span>
          </div>
          <div className="stat card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <span className="lbl">Trepadas</span>
            <span className="val font-mono">{statsLoading ? "..." : animatedHikes.toLocaleString()}</span>
            <span className="sub">SESIONES</span>
          </div>
        </div>
      </section>

      {/* Level progression — full width */}
      <section className="animate-fade-in">
        <div className="card p-4 mt-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow mb-1">NIVEL 03 · TREPADOR NOVATO</div>
              <div className="font-big-shoulders font-[800]" style={{ fontSize: 18 }}>Proximo: Caminante</div>
            </div>
            <div className="font-big-shoulders font-[800]" style={{ fontSize: 18, color: "var(--ember)" }}>
              320<span style={{ opacity: 0.3 }}>/500</span>
            </div>
          </div>
          <div className="progressbar mt-3">
            <span style={{ width: "64%" }} />
          </div>
          <div className="font-mono mt-2" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--muted)" }}>
            180 XP MAS · LIMPIA 2 SENDEROS
          </div>
        </div>
      </section>

      {/* Quests + Nearby trails — 2-col on lg: */}
      <section className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4">
        {/* Quests column */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="h-section">Retos de hoy</h2>
            <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>VER TODOS →</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Quest 1 */}
            <div className="card quest-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="font-mono font-bold" style={{ fontSize: 10, color: "var(--ember)", letterSpacing: "0.05em" }}>+50 ${TOKEN_DISPLAY_NAME}</div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center shrink-0 w-[42px] h-[42px] rounded-[14px]"
                  style={{ background: "color-mix(in oklch, var(--ember) 18%, var(--paper))", color: "var(--ember)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">Treprano</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>Inicia una trepada antes de las 8:00 AM</div>
                </div>
              </div>
              <div className="progressbar"><span style={{ width: "0%" }} /></div>
            </div>

            {/* Quest 2 */}
            <div className="card quest-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="font-mono font-bold" style={{ fontSize: 10, color: "var(--moss)", letterSpacing: "0.05em" }}>+120 ${TOKEN_DISPLAY_NAME}</div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center shrink-0 w-[42px] h-[42px] rounded-[14px]"
                  style={{ background: "color-mix(in oklch, var(--moss) 18%, var(--paper))", color: "var(--moss)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18l-2 13H5z"/><path d="M9 10v6M15 10v6"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">Cazador de PET</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>Recolecta 10 botellas PET esta semana</div>
                </div>
                <div className="font-mono text-[11px]" style={{ color: "var(--muted)" }}>3/10</div>
              </div>
              <div className="progressbar"><span style={{ width: "30%" }} /></div>
            </div>

            {/* Quest 3 */}
            <div className="card quest-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="font-mono font-bold" style={{ fontSize: 10, color: "var(--ink)", letterSpacing: "0.05em" }}>+300 ${TOKEN_DISPLAY_NAME}</div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center shrink-0 w-[42px] h-[42px] rounded-[14px]"
                  style={{ background: "color-mix(in oklch, var(--ink) 18%, var(--paper))", color: "var(--ink)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">Conquista La Reina</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>Llega a la cumbre del Cerro de la Reina</div>
                </div>
                <div className="font-mono text-[11px]" style={{ color: "var(--muted)" }}>0/1</div>
              </div>
              <div className="progressbar"><span style={{ width: "0%" }} /></div>
            </div>
          </div>
        </div>

        {/* Nearby trails column */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="h-section">Senderos cerca</h2>
            <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>MAPA →</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { name: "Bosque La Primavera", info: "2.3 KM · 87 TREPADAS · 1.5x" },
              { name: "Cerro El Diente", info: "5.8 KM · 142 TREPADAS · 2x" },
              { name: "Cerro de la Reina", info: "3.1 KM · 64 TREPADAS · 1.8x" },
            ].map((trail) => (
              <Link key={trail.name} href="/hike">
                <div className="card tap flex items-center p-3.5 gap-3.5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div
                    className="flex items-center justify-center shrink-0 w-16 h-16 rounded-[14px]"
                    style={{ background: "var(--bg-2)", color: "var(--moss)" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{trail.name}</div>
                    <div className="font-mono text-[11px] tracking-[0.05em]" style={{ color: "var(--muted)" }}>{trail.info}</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)" }}><path d="M9 6l6 6-6 6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent trails from NFTs — full width */}
      {recentNfts.length > 0 && (
        <section className="animate-fade-in mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="h-section">Trepadas recientes</h2>
            <Link href="/gallery" className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>
              VER TODOS →
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentNfts.map((nft) => {
              const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
              const km = (Number(nft.rastro.distanceMeters) / 1000).toFixed(1);
              return (
                <Link key={nft.tokenId.toString()} href="/gallery">
                  <div className="card tap flex items-center p-3.5 gap-3.5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                    <div
                      className="flex items-center justify-center shrink-0 w-11 h-11 rounded-[14px]"
                      style={{ background: "color-mix(in oklch, var(--moss) 18%, var(--paper))", color: "var(--moss)" }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">Trepada #{nft.tokenId.toString()}</div>
                      <div className="font-mono text-[11px] tracking-[0.05em] uppercase" style={{ color: "var(--muted)" }}>
                        {km} KM · {kg} KG
                      </div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)" }}><path d="M9 6l6 6-6 6"/></svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Community impact — full width */}
      <section className="animate-fade-in mt-6">
        <div
          className="card p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, oklch(0.96 0.02 150), oklch(0.92 0.04 145))",
            border: "1px solid color-mix(in oklch, var(--moss) 25%, transparent)",
          }}
        >
          <div className="eyebrow">IMPACTO COMUNITARIO · ESTA SEMANA</div>
          <div className="font-big-shoulders font-[900] text-[34px] leading-none mt-3" style={{ color: "var(--moss)" }}>
            186 KG
          </div>
          <div className="text-[13px] mt-2" style={{ color: "var(--muted)" }}>
            Recolectados por 84 trepadores en 23 senderos
          </div>
        </div>
      </section>

      {/* Quick actions — 2-col grid */}
      <section className="animate-fade-in grid grid-cols-2 gap-3 mt-6 pb-4">
        <Link href="/rewards" className="card tap flex flex-col items-center p-5 gap-2 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: "var(--ember)" }}>storefront</span>
          <span className="font-big-shoulders font-bold text-xs tracking-[0.12em] uppercase">Rewards</span>
        </Link>
        <Link href="/wiki" className="card tap flex flex-col items-center p-5 gap-2 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: "var(--moss)" }}>menu_book</span>
          <span className="font-big-shoulders font-bold text-xs tracking-[0.12em] uppercase">Wiki</span>
        </Link>
      </section>
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
