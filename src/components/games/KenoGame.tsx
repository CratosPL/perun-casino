'use client';
import { useState, useEffect, useRef } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

type RiskLevel = 'Classic' | 'Low' | 'Medium' | 'High';

const PAYOUT_TABLES: Record<RiskLevel, Record<number, Record<number, number>>> = {
  Classic: {
    1: { 0: 0, 1: 3.96 },
    2: { 0: 0, 1: 1.90, 2: 4.50 },
    3: { 0: 0, 1: 1, 2: 3.10, 3: 10.4 },
    4: { 0: 0, 1: 0.80, 2: 1.80, 3: 5, 4: 22.50 },
    5: { 0: 0, 1: 0.25, 2: 1.40, 3: 4.10, 4: 16.50, 5: 36 },
    6: { 0: 0, 1: 0, 2: 1, 3: 3.68, 4: 7, 5: 16.50, 6: 40 },
    7: { 0: 0, 1: 0, 2: 0.47, 3: 3, 4: 4.50, 5: 14, 6: 31, 7: 60 },
    8: { 0: 0, 1: 0, 2: 0, 3: 2.20, 4: 4, 5: 13, 6: 22, 7: 55, 8: 70 },
    9: { 0: 0, 1: 0, 2: 0, 3: 1.55, 4: 3, 5: 8, 6: 15, 7: 44, 8: 60, 9: 85 },
    10: { 0: 0, 1: 0, 2: 0, 3: 1.40, 4: 2.25, 5: 4.50, 6: 8, 7: 17, 8: 50, 9: 80, 10: 100 }
  },
  Low: {
    1: { 0: 0.70, 1: 1.85 },
    2: { 0: 0, 1: 2, 2: 3.80 },
    3: { 0: 0, 1: 1.10, 2: 1.38, 3: 26 },
    4: { 0: 0, 1: 0, 2: 2.20, 3: 7.90, 4: 90 },
    5: { 0: 0, 1: 0, 2: 1.50, 3: 4.20, 4: 13, 5: 300 },
    6: { 0: 0, 1: 0, 2: 1.10, 3: 2, 4: 6.20, 5: 110, 6: 700 },
    7: { 0: 0, 1: 0, 2: 1.10, 3: 1.60, 4: 3.50, 5: 15, 6: 225, 7: 700 },
    8: { 0: 0, 1: 0, 2: 1.10, 3: 1.50, 4: 1, 5: 5.50, 6: 39, 7: 100, 8: 800 },
    9: { 0: 0, 1: 0, 2: 1.10, 3: 1.30, 4: 1.70, 5: 2.50, 6: 7.50, 7: 50, 8: 250, 9: 1000 },
    10: { 0: 0, 1: 0, 2: 1.10, 3: 1.20, 4: 1.30, 5: 1.80, 6: 3.50, 7: 13, 8: 50, 9: 250, 10: 1000 }
  },
  Medium: {
    1: { 0: 0.40, 1: 2.75 },
    2: { 0: 0, 1: 2, 2: 5.10 },
    3: { 0: 0, 1: 0, 2: 2.80, 3: 50 },
    4: { 0: 0, 1: 0, 2: 1.70, 3: 10, 4: 100 },
    5: { 0: 0, 1: 0, 2: 1.40, 3: 4, 4: 14, 5: 390 },
    6: { 0: 0, 1: 0, 2: 0, 3: 3, 4: 9, 5: 180, 6: 710 },
    7: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 7, 5: 30, 6: 400, 7: 800 },
    8: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 4, 5: 11, 6: 67, 7: 400, 8: 900 },
    9: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 2.50, 5: 5, 6: 15, 7: 100, 8: 500, 9: 1000 },
    10: { 0: 0, 1: 0, 2: 0, 3: 1.60, 4: 2, 5: 4, 6: 7, 7: 26, 8: 100, 9: 500, 10: 1000 }
  },
  High: {
    1: { 0: 0, 1: 3.96 },
    2: { 0: 0, 1: 0, 2: 17.1 },
    3: { 0: 0, 1: 0, 2: 0, 3: 81.5 },
    4: { 0: 0, 1: 0, 2: 0, 3: 10, 4: 259 },
    5: { 0: 0, 1: 0, 2: 0, 3: 4.50, 4: 48, 5: 450 },
    6: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 11, 5: 350, 6: 710 },
    7: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 7, 5: 90, 6: 400, 7: 800 },
    8: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 5, 5: 20, 6: 270, 7: 600, 8: 900 },
    9: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 4, 5: 11, 6: 56, 7: 500, 8: 800, 9: 1000 },
    10: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 3.50, 5: 8, 6: 13, 7: 63, 8: 500, 9: 800, 10: 1000 }
  }
};

