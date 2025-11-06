'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { MiniKitProvider } from '@/lib/minikit-provider';
import { Providers } from '@/lib/providers';

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initApp = async () => {
      try {
        // Daj React chwilę na załadowanie
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Powiedz Farcaster że aplikacja jest gotowa
        await sdk.actions.ready();
        console.log('✅ Perun Casino ready!');
      } catch (error) {
        console.error('SDK ready error:', error);
      }
    };

    initApp();
  }, []);

  return (
    <MiniKitProvider>
      <Providers>
        {children}
      </Providers>
    </MiniKitProvider>
  );
}
