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
    // Ta funkcja MUSI być wywołana, aby Farcaster wiedział, że apka się załadowała
    const initApp = async () => {
      try {
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
