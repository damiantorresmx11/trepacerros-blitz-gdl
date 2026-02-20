'use client'

import { useReadContracts } from 'wagmi'
import { BLITZ_COLLECTION_ADDRESS, BLITZ_COLLECTION_ABI } from '@/lib/contracts'

export function Stats() {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: BLITZ_COLLECTION_ADDRESS,
        abi: BLITZ_COLLECTION_ABI,
        functionName: 'totalItems',
      },
      {
        address: BLITZ_COLLECTION_ADDRESS,
        abi: BLITZ_COLLECTION_ABI,
        functionName: 'totalSupply',
        args: [1n],
      },
      {
        address: BLITZ_COLLECTION_ADDRESS,
        abi: BLITZ_COLLECTION_ABI,
        functionName: 'totalSupply',
        args: [2n],
      },
      {
        address: BLITZ_COLLECTION_ADDRESS,
        abi: BLITZ_COLLECTION_ABI,
        functionName: 'totalSupply',
        args: [3n],
      },
    ],
  })

  const totalItems = data?.[0]?.result as bigint | undefined
  const supply1 = data?.[1]?.result as bigint | undefined
  const supply2 = data?.[2]?.result as bigint | undefined
  const supply3 = data?.[3]?.result as bigint | undefined

  const totalMinted = (supply1 || 0n) + (supply2 || 0n) + (supply3 || 0n)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-black/50 border border-monad-purple/20 rounded-xl p-6 animate-pulse">
            <div className="h-8 bg-monad-purple/10 rounded mb-2"></div>
            <div className="h-4 bg-monad-purple/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    { value: totalItems?.toString() || '3', label: 'Items' },
    { value: totalMinted.toString(), label: 'Minted' },
    { value: 'ERC1155', label: 'Standard' },
    { value: '10K', label: 'TPS' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, i) => (
        <div key={i} className="bg-black/50 border border-monad-purple/20 rounded-xl p-6 hover:border-monad-purple/40 transition-all">
          <div className="text-2xl font-bold text-monad-purple">{stat.value}</div>
          <div className="text-gray-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
