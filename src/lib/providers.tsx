'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

// Minimalna konfiguracja wagmi BEZ connectorów (MiniKit ma własny wallet)
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [], // PUSTE - MiniKit użyje własnego wallet
  ssr: false,
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
