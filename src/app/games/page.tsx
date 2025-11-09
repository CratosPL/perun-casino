'use client';

import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function GamesPage() {
  const games = [
    {
      id: 'keno',
      name: 'Thunder Keno',
      icon: '🎲',
      description: 'Pick numbers and win up to 50,000x your bet',
      players: 234,
      minBet: 10,
      maxPayout: '50,000x',
      status: 'live'
    },
    {
      id: 'slots',
      name: 'Lightning Slots',
      icon: '🎰',
      description: 'Spin the reels for massive jackpots',
      players: 0,
      minBet: 5,
      maxPayout: '10,000x',
      status: 'coming-soon'
    },
    {
      id: 'dice',
      name: 'Thunder Dice',
      icon: '🎯',
      description: 'Roll the dice and predict the outcome',
      players: 0,
      minBet: 1,
      maxPayout: '98x',
      status: 'coming-soon'
    },
    {
      id: 'crash',
      name: 'Lightning Crash',
      icon: '📈',
      description: 'Cash out before the crash!',
      players: 0,
      minBet: 10,
      maxPayout: '∞',
      status: 'coming-soon'
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

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      Min Bet
                    </div>
                    <div className="font-bold">{game.minBet}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      Max Win
                    </div>
                    <div className="font-bold text-yellow-400">{game.maxPayout}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      Players
                    </div>
                    <div className="font-bold">{game.players}</div>
                  </div>
                </div>

                {/* ✅ POPRAWIONY LINK */}
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
