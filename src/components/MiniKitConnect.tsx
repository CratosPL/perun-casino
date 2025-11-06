'use client';

import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useMiniKit } from '@/lib/minikit-provider';

export function MiniKitConnect() {
  const { isSDKLoaded, user } = useMiniKit();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Auto-connect gdy Warpcast provider jest dostępny
  useEffect(() => {
    if (isSDKLoaded && !isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [isSDKLoaded, isConnected, connectors, connect]);

  if (!isSDKLoaded) {
    return (
      <div className="px-4 py-2 bg-black/40 rounded-lg border border-purple-500/30">
        <p className="text-sm">⏳ Loading...</p>
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

  if (!isConnected || !address) {
    return (
      <div className="px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
        <p className="text-sm">⏳ Connecting wallet...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="px-4 py-2 bg-black/40 rounded-lg border border-purple-500/30">
        <p className="text-sm font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
      <div className="px-3 py-2 bg-purple-500/20 rounded-lg border border-purple-500/50">
        <p className="text-xs font-medium">@{user.username || 'user'}</p>
      </div>
    </div>
  );
}
