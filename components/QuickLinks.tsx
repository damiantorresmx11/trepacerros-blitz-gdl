'use client'

import { BLITZ_COLLECTION_ADDRESS } from '@/lib/contracts'

export function QuickLinks() {
  const links = [
    {
      title: 'Contract',
      description: 'View on Explorer',
      href: `https://monad-testnet.socialscan.io/address/${BLITZ_COLLECTION_ADDRESS}`,
    },
    {
      title: 'Faucet',
      description: 'Get testnet MON',
      href: 'https://faucet.monad.xyz',
    },
    {
      title: 'Docs',
      description: 'Learn Monad',
      href: 'https://docs.monad.xyz',
    },
    {
      title: 'GitHub',
      description: 'Source code',
      href: 'https://github.com/fruterito101/monad-blitz-starter',
    },
  ]

  return (
    <div className="mb-16">
      <h3 className="text-xl font-bold mb-8 text-center text-white">Links</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/50 border border-monad-purple/20 rounded-xl p-6 text-center hover:border-monad-purple/40 transition-all group"
          >
            <div className="font-bold text-white mb-1 group-hover:text-monad-purple transition-colors">{link.title}</div>
            <div className="text-gray-400 text-sm">{link.description}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
