import { Card } from '@/components/ui/Card'

const steps = [
  {
    emoji: '🥾',
    title: 'Sales a caminar',
    copy: 'Elige un cerro de Jalisco e inicia tu ruta GPS desde la app.',
  },
  {
    emoji: '🗑️',
    title: 'Recoges basura',
    copy: 'Junta lo que encuentres y separa por tipo: PET, vidrio, orgánico…',
  },
  {
    emoji: '📸',
    title: 'Subes evidencia',
    copy: 'Foto + peso por categoría. Tu hike queda registrado on-chain.',
  },
  {
    emoji: '🪙',
    title: 'Recibes PRIMA + NFT',
    copy: 'Tokens proporcionales al impacto y un NFT único por caminata.',
  },
]

export function HowItWorksLanding() {
  return (
    <section className="bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-foreground">
            Cómo funciona
          </h2>
          <p className="mt-3 text-foreground/70">
            Cuatro pasos. Mucho impacto.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Card className="h-full bg-background border border-foreground/10">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl leading-none" aria-hidden="true">
                    {step.emoji}
                  </span>
                  <span className="font-display text-2xl text-primary/40">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                  {step.copy}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorksLanding
