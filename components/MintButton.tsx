'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'
import { BLITZ_COLLECTION_ADDRESS, BLITZ_COLLECTION_ABI } from '@/lib/contracts'

interface MintButtonProps {
  tokenId: number
  tokenName: string
  onSuccess?: () => void
}

export function MintButton({ tokenId, tokenName, onSuccess }: MintButtonProps) {
  const { authenticated } = usePrivy()
  const [amount, setAmount] = useState(1)

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = async () => {
    writeContract({
      address: BLITZ_COLLECTION_ADDRESS,
      abi: BLITZ_COLLECTION_ABI,
      functionName: 'mint',
      args: [BigInt(tokenId), BigInt(amount)],
    })
  }

  if (!authenticated) {
    return (
      <button 
        disabled 
        className="bg-black border border-gray-800 text-gray-600 px-4 py-2 rounded-lg w-full text-sm"
      >
        Connect wallet first
      </button>
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="text-monad-purple font-medium mb-1">Minted!</div>
        <a 
          href={`https://monad-testnet.socialscan.io/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 text-xs hover:text-white"
        >
          View transaction
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-400 text-sm">Qty:</span>
        <input
          type="number"
          min="1"
          max="10"
          value={amount}
          onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          className="bg-black border border-monad-purple/30 rounded px-3 py-1 w-16 text-center text-white text-sm focus:border-monad-purple outline-none"
        />
      </div>
      
      <button
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className="bg-monad-purple hover:bg-monad-purple/80 disabled:bg-gray-800 disabled:text-gray-600 text-white px-4 py-2 rounded-lg font-medium w-full transition-all text-sm"
      >
        {isPending ? 'Confirming...' : 
         isConfirming ? 'Minting...' : 
         `Mint ${tokenName}`}
      </button>

      {error && (
        <div className="text-red-400 text-xs text-center">
          {error.message.slice(0, 50)}...
        </div>
      )}
    </div>
  )
}
