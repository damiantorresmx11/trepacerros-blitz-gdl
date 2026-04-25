"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CERROS, type Cerro } from "@/data/cerros";

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  Baja: { bg: "bg-cd-moss", text: "text-white" },
  Media: { bg: "bg-cd-ember", text: "text-white" },
  Alta: { bg: "bg-red-600", text: "text-white" },
};

const TRAIL_GRADIENTS: Record<string, string> = {
  primavera:
    "bg-gradient-to-br from-cd-moss/80 via-cd-leaf/60 to-cd-ember/30",
  colli: "bg-gradient-to-br from-cd-ember/70 via-cd-moss/40 to-cd-sky/30",
  colomos: "bg-gradient-to-br from-cd-sky/70 via-cd-moss/50 to-cd-leaf/30",
  metropolitano:
    "bg-gradient-to-br from-cd-moss/60 via-cd-sky/40 to-cd-ember-soft/50",
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
      <div className="font-lexend flex flex-col gap-6 pb-28">
        {/* Title */}
        <section>
          <h1 className="font-big-shoulders uppercase text-[36px] font-black leading-[0.95] text-cd-ink tracking-wide">
            ELIGE TU
            <br />
            SENDERO
          </h1>
          <p className="text-[13px] text-cd-muted mt-2 max-w-[36ch] leading-relaxed">
            Elige un sendero que necesite atención hoy y comienza tu misión de
            limpieza.
          </p>
        </section>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-cd-muted text-[20px]">
            search
          </span>
          <input
            className="solid-card w-full pl-12 pr-4 py-4 !rounded-[16px] focus:ring-2 focus:ring-cd-ember focus:border-transparent outline-none transition-all font-lexend text-cd-ink text-sm placeholder:text-cd-muted/60"
            placeholder="Buscar sendero o región..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Trail Cards */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          {filtered.map((cerro) => {
            const isSelected = selectedSlug === cerro.slug;
            const diffStyle =
              DIFFICULTY_STYLES[cerro.dificultad] || DIFFICULTY_STYLES.Baja;
            const gradient =
              TRAIL_GRADIENTS[cerro.slug] || TRAIL_GRADIENTS.primavera;

            return (
              <button
                key={cerro.slug}
                type="button"
                onClick={() => handleSelect(cerro)}
                className={`solid-card overflow-hidden text-left haptic-active transition-all duration-200 ${
                  isSelected
                    ? "!border-cd-ember !border-2 shadow-premium"
                    : "hover:shadow-premium"
                }`}
              >
                {/* Image placeholder with gradient + icon */}
                <div
                  className={`relative h-40 w-full ${gradient} flex items-center justify-center`}
                >
                  <span
                    className="material-symbols-outlined text-white/30"
                    style={{
                      fontSize: "72px",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    landscape
                  </span>

                  {/* Difficulty badge */}
                  <div
                    className={`absolute top-3 right-3 ${diffStyle.bg} ${diffStyle.text} px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-big-shoulders`}
                  >
                    {cerro.dificultad}
                  </div>

                  {/* Selected check */}
                  {isSelected && (
                    <div className="absolute top-3 left-3 bg-cd-ember text-white p-1.5 rounded-full shadow-lg">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        check_circle
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-big-shoulders uppercase text-[20px] font-extrabold text-cd-ink leading-tight tracking-wide">
                      {cerro.nombre}
                    </h3>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1 text-cd-muted">
                      <span className="material-symbols-outlined text-[16px]">
                        distance
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {cerro.distanciaTipicaKm} km
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-cd-muted">
                      <span className="material-symbols-outlined text-[16px]">
                        elevation
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {cerro.coordsCentro.lat > 20.7
                          ? "1,580"
                          : cerro.slug === "colli"
                          ? "1,960"
                          : "1,700"}{" "}
                        msnm
                      </span>
                    </div>
                  </div>

                  {/* Coordinate chip */}
                  <div className="coordinate-chip self-start">
                    {cerro.coordsCentro.lat.toFixed(3)}°N,{" "}
                    {Math.abs(cerro.coordsCentro.lng).toFixed(3)}°W
                  </div>

                  <p className="text-[12px] text-cd-muted line-clamp-2 leading-relaxed">
                    {cerro.descripcion}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky CTA at bottom */}
      {selectedSlug && (
        <div className="fixed bottom-24 md:bottom-6 left-0 right-0 z-40 px-4 md:px-0 md:max-w-[480px] md:mx-auto">
          <button
            onClick={handleStart}
            className="w-full bg-cd-ember text-white py-4 rounded-card shadow-premium flex items-center justify-center gap-3 haptic-active transition-transform font-big-shoulders uppercase tracking-widest text-lg"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hiking
            </span>
            <span>Iniciar Trepada</span>
          </button>
        </div>
      )}
    </AppShell>
  );
}
