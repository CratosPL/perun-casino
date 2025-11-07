'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useSendCalls } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';
import USDCABI from '@/lib/abis/USDC.json';
import { CONTRACTS } from '@/lib/contracts';

export function BuyThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  
  const { sendCalls, isPending: isSending } = useSendCalls();

  const { data: buyPrice } = useReadContract({
    address: CONTRACTS.THUNDER_BONDING_CURVE,
    abi: ThunderABI,
    functionName: 'getBuyPrice',
    args: thunderAmount ? [parseUnits(thunderAmount, 18)] : undefined,
  });

  const handleApproveAndBuy = async () => {
    if (!address || !thunderAmount || buyPrice === undefined) return;

    try {
      const approveData = encodeFunctionData({
        abi: USDCABI,
        functionName: 'approve',
        args: [CONTRACTS.THUNDER_BONDING_CURVE, parseUnits('1000000', 6)],
      });

      const buyData = encodeFunctionData({
        abi: ThunderABI,
        functionName: 'buy',
        args: [parseUnits(thunderAmount, 18)],
      });

      const calls = [
        {
          to: CONTRACTS.USDC,
          data: approveData,
        },
        {
          to: CONTRACTS.THUNDER_BONDING_CURVE,
          data: buyData,
        },
      ];

      await sendCalls({ 
        calls,
        account: address,
      });
    } catch (e) {
      console.error('Batch transaction failed:', e);
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
  
  // FIX: Proper decimal conversion
  // buyPrice is in wei (6 decimals for USDC)
  // Display as: price / 1e6
  const displayPrice = buyPrice 
    ? (Number(buyPrice) / 1e6).toFixed(6) 
    : '0';

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold thunder-gradient text-center">⚡ Buy Thunder</h2>
      <div className="space-y-4">
        <input
          type="number"
          value={thunderAmount}
          onChange={(e) => setThunderAmount(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white"
          min="1"
          step="100"
        />
        {buyPrice !== undefined && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm">Price: ${displayPrice} USDC</p>
            <p className="text-xs opacity-70">For {thunderAmount} Thunder</p>
          </div>
        )}
        <button 
          onClick={handleApproveAndBuy} 
          disabled={isPending || !buyPrice} 
          className="btn-primary w-full disabled:opacity-50"
        >
          {isPending ? '⏳ Processing...' : '⚡ Approve & Buy Thunder'}
        </button>
        <p className="text-xs text-center opacity-70">
          {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
      </div>
    </div>
  ); 
}
