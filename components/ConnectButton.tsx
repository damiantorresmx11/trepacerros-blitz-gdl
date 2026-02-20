'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth'

export function ConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { wallets } = useWallets()

  if (!ready) {
    return (
      <button 
        disabled
        className="bg-black border border-gray-800 text-gray-600 px-4 py-2 rounded-lg text-sm"
      >
        Loading...
      </button>
    )
  }

  if (!authenticated) {
    return (
      <button 
        onClick={login}
        className="bg-monad-purple hover:bg-monad-purple/80 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
      >
        Connect
      </button>
    )
  }

  const wallet = wallets[0]
  const shortAddress = wallet?.address 
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : 'No wallet'

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="font-mono text-monad-purple text-sm">{shortAddress}</div>
        {user?.email && (
          <div className="text-gray-500 text-xs">{user.email.address}</div>
        )}
      </div>
      <button 
        onClick={logout}
        className="bg-black border border-monad-purple/30 hover:border-monad-purple text-white px-3 py-1.5 rounded-lg text-sm transition-all"
      >
        Exit
      </button>
    </div>
  )
}
