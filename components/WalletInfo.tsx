'use client'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useBalance, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { monadTestnet } from '@/lib/wagmi'
import { useState } from 'react'

export function WalletInfo() {
  const { authenticated, exportWallet } = usePrivy()
  const { wallets } = useWallets()
  const wallet = wallets[0]
  const { data: balance, refetch } = useBalance({
    address: wallet?.address as `0x${string}`,
    chainId: monadTestnet.id,
  })
  const { sendTransaction, isPending } = useSendTransaction()

  const [showSend, setShowSend] = useState(false)
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [txStatus, setTxStatus] = useState<string | null>(null)

  if (!authenticated || !wallet) {
    return null
  }

  const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
  const balanceFormatted = balance ? parseFloat(balance.formatted).toFixed(4) : '0'

  const handleExport = async () => {
    try {
      await exportWallet()
    } catch (err: any) {
      setTxStatus(`Error: ${err.message}`)
    }
  }

  const handleSend = async () => {
    if (!toAddress || !amount) {
      setTxStatus('Llena dirección y cantidad')
      return
    }
    setTxStatus('Enviando...')
    sendTransaction(
      {
        to: toAddress as `0x${string}`,
        value: parseEther(amount),
      },
      {
        onSuccess: (hash) => {
          setTxStatus('Tx enviada: ' + hash.slice(0, 10) + '...')
          setTimeout(() => refetch(), 3000)
        },
        onError: (err) => {
          setTxStatus('Error: ' + err.message)
        },
      }
    )
  }

  return (
    <div className="bg-black/50 border border-monad-purple/20 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Wallet</div>
          <div className="font-mono text-white">{shortAddress}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Balance</div>
          <div className="font-bold text-monad-purple">{balanceFormatted} MON</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          
          <a
            href={"https://monad-testnet.socialscan.io/address/" + wallet.address}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black border border-monad-purple/30 hover:border-monad-purple px-4 py-2 rounded-lg text-sm transition-all text-gray-300 hover:text-white"
          >
            Explorer
          </a>
          <button
            onClick={() => setShowSend(!showSend)}
            className="bg-black border border-monad-purple/30 hover:border-monad-purple px-4 py-2 rounded-lg text-sm transition-all text-gray-300 hover:text-white"
          >
            {showSend ? 'Cancelar' : 'Send MON'}
          </button>
          <button
            onClick={handleExport}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm transition-all text-white"
          >
            Export Wallet
          </button>
        </div>
      </div>

      {showSend && (
        <div className="border-t border-monad-purple/20 pt-4 mt-2 space-y-3">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Direccion destino</label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-black border border-monad-purple/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-monad-purple"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Cantidad (MON)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2"
              className="w-full bg-black border border-monad-purple/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-monad-purple"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isPending}
            className="w-full bg-monad-purple hover:bg-monad-purple/80 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition-all text-white font-medium"
          >
            {isPending ? 'Enviando...' : 'Confirmar envio'}
          </button>
          {txStatus && (
            <div className="text-sm text-gray-300 font-mono">{txStatus}</div>
          )}
        </div>
      )}
    </div>
  )
}
