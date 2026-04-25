import { http, fallback } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { createConfig } from '@privy-io/wagmi'

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  pollingInterval: 30_000,
  transports: {
    [monadTestnet.id]: fallback([
      http('https://monad-testnet.drpc.org', {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
      }),
      http('https://testnet-rpc.monad.xyz'),
    ]),
  },
})

export { monadTestnet }
