'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import { sdk } from '@farcaster/miniapp-sdk';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';
import USDCABI from '@/lib/abis/USDC.json';

const THUNDER_CONTRACT = '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export function BuyThunder() {
  const { address, isConnected } = useAccount();
  const [thunderAmount, setThunderAmount] = useState('1000');
  const [step, setStep] = useState<'approve' | 'buy'>('approve');
  const [loading, setLoading] = useState(false);
  
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
    
    setLoading(true);
    try {
      const ethProvider = await sdk.wallet.getEthereumProvider();
      
      if (!ethProvider) {
        alert('Ethereum provider not available');
        return;
      }

      const data = encodeFunctionData({
        abi: USDCABI,
        functionName: 'approve',
        args: [THUNDER_CONTRACT, parseUnits('1000000', 6)],
      });

      const txHash = await ethProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: USDC_ADDRESS,
          data,
        }],
      });

      console.log('Approve tx:', txHash);
      alert('Approval sent!');

      setTimeout(() => refetchAllowance(), 3000);
    } catch (error: any) {
      console.error('Approve error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!address || !thunderAmount) return;
    
    setLoading(true);
    try {
      const ethProvider = await sdk.wallet.getEthereumProvider();
      
      if (!ethProvider) {
        alert('Ethereum provider not available');
        return;
      }

      const data = encodeFunctionData({
        abi: ThunderABI,
        functionName: 'buy',
        args: [parseUnits(thunderAmount, 18)],
      });

      const txHash = await ethProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: THUNDER_CONTRACT,
          data,
        }],
      });

      console.log('Buy tx:', txHash);
      alert('Purchase successful!');
      setThunderAmount('1000');
    } catch (error: any) {
      console.error('Buy error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
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
        <input
          type="number"
          value={thunderAmount}
          onChange={(e) => setThunderAmount(e.target.value)}
          placeholder="1000"
          className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg"
          min="1"
          step="100"
        />

        {buyPrice != null && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm">Price: ${(Number(buyPrice.toString()) / 1e18).toFixed(6)} USDC</p>
          </div>
        )}

        {step === 'approve' ? (
          <button
            onClick={handleApprove}
            disabled={loading}
            className="btn-secondary w-full"
          >
            {loading ? '⏳ Approving...' : '✅ Approve USDC'}
          </button>
        ) : (
          <button
            onClick={handleBuy}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '⏳ Buying...' : '⚡ Buy Thunder'}
          </button>
        )}

        <p className="text-xs text-center">Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
      </div>
    </div>
  );
}
