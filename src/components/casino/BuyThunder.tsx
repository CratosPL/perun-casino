'use client';
import { useState } from 'react';
import { useAccount, useSendCalls } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';
import USDCABI from '@/lib/abis/USDC.json';
import { CONTRACTS } from '@/lib/contracts';

export function BuyThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  const { sendCalls, isPending: isSending } = useSendCalls();

  const handleApproveAndBuy = async () => {
    if (!address || !thunderAmount) return;
    try {
      // Approve LARGE amount to bypass contract bug
      const approveData = encodeFunctionData({
        abi: USDCABI,
        functionName: 'approve',
        args: [CONTRACTS.THUNDER_BONDING_CURVE, parseUnits('1', 6)], // 1 USDC
      });
      const buyData = encodeFunctionData({
        abi: ThunderABI,
        functionName: 'buy',
        args: [parseUnits(thunderAmount, 18)],
      });
      await sendCalls({ 
        calls: [{to: CONTRACTS.USDC, data: approveData}, {to: CONTRACTS.THUNDER_BONDING_CURVE, data: buyData}],
        account: address,
      });
    } catch (e) {
      console.error('Failed:', e);
    }
  };
  
  if (!isConnected) return <div className="glass-card p-8"><p className="text-center text-sm">🚀 Open in Farcaster</p></div>;

  const estimatedPrice = (Number(thunderAmount) / 1000000).toFixed(6);

  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-3xl font-bold thunder-gradient text-center">⚡ Buy Thunder</h2>
      <input type="number" value={thunderAmount} onChange={(e) => setThunderAmount(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white" min="1" step="100" />
      <div className="p-3 bg-black/40 rounded-lg">
        <p className="text-sm">Est. Cost: $≈{estimatedPrice} USDC for {thunderAmount} Thunder</p>
        <p className="text-xs opacity-70">(1000 Thunder ≈ $0.001)</p>
      </div>
      <button onClick={handleApproveAndBuy} disabled={isSending} className="btn-primary w-full disabled:opacity-50">
        {isSending ? '⏳ Processing...' : '⚡ Approve & Buy Thunder'}
      </button>
      <p className="text-xs text-center opacity-70">{address && `${address.slice(0, 6)}...${address.slice(-4)}`}</p>
    </div>
  ); 
}
