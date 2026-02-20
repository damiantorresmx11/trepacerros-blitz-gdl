import { ConnectButton } from '@/components/ConnectButton'
import { Collection } from '@/components/Collection'
import { Stats } from '@/components/Stats'
import { WalletInfo } from '@/components/WalletInfo'
import { HowItWorks } from '@/components/HowItWorks'
import { QuickLinks } from '@/components/QuickLinks'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-monad-purple/20 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-monad-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Monad Blitz</h1>
              <p className="text-gray-500 text-xs">CDMX</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-monad-purple/20 text-monad-purple px-4 py-1 rounded-full text-sm font-medium mb-6 border border-monad-purple/30">
          Feb 21, 2026 — Ciudad de México
        </div>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Build on{' '}
          <span className="text-monad-purple">Monad</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Connect, mint, and explore ERC1155 on the fastest blockchain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#collection"
            className="bg-monad-purple hover:bg-monad-purple/80 text-white px-8 py-3 rounded-lg font-medium transition-all"
          >
            Start Minting
          </a>
          <a 
            href="https://github.com/fruterito101/monad-blitz-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black border border-monad-purple/30 hover:border-monad-purple text-white px-8 py-3 rounded-lg font-medium transition-all"
          >
            View Code
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4">
        <Stats />
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4">
        <HowItWorks />
      </section>

      {/* Wallet Info */}
      <section className="max-w-6xl mx-auto px-4">
        <WalletInfo />
      </section>

      {/* Collection */}
      <section id="collection" className="max-w-6xl mx-auto px-4 pb-16">
        <h3 className="text-xl font-bold mb-8 text-center text-white">
          Available Items
        </h3>
        <Collection />
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <QuickLinks />
      </section>

      {/* Footer */}
      <footer className="border-t border-monad-purple/20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Built by{' '}
            <a 
              href="https://frutero.club" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-monad-purple hover:underline"
            >
              Frutero
            </a>
            {' '}for Monad Blitz CDMX
          </p>
        </div>
      </footer>
    </main>
  )
}
