'use client';

import { useMiniKit } from '@/lib/minikit-provider';
import sdk from '@farcaster/frame-sdk';
import { useEffect, useState } from 'react';

export function MiniKitConnect() {
  const { isSDKLoaded, user } = useMiniKit();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!isSDKLoaded) return;

    const getAddress = async () => {
      try {
        const provider = await sdk.wallet.ethProvider;
        
        if (provider) {
          const accounts = await provider.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
          }
        }
      } catch (error) {
        console.error('Failed to get wallet address:', error);
      }
    };

    getAddress();
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return (
      <div className="px-4 py-2 bg-black/40 rounded-lg border border-purple-500/30">
        <p className="text-sm">⏳ Loading MiniKit...</p>
      </div>
    );
  }

  if (!user.fid) {
    return (
      <div className="px-4 py-2 bg-black/40 rounded-lg border border-red-500/30">
        <p className="text-sm">❌ Not in Farcaster</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {address && (
        <div className="px-4 py-2 bg-black/40 rounded-lg border border-purple-500/30">
          <p className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      )}
      <div className="px-3 py-2 bg-purple-500/20 rounded-lg border border-purple-500/50">
        <p className="text-xs font-medium">@{user.username || 'user'}</p>
      </div>
    </div>
  );
}
