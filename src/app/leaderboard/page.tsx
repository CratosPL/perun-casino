'use client';

import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  fid: number;
  points: number;
  games_played: number;
  total_won: number;
  total_wagered: number;
  daily_streak: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all-time' | 'weekly' | 'daily'>('all-time');

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        // ✅ POPRAWKA: Dodaj timeframe do API call
        const res = await fetch(`/api/leaderboard?limit=50&timeframe=${timeframe}`);
        const data = await res.json();
        
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [timeframe]); // Re-load when timeframe changes

  // Calculate win rate
  const calculateWinRate = (won: number, wagered: number): string => {
    if (wagered === 0) return '0.0';
    return ((won / wagered) * 100).toFixed(1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="thunder-gradient">🏆 Leaderboard</span>
            </h1>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Top players competing for glory and rewards
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              Ranked by total winnings • Skill-based ranking
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex justify-center gap-4 mb-12">
            {(['all-time', 'weekly', 'daily'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                    : 'glass-card hover:border-yellow-500/50'
                }`}
              >
                {tf === 'all-time' ? 'All Time' : tf === 'weekly' ? 'This Week' : 'Today'}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin text-4xl mb-4">⚡</div>
                <div>Loading leaderboard...</div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <div className="text-4xl mb-4">🎲</div>
                <div className="text-xl font-bold mb-2">No players yet</div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Be the first to play and claim the #1 spot!
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((player, idx) => (
                  <div
                    key={player.fid}
                    className={`
                      glass-card p-6 flex items-center justify-between
                      ${idx < 3 ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20' : ''}
                    `}
                  >
                    {/* Rank & Player */}
                    <div className="flex items-center gap-6">
                      <div className={`
                        text-3xl font-bold w-12 text-center
                        ${idx === 0 ? 'text-yellow-400' : ''}
                        ${idx === 1 ? 'text-gray-300' : ''}
                        ${idx === 2 ? 'text-orange-400' : ''}
                      `}>
                        {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
                      </div>
                      
                      <div>
                        <div className="font-bold text-lg">Player {player.fid}</div>
                        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {player.games_played} games • {player.daily_streak} day streak
                        </div>
                      </div>
                    </div>

                    {/* ✅ POPRAWIONE: Stats z Win Rate */}
                    <div className="flex items-center gap-6">
                      {/* Win Rate */}
                      <div className="text-right">
                        <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          Win Rate
                        </div>
                        <div className={`font-bold ${
                          parseFloat(calculateWinRate(player.total_won, player.total_wagered)) >= 100 
                            ? 'text-green-400' 
                            : 'text-blue-400'
                        }`}>
                          {calculateWinRate(player.total_won, player.total_wagered)}%
                        </div>
                      </div>

                      {/* Total Won */}
                      <div className="text-right">
                        <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          Total Won
                        </div>
                        <div className="font-bold text-xl text-green-400">
                          {player.total_won.toLocaleString()}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          Points
                        </div>
                        <div className="font-bold text-2xl text-yellow-400">
                          {player.points.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Legend */}
          <div className="max-w-5xl mx-auto mt-8 glass-card p-4">
            <div className="flex justify-center gap-8 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Win Rate: Total Won / Total Wagered
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Total Won: Cumulative winnings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Points: Current balance
                </span>
              </div>
            </div>
          </div>

          {/* Rewards Info */}
          <div className="max-w-4xl mx-auto mt-16 glass-card p-8">
            <h3 className="text-xl font-bold mb-4 text-center">🎁 Weekly Rewards</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🥇</div>
                <div className="font-bold text-yellow-400 text-xl">1st Place</div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  1,000 bonus points
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">🥈</div>
                <div className="font-bold text-gray-300 text-xl">2nd Place</div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  500 bonus points
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">🥉</div>
                <div className="font-bold text-orange-400 text-xl">3rd Place</div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  250 bonus points
                </div>
              </div>
            </div>
            <p className="text-xs text-center mt-6" style={{ color: 'var(--color-text-tertiary)' }}>
              Rewards are distributed every Monday at 00:00 UTC
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
