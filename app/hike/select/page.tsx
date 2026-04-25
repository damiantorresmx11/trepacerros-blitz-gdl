"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CERROS, type Cerro } from "@/data/cerros";

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Baja: { bg: "bg-tc-primary", text: "text-white" },
  Media: { bg: "bg-[#7b4100]", text: "text-white" },
  Alta: { bg: "bg-[#ba1a1a]", text: "text-white" },
};

const CERRO_IMAGES: Record<string, string> = {
  primavera: "https://picsum.photos/seed/trepacerros-hike-primavera/800/400",
  colli: "https://picsum.photos/seed/trepacerros-hike-colli/800/400",
  colomos: "https://picsum.photos/seed/trepacerros-hike-colomos/800/400",
  metropolitano: "https://picsum.photos/seed/trepacerros-hike-metro/800/400",
};

export default function HikeSelectPage() {
  const router = useRouter();
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

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6">
        <section>
          <h1 className="text-tc-headline-lg font-semibold text-tc-primary">Selecciona tu Ruta</h1>
          <p className="text-tc-body-md text-tc-on-surface-variant mt-1">
            Elige un sendero que necesite atencion hoy y comienza tu mision de limpieza.
          </p>
        </section>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tc-outline">search</span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-white border border-tc-outline-variant rounded-xl focus:ring-2 focus:ring-[#7b4100] focus:border-transparent outline-none transition-all font-lexend"
            placeholder="Buscar sendero o region..."
            type="text"
          />
        </div>

        {/* Route Cards */}
        <div className="flex flex-col gap-6">
          {CERROS.map((cerro) => {
            const isSelected = selectedSlug === cerro.slug;
            const diffStyle = DIFFICULTY_COLORS[cerro.dificultad] || DIFFICULTY_COLORS.Baja;

            return (
              <button
                key={cerro.slug}
                type="button"
                onClick={() => handleSelect(cerro)}
                className={`relative rounded-[2rem] overflow-hidden shadow-sm bg-white transition-all text-left ${
                  isSelected
                    ? "border-2 border-[#FF6B00] shadow-md"
                    : "border border-tc-surface-variant hover:shadow-md"
                }`}
              >
                <div className="h-48 w-full relative">
                  <img
                    className="w-full h-full object-cover"
                    src={CERRO_IMAGES[cerro.slug]}
                    alt={cerro.nombre}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className={`absolute top-4 right-4 ${diffStyle.bg} ${diffStyle.text} px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase`}>
                    {cerro.dificultad}
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 left-4 bg-[#FF6B00] text-white p-2 rounded-full shadow-lg">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-tc-headline-md font-semibold text-tc-on-surface">{cerro.nombre}</h3>
                    <div className="flex items-center gap-1 text-[#7b4100]">
                      <span className="material-symbols-outlined text-sm">distance</span>
                      <span className="text-xs font-bold">{cerro.distanciaTipicaKm} km</span>
                    </div>
                  </div>
                  <p className="text-sm text-tc-on-surface-variant line-clamp-2">{cerro.descripcion}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating CTA */}
        {selectedSlug && (
          <div className="sticky bottom-24 z-40">
            <button
              onClick={handleStart}
              className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <span className="font-bold uppercase tracking-widest">EMPEZAR LIMPIEZA</span>
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
