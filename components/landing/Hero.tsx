import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <div className="flex justify-center mb-6">
          <Badge variant="success" className="text-sm px-3 py-1">
            On-chain en Monad
          </Badge>
        </div>

        <h1 className="font-display font-semibold tracking-tight text-foreground text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9]">
          RASTROS
        </h1>

        <p className="mt-6 font-display italic text-2xl sm:text-3xl md:text-4xl text-primary">
          Tus huellas, tu impacto.
        </p>

        <p className="mt-5 max-w-xl mx-auto text-base sm:text-lg text-foreground/70">
          Camina cerros de Jalisco, recoge basura, y recibe PRIMA + un NFT
          único por cada hike.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <Link href="/hike" className="block">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Iniciar mi primer hike
            </Button>
          </Link>
          <Link href="/rewards" className="block">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              Ver recompensas
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground/60">
          <span><strong className="text-foreground">1,200 kg</strong> recogidos</span>
          <span aria-hidden="true">·</span>
          <span><strong className="text-foreground">320</strong> hikers</span>
          <span aria-hidden="true">·</span>
          <span><strong className="text-foreground">580</strong> NFTs minteados</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
