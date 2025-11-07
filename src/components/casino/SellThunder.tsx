'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useSendCalls } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';

const THUNDER_CONTRACT = '0xea0438580AaaA57BD27811428169566060073B6e' as const;

export function SellThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  
  const { sendCalls, isPending: isSending } = useSendCalls();

  // Pobierz ile USDC otrzymasz
  const { data: sellPrice } = useReadContract({
    address: THUNDER_CONTRACT,
    abi: ThunderABI,
    functionName: 'getSellPrice',
    args: thunderAmount ? [parseUnits(thunderAmount, 18)] : undefined,
  });

  const handleSell = async () => {
    if (!address || !thunderAmount || sellPrice === undefined) return;

    try {
      const sellData = encodeFunctionData({
        abi: ThunderABI,
        functionName: 'sell',
        args: [parseUnits(thunderAmount, 18)],
      });

      const calls = [
        {
          to: THUNDER_CONTRACT as `0x${string}`,
          data: sellData,
        },
      ];

      await sendCalls({ 
        calls,
        account: address,
      });
    } catch (e) {
      console.error('Sell failed:', e);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="glass-card p-8">
        <p className="text-center text-sm">🚀 Open in Farcaster to connect</p>
      </div>
    );
  }

  const isPending = isSending;

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold text-yellow-400 text-center">💰 Sell Thunder</h2>
      <div className="space-y-4">
        <input
          type="number"
          value={thunderAmount}
          onChange={(e) => setThunderAmount(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 border border-yellow-500/30 rounded-lg text-white"
          min="1"
          step="100"
        />
        {sellPrice !== undefined && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm">You receive: ${(Number(sellPrice) / 1e6).toFixed(6)} USDC</p>
            <p className="text-xs opacity-70">Fee: 2%</p>
          </div>
        )}
        <button 
          onClick={handleSell} 
          disabled={isPending || !sellPrice} 
          className="btn-primary w-full disabled:opacity-50 bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50"
        >
          {isPending ? '⏳ Processing...' : '💰 Sell Thunder'}
        </button>
        <p className="text-xs text-center opacity-70">
          {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
      </div>
    </div>
  ); 
}
