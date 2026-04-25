import type { Metadata } from 'next'
import { Inter, Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'Monad Blitz Collection',
  description: 'Mintea tu colección en Monad Testnet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className={`${inter.className} text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
