'use client';

import { useState } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';

const THUNDER_CONTRACT = '0xEC072aC80854A3477b447f895A9A32157589EA26';

export function SellThunder() {
  const { address } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  
  const { writeContract, isPending } = useWriteContract();

  const { data: thunderBalance } = useReadContract({
    address: THUNDER_CONTRACT as `0x${string}`,
    abi: ThunderABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: sellPrice } = useReadContract({
    address: THUNDER_CONTRACT as `0x${string}`,
    abi: ThunderABI,
    functionName: 'getSellPrice',
    args: thunderAmount ? [parseUnits(thunderAmount, 18)] : undefined,
  });

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

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold thunder-gradient text-center">💸 Sell Thunder</h2>
      
      <div className="space-y-4" suppressHydrationWarning>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Thunder Amount
          </label>
          <input
            suppressHydrationWarning
            type="number"
            value={thunderAmount}
            onChange={(e) => setThunderAmount(e.target.value)}
            placeholder="1000"
            className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            min="1"
            step="100"
          />
        </div>

        {sellPrice != null && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              You'll receive: <span className="thunder-gradient font-bold">
                ${(() => {
                  const price = Number(sellPrice.toString());
                  return (price / 1_000_000).toFixed(4);
                })()} USDC
              </span>
            </p>
          </div>
        )}

        {thunderBalance != null && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Your Thunder: <span className="font-bold">
                {(() => {
                  const balance = Number(thunderBalance.toString());
                  return (balance / 1e18).toFixed(0);
                })()} ⚡
              </span>
            </p>
          </div>
        )}

        <button
          onClick={handleSell}
          disabled={!address || isPending || !thunderAmount}
          className="btn-primary w-full text-base"
        >
          {isPending ? '⏳ Processing...' : '💸 Sell Thunder'}
        </button>

        {!address && (
          <p className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Connect wallet to sell Thunder
          </p>
        )}
      </div>
    </div>
  );
}
