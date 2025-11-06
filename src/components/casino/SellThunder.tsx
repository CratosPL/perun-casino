'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';

const THUNDER_CONTRACT = '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519';

export function SellThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  
  const { writeContract, isPending } = useWriteContract();

  const { data: sellPrice } = useReadContract({
    address: THUNDER_CONTRACT as `0x${string}`,
    abi: ThunderABI,
    functionName: 'getSellPrice',
    args: thunderAmount ? [parseUnits(thunderAmount, 18)] : undefined,
  });

  const handleSell = () => {
    if (!address || !thunderAmount) return;

    writeContract({
      address: THUNDER_CONTRACT as `0x${string}`,
      abi: ThunderABI,
      functionName: 'sell',
      args: [parseUnits(thunderAmount, 18)],
    });
  };

  if (!isConnected || !address) {
    return (
      <div className="glass-card p-8">
        <p className="text-center text-sm">🚀 Open in Farcaster</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold thunder-gradient text-center">💸 Sell Thunder</h2>

      <div className="space-y-4">
        <input
          type="number"
          value={thunderAmount}
          onChange={(e) => setThunderAmount(e.target.value)}
          placeholder="1000"
          className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white"
          min="1"
          step="100"
        />

        {sellPrice != null && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm">Receive: ${(Number(sellPrice.toString()) / 1e6).toFixed(2)} USDC</p>
          </div>
        )}

        <button
          onClick={handleSell}
          disabled={isPending || !thunderAmount}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isPending ? '⏳ Selling...' : '💸 Sell Thunder'}
        </button>

        <p className="text-xs text-center opacity-70">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </div>
  );
}
