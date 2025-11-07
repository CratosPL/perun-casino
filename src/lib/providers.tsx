'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { ReactNode } from 'react';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

const queryClient = new QueryClient();

// Używamy createConfig z oficjalnym connectorem
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    farcasterMiniApp(), // ✅ To jest oficjalny i jedyny connector, którego potrzebujesz
  ],
  ssr: false, // Mini App jest zawsze po stronie klienta
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
