'use client';
import { useState, useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

const PAYMENT_WALLET = '0xC950198D7fB2532BF9325Ef0d5bE82E5d555055C';
const QUICK_CLAIM_AMOUNT = '0.00001'; // ~$0.03 (lepiej widoczne)

export default function DailyBonus({ 
  fid, 
  streak = 0,
  onClaimed 
}: { 
  fid: number; 
  streak?: number;
  onClaimed?: (bonus: number, newBalance: number) => void;
}) {
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const { sendTransaction, data: txHash } = useSendTransaction();
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const handleFreeClaim = async () => {
    setClaiming(true);
    
    try {
      const res = await fetch('/api/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid })
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`🎁 Claimed ${data.bonus} points! Streak: ${data.streak} days`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        if (onClaimed) onClaimed(data.bonus, data.newBalance);
      } else {
        setMessage(`❌ ${data.error}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      setMessage('❌ Network error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setClaiming(false);
    }
  };

  const handleQuickClaim = async () => {
    setClaiming(true);
    
    try {
      sendTransaction({
        to: PAYMENT_WALLET,
        value: parseEther(QUICK_CLAIM_AMOUNT)
      });
    } catch (error) {
      setMessage('❌ Payment failed');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setClaiming(false);
    }
  };

  useEffect(() => {
    if (txConfirmed && txHash) {
      (async () => {
        const res = await fetch('/api/claim-paid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fid, txHash })
        });

        const data = await res.json();

        if (data.success) {
          setMessage(`⚡ Quick claim! +${data.bonus} points`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          
          if (onClaimed) onClaimed(data.bonus, data.newBalance);
        }
        
        setClaiming(false);
      })();
    }
  }, [txConfirmed, txHash, fid, onClaimed]);

  return (
    <>
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className={`glass-card px-6 py-4 ${
            message.includes('❌') ? 'border-red-500' : 'border-green-500'
          }`}>
            <div className="text-center font-semibold">{message}</div>
          </div>
        </div>
      )}

      <div className="glass-card p-8 text-center space-y-6">
        <div className="text-6xl mb-4">🎁</div>
        
        <div>
          <h3 className="text-2xl font-bold mb-2">Daily Bonus</h3>
          <p className="text-sm text-gray-400">
            Choose your claim method
          </p>
        </div>

        {/* FREE option */}
        <div className="border border-gray-600 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            +100 pts
          </div>
          <button
            onClick={handleFreeClaim}
            disabled={claiming}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
          >
            {claiming ? 'Claiming...' : 'Free Claim (24h cooldown)'}
          </button>
        </div>

        {/* PAID option */}
        <div className="border border-yellow-500 rounded-lg p-4 bg-yellow-500/10">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            +200 pts ⚡
          </div>
          
          {/* ✅ NOWE: Szczegóły płatności */}
          <div className="bg-black/20 rounded-lg p-3 mb-3 text-xs space-y-1">
            <div className="flex justify-between text-gray-300">
              <span>Payment:</span>
              <span>0.00001 ETH (~$0.03)</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Gas fee:</span>
              <span>~0.00001 ETH (~$0.03)</span>
            </div>
            <div className="border-t border-gray-600 pt-1 mt-1"></div>
            <div className="flex justify-between text-white font-semibold">
              <span>Total:</span>
              <span>~$0.06</span>
            </div>
          </div>
          
          <button
            onClick={handleQuickClaim}
            disabled={claiming}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:scale-105 disabled:opacity-50 transition-all"
          >
            {claiming ? 'Processing...' : `Quick Claim`}
          </button>
          
          {/* ✅ NOWE: Info o dobrowolności */}
          <div className="mt-3 text-xs text-gray-400 space-y-1">
            <p>✓ Instant, no cooldown</p>
            <p>✓ Optional micro-transaction</p>
            <p className="text-gray-500">Voluntary payment • Entertainment only</p>
          </div>
        </div>

        {streak > 0 && (
          <div className="text-sm text-gray-400">
            🔥 Current streak: {streak} days
          </div>
        )}
        
        {/* ✅ NOWE: Disclaimer na dole */}
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          Points are for entertainment purposes only and have no monetary value.
          All transactions are voluntary. Must be 18+.
        </div>
      </div>
    </>
  );
}
