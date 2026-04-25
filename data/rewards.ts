/**
 * Catálogo completo de recompensas canjeables.
 * 8 categorías, ~40 items totales. Espejo de lo que se seedea on-chain.
 */

export type RewardCategory =
  | "IMMEDIATE"
  | "EXPERIENCE"
  | "OUTDOOR"
  | "SUSTAINABILITY"
  | "DONATION"
  | "SERVICE"
  | "MERCH"
  | "EXCLUSIVE";

export interface Reward {
  id: number;
  name: string;
  description: string;
  category: RewardCategory;
  costInPrima: number;
  sponsor: string;
  icon: string;
  color: string;
}

export const CATEGORY_INFO: Record<RewardCategory, { label: string; description: string; color: string; icon: string }> = {
  IMMEDIATE: {
    label: "Consumo Inmediato",
    description: "Uso frecuente, valor bajo. Canjeable cualquier día.",
    color: "#FF6B35",
    icon: "🍺",
  },
  EXPERIENCE: {
    label: "Eventos y Experiencias",
    description: "Aspiracionales, valor alto.",
    color: "#7B2D26",
    icon: "🎯",
  },
  OUTDOOR: {
    label: "Productos Outdoor",
    description: "Equipo y servicios deportivos.",
    color: "#2A5C3E",
    icon: "🎒",
  },
  SUSTAINABILITY: {
    label: "Sustentabilidad",
    description: "Productos eco para tu hogar.",
    color: "#558B2F",
    icon: "🌱",
  },
  DONATION: {
    label: "Donación Directa",
    description: "Impacto directo a ONGs ambientales.",
    color: "#D4A017",
    icon: "💚",
  },
  SERVICE: {
    label: "Servicios Cotidianos",
    description: "Uso diario con aliados locales.",
    color: "#4A6FA5",
    icon: "🏪",
  },
  MERCH: {
    label: "Merch del Proyecto",
    description: "Identidad Trepacerros.",
    color: "#1C2430",
    icon: "👕",
  },
  EXCLUSIVE: {
    label: "Acceso Exclusivo",
    description: "Solo para los más activos.",
    color: "#794BFF",
    icon: "⭐",
  },
};

