import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="font-display text-2xl text-background tracking-wide">
              RASTROS
            </p>
            <p className="mt-1 text-xs text-background/60">
              Monad Blitz GDL 2026 · Hackathon project
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link
              href="/blitz-demo"
              className="hover:text-background transition-colors"
            >
              Blitz demo
            </Link>
            <a
              href="https://github.com/fruterito101/monad-blitz-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-background transition-colors"
            >
              GitHub
            </a>
            <span className="text-background/50">
              On-chain en Monad Testnet
            </span>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
