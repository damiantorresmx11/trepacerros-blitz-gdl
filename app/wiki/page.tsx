"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TRASH_TYPES, type TrashTypeInfo } from "@/data/trashTypes";

/* ── category filter chips ── */
const CATEGORIES = [
  { key: "all", label: "Todos" },
  { key: "plastico", label: "Plasticos" },
  { key: "vidrio", label: "Vidrio" },
  { key: "metal", label: "Metal" },
  { key: "organico", label: "Organico" },
  { key: "mixto", label: "Papel" },
  { key: "peligroso", label: "Electronica" },
];

/* ── SVG icons per wiki-card (matching HTML design) ── */
function WikiCardIcon({ categoria }: { categoria: string }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
  };
  switch (categoria) {
    case "metal":
      return (
        <svg {...props}>
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <path d="M9 7h6" />
        </svg>
      );
    case "vidrio":
      return (
        <svg {...props}>
          <path d="M5 8l4-5h6l4 5v13H5z" />
        </svg>
      );
    case "mixto":
      return (
        <svg {...props}>
          <path d="M4 4h12l4 4v12H4z" />
          <path d="M16 4v4h4" />
        </svg>
      );
    case "peligroso":
      return (
        <svg {...props}>
          <path d="M8 3h8v6H8z" />
          <rect x="6" y="9" width="12" height="12" rx="2" />
        </svg>
      );
    case "organico":
      return (
        <svg {...props}>
          <path d="M12 4c4 5 4 9 0 16-4-7-4-11 0-16z" />
        </svg>
      );
    default:
      // plastico / fallback
      return (
        <svg {...props}>
          <path d="M3 8h18l-2 13H5z" />
        </svg>
      );
  }
}

