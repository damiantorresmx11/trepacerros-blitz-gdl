/**
 * Contenido educativo de Trepacerros: datos del día, mitos vs realidades
 * y onboarding de seguridad para senderistas en Jalisco.
 *
 * Tono: cálido, factual, anclado en el contexto local (La Primavera,
 * Cerro del Colli, Bosque Los Colomos, Bosque Metropolitano).
 *
 * Las cifras son aproximadas — provienen de reportes públicos de SEMADET,
 * CONAFOR y prensa local. Verificar antes de usar en materiales formales.
 */

export interface DatoDelDia {
  id: number;
  titulo: string;
  cuerpo: string;
  fuente?: string;
}

export const DATOS_DEL_DIA: DatoDelDia[] = [
  {
    id: 1,
    titulo: "La Primavera respira por Guadalajara",
    cuerpo:
      "El Bosque La Primavera cubre cerca de 30,500 hectáreas y funciona como el principal regulador climático y de recarga de acuíferos del Área Metropolitana de Guadalajara. Sin él, la ciudad sería varios grados más caliente.",
    fuente: "SEMADET Jalisco",
  },
  {
    id: 2,
    titulo: "Una colilla, 50 litros menos de agua limpia",
    cuerpo:
      "Cada colilla de cigarro abandonada en el bosque libera nicotina, alquitranes y metales pesados. Una sola puede contaminar hasta 50 litros de agua antes de degradarse en 10 a 12 años.",
    fuente: "OMS / informes ambientales",
  },
  {
    id: 3,
    titulo: "Temporada de incendios 2025: récord en Jalisco",
    cuerpo:
      "La temporada seca 2025 dejó más de 60 incendios reportados en Bosque La Primavera, varios de origen humano. Una fogata mal apagada o un vidrio en el suelo concentrando luz solar son detonantes documentados.",
    fuente: "CONAFOR / Protección Civil Jalisco",
  },
  {
    id: 4,
    titulo: "El PET que recoges hoy puede ser una playera mañana",
    cuerpo:
      "Una botella PET reciclada se convierte en fibra textil. Siete botellas equivalen aproximadamente a una playera deportiva. Es uno de los reciclajes más eficientes en México.",
    fuente: "PetStar / ECOCE",
  },
  {
    id: 5,
    titulo: "El Cerro del Colli es un refugio urbano de fauna",
    cuerpo:
      "Pese a estar rodeado de ciudad, el Cerro del Colli alberga zorros grises, tlacuaches, coyotes y más de 80 especies de aves. Los rastros en sus senderos afectan directamente sus rutas de alimentación.",
    fuente: "SEMADET / observaciones locales",
  },
  {
    id: 6,
    titulo: "Bosque Los Colomos: el pulmón del norte tapatío",
    cuerpo:
      "Con 92 hectáreas en plena ciudad, Los Colomos recibe más de un millón de visitas al año. Cada bolsa que dejas duplica el costo de mantenimiento del parque y reduce la calidad del agua del manantial El Chochocate.",
    fuente: "Patronato Bosque Los Colomos",
  },
  {
    id: 7,
    titulo: "Pilas: 1 pila = 167,000 litros de agua arruinados",
    cuerpo:
      "Una sola pila alcalina puede contaminar hasta 167,000 litros de agua por los metales pesados (mercurio, cadmio, plomo). Nunca la recojas con la mano: repórtala con foto y ubicación.",
    fuente: "SEMARNAT",
  },
  {
    id: 8,
    titulo: "El vidrio nunca muere",
    cuerpo:
      "Una botella de vidrio tarda más de 4,000 años en degradarse pero puede reciclarse infinitas veces sin perder calidad. Reciclarlo ahorra 30% de la energía requerida para fabricar vidrio nuevo.",
    fuente: "Vitro / industria nacional",
  },
  {
    id: 9,
    titulo: "Los orgánicos también contaminan",
    cuerpo:
      "Una cáscara de plátano tarda hasta 2 años en degradarse en suelo de bosque seco como el de La Primavera. Mientras lo hace, atrae fauna a senderos donde no debería estar y altera dietas naturales.",
    fuente: "Estudios de ecología tropical",
  },
  {
    id: 10,
    titulo: "Bosque Metropolitano: nacido para limpiar aire",
    cuerpo:
      "Las 186 hectáreas del Bosque Metropolitano fueron diseñadas para capturar CO2 y partículas finas (PM2.5). Cada residuo no recogido reduce la eficiencia de ese servicio ambiental gratuito que recibe la ciudad.",
    fuente: "Ayuntamiento de Zapopan",
  },
];

export interface MitoRealidad {
  mito: string;
  realidad: string;
}

export const MITOS_REALIDADES: MitoRealidad[] = [
  {
    mito: "Si es orgánico, no pasa nada si lo dejo en el bosque.",
    realidad:
      "En bosques secos como La Primavera la materia orgánica no nativa tarda meses en degradarse, atrae fauna a senderos y altera dietas. Si lo trajiste, te lo llevas.",
  },
  {
    mito: "El vidrio se degrada con el sol.",
    realidad:
      "El vidrio tarda más de 4,000 años en degradarse y puede actuar como lupa concentrando luz solar. Es una causa documentada de incendios forestales en Jalisco.",
  },
  {
    mito: "Las colillas son tan pequeñas que no importan.",
    realidad:
      "Son el residuo más abundante del planeta. Cada una contamina hasta 50 litros de agua y carga 4,000 químicos tóxicos. Imagínate millones tiradas en La Primavera.",
  },
  {
    mito: "Reciclar en Guadalajara no sirve, todo termina en el mismo camión.",
    realidad:
      "Centros como SIMAR, Punto Limpio Andares y Recicla GDL sí procesan materiales separados. La logística mejora cuando ciudadanos llevan residuos limpios y separados.",
  },
  {
    mito: "Si el sendero está limpio, no necesito llevar bolsa.",
    realidad:
      "Siempre carga bolsa: vas a encontrar algo. Y si no, sirve para residuos propios. Es la diferencia entre ser visitante y ser custodio del lugar.",
  },
];

export const ONBOARDING_SEGURIDAD: string[] = [
  "Hidrátate antes, durante y después: lleva mínimo 1.5 L de agua por persona en rutas de medio día en La Primavera.",
  "Nunca toques vidrios rotos, jeringas ni pilas con la mano desnuda. Repórtalos en la app con foto y ubicación.",
  "Usa guantes resistentes y bolsas dedicadas para los rastros que sí puedes recoger.",
  "Aplica bloqueador SPF 50+ cada 2 horas: el sol de Jalisco a 1,600 m de altura quema más rápido de lo que crees.",
  "No salgas a recorrer Cerro del Colli ni La Primavera después del atardecer; los senderos pierden visibilidad y la fauna nocturna se activa.",
  "Avisa a alguien tu ruta y hora estimada de regreso antes de subir. Comparte tu ubicación en vivo si vas con poca señal.",
  "En temporada seca (noviembre a junio) está prohibido encender fuego de cualquier tipo. La temporada 2025 dejó más de 60 incendios en La Primavera.",
  "Si ves humo o fuego, llama al 911 y reporta a Protección Civil Jalisco. No intentes apagarlo solo.",
  "Usa calzado de suela cerrada con buen agarre: las terrazas de toba volcánica de La Primavera resbalan con polvo.",
  "Respeta a la fauna: no la alimentes, no la persigas para fotos. Eres visitante en su casa.",
];
