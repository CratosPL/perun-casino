'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useSendCalls } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';
import USDCABI from '@/lib/abis/USDC.json';

const THUNDER_CONTRACT = '0xea0438580AaaA57BD27811428169566060073B6e' as const;
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

export function BuyThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  
  const { sendCalls, isPending: isSending } = useSendCalls();

  // Pobierz cenę za Thunder
  const { data: buyPrice } = useReadContract({
    address: THUNDER_CONTRACT,
    abi: ThunderABI,
    functionName: 'getBuyPrice',
    args: thunderAmount ? [parseUnits(thunderAmount, 18)] : undefined,
  });

  const handleApproveAndBuy = async () => {
    if (!address || !thunderAmount || buyPrice === undefined) return;

    try {
      // Enkoduj obydwie operacje
      const approveData = encodeFunctionData({
        abi: USDCABI,
        functionName: 'approve',
        args: [THUNDER_CONTRACT, parseUnits('1000000', 6)],
      });

      const buyData = encodeFunctionData({
        abi: ThunderABI,
        functionName: 'buy',
        args: [parseUnits(thunderAmount, 18)],
      });

      // Przygotuj batch transaction
      const calls = [
        {
          to: USDC_ADDRESS as `0x${string}`,
          data: approveData,
        },
        {
          to: THUNDER_CONTRACT as `0x${string}`,
          data: buyData,
        },
      ];

      // Wyślij batch transaction
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
            <p className="text-sm">Price: ${(Number(buyPrice) / 1e6).toFixed(6)} USDC</p>
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
