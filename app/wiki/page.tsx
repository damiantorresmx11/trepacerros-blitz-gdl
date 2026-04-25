"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TRASH_TYPES, type TrashTypeInfo } from "@/data/trashTypes";

const CATEGORY_ICONS: Record<string, string> = {
  plastico: "water_bottle",
  vidrio: "inventory_2",
  metal: "inventory_2",
  organico: "eco",
  mixto: "layers",
  peligroso: "warning",
};

function TrashDetailModal({ item, onClose }: { item: TrashTypeInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-[480px] md:max-w-lg bg-[#fcf9f8] text-tc-on-surface rounded-t-3xl md:rounded-3xl shadow-xl p-6 font-lexend max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{item.icono}</span>
            <h3 className="text-tc-headline-md font-semibold">{item.nombre}</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-tc-on-surface" aria-label="Cerrar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {item.reciclable && (
            <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Reciclable
            </span>
          )}
          {item.multiplicador > 1 && (
            <span className="bg-tc-primary-fixed text-tc-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {item.multiplicador}x reward
            </span>
          )}
        </div>

        <p className="text-sm text-tc-on-surface-variant mb-4">{item.impacto}</p>

        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <h4 className="font-bold text-xs uppercase text-stone-500 mb-1">Degradacion</h4>
            <p className="text-sm">{item.tiempoDegradacion}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <h4 className="font-bold text-xs uppercase text-stone-500 mb-1">Como separar</h4>
            <p className="text-sm">{item.como_separar}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <h4 className="font-bold text-xs uppercase text-stone-500 mb-1">Disposicion en GDL</h4>
            <p className="text-sm">{item.disposicionGDL}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-100">
            <h4 className="font-bold text-xs uppercase text-stone-500 mb-1">Ruta correcta</h4>
            <p className="text-sm">{item.ruta_correcta}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-tc-primary-container text-white font-bold py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TrashTypeInfo | null>(null);

  const filtered = search
    ? TRASH_TYPES.filter(
        (t) =>
          t.nombre.toLowerCase().includes(search.toLowerCase()) ||
          t.categoria.toLowerCase().includes(search.toLowerCase())
      )
    : TRASH_TYPES;

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6 md:max-w-5xl">
        {/* Header */}
        <section>
          <h1 className="text-tc-headline-lg font-semibold text-tc-primary mb-2">Wiki de Residuos</h1>
          <p className="text-tc-body-lg text-tc-on-primary-container bg-tc-primary-container p-4 rounded-xl">
            Conoce tus materiales y aprende a darles una segunda vida.
          </p>
        </section>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-tc-outline">search</span>
          <input
            className="w-full pl-12 pr-4 py-4 bg-white border border-tc-outline-variant rounded-xl focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all shadow-sm font-lexend text-tc-on-surface"
            placeholder="Busca un material (ej. PET, vidrio)..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Materials Grid */}
        <section>
          <h3 className="text-tc-headline-md font-semibold text-tc-primary mb-4">Categorias de Impacto</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`bg-white rounded-3xl p-4 shadow-sm border border-stone-100 flex flex-col gap-3 text-left hover:shadow-md transition-shadow ${
                  idx === 0 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-tc-primary-fixed rounded-2xl flex items-center justify-center text-tc-primary">
                    <span className="material-symbols-outlined">
                      {CATEGORY_ICONS[item.categoria] || "recycling"}
                    </span>
                  </div>
                  {item.reciclable && (
                    <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.multiplicador > 1 ? `${item.multiplicador}x` : "Reciclable"}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-tc-primary mb-1">{item.icono} {item.nombre}</h4>
                  <p className="text-xs text-tc-on-surface-variant line-clamp-2">{item.impacto}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recycling Guide */}
        <section>
          <h3 className="text-tc-headline-md font-semibold text-tc-primary mb-4">Guia de Reciclaje</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border-l-4 border-tc-primary shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-tc-primary text-white flex items-center justify-center font-bold">1</div>
              <div>
                <h5 className="font-bold text-tc-primary">Limpia</h5>
                <p className="text-sm text-tc-on-surface-variant">Asegurate de que los envases no tengan restos organicos.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border-l-4 border-tc-primary shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-tc-primary text-white flex items-center justify-center font-bold">2</div>
              <div>
                <h5 className="font-bold text-tc-primary">Separa</h5>
                <p className="text-sm text-tc-on-surface-variant">Organiza por tipo de material en tu estacion de casa.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#FF6B00] p-4 rounded-2xl border-l-4 border-white shadow-md">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-[#FF6B00] flex items-center justify-center font-bold">3</div>
              <div className="text-white">
                <h5 className="font-bold">Trepa y valida</h5>
                <p className="text-sm opacity-90">Llevalo a un punto de recoleccion en el cerro y gana tokens.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {selected && <TrashDetailModal item={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}
