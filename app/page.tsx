import { Hero } from '@/components/landing/Hero'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { HowItWorksLanding } from '@/components/landing/HowItWorksLanding'
import { RewardsTeaser } from '@/components/landing/RewardsTeaser'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <Hero />
      <ProblemSection />
      <HowItWorksLanding />
      <RewardsTeaser />
      <Footer />
    </main>
  )
}
