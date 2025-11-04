'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import sdk from '@farcaster/frame-sdk';

type MiniKitContextType = {
  isSDKLoaded: boolean;
  context: any;
  user: {
    fid: number | null;
    username: string | null;
    displayName: string | null;
    pfpUrl: string | null;
  };
};

const MiniKitContext = createContext<MiniKitContextType>({
  isSDKLoaded: false,
  context: null,
  user: {
    fid: null,
    username: null,
    displayName: null,
    pfpUrl: null,
  },
});

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [user, setUser] = useState({
    fid: null as number | null,
    username: null as string | null,
    displayName: null as string | null,
    pfpUrl: null as string | null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        // Initialize SDK
        const ctx = await sdk.context;
        setContext(ctx);
        
        // Get user info
        if (ctx?.user) {
          setUser({
            fid: ctx.user.fid,
            username: ctx.user.username || null,
            displayName: ctx.user.displayName || null,
            pfpUrl: ctx.user.pfpUrl || null,
          });
        }
        
        setIsSDKLoaded(true);
        
        // WAŻNE: Notify app that SDK is ready
        await sdk.actions.ready();
      } catch (error) {
        console.error('MiniKit SDK load error:', error);
        setIsSDKLoaded(true);
        
        // Try to call ready even if error
        try {
          await sdk.actions.ready();
        } catch (e) {
          console.error('Failed to call ready:', e);
        }
      }
    };

    load();
  }, []);

  return (
    <MiniKitContext.Provider value={{ isSDKLoaded, context, user }}>
      {children}
    </MiniKitContext.Provider>
  );
}

export function useMiniKit() {
  return useContext(MiniKitContext);
}
