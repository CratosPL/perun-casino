'use client';

import { useState } from 'react';

function calculateDailyBonus(streak: number): number {
  const baseBonus = 100;
  const bonusPerDay = 20;
  const maxBonus = 300;

  const bonus = baseBonus + (streak - 1) * bonusPerDay;
  return Math.min(bonus, maxBonus);
}

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

  const handleClaim = async () => {
    setClaiming(true);
    setMessage('');

    try {
      const res = await fetch('/api/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid })
      });

      const data = await res.json();

      if (data.success) {
        const bonusAmount = data.bonus;
        const newBalance = data.newBalance;
        
        setMessage(`🎁 Claimed ${bonusAmount} points! Streak: ${data.streak} days`);
        setShowToast(true);
        
        setTimeout(() => setShowToast(false), 3000);
        
        if (onClaimed) {
          onClaimed(bonusAmount, newBalance);
        }
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

  // ✅ UŻYWAJ NOWEJ FUNKCJI zamiast prostego obliczenia
  const estimatedBonus = streak > 0 ? calculateDailyBonus(streak) : 100;

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
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Claim your free points every 24 hours
          </p>
        </div>

        <div className="text-4xl font-bold thunder-gradient">
          +{estimatedBonus} pts
        </div>

        {streak > 0 && (
          <div className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            🔥 Current streak: {streak} days
          </div>
        )}

        {streak === 7 && (
          <div className="text-sm font-semibold text-yellow-400 animate-pulse">
            🎉 7-day streak bonus: +500 pts!
          </div>
        )}

        {streak === 30 && (
          <div className="text-sm font-semibold text-yellow-400 animate-pulse">
            🏆 30-day streak mega bonus: +1500 pts!
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={claiming}
          className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {claiming ? 'Claiming...' : 'Claim Now'}
        </button>

        <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          New players start with 2500 pts<br />
          Base: 100 pts + Streak: {streak > 0 ? (streak - 1) * 20 : 0} pts (max 300 pts/day)
        </div>
      </div>
    </>
  );
}