// Mismo orden que el script de deploy para que IDs on-chain coincidan
export const REWARDS: Reward[] = [
  // IMMEDIATE (0-4)
  { id: 0, name: "Chela Cervecera Minerva", description: "1 cerveza artesanal en bares aliados", category: "IMMEDIATE", costInPrima: 20, sponsor: "Cervecería Minerva", icon: "🍺", color: "#FF6B35" },
  { id: 1, name: "Café de Especialidad", description: "1 café en cafeterías aliadas", category: "IMMEDIATE", costInPrima: 15, sponsor: "Cafés aliados", icon: "☕", color: "#FF6B35" },
  { id: 2, name: "Smoothie Post-Hike", description: "Smoothie verde en juice bars", category: "IMMEDIATE", costInPrima: 18, sponsor: "Juice bars", icon: "🥤", color: "#FF6B35" },
  { id: 3, name: "Pan de Masa Madre", description: "1 pan en panaderías aliadas", category: "IMMEDIATE", costInPrima: 12, sponsor: "Panaderías locales", icon: "🍞", color: "#FF6B35" },
  { id: 4, name: "Tacos del Día", description: "Orden de tacos en locales aliados", category: "IMMEDIATE", costInPrima: 25, sponsor: "Taquerías aliadas", icon: "🌮", color: "#FF6B35" },

  // EXPERIENCE (5-10)
  { id: 5, name: "Trail Run Primavera 2026", description: "Entrada a carrera oficial", category: "EXPERIENCE", costInPrima: 150, sponsor: "Club Trail GDL", icon: "🏃", color: "#7B2D26" },
  { id: 6, name: "Hike Guiado con Experto", description: "Ruta guiada en La Primavera con biólogo", category: "EXPERIENCE", costInPrima: 80, sponsor: "Bosque La Primavera A.C.", icon: "🥾", color: "#7B2D26" },
  { id: 7, name: "Taller de Reforestación", description: "Taller de 4hrs con ONG aliada", category: "EXPERIENCE", costInPrima: 60, sponsor: "Reforestamos México", icon: "🌳", color: "#7B2D26" },
  { id: 8, name: "Yoga al Amanecer", description: "Clase de yoga outdoor en el cerro", category: "EXPERIENCE", costInPrima: 35, sponsor: "Estudios de yoga GDL", icon: "🧘", color: "#7B2D26" },
  { id: 9, name: "Primeros Auxilios Montaña", description: "Curso certificado de 8hrs", category: "EXPERIENCE", costInPrima: 200, sponsor: "Cruz Roja Jalisco", icon: "⛑️", color: "#7B2D26" },
  { id: 10, name: "Avistamiento de Aves", description: "Tour de aves silvestres con guía", category: "EXPERIENCE", costInPrima: 70, sponsor: "SEMADET", icon: "🦅", color: "#7B2D26" },

  // OUTDOOR (11-16)
  { id: 11, name: "Descuento Tienda Outdoor", description: "30% en tienda de montañismo aliada", category: "OUTDOOR", costInPrima: 50, sponsor: "Tiendas aliadas", icon: "🏔️", color: "#2A5C3E" },
  { id: 12, name: "Botella Reutilizable Branded", description: "Botella de acero inoxidable", category: "OUTDOOR", costInPrima: 40, sponsor: "Trepacerros", icon: "💧", color: "#2A5C3E" },
  { id: 13, name: "Calcetines Trail", description: "Calcetines técnicos", category: "OUTDOOR", costInPrima: 30, sponsor: "Marcas aliadas", icon: "🧦", color: "#2A5C3E" },
  { id: 14, name: "Reparación de Bicicleta", description: "Servicio básico en taller aliado", category: "OUTDOOR", costInPrima: 80, sponsor: "Talleres aliados", icon: "🚴", color: "#2A5C3E" },
  { id: 15, name: "Lavado de Equipo", description: "Lavado profesional de mochila/carpa", category: "OUTDOOR", costInPrima: 45, sponsor: "Servicios aliados", icon: "🎒", color: "#2A5C3E" },
  { id: 16, name: "Bandana Trepacerros", description: "Bandana multiuso del proyecto", category: "OUTDOOR", costInPrima: 25, sponsor: "Trepacerros", icon: "🪢", color: "#2A5C3E" },

  // SUSTAINABILITY (17-21)
  { id: 17, name: "Kit Limpieza a Granel", description: "Set de productos biodegradables", category: "SUSTAINABILITY", costInPrima: 55, sponsor: "Tiendas a granel", icon: "🧼", color: "#558B2F" },
  { id: 18, name: "Shampoo Sólido", description: "Cosmética sólida eco", category: "SUSTAINABILITY", costInPrima: 35, sponsor: "Cosmética eco", icon: "🧴", color: "#558B2F" },
  { id: 19, name: "Planta Nativa de Jalisco", description: "Planta para tu jardín", category: "SUSTAINABILITY", costInPrima: 30, sponsor: "Viveros locales", icon: "🌿", color: "#558B2F" },
  { id: 20, name: "Composta Casera Kit", description: "Kit para empezar composta", category: "SUSTAINABILITY", costInPrima: 65, sponsor: "Aliados de composta", icon: "🌱", color: "#558B2F" },
  { id: 21, name: "Bolsa Reutilizable Set", description: "3 bolsas de tela orgánica", category: "SUSTAINABILITY", costInPrima: 20, sponsor: "Trepacerros", icon: "🛍️", color: "#558B2F" },

  // DONATION (22-26)
  { id: 22, name: "Donación Bosque La Primavera A.C.", description: "Aporte directo a la ONG", category: "DONATION", costInPrima: 10, sponsor: "Bosque La Primavera A.C.", icon: "🌲", color: "#D4A017" },
  { id: 23, name: "Refugio Fauna Silvestre", description: "Ayuda a rescate animal", category: "DONATION", costInPrima: 15, sponsor: "Centros de rescate", icon: "🦌", color: "#D4A017" },
  { id: 24, name: "Reforestación 1 Árbol", description: "Financia la plantación de 1 árbol real", category: "DONATION", costInPrima: 25, sponsor: "Reforestamos México", icon: "🌳", color: "#D4A017" },
  { id: 25, name: "Rescate Animal Jalisco", description: "Donativo a centro de rescate", category: "DONATION", costInPrima: 20, sponsor: "Centros aliados", icon: "🐾", color: "#D4A017" },
  { id: 26, name: "Beca Ambiental Estudiante", description: "Aporta a beca de estudios ambientales", category: "DONATION", costInPrima: 50, sponsor: "Fundaciones aliadas", icon: "🎓", color: "#D4A017" },

  // SERVICE (27-31)
  { id: 27, name: "Menú del Día Restaurante", description: "Comida corrida en restaurantes aliados", category: "SERVICE", costInPrima: 40, sponsor: "Restaurantes aliados", icon: "🍽️", color: "#4A6FA5" },
  { id: 28, name: "Lavandería Ciclo", description: "Ciclo de lavado + secado", category: "SERVICE", costInPrima: 25, sponsor: "Lavanderías aliadas", icon: "🧺", color: "#4A6FA5" },
  { id: 29, name: "Librería Independiente", description: "Descuento en libros", category: "SERVICE", costInPrima: 30, sponsor: "Librerías indies", icon: "📚", color: "#4A6FA5" },
  { id: 30, name: "Corte de Pelo", description: "Corte en barbería/peluquería aliada", category: "SERVICE", costInPrima: 45, sponsor: "Barberías aliadas", icon: "💇", color: "#4A6FA5" },
  { id: 31, name: "Pase 1 Día Gym", description: "Entrada a estudio fitness aliado", category: "SERVICE", costInPrima: 35, sponsor: "Estudios fitness", icon: "💪", color: "#4A6FA5" },

  // MERCH (32-36)
  { id: 32, name: "Playera Trepacerros", description: "Playera del proyecto edición limitada", category: "MERCH", costInPrima: 60, sponsor: "Trepacerros", icon: "👕", color: "#1C2430" },
  { id: 33, name: "Hoodie Edición Limitada", description: "Sudadera edición Blitz GDL 2026", category: "MERCH", costInPrima: 120, sponsor: "Trepacerros", icon: "🧥", color: "#1C2430" },
  { id: 34, name: "Kit de Limpieza Hiker", description: "Guantes, bolsas biodegradables, pinza", category: "MERCH", costInPrima: 35, sponsor: "Trepacerros", icon: "🧤", color: "#1C2430" },
  { id: 35, name: "Sticker Pack Temporada", description: "Pack de stickers y parches", category: "MERCH", costInPrima: 15, sponsor: "Trepacerros", icon: "🏷️", color: "#1C2430" },
  { id: 36, name: "NFT Especial Blitz GDL", description: "NFT coleccionable del evento", category: "MERCH", costInPrima: 100, sponsor: "Trepacerros x Frutero", icon: "🎨", color: "#1C2430" },

  // EXCLUSIVE (37-40)
  { id: 37, name: "Ruta VIP Guiada Primavera", description: "Acceso a ruta privada con guía", category: "EXCLUSIVE", costInPrima: 180, sponsor: "Bosque La Primavera A.C.", icon: "🗺️", color: "#794BFF" },
  { id: 38, name: "Early Access Nueva Zona", description: "Primeros en acceder a cerro nuevo", category: "EXCLUSIVE", costInPrima: 80, sponsor: "Trepacerros", icon: "🚀", color: "#794BFF" },
  { id: 39, name: "Evento Sponsor Exclusivo", description: "Invitación a evento privado de marca", category: "EXCLUSIVE", costInPrima: 100, sponsor: "Sponsors rotativos", icon: "🎫", color: "#794BFF" },
  { id: 40, name: "Membresía Premium 3 Meses", description: "Features avanzadas en la app", category: "EXCLUSIVE", costInPrima: 150, sponsor: "Trepacerros", icon: "⭐", color: "#794BFF" },
];

export function getRewardsByCategory(category: RewardCategory): Reward[] {
  return REWARDS.filter((r) => r.category === category);
}

export function getAffordableRewards(primaBalance: number): Reward[] {
  return REWARDS.filter((r) => r.costInPrima <= primaBalance);
}
