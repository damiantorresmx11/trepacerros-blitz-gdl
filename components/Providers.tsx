'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig, monadTestnet } from '@/lib/wagmi'
import { ToastProvider } from '@/components/ui/Toast'
import { CerroBalancePill } from '@/components/CerroBalancePill'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#836EF9',
          logo: 'https://monad.xyz/monad-logo.svg',
        },
        loginMethods: ['email', 'google', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: monadTestnet,
        supportedChains: [monadTestnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ToastProvider>
            {/* CerroBalancePill persists across all route changes (R11 mitigation) */}
            <CerroBalancePill key="cerro-pill" />
            {children}
          </ToastProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
