'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { ReactNode } from 'react';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'; // DODANE!

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [farcasterMiniApp()], // ZMIENIONE!
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
