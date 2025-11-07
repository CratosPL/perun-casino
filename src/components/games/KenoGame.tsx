'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useSendCalls } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import GameRewardsABI from '@/lib/abis/GameRewards.json';
import { CONTRACTS } from '@/lib/contracts';

export function KenoGame() {
  const { address, isConnected } = useAccount();
  const { sendCalls, isPending: isSending } = useSendCalls();
  
  const [depositAmount, setDepositAmount] = useState('100');
  const [gameActive, setGameActive] = useState(false);
  const [gameBalance, setGameBalance] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [result, setResult] = useState<{ matched: number; payout: number } | null>(null);
  
  // ✅ Odczytaj gameBalance z blockchain'u
  const { data: blockchainBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.GAME_REWARDS,
    abi: GameRewardsABI,
    functionName: 'gameBalance',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const handleDeposit = async () => {
    if (!address || !depositAmount) return;
    
    try {
      const amount = parseUnits(depositAmount, 18);
      
      const depositData = encodeFunctionData({
        abi: GameRewardsABI,
        functionName: 'depositThunderForGaming',
        args: [amount],
      });
      
      await sendCalls({
        calls: [
          {
            to: CONTRACTS.GAME_REWARDS,
            data: depositData,
          },
        ],
        account: address,
      });
      
      // ✅ Czekaj i odśwież balance
      setTimeout(() => {
        refetchBalance();
        setGameBalance(Number(depositAmount));
        setGameActive(true);
      }, 2000);
    } catch (e) {
      console.error('Deposit failed:', e);
    }
  };
  
  const playKeno = () => {
    // ✅ Sprawdź czy ma Thunder
    if (selectedNumbers.length === 0 || gameBalance < 10) {
      alert('Select numbers and have enough balance!');
      return;
    }
    
    const drawn: number[] = [];
    while (drawn.length < 20) {
      const num = Math.floor(Math.random() * 80) + 1;
      if (!drawn.includes(num)) drawn.push(num);
    }
    
    const matched = selectedNumbers.filter(n => drawn.includes(n)).length;
    const multiplier = matched === 0 ? 0 : matched === 1 ? 1 : matched === 2 ? 2 : matched === 3 ? 5 : 10;
    const payout = 10 * multiplier;
    
    setGameBalance(gameBalance + (payout - 10));
    setResult({ matched, payout });
    setSelectedNumbers([]);
  };
  
  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };
  
  const handleWithdraw = async () => {
    if (!address || gameBalance === 0) return;
    
    try {
      const mockSignature = '0x' + '00'.repeat(65);
      const finalBalance = parseUnits(gameBalance.toString(), 18);
      
      const withdrawData = encodeFunctionData({
        abi: GameRewardsABI,
        functionName: 'withdrawFromGame',
        args: [finalBalance, mockSignature],
      });
      
      await sendCalls({
        calls: [
          {
            to: CONTRACTS.GAME_REWARDS,
            data: withdrawData,
          },
        ],
        account: address,
      });
      
      setGameActive(false);
      setGameBalance(0);
    } catch (e) {
      console.error('Withdraw failed:', e);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="glass-card p-8">
        <p className="text-center text-sm">🚀 Open in Farcaster to connect</p>
      </div>
    );
  }
  
  // ✅ Sprawdzenie: czy ma zdeponowany Thunder?
  const hasDeposit = blockchainBalance && blockchainBalance > 0n;
  
  if (!gameActive && !hasDeposit) {
    return (
      <div className="glass-card p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">🎰 KENO</h2>
        <div>
          <label className="text-sm opacity-70">Deposit Thunder to Play</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white"
            min="1"
            step="10"
          />
        </div>
        <button
          onClick={handleDeposit}
          disabled={isSending}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold disabled:opacity-50"
        >
          {isSending ? '⏳ Processing...' : '💳 Deposit & Play'}
        </button>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🎰 KENO</h2>
        <div className="text-right">
          <p className="text-sm opacity-70">Balance</p>
          <p className="text-xl font-bold">{gameBalance} ⚡</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm opacity-70 mb-3">Select 1-10 numbers</p>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              className={`py-2 rounded text-xs font-bold transition ${
                selectedNumbers.includes(num)
                  ? 'bg-purple-600 text-white'
                  : 'bg-black/40 border border-purple-500/30 hover:border-purple-500/60'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      
      {result && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm">Matched: {result.matched} numbers</p>
          <p className="text-lg font-bold text-green-400">+{result.payout} ⚡</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={playKeno}
          disabled={selectedNumbers.length === 0 || gameBalance < 10}
          className="py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold disabled:opacity-50"
        >
          🎲 Play (10⚡)
        </button>
        <button
          onClick={handleWithdraw}
          disabled={isSending}
          className="py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold disabled:opacity-50"
        >
          {isSending ? '⏳ ...' : '💰 Withdraw'}
        </button>
      </div>
      
      <p className="text-xs text-center opacity-50">
        Selected: {selectedNumbers.length}/10
      </p>
    </div>
  );
}
