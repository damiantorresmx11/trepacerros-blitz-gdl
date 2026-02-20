'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useBalance } from 'wagmi'
import { monadTestnet } from '@/lib/wagmi'

export function WalletInfo() {
  const { authenticated } = usePrivy()
  const { wallets } = useWallets()
  const wallet = wallets[0]

  const { data: balance } = useBalance({
    address: wallet?.address as `0x${string}`,
    chainId: monadTestnet.id,
  })

  if (!authenticated || !wallet) {
    return null
  }

  const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
  const balanceFormatted = balance ? parseFloat(balance.formatted).toFixed(4) : '0'

  return (
    <div className="bg-black/50 border border-monad-purple/20 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Wallet</div>
          <div className="font-mono text-white">{shortAddress}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Balance</div>
          <div className="font-bold text-monad-purple">{balanceFormatted} MON</div>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://monad-testnet.socialscan.io/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black border border-monad-purple/30 hover:border-monad-purple px-4 py-2 rounded-lg text-sm transition-all text-gray-300 hover:text-white"
          >
            Explorer
          </a>
          <a
            href="https://faucet.monad.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-monad-purple hover:bg-monad-purple/80 px-4 py-2 rounded-lg text-sm transition-all text-white"
          >
            Get MON
          </a>
        </div>
      </div>
    </div>
  )
}
