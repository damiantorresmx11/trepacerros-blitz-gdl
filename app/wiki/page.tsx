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
        className="card w-full max-w-[480px] md:max-w-lg max-h-[85vh] overflow-y-auto"
        style={{
          padding: 24,
          borderRadius: "20px 20px 0 0",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 30 }}>{item.icono}</span>
            <h3
              className="h-section"
              style={{ fontSize: 20, lineHeight: 1.1 }}
            >
              {item.nombre}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ color: "var(--muted)", cursor: "pointer", background: "none", border: "none", fontSize: 22 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
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

        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
          {item.impacto}
        </p>

        {/* Info sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Degradacion", content: item.tiempoDegradacion },
            { title: "Como separar", content: item.como_separar },
            { title: "Disposicion en GDL", content: item.disposicionGDL },
            { title: "Ruta correcta", content: item.ruta_correcta },
          ].map((section) => (
            <div
              key={section.title}
              className="card"
              style={{ padding: 14 }}
            >
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                <span>{section.title.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 20,
            background: "var(--ember)",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            padding: "16px 0",
            borderRadius: 18,
            border: "none",
            cursor: "pointer",
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
      <div style={{ padding: "0 18px" }}>
        <div className="eyebrow">
          <span>MATERIALES</span>
          <span className="tick" />
          <span>RECICLAJE</span>
          <span className="tick" />
          <span>IMPACTO</span>
        </div>

        <h1
          className="h-display"
          style={{ fontSize: 36, fontWeight: 900, lineHeight: 0.95, margin: "12px 0 0" }}
        >
          Wiki de
          <br />
          Materiales
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "10px 0 16px", maxWidth: "36ch", lineHeight: 1.5 }}>
          Aprende que reciclar, como separarlo, y cuanto multiplica tus $CERRO.
        </p>

        {/* Search bar */}
        <div className="search">
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
      <div className="hscroll" style={{ marginTop: 12 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="chip"
            style={
              activeCategory === cat.key
                ? {
                    background: "var(--ink)",
                    color: "var(--bg)",
                    borderColor: "transparent",
                    cursor: "pointer",
                    flexShrink: 0,
                  }
                : { cursor: "pointer", flexShrink: 0 }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured: Material del dia */}
      <div style={{ padding: "20px 18px 0" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              height: 160,
              background: "repeating-linear-gradient(135deg, color-mix(in oklch, var(--moss) 18%, var(--paper)) 0 12px, color-mix(in oklch, var(--moss) 10%, var(--paper)) 12px 24px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="eyebrow"><span>MATERIAL DEL DIA</span></span>
              <span className="mult-badge">&times;{FEATURED.multiplicador}</span>
            </div>
            <h3
              className="h-display"
              style={{ fontSize: 24, fontWeight: 900, lineHeight: 1, marginTop: 8 }}
            >
              {FEATURED.nombre}
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: "8px 0 0" }}>
              Una botella PET reciclada ahorra energia equivalente a mantener un foco encendido por 6 horas.
              Aplastala antes de echarla a la bolsa.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
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
      <div style={{ padding: "24px 18px 12px" }}>
        <h2 className="h-section">Categorias de Impacto</h2>
      </div>
      <div style={{ padding: "0 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="card"
              style={{
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                textAlign: "left",
                cursor: "pointer",
                border: "1px solid var(--line)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="wiki-icon">
                  <WikiCardIcon categoria={item.categoria} />
                </div>
                <span className="mult-badge">&times;{item.multiplicador}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{item.nombre}</div>
                <div
                  style={{
                    fontSize: 11,
                    lineHeight: 1.4,
                    marginTop: 4,
                    color: "var(--muted)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.impacto}
                </div>
              </div>
              {item.reciclable && (
                <span
                  className="chip"
                  style={{
                    alignSelf: "flex-start",
                    background: "color-mix(in oklch, var(--moss) 14%, var(--paper))",
                    color: "var(--moss)",
                    borderColor: "color-mix(in oklch, var(--moss) 25%, transparent)",
                    fontSize: 10,
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
      <div style={{ padding: "24px 18px" }}>
        <div
          className="card"
          style={{
            padding: 18,
            border: "1px solid color-mix(in oklch, var(--moss) 30%, transparent)",
            background: "color-mix(in oklch, var(--moss) 6%, var(--paper))",
          }}
        >
          <div className="eyebrow"><span>SABIAS QUE?</span></div>
          <div
            className="h-display"
            style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, marginTop: 8 }}
          >
            Una sola persona en Jalisco genera{" "}
            <span style={{ color: "var(--moss)" }}>1.2 kg de basura al dia</span>.
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginTop: 8 }}>
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
