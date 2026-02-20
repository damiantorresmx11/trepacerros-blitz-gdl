'use client'

import { useReadContracts } from 'wagmi'
import { useWallets } from '@privy-io/react-auth'
import { BLITZ_COLLECTION_ADDRESS, BLITZ_COLLECTION_ABI } from '@/lib/contracts'
import { MintButton } from './MintButton'

const ITEMS = [
  { id: 1, icon: '★', label: 'Badge' },
  { id: 2, icon: '◆', label: 'Pass' },
  { id: 3, icon: '◇', label: 'OG' },
]

export function Collection() {
  const { wallets } = useWallets()
  const userAddress = wallets[0]?.address as `0x${string}` | undefined

  const { data: itemsData, isLoading, refetch } = useReadContracts({
    contracts: ITEMS.flatMap(item => [
      {
        address: BLITZ_COLLECTION_ADDRESS,
        abi: BLITZ_COLLECTION_ABI,
        functionName: 'getItemInfo',
        args: [BigInt(item.id)],
      },
      {
        address: BLITZ_COLLECTION_ADDRESS,
        abi: BLITZ_COLLECTION_ABI,
        functionName: 'balanceOf',
        args: [userAddress || '0x0000000000000000000000000000000000000000', BigInt(item.id)],
      },
    ]),
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ITEMS.map((item) => (
          <div 
            key={item.id}
            className="bg-black/50 border border-monad-purple/20 rounded-2xl p-8 animate-pulse"
          >
            <div className="h-20 bg-monad-purple/10 rounded-full w-20 mx-auto mb-4"></div>
            <div className="h-6 bg-monad-purple/10 rounded mb-2 mx-auto w-2/3"></div>
            <div className="h-4 bg-monad-purple/10 rounded mx-auto w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ITEMS.map((item, index) => {
        const itemInfo = itemsData?.[index * 2]?.result as [string, bigint, bigint, boolean] | undefined
        const balance = itemsData?.[index * 2 + 1]?.result as bigint | undefined

        const name = itemInfo?.[0] || `Item ${item.id}`
        const currentSupply = itemInfo?.[1] || 0n
        const maxSupply = itemInfo?.[2] || 0n
        const available = itemInfo?.[3] ?? true

        const progress = maxSupply > 0n 
          ? Number((currentSupply * 100n) / maxSupply) 
          : 0

        return (
          <div 
            key={item.id}
            className="bg-black/50 border border-monad-purple/30 rounded-2xl p-8 hover:border-monad-purple/60 transition-all duration-300"
          >
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-monad-purple/20 flex items-center justify-center">
              <span className="text-4xl text-monad-purple">{item.icon}</span>
            </div>
            
            {/* Name */}
            <h3 className="text-xl font-bold text-center mb-2 text-white">{name}</h3>
            
            {/* Supply */}
            <div className="text-center text-gray-400 text-sm mb-4">
              {maxSupply > 0n 
                ? `${currentSupply.toString()} / ${maxSupply.toString()}`
                : `${currentSupply.toString()} minted`
              }
            </div>

            {/* Progress bar (if limited) */}
            {maxSupply > 0n && (
              <div className="w-full bg-black rounded-full h-1 mb-4">
                <div 
                  className="bg-monad-purple h-1 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {/* User balance */}
            {userAddress && balance !== undefined && balance > 0n && (
              <div className="text-center mb-4">
                <span className="text-monad-purple text-sm font-medium">
                  You own: {balance.toString()}
                </span>
              </div>
            )}

            {/* Mint button */}
            {available ? (
              <MintButton 
                tokenId={item.id} 
                tokenName={name}
                onSuccess={() => refetch()}
              />
            ) : (
              <div className="text-center">
                <span className="text-gray-500 text-sm">Sold out</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
