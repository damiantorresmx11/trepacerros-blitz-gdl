import type { Metadata } from 'next'
import { Big_Shoulders_Display, Inter, Fraunces, DM_Sans, Lexend, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
const bigShoulders = Big_Shoulders_Display({ subsets: ['latin'], variable: '--font-big-shoulders', weight: ['400', '500', '600', '700', '800', '900'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Trepacerros — Limpia el cerro, gana tokens',
  description: 'App gamificada de limpieza de senderos en Guadalajara. Recolecta basura, gana $CERRO, redime recompensas locales.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable} ${lexend.variable} ${spaceGrotesk.variable} ${bigShoulders.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} text-cd-ink bg-cd-bg`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
