/**
 * Catálogo de áreas naturales en el Área Metropolitana de Guadalajara
 * donde opera Rastros: La Primavera, Cerro del Colli, Bosque Los Colomos
 * y Bosque Metropolitano.
 *
 * Las coordenadas son aproximadas al centro del polígono de cada área
 * y son suficientes para centrar mapas. Para rutas oficiales y accesos
 * exactos consultar SEMADET y patronatos respectivos.
 */

export type Dificultad = "Baja" | "Media" | "Alta";

export interface Cerro {
  slug: "primavera" | "colli" | "colomos" | "metropolitano";
  nombre: string;
  descripcion: string;
  dificultad: Dificultad;
  /** Distancia tipica de un recorrido representativo, en kilometros (ida y vuelta). */
  distanciaTipicaKm: number;
  accesos: string[];
  coordsCentro: { lat: number; lng: number };
}

export const CERROS: Cerro[] = [
  {
    slug: "primavera",
    nombre: "Bosque La Primavera",
    descripcion:
      "Área natural protegida de cerca de 30,500 hectáreas al poniente de Guadalajara. Es el principal regulador climático y de recarga de acuíferos del AMG. Bosque de encino-pino con manantiales termales y fauna como venado cola blanca y coyote.",
    dificultad: "Media",
    distanciaTipicaKm: 12,
    accesos: [
      "Caseta La Cañada (Mariano Otero, Zapopan)",
      "Caseta Las Planillas",
      "Acceso Río Caliente",
      "Acceso por La Venta del Astillero",
    ],
    coordsCentro: { lat: 20.667, lng: -103.567 },
  },
  {
    slug: "colli",
    nombre: "Cerro del Colli",
    descripcion:
      "Cono volcánico de cerca de 1,960 m s.n.m. en Zapopan, rodeado por la mancha urbana. Refugio de fauna como zorro gris, tlacuache y más de 80 especies de aves. Ruta corta pero con pendiente sostenida.",
    dificultad: "Media",
    distanciaTipicaKm: 5,
    accesos: [
      "Acceso por Av. Aviación / Col. Bugambilias",
      "Acceso por Col. Loma Real",
    ],
    coordsCentro: { lat: 20.668, lng: -103.467 },
  },
  {
    slug: "colomos",
    nombre: "Bosque Los Colomos",
    descripcion:
      "Parque urbano de 92 hectáreas en el norte de Guadalajara y Zapopan. Alberga el manantial El Chochocate, el jardín japonés y senderos planos. Recibe más de un millón de visitas al año, ideal para iniciarse en cleanup.",
    dificultad: "Baja",
    distanciaTipicaKm: 4,
    accesos: [
      "Entrada Av. Patria (Zapopan)",
      "Entrada El Chaco (Guadalajara)",
      "Entrada Av. Acueducto",
    ],
    coordsCentro: { lat: 20.713, lng: -103.405 },
  },
  {
    slug: "metropolitano",
    nombre: "Bosque Metropolitano",
    descripcion:
      "Parque de 186 hectáreas en Zapopan diseñado como pulmón urbano y captador de CO2. Mezcla zonas reforestadas, pista de trote y áreas de educación ambiental. Buen lugar para retos largos en plano.",
    dificultad: "Baja",
    distanciaTipicaKm: 6,
    accesos: [
      "Entrada principal Av. Beethoven",
      "Acceso Av. Rafael Sanzio",
      "Acceso Av. Juan Gil Preciado",
    ],
    coordsCentro: { lat: 20.659, lng: -103.467 },
  },
];
