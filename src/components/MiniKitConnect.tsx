'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit } from '@/lib/minikit-provider';
import { sdk } from '@farcaster/miniapp-sdk';

export function MiniKitConnect() {
  const { isConnected, address } = useAccount();
  const { isSDKLoaded, user } = useMiniKit();

  if (!isSDKLoaded) {
    return (
      <div className="px-4 py-2 bg-black/40 rounded-lg border border-purple-500/30">
        <p className="text-sm">⏳ Loading SDK...</p>
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
        <p className="text-xs font-medium">@{user.username || `fid:${user.fid}`}</p>
      </div>
    </div>
  );
}
