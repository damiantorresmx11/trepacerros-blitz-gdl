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

const CATEGORIES = [
  { key: "all", label: "Todos" },
  { key: "plastico", label: "Plásticos" },
  { key: "vidrio", label: "Vidrio" },
  { key: "metal", label: "Metal" },
  { key: "organico", label: "Orgánico" },
  { key: "mixto", label: "Mixto" },
  { key: "peligroso", label: "Peligroso" },
];

function TrashDetailModal({
  item,
  onClose,
}: {
  item: TrashTypeInfo;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="solid-card w-full max-w-[480px] md:max-w-lg rounded-t-card md:rounded-card shadow-premium p-6 font-lexend max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{item.icono}</span>
            <h3 className="font-big-shoulders uppercase text-xl text-cd-ink tracking-wide">
              {item.nombre}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-cd-muted hover:text-cd-ink transition-colors"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.reciclable && (
            <span className="bg-cd-moss/10 text-cd-moss text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Reciclable
            </span>
          )}
          <span className="bg-cd-ember/10 text-cd-ember text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            {item.multiplicador > 1
              ? `×${item.multiplicador} reward`
              : `×${item.multiplicador}`}
          </span>
        </div>

        <p className="text-sm text-cd-muted mb-5 leading-relaxed">
          {item.impacto}
        </p>

        {/* Info sections */}
        <div className="space-y-3">
          {[
            { title: "Degradación", content: item.tiempoDegradacion },
            { title: "Cómo separar", content: item.como_separar },
            { title: "Disposición en GDL", content: item.disposicionGDL },
            { title: "Ruta correcta", content: item.ruta_correcta },
          ].map((section) => (
            <div
              key={section.title}
              className="bg-cd-bg rounded-[16px] p-4 border border-cd-line"
            >
              <h4 className="font-big-shoulders uppercase text-xs text-cd-muted tracking-widest mb-1">
                {section.title}
              </h4>
              <p className="text-sm text-cd-ink font-lexend leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-cd-ember text-white font-big-shoulders uppercase tracking-widest py-4 rounded-card haptic-active transition-transform text-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState<TrashTypeInfo | null>(null);

  const filtered = TRASH_TYPES.filter((t) => {
    const matchesSearch =
      !search ||
      t.nombre.toLowerCase().includes(search.toLowerCase()) ||
      t.categoria.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || t.categoria === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell>
      <div className="font-lexend flex flex-col gap-6 pb-8">
        {/* Title */}
        <section>
          <h1 className="font-big-shoulders uppercase text-[36px] font-black leading-[0.95] text-cd-ink tracking-wide">
            ECO-WIKI
          </h1>
          <p className="text-[13px] text-cd-muted mt-2 max-w-[36ch] leading-relaxed">
            Aprende qué reciclar, cómo separarlo, y cuánto multiplica tus
            $CERRO.
          </p>
        </section>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-cd-muted text-[20px]">
            search
          </span>
          <input
            className="solid-card w-full pl-12 pr-4 py-4 !rounded-[16px] focus:ring-2 focus:ring-cd-ember focus:border-transparent outline-none transition-all font-lexend text-cd-ink text-sm placeholder:text-cd-muted/60"
            placeholder="Busca un material (ej. PET, vidrio, papel)"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category chips (horizontal scroll) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all haptic-active ${
                activeCategory === cat.key
                  ? "bg-cd-ink text-cd-bg"
                  : "bg-transparent border border-cd-line text-cd-muted hover:border-cd-ink hover:text-cd-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <section>
          <h2 className="font-big-shoulders uppercase text-lg text-cd-ink tracking-wide mb-3">
            Categorías de Impacto
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px]">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="solid-card p-4 flex flex-col gap-3 text-left haptic-active hover:shadow-premium transition-all duration-150"
              >
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-cd-moss/10 rounded-[14px] flex items-center justify-center text-cd-moss">
                    <span className="material-symbols-outlined text-[22px]">
                      {CATEGORY_ICONS[item.categoria] || "recycling"}
                    </span>
                  </div>
                  <span className="font-mono text-cd-ember font-bold text-sm">
                    ×{item.multiplicador}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-cd-ink mb-1 leading-tight">
                    {item.nombre}
                  </h4>
                  <p className="text-[11px] text-cd-muted line-clamp-2 leading-[1.4]">
                    {item.impacto}
                  </p>
                </div>
                {item.reciclable && (
                  <span className="self-start bg-cd-moss/10 text-cd-moss text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Reciclable
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Recycling Guide */}
        <section>
          <h2 className="font-big-shoulders uppercase text-lg text-cd-ink tracking-wide mb-3">
            Guía de Reciclaje
          </h2>
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Limpia",
                desc: "Asegúrate de que los envases no tengan restos orgánicos.",
                accent: false,
              },
              {
                step: 2,
                title: "Separa",
                desc: "Organiza por tipo de material en tu estación de casa.",
                accent: false,
              },
              {
                step: 3,
                title: "Trepa y valida",
                desc: "Llévalo a un punto de recolección en el cerro y gana tokens.",
                accent: true,
              },
            ].map(({ step, title, desc, accent }) => (
              <div
                key={step}
                className={`solid-card flex items-center gap-4 p-4 ${
                  accent
                    ? "!bg-cd-ember !border-cd-ember"
                    : "border-l-4 !border-l-cd-moss"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-big-shoulders text-lg font-bold ${
                    accent
                      ? "bg-white text-cd-ember"
                      : "bg-cd-moss text-white"
                  }`}
                >
                  {step}
                </div>
                <div>
                  <h5
                    className={`font-bold text-sm ${
                      accent ? "text-white" : "text-cd-ink"
                    }`}
                  >
                    {title}
                  </h5>
                  <p
                    className={`text-[13px] leading-relaxed ${
                      accent ? "text-white/90" : "text-cd-muted"
                    }`}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Did you know */}
        <section>
          <div className="solid-card p-5 !border-cd-moss/30 !bg-[color-mix(in_oklch,#2d5a3e_6%,#fdfcf7)]">
            <span className="font-big-shoulders uppercase text-[11px] tracking-[0.15em] text-cd-moss font-bold">
              ¿Sabías que?
            </span>
            <p className="font-big-shoulders text-[22px] font-extrabold leading-[1.15] text-cd-ink mt-2">
              Una sola persona en Jalisco genera{" "}
              <span className="text-cd-moss">1.2 kg de basura al día</span>.
            </p>
            <p className="text-[12px] text-cd-muted leading-relaxed mt-2">
              La Primavera recibe ~12 toneladas de basura visitante por mes. Tu
              trepada cuenta.
            </p>
          </div>
        </section>
      </div>

      {selected && (
        <TrashDetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </AppShell>
  );
}
