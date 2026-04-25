import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CATEGORY_INFO, RewardCategory } from '@/data/rewards'

const ORDER: RewardCategory[] = [
  'IMMEDIATE',
  'EXPERIENCE',
  'OUTDOOR',
  'SUSTAINABILITY',
  'DONATION',
  'SERVICE',
  'MERCH',
  'EXCLUSIVE',
]

export function RewardsTeaser() {
  return (
    <section className="bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-foreground">
            Recompensas reales
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Canjea PRIMA en 8 categorías con aliados locales y ONGs ambientales.
          </p>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {ORDER.map((key) => {
            const info = CATEGORY_INFO[key]
            return (
              <li key={key}>
                <Card className="h-full bg-background border border-foreground/10 p-4 sm:p-5">
                  <div
                    className="text-3xl sm:text-4xl mb-3"
                    aria-hidden="true"
                  >
                    {info.icon}
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-foreground leading-snug">
                    {info.label}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-foreground/65 leading-snug">
                    {info.description}
                  </p>
                </Card>
              </li>
            )
          })}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link href="/rewards">
            <Button variant="secondary" size="lg">
              Ver catálogo completo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default RewardsTeaser
