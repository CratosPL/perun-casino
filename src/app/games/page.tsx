'use client';

import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GamesPage() {
  const [playerCounts, setPlayerCounts] = useState<Record<string, number>>({});

  // ✅ Opcjonalnie: Pobierz rzeczywiste liczby graczy z API
  useEffect(() => {
    // Możesz dodać endpoint /api/stats/players który zwraca aktywnych graczy
    // fetch('/api/stats/players')
    //   .then(res => res.json())
    //   .then(data => setPlayerCounts(data))
    //   .catch(console.error);
  }, []);

  const games = [
    {
      id: 'keno',
      name: 'Thunder Keno',
      icon: '🎲',
      description: 'Pick up to 10 numbers and win big multipliers',
      minBet: 10,
      maxPayout: '1,000x', // ✅ POPRAWIONE: było 50,000x
      status: 'live' as const
    },
    {
      id: 'slots',
      name: 'Lightning Slots',
      icon: '🎰',
      description: 'Spin the reels for massive jackpots',
      minBet: 5,
      maxPayout: '10,000x',
      status: 'coming-soon' as const
    },
    {
      id: 'dice',
      name: 'Thunder Dice',
      icon: '🎯',
      description: 'Roll the dice and predict the outcome',
      minBet: 1,
      maxPayout: '98x',
      status: 'coming-soon' as const
    },
    {
      id: 'crash',
      name: 'Lightning Crash',
      icon: '📈',
      description: 'Cash out before the crash!',
      minBet: 10,
      maxPayout: '∞',
      status: 'coming-soon' as const
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-24 relative z-10">
        <div className="container mx-auto px-6">
          
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="thunder-gradient">All Games</span>
            </h1>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Choose your favorite game and start winning
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 glass-card">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                💰 Start with <strong className="text-yellow-400">2,500 points</strong> • 
                📅 Daily bonus <strong className="text-yellow-400">100-300 pts</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {games.map((game) => (
              <div
                key={game.id}
                className="glass-card p-6 space-y-4 relative overflow-hidden"
              >
                {game.status === 'live' ? (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs font-semibold text-green-400">LIVE</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-gray-700/50 rounded-full">
                      <span className="text-xs font-semibold text-gray-400">SOON</span>
                    </div>
                  </div>
                )}

                <div className="text-6xl mb-4">{game.icon}</div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {game.description}
                  </p>
                </div>

                {/* ✅ ZMIENIONE: Usunięto fake liczbę graczy, dodano provably fair badge */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      Min Bet
                    </div>
                    <div className="font-bold">{game.minBet} pts</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      Max Win
                    </div>
                    <div className="font-bold text-yellow-400">{game.maxPayout}</div>
                  </div>
                </div>

                {/* ✅ Provably Fair Badge */}
                <div className="flex items-center justify-center gap-2 py-2 bg-gray-900/50 rounded text-xs">
                  <span>🔒</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Provably Fair
                  </span>
                </div>

                {game.status === 'live' ? (
                  <Link href={`/games/${game.id}`}>
                    <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:scale-105 transition-all">
                      Play Now
                    </button>
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="w-full py-3 bg-gray-700 text-gray-400 font-bold rounded-lg cursor-not-allowed opacity-50"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Game Info Cards */}
          <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-2xl font-bold thunder-gradient mb-1">2,500</div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Starting Points for New Players
              </div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold thunder-gradient mb-1">100-300</div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Daily Bonus (scales with streak)
              </div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-2xl font-bold thunder-gradient mb-1">100%</div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Provably Fair & Transparent
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16 glass-card p-8 text-center">
            <h3 className="text-xl font-bold mb-3">🔒 All Games are Provably Fair</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Every game result is cryptographically verifiable. You can prove we can't cheat.
              <Link href="/#provably-fair" className="text-yellow-400 hover:underline ml-1">
                Learn more →
              </Link>
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