const HIT_PROBABILITIES: Record<number, Record<number, string>> = {
  1: { 0: '75%', 1: '25%' },
  2: { 0: '55.7%', 1: '38.4%', 2: '5.76%' },
  3: { 0: '41%', 1: '44.7%', 2: '13.6%', 3: '1.21%' },
  4: { 0: '30%', 1: '44.4%', 2: '21.4%', 3: '3.93%', 4: '0.22%' },
  5: { 0: '21.65%', 1: '41.64%', 2: '27.76%', 3: '7.933%', 4: '0.958%', 5: '0.0383%' },
  6: { 0: '15.46%', 1: '37.12%', 2: '32.12%', 3: '12.692%', 4: '2.3799%', 5: '0.01969%', 6: '0.00547%' },
  7: { 0: '10.91%', 1: '31.84%', 2: '34.39%', 3: '17.639%', 4: '4.5731%', 5: '0.05879%', 6: '0.03379%', 7: '0.00064365%' },
  8: { 0: '7.61%', 1: '26.47%', 2: '34.74%', 3: '22.236%', 4: '7.483%', 5: '1.3301%', 6: '0.118%', 7: '0.00468%', 8: '0.00005851%' },
  9: { 0: '5.23%', 1: '21.40%', 2: '33.50%', 3: '26.05%', 4: '10.94%', 5: '2.525%', 6: '0.3118%', 7: '0.01909%', 8: '0.0004937%', 9: '0.00000366%' },
  10: { 0: '3.5443%', 1: '16.878%', 2: '31.071%', 3: '28.820%', 4: '14.710%', 5: '4.236%', 6: '0.678%', 7: '0.05747%', 8: '0.002309%', 9: '0.00003539%', 10: '0.00000012%' }
};