/* ── detail modal ── */
function TrashDetailModal({
  item,
  onClose,
}: {
  item: TrashTypeInfo;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="card w-full max-w-[480px] md:max-w-lg max-h-[85vh] overflow-y-auto p-6 rounded-t-[20px] md:rounded-[20px]"
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[30px]">{item.icono}</span>
            <h3
              className="h-section text-xl leading-tight"
            >
              {item.nombre}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer bg-transparent border-none text-[22px]"
            style={{ color: "var(--muted)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.reciclable && (
            <span
              className="chip"
              style={{
                background: "color-mix(in oklch, var(--moss) 14%, var(--paper))",
                color: "var(--moss)",
                borderColor: "color-mix(in oklch, var(--moss) 25%, transparent)",
              }}
            >
              Reciclable
            </span>
          )}
          <span className="mult-badge">
            {item.multiplicador > 1
              ? `\u00d7${item.multiplicador} reward`
              : `\u00d7${item.multiplicador}`}
          </span>
        </div>

        <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--muted)" }}>
          {item.impacto}
        </p>

        {/* Info sections */}
        <div className="flex flex-col gap-2.5">
          {[
            { title: "Degradacion", content: item.tiempoDegradacion },
            { title: "Como separar", content: item.como_separar },
            { title: "Disposicion en GDL", content: item.disposicionGDL },
            { title: "Ruta correcta", content: item.ruta_correcta },
          ].map((section) => (
            <div
              key={section.title}
              className="card p-3.5"
            >
              <div className="eyebrow mb-1">
                <span>{section.title.toUpperCase()}</span>
              </div>
              <p className="text-[13px] leading-normal" style={{ color: "var(--ink)" }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-4 rounded-[18px] border-none cursor-pointer uppercase tracking-[0.12em]"
          style={{
            background: "var(--ember)",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* ── featured "Material del dia" ── */
const FEATURED = TRASH_TYPES.find((t) => t.id === "pet")!;

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
      {/* pad: title + subtitle + search */}
      <div className="px-[18px]">
        <div className="eyebrow">
          <span>MATERIALES</span>
          <span className="tick" />
          <span>RECICLAJE</span>
          <span className="tick" />
          <span>IMPACTO</span>
        </div>

        <h1
          className="h-display mt-3"
          style={{ fontSize: 36, fontWeight: 900, lineHeight: 0.95 }}
        >
          Wiki de
          <br />
          Materiales
        </h1>
        <p className="text-[13px] mt-2.5 mb-4 max-w-[36ch] leading-relaxed" style={{ color: "var(--muted)" }}>
          Aprende que reciclar, como separarlo, y cuanto multiplica tus $CERRO.
        </p>

        {/* Search bar */}
        <div className="search max-w-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)" }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            placeholder="Busca un material (ej. PET, vidrio, papel)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Horizontal scroll filter chips */}
      <div className="hscroll mt-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="chip shrink-0 cursor-pointer"
            style={
              activeCategory === cat.key
                ? {
                    background: "var(--ink)",
                    color: "var(--bg)",
                    borderColor: "transparent",
                  }
                : undefined
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured: Material del dia */}
      <div className="pt-5 px-[18px]">
        <div className="card p-0 overflow-hidden lg:flex lg:flex-row lg:max-h-[280px]">
          <div
            className="h-40 flex items-center justify-center lg:w-1/2 lg:h-auto lg:min-h-[240px] shrink-0"
            style={{
              background: "repeating-linear-gradient(135deg, color-mix(in oklch, var(--moss) 18%, var(--paper)) 0 12px, color-mix(in oklch, var(--moss) 10%, var(--paper)) 12px 24px)",
              fontFamily: "var(--font-mono-var)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "var(--moss)",
            }}
          >
            FOTO &middot; BOTELLAS PET RECOLECTADAS
          </div>
          <div className="p-[18px] lg:flex lg:flex-col lg:justify-center">
            <div className="flex justify-between items-center">
              <span className="eyebrow"><span>MATERIAL DEL DIA</span></span>
              <span className="mult-badge">&times;{FEATURED.multiplicador}</span>
            </div>
            <h3
              className="h-display mt-2"
              style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}
            >
              {FEATURED.nombre}
            </h3>
            <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--muted)" }}>
              Una botella PET reciclada ahorra energia equivalente a mantener un foco encendido por 6 horas.
              Aplastala antes de echarla a la bolsa.
            </p>
            <div className="flex gap-2 mt-3">
              <span
                className="chip"
                style={{
                  background: "color-mix(in oklch, var(--moss) 14%, var(--paper))",
                  color: "var(--moss)",
                  borderColor: "color-mix(in oklch, var(--moss) 25%, transparent)",
                }}
              >
                100% reciclable
              </span>
              <span className="chip">Resina #1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categorias grid */}
      <div className="pt-6 px-[18px] pb-3">
        <h2 className="h-section">Categorias de Impacto</h2>
      </div>
      <div className="px-[18px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="card p-3.5 flex flex-col gap-2.5 text-left cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
              style={{
                border: "1px solid var(--line)",
              }}
            >
              <div className="flex justify-between items-center">
                <div className="wiki-icon">
                  <WikiCardIcon categoria={item.categoria} />
                </div>
                <span className="mult-badge">&times;{item.multiplicador}</span>
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: "var(--ink)" }}>{item.nombre}</div>
                <div
                  className="text-[11px] leading-snug mt-1 overflow-hidden"
                  style={{
                    color: "var(--muted)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.impacto}
                </div>
              </div>
              {item.reciclable && (
                <span
                  className="chip self-start text-[10px]"
                  style={{
                    background: "color-mix(in oklch, var(--moss) 14%, var(--paper))",
                    color: "var(--moss)",
                    borderColor: "color-mix(in oklch, var(--moss) 25%, transparent)",
                  }}
                >
                  Reciclable
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Did you know */}
      <div className="p-[18px] pt-6">
        <div
          className="card p-[18px]"
          style={{
            border: "1px solid color-mix(in oklch, var(--moss) 30%, transparent)",
            background: "color-mix(in oklch, var(--moss) 6%, var(--paper))",
          }}
        >
          <div className="eyebrow"><span>SABIAS QUE?</span></div>
          <div
            className="h-display mt-2"
            style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}
          >
            Una sola persona en Jalisco genera{" "}
            <span style={{ color: "var(--moss)" }}>1.2 kg de basura al dia</span>.
          </div>
          <div className="text-xs leading-relaxed mt-2" style={{ color: "var(--muted)" }}>
            La Primavera recibe ~12 toneladas de basura visitante por mes. Tu trepada cuenta.
          </div>
        </div>
      </div>

      {selected && (
        <TrashDetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </AppShell>
  );
}
