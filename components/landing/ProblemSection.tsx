export function ProblemSection() {
  return (
    <section className="bg-foreground text-background">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 items-center">
          <div className="md:col-span-2">
            <p className="font-display text-7xl sm:text-8xl text-warm leading-none">
              919
            </p>
            <p className="mt-2 text-background/70 text-sm uppercase tracking-widest">
              incendios en Jalisco · 2025
            </p>
          </div>

          <div className="md:col-span-3 space-y-4 text-base sm:text-lg leading-relaxed text-background/80">
            <h2 className="font-display text-3xl sm:text-4xl text-background">
              El bosque no aguanta solo.
            </h2>
            <p>
              En 2025, Jalisco registró <strong className="text-background">919 incendios forestales</strong>,
              y el Bosque La Primavera, pulmón de Guadalajara, vuelve a estar bajo
              presión cada temporada seca.
            </p>
            <p>
              La basura abandonada amplifica el riesgo. Trepacerros convierte cada
              caminata en un acto de cuidado on-chain.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSection
