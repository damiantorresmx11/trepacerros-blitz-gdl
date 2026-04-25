"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CERROS, type Cerro } from "@/data/cerros";

const DIFFICULTY_COLORS: Record<string, string> = {
  Baja: "var(--moss)",
  Media: "var(--ember)",
  Alta: "#dc2626",
};

const ELEVATION: Record<string, string> = {
  primavera: "1,580",
  colli: "1,960",
  colomos: "1,700",
  metropolitano: "1,700",
};

export default function HikeSelectPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const handleSelect = (cerro: Cerro) => {
    setSelectedSlug(cerro.slug);
  };

  const handleStart = () => {
    if (!selectedSlug) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("trepacerros_selected_trail", selectedSlug);
    }
    router.push("/hike");
  };

  const filtered = CERROS.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.descripcion.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell>
      {/* pad: eyebrow + title + subtitle */}
      <div className="px-[18px]">
        <div className="eyebrow">
          <span>
            {selectedSlug
              ? `${CERROS.find((c) => c.slug === selectedSlug)?.coordsCentro.lat.toFixed(3)}N, ${Math.abs(CERROS.find((c) => c.slug === selectedSlug)?.coordsCentro.lng ?? 0).toFixed(3)}W`
              : "20.667N, 103.567W"}
          </span>
          <span className="tick" />
          <span>GDL</span>
        </div>

        <h1
          className="h-display mt-3"
          style={{ fontSize: 36, fontWeight: 900, lineHeight: 0.95 }}
        >
          Elige tu
          <br />
          Sendero
        </h1>
        <p className="text-[13px] mt-2.5 mb-4 max-w-[36ch] leading-relaxed" style={{ color: "var(--muted)" }}>
          Elige un sendero que necesite atencion hoy y comienza tu mision de limpieza.
        </p>

        {/* Search bar */}
        <div className="search max-w-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)" }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            placeholder="Buscar sendero o region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Trail cards grid */}
      <div className="pt-5 px-[18px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cerro) => {
          const isSelected = selectedSlug === cerro.slug;
          const diffColor = DIFFICULTY_COLORS[cerro.dificultad] ?? DIFFICULTY_COLORS.Baja;

          return (
            <button
              key={cerro.slug}
              type="button"
              onClick={() => handleSelect(cerro)}
              className="card p-0 overflow-hidden text-left cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              style={{
                border: isSelected ? "2px solid var(--ember)" : "1px solid var(--line)",
                boxShadow: isSelected ? "0 8px 30px -10px var(--ember)" : undefined,
              }}
            >
              {/* Gradient mountain placeholder */}
              <div
                className="relative h-40 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, color-mix(in oklch, var(--moss) 60%, var(--paper)), color-mix(in oklch, var(--ember) 20%, var(--paper)))",
                }}
              >
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-20 text-white">
                  <path d="M3 20l5.5-9 4 6 3-4L21 20z" />
                </svg>

                {/* Difficulty badge */}
                <span
                  className="absolute top-3 right-3 py-1 px-2.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                  style={{
                    background: diffColor,
                    color: "#fff",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {cerro.dificultad}
                </span>

                {/* Selected check */}
                {isSelected && (
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-full grid place-items-center"
                    style={{
                      background: "var(--ember)",
                      color: "#fff",
                      boxShadow: "0 4px 12px -4px var(--ember)",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="px-[18px] pt-[18px] pb-5 flex flex-col gap-2.5">
                <h3
                  className="h-display"
                  style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.05 }}
                >
                  {cerro.nombre}
                </h3>

                {/* Stats row */}
                <div className="flex items-center gap-3.5" style={{ color: "var(--muted)" }}>
                  <span className="text-xs font-bold" style={{ fontFamily: "var(--font-mono-var)" }}>
                    {cerro.distanciaTipicaKm} km
                  </span>
                  <span className="text-xs font-bold" style={{ fontFamily: "var(--font-mono-var)" }}>
                    {ELEVATION[cerro.slug] ?? "1,700"} msnm
                  </span>
                </div>

                {/* Coordinate chip */}
                <div className="chip self-start text-[10px]">
                  {cerro.coordsCentro.lat.toFixed(3)}&deg;N,{" "}
                  {Math.abs(cerro.coordsCentro.lng).toFixed(3)}&deg;W
                </div>

                <p
                  className="text-xs leading-relaxed overflow-hidden"
                  style={{
                    color: "var(--muted)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {cerro.descripcion}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* spacer for sticky CTA */}
      <div className="h-[100px]" />

      {/* Sticky CTA */}
      {selectedSlug && (
        <div
          className="fixed bottom-[90px] left-0 right-0 z-40 px-4 mx-auto max-w-[480px] md:max-w-md"
        >
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-[18px] border-none cursor-pointer uppercase tracking-[0.12em] flex items-center justify-center gap-2.5 transition-transform duration-200 hover:scale-[1.03]"
            style={{
              background: "var(--ember)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 16,
              boxShadow: "0 12px 30px -10px var(--ember)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Iniciar Trepada
          </button>
        </div>
      )}
    </AppShell>
  );
}
