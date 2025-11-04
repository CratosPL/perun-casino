'use client';

import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function MiniKitConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Auto-connect Farcaster wallet
    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [isConnected, connectors, connect]);

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-black/40 rounded-lg border border-purple-500/30">
          <p className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
        <button onClick={() => disconnect()} className="btn-secondary text-sm">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 bg-black/40 rounded-lg border border-purple-500/30">
      <p className="text-sm">⏳ Connecting...</p>
    </div>
  );
}
