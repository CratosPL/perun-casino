'use client';
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

type RiskLevel = 'Klasyczne' | 'Niskie' | 'Średnie' | 'Wysokie';

// ✅ DOKŁADNE PAYOUTS zgodnie z Twoją specyfikacją
const PAYOUT_TABLES: Record<RiskLevel, Record<number, Record<number, number>>> = {
  Klasyczne: {
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
  Niskie: {
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
  Średnie: {
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
  Wysokie: {
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

// ✅ Szanse na trafienia (dla wyjaśnienia pod planszą)
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

export default function KenoGame({
  onPointsChange
}: {
  onPointsChange?: (points: number) => void
}) {
  const [fid, setFid] = useState<number>(0);
  const [points, setPoints] = useState(2500);
  const [loading, setLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [numberOfPicks, setNumberOfPicks] = useState<number>(1);
  const [betAmount, setBetAmount] = useState(10);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Klasyczne');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [isDev, setIsDev] = useState(false);
  const [clientSeed, setClientSeed] = useState<string>('');
  const [serverSeedHash, setServerSeedHash] = useState<string>('');
  const [showProvablyFair, setShowProvablyFair] = useState(false);
  const [showPayoutInfo, setShowPayoutInfo] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoRounds, setAutoRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(0);
  const [animatingNumbers, setAnimatingNumbers] = useState<number[]>([]);

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
    
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < numberOfPicks) {
      setSelectedNumbers([...selectedNumbers, num]);
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

  const handlePlay = async () => {
    if (selectedNumbers.length !== numberOfPicks) {
      alert(`⚠️ Wybierz dokładnie ${numberOfPicks} ${numberOfPicks === 1 ? 'liczbę' : 'liczb'}!`);
      return;
    }
    if (betAmount <= 0) {
      alert('⚠️ Stawka musi być większa niż 0!');
      return;
    }
    if (betAmount > points) {
      alert(`❌ Niewystarczająca ilość punktów!\n\nMasz: ${points} pkt\nStawka: ${betAmount} pkt`);
      return;
    }

    setIsPlaying(true);
    setLastResult(null);
    setAnimatingNumbers([]);

    try {
      if (isDev) {
        await new Promise(r => setTimeout(r, 800));
        const drawnNumbers: number[] = [];
        while (drawnNumbers.length < 10) {
          const n = Math.floor(Math.random() * 40) + 1;
          if (!drawnNumbers.includes(n)) drawnNumbers.push(n);
        }
        
        setAnimatingNumbers(drawnNumbers);
        await new Promise(r => setTimeout(r, 2000));
        
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
        setAnimatingNumbers(data.result.drawnNumbers);
        await new Promise(r => setTimeout(r, 2000));
        
        setPoints(data.newBalance || 0);
        setLastResult({
          ...data.result,
          provablyFair: data.provablyFair
        });
        if (data.provablyFair?.nextServerSeedHash) {
          setServerSeedHash(data.provablyFair.nextServerSeedHash);
        }

        if (data.result.payout > betAmount * 10) {
          sdk.actions.openUrl(
            `https://warpcast.com/~/compose?text=Wygrałem ${data.result.payout.toFixed(2)} punktów w Thunder Keno! 🎰⚡`
          );
        }
      } else {
        alert(data.error || 'Błąd gry');
      }
    } catch (error) {
      alert('Błąd sieci');
    } finally {
      setIsPlaying(false);
      setAnimatingNumbers([]);
    }
  };

  const startAutoPlay = () => {
    if (selectedNumbers.length !== numberOfPicks) {
      alert(`⚠️ Wybierz dokładnie ${numberOfPicks} liczb przed auto-play!`);
      return;
    }
    setAutoPlay(true);
    setCurrentRound(0);
  };

  const stopAutoPlay = () => {
    setAutoPlay(false);
    setCurrentRound(0);
  };

  useEffect(() => {
    if (autoPlay && currentRound < autoRounds && !isPlaying) {
      const timer = setTimeout(() => {
        handlePlay().then(() => {
          setCurrentRound(prev => prev + 1);
        });
      }, 3000);
      return () => clearTimeout(timer);
    } else if (autoPlay && currentRound >= autoRounds) {
      stopAutoPlay();
    }
  }, [autoPlay, currentRound, autoRounds, isPlaying]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin text-4xl mb-4">⚡</div>
        <div>Ładowanie...</div>
      </div>
    );
  }

  const potentialWin = calculatePotentialWin();
  const currentPayoutTable = PAYOUT_TABLES[riskLevel][numberOfPicks];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Settings */}
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold">⚙️ Ustawienia Gry</h2>
            
            {/* Number of picks */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Wybierz ilość liczb: 
                <span className="text-yellow-400 ml-2 text-xl font-bold">{numberOfPicks}</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumberOfPicksChange(num)}
                    disabled={isPlaying}
                    className={`px-3 py-2 rounded-lg font-bold transition-all ${
                      numberOfPicks === num
                        ? 'bg-yellow-500 text-black scale-110 ring-2 ring-yellow-300'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } disabled:opacity-50`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-semibold mb-2">Poziom ryzyka:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Klasyczne', 'Niskie', 'Średnie', 'Wysokie'] as RiskLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level)}
                    disabled={isPlaying}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      riskLevel === level
                        ? 'bg-yellow-500 text-black ring-2 ring-yellow-300'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } disabled:opacity-50`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="block text-sm font-semibold mb-2">Stawka:</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={1}
                max={points}
                disabled={isPlaying}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-lg font-bold"
              />
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[10, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isPlaying || amount > points}
                    className="px-3 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-sm font-semibold disabled:opacity-50"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Info */}
            <div className="p-4 bg-gray-800 rounded-lg border-2 border-gray-700">
              <div className="text-sm text-gray-400 mb-1">
                Wybrane liczby:
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-yellow-400">
                  {selectedNumbers.length} / {numberOfPicks}
                </span>
                {selectedNumbers.length === numberOfPicks && (
                  <span className="text-green-400 text-sm">✓ Gotowe</span>
                )}
              </div>
              <div className="text-sm font-mono min-h-[24px] text-white">
                {selectedNumbers.length > 0 
                  ? selectedNumbers.sort((a, b) => a - b).join(', ') 
                  : `Wybierz ${numberOfPicks} ${numberOfPicks === 1 ? 'liczbę' : 'liczb'}`
                }
              </div>
              <div className="border-t border-gray-700 mt-3 pt-3">
                <div className="text-sm text-gray-400">Maksymalna wygrana:</div>
                <div className="text-3xl font-bold text-yellow-400">
                  {potentialWin.toFixed(2)} pkt
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (maks. mnożnik: {currentPayoutTable ? Math.max(...Object.values(currentPayoutTable)) : 0}x)
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handlePlay}
              disabled={isPlaying || selectedNumbers.length !== numberOfPicks || betAmount > points}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xl rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isPlaying ? '🎲 Losowanie...' : `🎲 GRAJ (${betAmount} pkt)`}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={quickPick}
                disabled={isPlaying}
                className="py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 transition-all"
              >
                ⚡ Szybki wybór
              </button>
              <button
                onClick={clearSelection}
                disabled={isPlaying}
                className="py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold disabled:opacity-50 transition-all"
              >
                🗑️ Wyczyść
              </button>
            </div>

            {/* Auto Play */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <label className="block text-sm font-semibold">🔄 Auto Play</label>
              <input
                type="number"
                value={autoRounds}
                onChange={(e) => setAutoRounds(Number(e.target.value))}
                min={1}
                max={100}
                disabled={autoPlay}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                placeholder="Liczba rund"
              />
              {!autoPlay ? (
                <button
                  onClick={startAutoPlay}
                  disabled={selectedNumbers.length !== numberOfPicks || betAmount > points}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50"
                >
                  ▶️ START AUTO
                </button>
              ) : (
                <button
                  onClick={stopAutoPlay}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                >
                  ⏹️ STOP ({currentRound}/{autoRounds})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center: Game Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">
                ⚡ Thunder Keno
                {isDev && <span className="text-xs ml-2 text-yellow-400">(Dev)</span>}
              </h1>
              <div className="text-2xl font-mono">
                Punkty: <span className="text-yellow-400 font-bold">{points.toFixed(2)}</span>
              </div>
            </div>

            {/* Last Result */}
            {lastResult && (
              <div className={`mb-6 p-6 rounded-lg ${lastResult.payout > 0 ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-red-900 to-red-800'} border-2 ${lastResult.payout > 0 ? 'border-green-500' : 'border-red-500'}`}>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-3">
                    {lastResult.payout > 0 ? '🎉 WYGRANA!' : '😢 Przegrana'}
                  </div>
                  <div className="text-lg mb-2">Trafienia: <span className="font-bold">{lastResult.matches} / {lastResult.numberOfPicks || numberOfPicks}</span></div>
                  <div className="text-lg mb-2">Mnożnik: <span className="font-bold text-yellow-400">{lastResult.multiplier}x</span></div>
                  <div className="text-3xl font-bold mt-3">
                    {lastResult.payout > 0 ? '+' : ''}{lastResult.payout.toFixed(2)} pkt
                  </div>
                  {lastResult.payout === 0 && (
                    <div className="text-sm text-gray-400 mt-2">Spróbuj ponownie!</div>
                  )}
                </div>
              </div>
            )}

            {/* Keno Board - 8x5 (40 pól) */}
            <div className="grid grid-cols-8 gap-2 mb-6">
              {Array.from({ length: 40 }, (_, i) => i + 1).map(num => {
                const isSelected = selectedNumbers.includes(num);
                const isDrawn = animatingNumbers.includes(num) || lastResult?.drawnNumbers?.includes(num);
                const isMatch = isSelected && isDrawn;
                
                return (
                  <button
                    key={num}
                    onClick={() => toggleNumber(num)}
                    disabled={isPlaying || (selectedNumbers.length >= numberOfPicks && !isSelected)}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg font-bold text-lg
                      transition-all duration-200
                      ${isMatch 
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-110 ring-4 ring-green-300 shadow-xl' 
                        : isSelected
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black scale-105 ring-2 ring-yellow-300'
                        : isDrawn
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white ring-2 ring-blue-300'
                        : 'bg-gray-700 hover:bg-gray-600'}
                      ${isPlaying || (selectedNumbers.length >= numberOfPicks && !isSelected)
                        ? 'cursor-not-allowed opacity-50' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'}
                      ${animatingNumbers.includes(num) ? 'animate-pulse' : ''}
                    `}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Drawn Numbers Display */}
            {(lastResult || animatingNumbers.length > 0) && (
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400 mb-3 font-semibold">Wylosowane numery:</div>
                <div className="flex flex-wrap gap-2">
                  {(animatingNumbers.length > 0 ? animatingNumbers : lastResult?.drawnNumbers || []).map((num: number) => {
                    const isMatch = lastResult && lastResult.drawnNumbers.includes(num) && selectedNumbers.includes(num);
                    return (
                      <span
                        key={num}
                        className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg ${
                          isMatch 
                            ? 'bg-green-500 ring-2 ring-green-300' 
                            : 'bg-blue-600'
                        }`}
                      >
                        {num}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

{/* Payout Table - Compact Horizontal (Stake.com style) */}
<div className="glass-card p-4">
  <button
    onClick={() => setShowPayoutInfo(!showPayoutInfo)}
    className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-800 rounded-lg transition-all"
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">📊</span>
      <div>
        <h3 className="text-base font-bold">Tabela Wypłat - {riskLevel}</h3>
        <p className="text-xs text-gray-400">
          {numberOfPicks} {numberOfPicks === 1 ? 'wybór' : 'wyborów'}
          {currentPayoutTable && (
            <span className="ml-2 text-yellow-400">
              Max: {Math.max(...Object.values(currentPayoutTable))}x
            </span>
          )}
        </p>
      </div>
    </div>
    <span className={`text-xl transition-transform duration-300 ${showPayoutInfo ? 'rotate-180' : ''}`}>
      ▼
    </span>
  </button>
  
  {showPayoutInfo && currentPayoutTable && (
    <div className="mt-4 space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar px-1">
      {Object.entries(currentPayoutTable)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([matches, multiplier]) => {
          const probability = HIT_PROBABILITIES[numberOfPicks]?.[Number(matches)] || '?';
          const winAmount = (betAmount * multiplier).toFixed(2);
          const isZero = multiplier === 0;
          
          return (
            <div 
              key={matches} 
              className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                isZero 
                  ? 'bg-gray-900/50 opacity-60 hover:opacity-80' 
                  : 'bg-gray-800/80 hover:bg-gray-700 border border-gray-700 hover:border-yellow-500/30'
              }`}
            >
              {/* Left: Trafienia + Szansa */}
              <div className="flex items-center gap-3 flex-1">
                <div className="text-left min-w-[80px]">
                  <div className={`text-sm font-semibold ${isZero ? 'text-gray-500' : 'text-white'}`}>
                    {matches} {Number(matches) === 1 ? 'trafienie' : 'trafień'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {probability}
                  </div>
                </div>
              </div>
              
              {/* Right: Multiplier + Wygrana */}
              <div className="flex items-center gap-4">
                <div className={`text-lg font-bold ${isZero ? 'text-gray-600' : 'text-yellow-400'}`}>
                  {multiplier}x
                </div>
                <div className="text-right min-w-[80px]">
                  <div className="text-xs text-gray-500">wygrana</div>
                  <div className={`text-sm font-semibold ${isZero ? 'text-gray-600' : 'text-white'}`}>
                    {winAmount} pkt
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  )}
  
  {!showPayoutInfo && (
    <div className="mt-3 text-center">
      <button
        onClick={() => setShowPayoutInfo(true)}
        className="text-xs text-blue-400 hover:underline"
      >
        Kliknij aby zobaczyć szczegóły
      </button>
    </div>
  )}
  
  <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs text-gray-500 text-center">
    💡 Wybierz poziom ryzyka aby zobaczyć różne wypłaty
  </div>
</div>


        </div>
      </div>

      {/* Provably Fair */}
      <div className="mt-6 glass-card p-4">
        <button
          onClick={() => setShowProvablyFair(!showProvablyFair)}
          className="w-full flex items-center justify-between text-left font-semibold"
        >
          <span className="flex items-center gap-2">
            🔒 Provably Fair
            {!isDev && <span className="text-xs text-green-400">Verified</span>}
          </span>
          <span className="text-gray-400">{showProvablyFair ? '▼' : '▶'}</span>
        </button>
        {showProvablyFair && (
          <div className="mt-4 text-sm text-gray-400">
            {isDev ? (
              <p>Provably fair jest dostępny w wersji produkcyjnej.</p>
            ) : (
              <div className="space-y-2">
                <div>Client Seed: <span className="text-yellow-400 font-mono text-xs break-all">{clientSeed}</span></div>
                <div>Server Hash: <span className="text-green-400 font-mono text-xs break-all">{serverSeedHash}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
