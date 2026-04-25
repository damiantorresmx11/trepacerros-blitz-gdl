"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
import { HeroIllustration } from "@/components/HeroIllustration";
import { usePrimaBalance, useHikerStats, useUserNFTs } from "@/hooks/useRastros";
import { TOKEN_DISPLAY_NAME } from "@/lib/tokens";
import { ConnectButton } from "@/components/ConnectButton";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

function LandingHero() {
  const { login } = usePrivy();

  return (
    <div className="min-h-screen dawn-gradient topo-bg flex flex-col font-body">
      {/* Top bar */}
      <div className="px-5 pt-3 pb-2 flex items-center gap-2">
        <span className="text-cd-moss">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
        </span>
        <span className="font-big-shoulders text-sm font-bold uppercase tracking-widest text-cd-ink">TREPACERROS</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-5 md:px-8 max-w-[600px] md:max-w-[800px] mx-auto w-full">
        {/* Eyebrow */}
        <div className="mt-20 md:mt-28 flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-cd-muted">
          <span>EST. GDL · 2026</span>
          <span className="w-1 h-1 rounded-full bg-cd-muted inline-block" />
          <span>v1.0</span>
        </div>

        {/* Display headline */}
        <h1 className="font-big-shoulders font-black text-[72px] md:text-[96px] leading-[0.92] tracking-tight text-cd-ink mt-4">
          TREPA<br />EL CERRO,<br />
          <span className="text-cd-ember">GANA</span><br />
          ${TOKEN_DISPLAY_NAME}.
        </h1>
        <p className="text-[15px] text-cd-muted leading-relaxed mt-3.5 max-w-[32ch]">
          Sal, recolecta basura en los senderos de Guadalajara, y monetiza tu trepada en la red Monad.
        </p>

        {/* Mountain hero card */}
        <div className="mt-8 relative rounded-card overflow-hidden h-[260px] md:h-[320px] bg-cd-ink">
          <HeroIllustration className="w-full h-full" />
          {/* Coordinate chips */}
          <div className="coordinate-chip absolute top-4 left-4 font-mono text-[11px] font-medium tracking-wide text-white/85 leading-tight">
            20.6736°N<br />103.3500°W
          </div>
          <div className="coordinate-chip absolute top-4 right-5 font-mono text-[11px] font-medium tracking-wide text-white/85 text-right leading-tight">
            BOSQUE LA PRIMAVERA<br />· EL DIENTE
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="solid-card p-3 text-center">
            <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-cd-muted">Tokens minteados</div>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="font-big-shoulders text-[22px] font-black text-cd-ink">142,031</span>
              <span className="font-mono text-[10px] text-cd-muted">{TOKEN_DISPLAY_NAME}</span>
            </div>
          </div>
          <div className="solid-card p-3 text-center">
            <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-cd-muted">Basura recogida</div>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="font-big-shoulders text-[22px] font-black text-cd-ink">2,847</span>
              <span className="font-mono text-[10px] text-cd-muted">KG</span>
            </div>
          </div>
          <div className="solid-card p-3 text-center">
            <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-cd-muted">Trepadores</div>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="font-big-shoulders text-[22px] font-black text-cd-ink">684</span>
              <span className="font-mono text-[10px] text-cd-muted">HIKERS</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button
            onClick={login}
            className="w-full bg-cd-ember text-white py-4 rounded-xl font-big-shoulders text-base font-bold uppercase tracking-widest flex items-center justify-center gap-3 haptic-active shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h13a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M16 12h3"/><path d="M3 7l3-3h10v3"/></svg>
            CONECTAR WALLET
          </button>
        </div>

        {/* How it works */}
        <div className="mt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-cd-muted">
            <span>COMO FUNCIONA</span>
            <span className="w-1 h-1 rounded-full bg-cd-muted inline-block" />
            <span>3 PASOS</span>
          </div>
          <div className="flex flex-col gap-3 mt-5">
            {/* Step 1 */}
            <div className="solid-card p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cd-ember text-white flex items-center justify-center font-big-shoulders font-black text-sm shrink-0">
                01
              </div>
              <div>
                <div className="font-big-shoulders text-lg font-extrabold uppercase text-cd-ink">TREPA EL CERRO</div>
                <div className="text-[13px] text-cd-muted leading-snug mt-0.5">Inicia tu sesion en cualquier sendero de GDL: La Primavera, El Diente, La Reina.</div>
              </div>
            </div>
            {/* Step 2 */}
            <div className="solid-card p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cd-moss text-white flex items-center justify-center font-big-shoulders font-black text-sm shrink-0">
                02
              </div>
              <div>
                <div className="font-big-shoulders text-lg font-extrabold uppercase text-cd-ink">RECOLECTA BASURA</div>
                <div className="text-[13px] text-cd-muted leading-snug mt-0.5">Toma foto de cada pieza y registra el material. Multiplicadores hasta 2x.</div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="solid-card p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cd-ink text-white flex items-center justify-center font-big-shoulders font-black text-sm shrink-0">
                03
              </div>
              <div>
                <div className="font-big-shoulders text-lg font-extrabold uppercase text-cd-ink">REDIME LOCAL</div>
                <div className="text-[13px] text-cd-muted leading-snug mt-0.5">Tus ${TOKEN_DISPLAY_NAME} valen chelas, cafe y entradas en negocios aliados de Jalisco.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust footer */}
        <div className="mt-10 mb-16">
          <div className="solid-card p-4 flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-xl bg-cd-bg flex items-center justify-center text-cd-moss shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="leading-snug">
              <div className="font-semibold text-[13px] text-cd-ink">Verificado on-chain</div>
              <div className="text-[12px] text-cd-muted">Cada trepada se firma en Monad. Tu impacto, on-chain.</div>
            </div>
          </div>
          <div className="text-center font-mono text-[10px] tracking-[0.16em] text-cd-muted mt-6">
            HECHO EN GDL · CON AMOR POR HUELLA VERDE
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedDashboard() {
  const { address } = useAccount();
  const { formatted } = usePrimaBalance(address);
  const { totalKg, hikes, isLoading: statsLoading } = useHikerStats(address);
  const { nfts } = useUserNFTs(address);

  const kgFormatted = (Number(totalKg) / 1000).toFixed(1);
  const recentNfts = nfts.slice(0, 3);
  const greeting = getGreeting();

  const now = new Date();
  const dayNames = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const dateStr = `${dayNames[now.getDay()]} · ${now.getDate()} ${monthNames[now.getMonth()]} · ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-5 font-body md:max-w-[800px] md:mx-auto">
      {/* Greeting */}
      <div>
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-cd-muted mb-1.5">
          {dateStr}
        </div>
        <h1 className="font-big-shoulders text-[32px] md:text-[40px] font-black leading-none text-cd-ink">
          {greeting},<br />Trepador.
        </h1>
      </div>

      {/* Start trepada card */}
      <div className="solid-card overflow-hidden">
        <div className="relative h-[170px] md:h-[200px] bg-cd-ink overflow-hidden">
          <HeroIllustration className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="coordinate-chip absolute top-3 left-4 font-mono text-[10px] tracking-[0.18em] uppercase text-white/80">
            HOY · LA PRIMAVERA
          </div>
        </div>
        <div className="p-4">
          <div className="font-big-shoulders text-[24px] font-black leading-tight text-cd-ink">
            Listo para trepar?
          </div>
          <div className="text-[13px] text-cd-muted mt-1">
            El sendero te espera. Promedio 4.2km · 1h 12min
          </div>
          <Link
            href="/hike"
            className="mt-4 w-full bg-cd-ember text-white py-3.5 rounded-xl font-big-shoulders text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 haptic-active shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            START TREPADA
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="solid-card p-3 flex flex-col items-center">
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-cd-muted">Balance</span>
          <span className="font-mono text-2xl md:text-3xl font-black text-cd-ink mt-1">
            {Math.floor(Number(formatted))}
          </span>
          <span className="font-mono text-[10px] text-cd-ember font-bold mt-0.5">{TOKEN_DISPLAY_NAME}</span>
        </div>
        <div className="solid-card p-3 flex flex-col items-center">
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-cd-muted">Recolectado</span>
          <span className="font-mono text-2xl md:text-3xl font-black text-cd-ink mt-1">
            {statsLoading ? "..." : kgFormatted}
          </span>
          <span className="font-mono text-[10px] text-cd-muted mt-0.5">KG TOTAL</span>
        </div>
        <div className="solid-card p-3 flex flex-col items-center">
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-cd-muted">Trepadas</span>
          <span className="font-mono text-2xl md:text-3xl font-black text-cd-ink mt-1">
            {statsLoading ? "..." : hikes.toString()}
          </span>
          <span className="font-mono text-[10px] text-cd-muted mt-0.5">SESIONES</span>
        </div>
      </div>

      {/* Daily challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-big-shoulders text-lg font-bold uppercase tracking-wide text-cd-ink">Retos de hoy</h2>
          <span className="font-mono text-[11px] tracking-[0.1em] text-cd-muted uppercase">Ver todos</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {/* Quest 1 */}
          <div className="solid-card p-4">
            <div className="font-mono text-[10px] font-bold text-cd-ember tracking-wide mb-2">+50 {TOKEN_DISPLAY_NAME}</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cd-ember/15 text-cd-ember flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-cd-ink">Treprano</div>
                <div className="text-[12px] text-cd-muted">Inicia una trepada antes de las 8:00 AM</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-cd-line overflow-hidden">
              <div className="h-full rounded-full bg-cd-ember" style={{ width: "0%" }} />
            </div>
          </div>
          {/* Quest 2 */}
          <div className="solid-card p-4">
            <div className="font-mono text-[10px] font-bold text-cd-moss tracking-wide mb-2">+120 {TOKEN_DISPLAY_NAME}</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cd-moss/15 text-cd-moss flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18l-2 13H5z"/><path d="M9 10v6M15 10v6"/></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-cd-ink">Cazador de PET</div>
                <div className="text-[12px] text-cd-muted">Recolecta 10 botellas PET esta semana</div>
              </div>
              <span className="font-mono text-[11px] text-cd-muted">3/10</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-cd-line overflow-hidden">
              <div className="h-full rounded-full bg-cd-moss" style={{ width: "30%" }} />
            </div>
          </div>
          {/* Quest 3 */}
          <div className="solid-card p-4">
            <div className="font-mono text-[10px] font-bold text-cd-ink tracking-wide mb-2">+300 {TOKEN_DISPLAY_NAME}</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cd-ink/10 text-cd-ink flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 20l5.5-9 4 6 3-4L21 20z"/></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-cd-ink">Conquista La Reina</div>
                <div className="text-[12px] text-cd-muted">Llega a la cumbre del Cerro de la Reina</div>
              </div>
              <span className="font-mono text-[11px] text-cd-muted">0/1</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-cd-line overflow-hidden">
              <div className="h-full rounded-full bg-cd-ink" style={{ width: "0%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent trails */}
      {recentNfts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-big-shoulders text-lg font-bold uppercase tracking-wide text-cd-ink">Senderos recientes</h2>
            <Link href="/gallery" className="font-mono text-[11px] tracking-[0.1em] text-cd-muted uppercase hover:text-cd-ember transition-colors">
              VER TODOS
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentNfts.map((nft) => {
              const kg = (Number(nft.rastro.trashGrams) / 1000).toFixed(1);
              const km = (Number(nft.rastro.distanceMeters) / 1000).toFixed(1);
              return (
                <Link key={nft.tokenId.toString()} href="/gallery">
                  <div className="solid-card p-3.5 flex items-center gap-3.5 hover:shadow-md hover:scale-[1.01] transition-all duration-150">
                    <div className="w-11 h-11 rounded-xl bg-cd-moss/15 text-cd-moss flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">hiking</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-cd-ink">
                        Trepada #{nft.tokenId.toString()}
                      </p>
                      <p className="font-mono text-[11px] tracking-wide text-cd-muted uppercase">
                        {km} KM · {kg} KG
                      </p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cd-muted shrink-0"><path d="M9 6l6 6-6 6"/></svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <Link
          href="/rewards"
          className="solid-card p-5 flex flex-col items-center gap-2 hover:shadow-md hover:scale-[1.01] transition-all duration-150"
        >
          <span className="material-symbols-outlined text-cd-ember text-2xl">storefront</span>
          <span className="font-big-shoulders text-xs font-bold uppercase tracking-widest text-cd-ink">Rewards</span>
        </Link>
        <Link
          href="/wiki"
          className="solid-card p-5 flex flex-col items-center gap-2 hover:shadow-md hover:scale-[1.01] transition-all duration-150"
        >
          <span className="material-symbols-outlined text-cd-moss text-2xl">menu_book</span>
          <span className="font-big-shoulders text-xs font-bold uppercase tracking-widest text-cd-ink">Wiki</span>
        </Link>
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
