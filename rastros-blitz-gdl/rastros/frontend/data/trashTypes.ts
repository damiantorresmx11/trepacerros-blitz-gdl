/**
 * Base de datos de tipos de basura comunes en senderos mexicanos.
 * Contenido curado con enfoque en biomateriales y ciclo de vida.
 * El experto del equipo debe completar/refinar los datos de impacto.
 */

export interface TrashTypeInfo {
  id: string;
  nombre: string;
  categoria: "plastico" | "vidrio" | "metal" | "organico" | "mixto" | "peligroso";
  contractEnum: number; // 0=MIXED, 1=PET, 2=GLASS, 3=METAL, 4=ORGANIC, 5=HAZARDOUS
  reciclable: boolean;
  tiempo_degradacion: string;
  impacto: string;
  ruta_correcta: string;
  como_separar: string;
  icono: string;
  multiplicador: number;
}

export const TRASH_TYPES: TrashTypeInfo[] = [
  {
    id: "pet",
    nombre: "Botellas PET",
    categoria: "plastico",
    contractEnum: 1,
    reciclable: true,
    tiempo_degradacion: "450 años",
    impacto: "Una botella PET reciclada ahorra energía equivalente a mantener un foco encendido 6 horas. El PET se transforma en fibra textil para ropa deportiva.",
    ruta_correcta: "Centro de acopio PET o contenedor de plástico rígido",
    como_separar: "Enjuaga, aplasta, sin tapa (las tapas son HDPE, van aparte)",
    icono: "🍶",
    multiplicador: 1.5,
  },
  {
    id: "vidrio",
    nombre: "Vidrio y Botellas de Vidrio",
    categoria: "vidrio",
    contractEnum: 2,
    reciclable: true,
    tiempo_degradacion: "Indefinido (más de 4,000 años)",
    impacto: "El vidrio es 100% reciclable infinitas veces sin perder calidad. Una tonelada reciclada evita extraer 1.2 toneladas de materia prima.",
    ruta_correcta: "Centro de acopio o contenedor específico de vidrio",
    como_separar: "Enjuaga, separa por color si es posible (claro, ámbar, verde). Maneja con cuidado por riesgo de corte.",
    icono: "🍾",
    multiplicador: 1.5,
  },
  {
    id: "metal",
    nombre: "Latas y Metales",
    categoria: "metal",
    contractEnum: 3,
    reciclable: true,
    tiempo_degradacion: "50-200 años (aluminio), 100 años (acero)",
    impacto: "Reciclar aluminio ahorra 95% de la energía vs producirlo nuevo. Una lata reciclada ahorra energía para 3 horas de TV.",
    ruta_correcta: "Centro de acopio de metales o chatarrería",
    como_separar: "Enjuaga y aplasta las latas para reducir volumen. Separa aluminio de acero (imán los distingue).",
    icono: "🥫",
    multiplicador: 1.5,
  },
  {
    id: "organico",
    nombre: "Restos Orgánicos",
    categoria: "organico",
    contractEnum: 4,
    reciclable: true,
    tiempo_degradacion: "2-8 semanas en composta",
    impacto: "Orgánicos mal dispuestos generan metano (gas 25x más potente que CO2). Bien compostados nutren suelos empobrecidos por incendios.",
    ruta_correcta: "Composta casera o centro de composteo municipal",
    como_separar: "Solo orgánicos vegetales. NO incluye carnes, lácteos, ni excremento en composta casera.",
    icono: "🍂",
    multiplicador: 1.5,
  },
  {
    id: "mixto",
    nombre: "Basura Mixta",
    categoria: "mixto",
    contractEnum: 0,
    reciclable: false,
    tiempo_degradacion: "Variable",
    impacto: "La basura mixta termina en rellenos sanitarios. Separar bien aumenta 80% la tasa de reciclaje real.",
    ruta_correcta: "Bote municipal general",
    como_separar: "Intenta separar antes de subir. Si no es posible, basura mixta es mejor que nada.",
    icono: "🗑️",
    multiplicador: 1.0,
  },
  {
    id: "colillas",
    nombre: "Colillas de Cigarro",
    categoria: "peligroso",
    contractEnum: 5,
    reciclable: false,
    tiempo_degradacion: "10-12 años",
    impacto: "Es el residuo más abundante del planeta. Una colilla contamina hasta 50 litros de agua. Contiene acetato de celulosa + 4,000 químicos tóxicos.",
    ruta_correcta: "Contenedor especial o recicladoras especializadas (TerraCycle)",
    como_separar: "Recoge con guantes. Usa envase cerrado para transporte.",
    icono: "🚬",
    multiplicador: 2.0,
  },
  {
    id: "baterias",
    nombre: "Baterías y Pilas",
    categoria: "peligroso",
    contractEnum: 5,
    reciclable: true,
    tiempo_degradacion: "Depende del tipo (500-1000 años)",
    impacto: "Una pila contamina hasta 167,000 litros de agua por los metales pesados (mercurio, cadmio, plomo).",
    ruta_correcta: "NO LA RECOJAS. Reporta ubicación para recolección especial.",
    como_separar: "REPORTAR, no recolectar. Riesgo de fuga de químicos.",
    icono: "🔋",
    multiplicador: 2.0,
  },
  {
    id: "jeringas",
    nombre: "Jeringas y Material Punzocortante",
    categoria: "peligroso",
    contractEnum: 5,
    reciclable: false,
    tiempo_degradacion: "Variable",
    impacto: "Riesgo biológico alto. Infecciones potenciales incluyen hepatitis B/C y VIH.",
    ruta_correcta: "NO LA RECOJAS. Reporta para recolección por protección civil.",
    como_separar: "REPORTAR, nunca manipular. Toma foto con distancia.",
    icono: "💉",
    multiplicador: 2.0,
  },
  {
    id: "hdpe",
    nombre: "Plásticos Rígidos (HDPE)",
    categoria: "plastico",
    contractEnum: 1,
    reciclable: true,
    tiempo_degradacion: "100-450 años",
    impacto: "Tapas, envases de shampoo, botellas de leche. Se recicla en tuberías, contenedores industriales.",
    ruta_correcta: "Centro de acopio de plásticos rígidos",
    como_separar: "Enjuaga. Separa tapas de botellas PET (materiales diferentes).",
    icono: "🧴",
    multiplicador: 1.5,
  },
  {
    id: "carton",
    nombre: "Cartón y Papel",
    categoria: "mixto",
    contractEnum: 0,
    reciclable: true,
    tiempo_degradacion: "2-6 meses",
    impacto: "Reciclar 1 tonelada de cartón salva 17 árboles. Pero si está mojado o contaminado con grasa, NO es reciclable.",
    ruta_correcta: "Centro de acopio de papel/cartón (si está limpio y seco)",
    como_separar: "Solo cartón limpio y seco. Cajas de pizza con grasa NO se reciclan.",
    icono: "📦",
    multiplicador: 1.5,
  },
  {
    id: "tetrapak",
    nombre: "Tetra Pak y Envases Encerados",
    categoria: "mixto",
    contractEnum: 0,
    reciclable: true,
    tiempo_degradacion: "30+ años",
    impacto: "Son multicapas (papel + aluminio + plástico). Requieren recicladoras especializadas, no el contenedor de papel común.",
    ruta_correcta: "Centro de acopio específico de Tetra Pak",
    como_separar: "Enjuaga, aplasta. Separa de papel común — NO va junto.",
    icono: "🧃",
    multiplicador: 1.5,
  },
  {
    id: "unicel",
    nombre: "Unicel (Poliestireno)",
    categoria: "plastico",
    contractEnum: 1,
    reciclable: true,
    tiempo_degradacion: "500+ años",
    impacto: "El unicel fragmentado contamina suelos y cadenas alimentarias. Reciclable pero pocos centros lo aceptan.",
    ruta_correcta: "Centros especializados (Ecolana tiene mapa)",
    como_separar: "Enjuaga, compacta. Envases con comida pegada NO se aceptan.",
    icono: "🥡",
    multiplicador: 1.5,
  },
];

export function getTrashType(id: string): TrashTypeInfo | undefined {
  return TRASH_TYPES.find((t) => t.id === id);
}

export function getTrashTypesByCategoria(categoria: TrashTypeInfo["categoria"]): TrashTypeInfo[] {
  return TRASH_TYPES.filter((t) => t.categoria === categoria);
}
