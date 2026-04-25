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
      <div style={{ padding: "0 18px" }}>
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
          className="h-display"
          style={{ fontSize: 36, fontWeight: 900, lineHeight: 0.95, margin: "12px 0 0" }}
        >
          Elige tu
          <br />
          Sendero
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "10px 0 16px", maxWidth: "36ch", lineHeight: 1.5 }}>
          Elige un sendero que necesite atencion hoy y comienza tu mision de limpieza.
        </p>

        {/* Search bar */}
        <div className="search">
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
      <div
        style={{
          padding: "20px 18px 0",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 14,
        }}
      >
        {filtered.map((cerro) => {
          const isSelected = selectedSlug === cerro.slug;
          const diffColor = DIFFICULTY_COLORS[cerro.dificultad] ?? DIFFICULTY_COLORS.Baja;

          return (
            <button
              key={cerro.slug}
              type="button"
              onClick={() => handleSelect(cerro)}
              className="card"
              style={{
                padding: 0,
                overflow: "hidden",
                textAlign: "left",
                cursor: "pointer",
                border: isSelected ? "2px solid var(--ember)" : "1px solid var(--line)",
                boxShadow: isSelected ? "0 8px 30px -10px var(--ember)" : undefined,
                transition: "border 0.2s, box-shadow 0.2s",
              }}
            >
              {/* Gradient mountain placeholder */}
              <div
                style={{
                  position: "relative",
                  height: 160,
                  background: "linear-gradient(135deg, color-mix(in oklch, var(--moss) 60%, var(--paper)), color-mix(in oklch, var(--ember) 20%, var(--paper)))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.2, color: "#fff" }}>
                  <path d="M3 20l5.5-9 4 6 3-4L21 20z" />
                </svg>

                {/* Difficulty badge */}
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: diffColor,
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: 99,
                    fontFamily: "var(--font-display)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {cerro.dificultad}
                </span>

                {/* Selected check */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "var(--ember)",
                      color: "#fff",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
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
              <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <h3
                  className="h-display"
                  style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.05 }}
                >
                  {cerro.nombre}
                </h3>

                {/* Stats row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)" }}>
                  <span style={{ fontFamily: "var(--font-mono-var)", fontSize: 12, fontWeight: 700 }}>
                    {cerro.distanciaTipicaKm} km
                  </span>
                  <span style={{ fontFamily: "var(--font-mono-var)", fontSize: 12, fontWeight: 700 }}>
                    {ELEVATION[cerro.slug] ?? "1,700"} msnm
                  </span>
                </div>

                {/* Coordinate chip */}
                <div className="chip" style={{ alignSelf: "flex-start", fontSize: 10 }}>
                  {cerro.coordsCentro.lat.toFixed(3)}&deg;N,{" "}
                  {Math.abs(cerro.coordsCentro.lng).toFixed(3)}&deg;W
                </div>

                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {cerro.descripcion}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* spacer for sticky CTA */}
      <div style={{ height: 100 }} />

      {/* Sticky CTA */}
      {selectedSlug && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: 0,
            right: 0,
            zIndex: 40,
            padding: "0 16px",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          <button
            onClick={handleStart}
            style={{
              width: "100%",
              background: "var(--ember)",
              color: "#fff",
              padding: "16px 0",
              borderRadius: 18,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
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
