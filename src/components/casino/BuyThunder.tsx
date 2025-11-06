'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useSendCalls } from 'wagmi';
import { parseUnits } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';
import USDCABI from '@/lib/abis/USDC.json';
import { encodeApproveUSDC } from '@/lib/encode-calls';

const THUNDER_CONTRACT = '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export function BuyThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  const [step, setStep] = useState<'approve' | 'buy' | 'waiting'>('approve');
  
  const { sendCalls, isPending: isSending } = useSendCalls();
  const { writeContract, isPending: isWritePending } = useWriteContract();

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
      
      if (allowanceBig >= priceBig) {
        setStep('buy');
      } else {
        setStep('approve');
      }
    }
  }, [allowance, buyPrice]);

  const handleApprove = async () => {
    if (!address || !buyPrice) return;

    try {
      const approveData = encodeApproveUSDC();
      
      await sendCalls({
        calls: [
          {
            to: USDC_ADDRESS as `0x${string}`,
            data: approveData,
          },
        ],
      });
      setStep('waiting');
      setTimeout(() => refetchAllowance(), 2000);
    } catch (e) {
      console.log('Batch transaction failed, falling back to regular approve:', e);
      writeContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDCABI,
        functionName: 'approve',
        args: [THUNDER_CONTRACT, parseUnits('1000000', 6)],
      });
    }
  };

  const handleBuy = () => {
    if (!address || !thunderAmount) return;

    writeContract({
      address: THUNDER_CONTRACT as `0x${string}`,
      abi: ThunderABI,
      functionName: 'buy',
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

  const isPending = isSending || isWritePending;

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold thunder-gradient text-center">⚡ Buy Thunder</h2>

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

        {buyPrice != null && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm">Price: ${(Number(buyPrice.toString()) / 1e6).toFixed(2)} USDC</p>
          </div>
        )}

        {step === 'approve' ? (
          <button
            onClick={handleApprove}
            disabled={isPending || !buyPrice}
            className="btn-secondary w-full disabled:opacity-50"
          >
            {isPending ? '⏳ Approving...' : '✅ Approve USDC'}
          </button>
        ) : step === 'waiting' ? (
          <button disabled className="btn-secondary w-full opacity-50">
            ⏳ Waiting for approval...
          </button>
        ) : (
          <button
            onClick={handleBuy}
            disabled={isPending}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isPending ? '⏳ Buying...' : '⚡ Buy Thunder'}
          </button>
        )}

        <p className="text-xs text-center opacity-70">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </div>
  );
}