export default function KenoGame({ onPointsChange }: { onPointsChange?: (points: number) => void }) {
  const [fid, setFid] = useState<number>(0);
  const [points, setPoints] = useState(2500);
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [numberOfPicks, setNumberOfPicks] = useState<number>(1);
  const [betAmount, setBetAmount] = useState(10);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Classic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [isDev, setIsDev] = useState(false);
  const [clientSeed, setClientSeed] = useState<string>('');
  const [serverSeedHash, setServerSeedHash] = useState<string>('');
  const [showProvablyFair, setShowProvablyFair] = useState(false);
  const [showPayoutInfo, setShowPayoutInfo] = useState(false);
  
  const [revealedNumbers, setRevealedNumbers] = useState<number[]>([]);
  const [currentlyDrawing, setCurrentlyDrawing] = useState<number | null>(null);
  const lastClickTime = useRef<number>(0);

  useEffect(() => {
    if (onPointsChange) onPointsChange(points);
  }, [points, onPointsChange]);

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        if (context?.user?.fid) {
          setFid(context.user.fid);
          setIsDev(false);
          try {
            const res = await fetch(`/api/user/${context.user.fid}`);
            if (res.ok) {
              const data = await res.json();
              setPoints(data.points || 2500);
            }
          } catch (error) {
            console.error('Failed to fetch points:', error);
          }
        } else throw new Error('No Farcaster user context');
      } catch {
        setIsDev(true);
        setFid(999999);
        const saved = localStorage.getItem('dev_points');
        setPoints(saved ? parseFloat(saved) : 2500);
      } finally {
        setLoading(false);
      }
    };
    init();
    generateNewClientSeed();
  }, []);

  useEffect(() => {
    if (isDev && !loading) {
      localStorage.setItem('dev_points', points.toString());
    }
  }, [points, isDev, loading]);

  useEffect(() => {
    if (lastResult && !isPlaying) {
      const timer = setTimeout(() => setLastResult(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastResult, isPlaying]);

  const generateNewClientSeed = () => {
    const seed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    setClientSeed(seed);
  };

  const handleNumberOfPicksChange = (num: number) => {
    setNumberOfPicks(num);
    setSelectedNumbers([]);
  };

  const toggleNumber = (num: number) => {
    if (isPlaying) return;
    
    const now = Date.now();
    if (now - lastClickTime.current < 150) return;
    lastClickTime.current = now;
    
    if (selectedNumbers.includes(num)) {
      return;
    } else if (selectedNumbers.length < numberOfPicks) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const deselectNumber = (num: number) => {
    if (!isPlaying) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    }
  };

  const quickPick = () => {
    if (isPlaying) return;
    const picked: number[] = [];
    while (picked.length < numberOfPicks) {
      const n = Math.floor(Math.random() * 40) + 1;
      if (!picked.includes(n)) picked.push(n);
    }
    setSelectedNumbers(picked);
  };

  const clearSelection = () => {
    if (!isPlaying) setSelectedNumbers([]);
  };

  const calculatePotentialWin = () => {
    if (selectedNumbers.length === 0) return 0;
    const payoutTable = PAYOUT_TABLES[riskLevel][numberOfPicks];
    if (!payoutTable) return 0;
    const maxMultiplier = Math.max(...Object.values(payoutTable));
    return betAmount * maxMultiplier;
  };

  // ✅ UPROSZCZONA ANIMACJA - Stake-style (bez flickeringu)
  const animateDrawnNumbers = async (drawnNumbers: number[]) => {
    // ⚙️ USTAWIENIA CZASU (dostosuj tutaj)
    const FLASH_DURATION = 100;        // Czas błysku liczby
    const NORMAL_PAUSE = 80;          // Pauza między liczbami
    const HIT_PAUSE = 0;             // Pauza po trafieniu
    const FINAL_PAUSE = 300;           // Pauza przed wynikiem
    
    setRevealedNumbers([]);
    setCurrentlyDrawing(null);
    
    const localRevealed: number[] = [];
    
    for (let i = 0; i < drawnNumbers.length; i++) {
      const currentNum = drawnNumbers[i];
      
      // Podświetl aktualnie losowaną liczbę
      setCurrentlyDrawing(currentNum);
      await new Promise(resolve => setTimeout(resolve, FLASH_DURATION));
      
      // Dodaj do wylosowanych
      localRevealed.push(currentNum);
      setRevealedNumbers([...localRevealed]);
      setCurrentlyDrawing(null);
      
      // Pauza (dłuższa przy trafieniu)
      const isMatch = selectedNumbers.includes(currentNum);
      const pauseDuration = isMatch ? HIT_PAUSE : NORMAL_PAUSE;
      
      await new Promise(resolve => setTimeout(resolve, pauseDuration));
    }
    
    // Finalna pauza przed pokazaniem wyniku
    await new Promise(resolve => setTimeout(resolve, FINAL_PAUSE));
  };

  const handlePlay = async () => {
    if (selectedNumbers.length !== numberOfPicks) {
      alert(`⚠️ Select exactly ${numberOfPicks} number${numberOfPicks === 1 ? '' : 's'}!`);
      return;
    }
    if (betAmount <= 0) {
      alert('⚠️ Bet must be greater than 0!');
      return;
    }
    if (betAmount > points) {
      alert(`❌ Insufficient points!\n\nYou have: ${points} pts\nBet: ${betAmount} pts`);
      return;
    }

    setIsPlaying(true);
    setLastResult(null);
    setRevealedNumbers([]);
    setCurrentlyDrawing(null);

    try {
      if (isDev) {
        await new Promise(r => setTimeout(r, 300));
        const drawnNumbers: number[] = [];
        while (drawnNumbers.length < 10) {
          const n = Math.floor(Math.random() * 40) + 1;
          if (!drawnNumbers.includes(n)) drawnNumbers.push(n);
        }
        
        await animateDrawnNumbers(drawnNumbers);
        
        const matches = selectedNumbers.filter(n => drawnNumbers.includes(n)).length;
        const payoutTable = PAYOUT_TABLES[riskLevel][numberOfPicks];
        const multiplier = payoutTable?.[matches] || 0;
        const payout = betAmount * multiplier;
        const newPoints = points - betAmount + payout;
        
        setPoints(newPoints);
        setLastResult({ drawnNumbers, matches, multiplier, payout, numberOfPicks });
        setIsPlaying(false);
        return;
      }

      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          gameType: 'keno',
          betAmount,
          selectedNumbers,
          clientSeed,
          riskLevel,
          numberOfPicks
        })
      });

      const data = await response.json();

      if (data.success) {
        await animateDrawnNumbers(data.result.drawnNumbers);
        
        setPoints(data.newBalance || 0);
        setLastResult({
          ...data.result,
          provablyFair: data.provablyFair
        });
        if (data.provablyFair?.nextServerSeedHash) {
          setServerSeedHash(data.provablyFair.nextServerSeedHash);
        }
      } else {
        alert(data.error || 'Game error');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin text-4xl mb-4">⚡</div>
        <div>Loading...</div>
      </div>
    );
  }

  const potentialWin = calculatePotentialWin();
  const currentPayoutTable = PAYOUT_TABLES[riskLevel][numberOfPicks];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="glass-card p-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="thunder-gradient">⚡ Thunder Keno</span>
              {isDev && <span className="text-xs ml-2 text-yellow-400">(Dev)</span>}
            </h1>
            <div className="text-xl font-mono">
              Points: <span className="text-yellow-400 font-bold">{points.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card p-3">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs font-semibold mb-1">Pick Numbers:</label>
              <div className="flex gap-1 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumberOfPicksChange(num)}
                    disabled={isPlaying}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      numberOfPicks === num ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
                    } disabled:opacity-50`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Risk:</label>
              <div className="grid grid-cols-2 gap-1">
                {(['Classic', 'Low', 'Medium', 'High'] as RiskLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level)}
                    disabled={isPlaying}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                      riskLevel === level ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
                    } disabled:opacity-50`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Bet Amount:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={1}
                max={points}
                disabled={isPlaying}
                className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm font-bold"
              />
              {[10, 50, 100, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={isPlaying || amount > points}
                  className="px-2 py-2 bg-gray-600 rounded hover:bg-gray-500 text-xs font-semibold disabled:opacity-50"
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs bg-gray-800 rounded p-2">
            <div>Selected: <span className="font-bold text-yellow-400">{selectedNumbers.length}/{numberOfPicks}</span></div>
            <div>Max Win: <span className="font-bold text-yellow-400">{potentialWin.toFixed(0)} pts</span></div>
          </div>
        </div>

        {/* Selected Numbers */}
        {selectedNumbers.length > 0 && !isPlaying && (
          <div className="glass-card p-3">
            <div className="text-xs text-gray-400 mb-2">Your Numbers (click X to remove):</div>
            <div className="flex flex-wrap gap-2">
              {selectedNumbers.map(num => (
                <button
                  key={num}
                  onClick={() => deselectNumber(num)}
                  className="group relative w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm bg-gradient-to-br from-yellow-400 to-yellow-600 text-black hover:opacity-80 transition-all"
                >
                  {num}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    ×
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keno Board */}
        <div className="glass-card p-3 relative">
          {/* ✅ NOWY: Overlay u góry, nie zasłania planszy */}
{/* ✅ WYCENTROWANY OVERLAY - w środku, kompaktowy */}
{lastResult && (
  <div 
    className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg cursor-pointer"
    onClick={() => setLastResult(null)}
  >
    <div 
className={`p-6 rounded-xl max-w-md w-full mx-4 backdrop-blur-sm border-2 shadow-2xl ${
  lastResult.payout > 0 
    ? 'bg-green-900/30 border-green-500/40' 
    : 'bg-gray-900/30 border-gray-600/40'
}`}

      onClick={(e) => e.stopPropagation()}
    >
      {/* Emoji i Status */}
      <div className="text-center mb-4">
        <div className="text-6xl mb-2">
          {lastResult.payout > 0 ? '🎉' : '😢'}
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {lastResult.payout > 0 ? 'WIN!' : 'Loss'}
        </div>
      </div>
      
      {/* Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-base text-white/90">
          <span>Matches:</span>
          <span className="font-bold text-xl">
            {lastResult.matches}/{lastResult.numberOfPicks || numberOfPicks}
          </span>
        </div>
        <div className="flex justify-between items-center text-base text-white/90">
          <span>Multiplier:</span>
          <span className="font-bold text-xl text-yellow-300">
            {lastResult.multiplier}x
          </span>
        </div>
      </div>
      
      {/* Payout */}
      <div className="border-t border-white/20 pt-4 mb-4">
        <div className="text-center">
          <div className={`text-5xl font-bold ${
            lastResult.payout > 0 ? 'text-green-300' : 'text-gray-300'
          }`}>
            {lastResult.payout > 0 ? '+' : ''}{lastResult.payout.toFixed(0)}
          </div>
          <div className="text-sm text-white/60 mt-1">points</div>
        </div>
      </div>
      
      {/* Close button */}
      <button 
        onClick={() => setLastResult(null)}
        className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-all"
      >
        Continue
      </button>
      
      <div className="mt-2 text-xs text-white/40 text-center animate-pulse">
        or click anywhere to dismiss
      </div>
    </div>
  </div>
)}


          {/* ✅ POPRAWIONE KOLORY - stonowane */}
{/* ✅ POPRAWIONE KOLORY - wylosowane liczby bardziej widoczne */}
<div className="grid grid-cols-8 gap-1.5 mb-3">
  {Array.from({ length: 40 }, (_, i) => i + 1).map(num => {
    const isSelected = selectedNumbers.includes(num);
    const isRevealed = revealedNumbers.includes(num);
    const isCurrentlyDrawing = currentlyDrawing === num;
    const isMatch = isSelected && isRevealed;
    
    return (
      <button
        key={num}
        onClick={() => toggleNumber(num)}
        disabled={isPlaying || (selectedNumbers.length >= numberOfPicks && !isSelected)}
        className={`
          aspect-square flex items-center justify-center rounded-lg font-bold text-sm
          transition-all duration-200 relative overflow-hidden
          ${isMatch 
            ? 'bg-gradient-to-br from-green-500 to-green-700 text-white scale-110 ring-2 ring-green-400 shadow-lg shadow-green-500/50 animate-pulse-glow' 
            : isCurrentlyDrawing
            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white scale-105 ring-2 ring-orange-400 shadow-lg'
            : isSelected
            ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white scale-105 ring-1 ring-amber-500'
            : isRevealed
            ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white ring-2 ring-blue-300 shadow-md'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 active:scale-95'}
          ${isPlaying || (selectedNumbers.length >= numberOfPicks && !isSelected)
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer'}
        `}
      >
        {num}
        {isMatch && (
          <span className="absolute inset-0 rounded-lg bg-green-400/20 blur-md animate-pulse"></span>
        )}
      </button>
    );
  })}
</div>


          {/* ✅ STONOWANE KOLORY - Live Drawing */}
          {(revealedNumbers.length > 0 || isPlaying) && (
            <div className="p-3 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-lg border border-gray-600/30 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  🎲 Drawing... 
                  <span className="text-amber-400 font-mono text-base">
                    {revealedNumbers.length}/10
                  </span>
                </span>
                {isPlaying && (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              
              <div className="w-full h-1 bg-gray-700 rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-slate-500 to-slate-600 transition-all duration-300 rounded-full"
                  style={{ width: `${(revealedNumbers.length / 10) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {revealedNumbers.map((num, index) => {
                  const isMatch = selectedNumbers.includes(num);
                  const isLast = index === revealedNumbers.length - 1;
                  return (
                    <div
                      key={`${num}-${index}`}
                      className={`
                        w-12 h-12 flex items-center justify-center rounded-full font-bold text-sm relative
                        ${isMatch 
                          ? 'bg-gradient-to-br from-green-500 to-green-700 ring-2 ring-green-400 shadow-lg shadow-green-500/50' 
                          : 'bg-gradient-to-br from-slate-600 to-slate-700'}
                        text-white
                        ${isLast ? 'animate-bounce' : 'animate-scale-in'}
                      `}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {num}
                      {isMatch && (
                        <span className="absolute -top-1 -right-1 text-lg animate-bounce">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {isPlaying && revealedNumbers.length > 0 && (
                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-400">Current Matches: </span>
                  <span className="text-lg font-bold text-green-400">
                    {selectedNumbers.filter(n => revealedNumbers.includes(n)).length}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="glass-card p-3 space-y-2">
          <button
            onClick={handlePlay}
            disabled={isPlaying || selectedNumbers.length !== numberOfPicks || betAmount > points}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isPlaying ? '🎲 Drawing...' : `🎲 PLAY (${betAmount} pts)`}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={quickPick}
              disabled={isPlaying}
              className="py-2 bg-blue-600 active:bg-blue-700 rounded font-semibold text-sm disabled:opacity-50 transition-all"
            >
              ⚡ Auto Pick
            </button>
            <button
              onClick={clearSelection}
              disabled={isPlaying}
              className="py-2 bg-red-600 active:bg-red-700 rounded font-semibold text-sm disabled:opacity-50 transition-all"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Payout Table */}
        <div className="glass-card p-3">
          <button
            onClick={() => setShowPayoutInfo(!showPayoutInfo)}
            className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-800 rounded transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <div>
                <h3 className="text-sm font-bold">Payout Table - {riskLevel}</h3>
                <p className="text-xs text-gray-400">
                  {numberOfPicks} pick{numberOfPicks === 1 ? '' : 's'}
                  {currentPayoutTable && (
                    <span className="ml-2 text-yellow-400">
                      Max: {Math.max(...Object.values(currentPayoutTable))}x
                    </span>
                  )}
                </p>
              </div>
            </div>
            <span className={`text-lg transition-transform duration-300 ${showPayoutInfo ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showPayoutInfo && currentPayoutTable && (
            <div className="mt-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              {Object.entries(currentPayoutTable)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([matches, multiplier]) => {
                  const probability = HIT_PROBABILITIES[numberOfPicks]?.[Number(matches)] || '?';
                  const winAmount = (betAmount * multiplier).toFixed(0);
                  const isZero = multiplier === 0;
                  const isActive = lastResult?.matches === Number(matches);
                  
                  return (
                    <div 
                      key={matches} 
                      className={`flex items-center justify-between p-2 rounded transition-all text-xs ${
                        isActive 
                          ? 'bg-green-900/40 border border-green-500' 
                          : isZero 
                          ? 'bg-gray-900/50 opacity-50' 
                          : 'bg-gray-800/80 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div>
                          <div className={`font-semibold ${isZero ? 'text-gray-500' : 'text-white'}`}>
                            {matches} hit{Number(matches) === 1 ? '' : 's'}
                          </div>
                          <div className="text-gray-500 text-xs">{probability}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`font-bold ${isZero ? 'text-gray-600' : 'text-yellow-400'}`}>
                          {multiplier}x
                        </div>
                        <div className="text-right min-w-[60px]">
                          <div className={`font-semibold ${isZero ? 'text-gray-600' : 'text-white'}`}>
                            {winAmount} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
          
          <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs text-gray-500 text-center">
            💡 Change risk level to see different payouts
          </div>
        </div>

        {/* Provably Fair */}
        <div className="glass-card p-3">
          <button
            onClick={() => setShowProvablyFair(!showProvablyFair)}
            className="w-full flex items-center justify-between text-left text-sm"
          >
            <span className="flex items-center gap-2">
              🔒 Provably Fair
              {!isDev && <span className="text-xs text-green-400">✓</span>}
            </span>
            <span>{showProvablyFair ? '▼' : '▶'}</span>
          </button>
          {showProvablyFair && (
            <div className="mt-2 text-xs text-gray-400 space-y-1">
              {isDev ? (
                <p>Available in production version</p>
              ) : (
                <>
                  <div>Client: <span className="text-yellow-400 font-mono text-xs">{clientSeed?.slice(0, 20)}...</span></div>
                  <div>Hash: <span className="text-green-400 font-mono text-xs">{serverSeedHash?.slice(0, 20)}...</span></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
