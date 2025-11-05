'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';

const THUNDER_CONTRACT = '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519';

export function SellThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('100');
  
  const { writeContract, isPending, error } = useWriteContract();

  const { data: thunderBalance } = useReadContract({
    address: THUNDER_CONTRACT as `0x${string}`,
    abi: ThunderABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: sellPrice, error: priceError } = useReadContract({
    address: THUNDER_CONTRACT as `0x${string}`,
    abi: ThunderABI,
    functionName: 'getSellPrice',
    args: thunderAmount ? [parseUnits(thunderAmount, 18)] : undefined,
  });

  useEffect(() => {
    if (error) {
      alert(`Transaction failed: ${error.message}`);
    }
  }, [error]);

  const handleSell = async () => {
    if (!address || !thunderAmount) return;
    
    try {
      await writeContract({
        address: THUNDER_CONTRACT as `0x${string}`,
        abi: ThunderABI,
        functionName: 'sell',
        args: [parseUnits(thunderAmount, 18)],
      });
    } catch (error) {
      console.error('Sell error:', error);
    }
  };

  // Calculate if user has enough balance
  const hasEnoughBalance = () => {
    if (!thunderBalance || !thunderAmount) return false;
    try {
      const amountWei = parseUnits(thunderAmount, 18);
      return BigInt(thunderBalance.toString()) >= BigInt(amountWei);
    } catch {
      return false;
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="glass-card p-8">
        <p className="text-center">🚀 Open in Farcaster to sell Thunder</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold thunder-gradient text-center">💸 Sell Thunder</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Thunder Amount
          </label>
          <input
            type="number"
            value={thunderAmount}
            onChange={(e) => setThunderAmount(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            min="1"
            step="10"
          />
        </div>

        {priceError && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">
              ⚠️ Cannot get sell price - contract may have insufficient supply
            </p>
          </div>
        )}

        {sellPrice != null && !priceError && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              You'll receive: <span className="thunder-gradient font-bold">
                ${(Number(sellPrice.toString()) / 1_000_000_000_000_000_000).toFixed(6)} USDC
              </span>
            </p>
            <p className="text-xs mt-1 text-yellow-400">
              ⚠️ Contract pricing bug - will redeploy soon
            </p>
          </div>
        )}

        {thunderBalance != null && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Your Thunder: <span className="font-bold">
                {(Number(thunderBalance.toString()) / 1e18).toFixed(2)} ⚡
              </span>
            </p>
          </div>
        )}

        {!hasEnoughBalance() && thunderAmount && (
          <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-400">
              ⚠️ Insufficient Thunder balance
            </p>
          </div>
        )}

        <button
          onClick={handleSell}
          disabled={isPending || !thunderAmount || !hasEnoughBalance() || !!priceError}
          className="btn-primary w-full text-base"
        >
          {isPending ? '⏳ Processing...' : '💸 Sell Thunder'}
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </div>
  );
}
