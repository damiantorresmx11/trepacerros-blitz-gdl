import type { Metadata } from 'next'
import { Inter, Fraunces, DM_Sans, Lexend, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

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
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable} ${lexend.variable} ${spaceGrotesk.variable}`}>
      {/* Material Symbols self-hosted via @font-face in globals.css — no CDN dependency */}
      <body className={`${inter.className} text-tc-on-surface`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
