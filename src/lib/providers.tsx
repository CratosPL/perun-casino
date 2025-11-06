'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

// Warpcast automatycznie injectuje provider (window.ethereum)
// Nie potrzebujemy connectora - wagmi sam go znajdzie!
const wagmiConfig = createConfig({
  chains: [base],
  connectors: [], // PUSTE - Warpcast zrobi resztę
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
