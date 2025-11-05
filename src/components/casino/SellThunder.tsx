'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@/lib/minikit-provider';
import sdk from '@farcaster/frame-sdk';
import { parseUnits, encodeFunctionData, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import ThunderABI from '@/lib/abis/ThunderBondingCurve.json';

const THUNDER_CONTRACT = '0xEC072aC80854A3477b447f895A9A32157589EA26';

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export function SellThunder() {
  const { isSDKLoaded, context } = useMiniKit();
  const [thunderAmount, setThunderAmount] = useState('1000');
  const [sellPrice, setSellPrice] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const address = context?.user?.custody;

  // Pobierz cenę sprzedaży
  useEffect(() => {
    if (!thunderAmount) return;

    const fetchPrice = async () => {
      try {
        const price = await publicClient.readContract({
          address: THUNDER_CONTRACT as `0x${string}`,
          abi: ThunderABI,
          functionName: 'getSellPrice',
          args: [parseUnits(thunderAmount, 18)],
        });
        
        const priceInUSDC = (Number(price.toString()) / 1_000_000).toFixed(4);
        setSellPrice(priceInUSDC);
      } catch (error) {
        console.error('Error fetching sell price:', error);
      }
    };

    fetchPrice();
  }, [thunderAmount]);

  // Pobierz balans Thunder
  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      try {
        const bal = await publicClient.readContract({
          address: THUNDER_CONTRACT as `0x${string}`,
          abi: ThunderABI,
          functionName: 'balanceOf',
          args: [address],
        });
        
        const balanceFormatted = (Number(bal.toString()) / 1e18).toFixed(0);
        setBalance(balanceFormatted);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [address]);

  const handleSell = async () => {
    if (!address || !thunderAmount || !isSDKLoaded) return;
    
    setLoading(true);
    try {
      const data = encodeFunctionData({
        abi: ThunderABI,
        functionName: 'sell',
        args: [parseUnits(thunderAmount, 18)],
      });

      await sdk.wallet.sendTransaction({
        to: THUNDER_CONTRACT,
        value: '0',
        data,
      });

      alert('Thunder sold! 💸');
      setThunderAmount('1000');

      // Odśwież balance
      setTimeout(async () => {
        const newBal = await publicClient.readContract({
          address: THUNDER_CONTRACT as `0x${string}`,
          abi: ThunderABI,
          functionName: 'balanceOf',
          args: [address],
        });
        setBalance((Number(newBal.toString()) / 1e18).toFixed(0));
      }, 3000);

    } catch (error) {
      console.error('Sell error:', error);
      alert('Sale failed!');
    } finally {
      setLoading(false);
    }
  };

  if (!isSDKLoaded) {
    return (
      <div className="glass-card p-8">
        <p className="text-center">⏳ Loading...</p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="glass-card p-8">
        <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          🚀 Open in Farcaster to sell Thunder
        </p>
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
            placeholder="1000"
            className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
            min="1"
            step="100"
          />
        </div>

        {sellPrice && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              You'll receive: <span className="thunder-gradient font-bold">
                ${sellPrice} USDC
              </span>
            </p>
          </div>
        )}

        {balance && (
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Your Thunder: <span className="font-bold">
                {balance} ⚡
              </span>
            </p>
          </div>
        )}

        <button
          onClick={handleSell}
          disabled={loading || !thunderAmount}
          className="btn-primary w-full text-base"
        >
          {loading ? '⏳ Processing...' : '💸 Sell Thunder'}
        </button>
      </div>
    </div>
  );
}
