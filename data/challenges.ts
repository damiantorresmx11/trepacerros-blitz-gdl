/**
 * Retos diarios de Trepacerros: una misión por día de la semana.
 * El usuario sube una foto que valida el reto y recibe el bonus en PRIMA.
 *
 * Diseño: feasibles, fotografiables, complementarios al loop principal
 * de recoger basura. Rotan los siete días.
 */

export interface DailyChallenge {
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  nombre: string;
  descripcion: string;
  emoji: string;
  bonusPrima: number;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    day: 1,
    nombre: "Antes y después",
    descripcion:
      "Encuentra un punto con basura en el sendero. Toma una foto antes de limpiarlo y otra después. Sube ambas a la app.",
    emoji: "📸",
    bonusPrima: 15,
  },
  {
    day: 2,
    nombre: "Especie nativa",
    descripcion:
      "Fotografía una planta o animal nativo de Jalisco que veas en tu ruta (encino, agave, tlacuache, halcón cola roja, etc). Etiqueta la especie si la conoces.",
    emoji: "🌿",
    bonusPrima: 10,
  },
  {
    day: 3,
    nombre: "Hidrátate y comparte",
    descripcion:
      "Súbete una foto con tu botella reutilizable llena en el punto más alto de tu ruta. Sin botellas desechables.",
    emoji: "💧",
    bonusPrima: 8,
  },
  {
    day: 4,
    nombre: "Cazador de colillas",
    descripcion:
      "Recolecta al menos 20 colillas de cigarro en una sola salida. Súbelas en una sola foto sobre superficie clara.",
    emoji: "🚬",
    bonusPrima: 20,
  },
  {
    day: 5,
    nombre: "Trail buddy",
    descripcion:
      "Sal a recorrer con alguien que nunca haya hecho cleanup en sendero. Foto grupal con la cosecha del día.",
    emoji: "🤝",
    bonusPrima: 18,
  },
  {
    day: 6,
    nombre: "Amanecer custodio",
    descripcion:
      "Empieza tu ruta antes de las 7 a.m. Comparte foto del amanecer con sello de tiempo de la app.",
    emoji: "🌅",
    bonusPrima: 12,
  },
  {
    day: 7,
    nombre: "Cierre de semana",
    descripcion:
      "Lleva tu acumulado de la semana a un centro SIMAR, Punto Limpio Andares o Recicla GDL. Foto del depósito en el contenedor correcto.",
    emoji: "♻️",
    bonusPrima: 25,
  },
];
