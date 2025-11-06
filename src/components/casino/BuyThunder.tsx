'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';
import USDCABI from '@/lib/abis/USDC.json';

const THUNDER_CONTRACT = '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export function BuyThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  const [step, setStep] = useState<'approve' | 'buy'>('approve');
  
  const { writeContract, isPending } = useWriteContract();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDCABI,
    functionName: 'allowance',
    args: address ? [address, THUNDER_CONTRACT] : undefined,
  });

  const { data: buyPrice } = useReadContract({
    address: THUNDER_CONTRACT as `0x${string}`,
    abi: ThunderABI,
    functionName: 'getBuyPrice',
    args: thunderAmount ? [parseUnits(thunderAmount, 18)] : undefined,
  });

  useEffect(() => {
    if (allowance && buyPrice) {
      const allowanceBig = BigInt(String(allowance));
      const priceBig = BigInt(String(buyPrice));
      
      setStep(allowanceBig >= priceBig ? 'buy' : 'approve');
    }
  }, [allowance, buyPrice]);

  const handleApprove = async () => {
    if (!address || !buyPrice) return;
    
    try {
      await writeContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'approve',
        args: [THUNDER_CONTRACT, parseUnits('1000000', 6)],
      });
      
      setTimeout(() => refetchAllowance(), 3000);
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleBuy = async () => {
    if (!address || !thunderAmount) return;
    
    try {
      await writeContract({
        address: THUNDER_CONTRACT as `0x${string}`,
        abi: ThunderABI,
        functionName: 'buy',
        args: [parseUnits(thunderAmount, 18)],
      });
    } catch (error) {
      console.error('Buy error:', error);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="glass-card p-8">
        <p className="text-center">🚀 Open in Farcaster</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold thunder-gradient text-center">⚡ Buy Thunder</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Thunder Amount
          </label>
          <input
            type="number"
            value={thunderAmount}
            onChange={(e) => setThunderAmount(e.target.value)}
            placeholder="1000"
            className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            min="1"
            step="100"
          />
        </div>

        {buyPrice != null && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Price: <span className="thunder-gradient font-bold">
                ${(Number(buyPrice.toString()) / 1_000_000_000_000_000_000).toFixed(6)} USDC
              </span>
            </p>
          </div>
        )}

        {step === 'approve' ? (
          <button
            onClick={handleApprove}
            disabled={!address || isPending || !buyPrice}
            className="btn-secondary w-full text-base"
          >
            {isPending ? '⏳ Approving...' : '✅ Approve USDC'}
          </button>
        ) : (
          <button
            onClick={handleBuy}
            disabled={!address || isPending || !thunderAmount}
            className="btn-primary w-full text-base"
          >
            {isPending ? '⏳ Processing...' : '⚡ Buy Thunder'}
          </button>
        )}
      </div>
    </div>
  );
}
