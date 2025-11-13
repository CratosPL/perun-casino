'use client';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  fid: number;
  points: number;
  games_played: number;
  total_won: number;
  daily_streak: number;
}

interface Props {
  myFid?: number;
}

export default function Leaderboard({ myFid }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Skracanie dużych liczb na mobile (np. 4097.5 → 4.1k)
  const formatPoints = (points: number, isMobile: boolean = false) => {
    if (!isMobile || points < 1000) {
      return points.toLocaleString('en-US', { maximumFractionDigits: 1 });
    }
    const suffixes = ['', 'k', 'M', 'B'];
    let value = points;
    let suffixIndex = 0;
    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
      value /= 1000;
      suffixIndex++;
    }
    return (value.toFixed(1) + suffixes[suffixIndex]).replace('.', ','); // Zachowaj przecinek dla PL
  };

  // Detect mobile (Farcaster WebView)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640 || /iPhone|iPad|iPod/.test(navigator.userAgent));
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const url = `/api/leaderboard?limit=10${myFid ? `&fid=${myFid}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          setLeaderboard(data.leaderboard);
          setMyRank(data.myRank);
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    load();
    const interval = setInterval(load, isMobile ? 60000 : 30000); // 60s na mobile dla oszczędności
    return () => clearInterval(interval);
  }, [myFid, isMobile]);
  
  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin text-2xl mb-2">🏆</div>
        <div>Loading leaderboard...</div>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-4 sm:p-6 overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center thunder-gradient">
        🏆 Leaderboard
      </h2>
      
      {myRank && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-yellow-900/20 rounded-lg text-center">
          <span className="text-xs sm:text-sm">Your Rank: </span>
          <span className="font-bold text-yellow-400">#{myRank}</span>
        </div>
      )}
      
      <div className="space-y-2 sm:space-y-3 overflow-x-hidden">
        {leaderboard.map((entry, idx) => {
          const shortFid = entry.fid.toString().length > 5 ? entry.fid.toString().slice(0, 2) + '...' + entry.fid.toString().slice(-3) : entry.fid.toString();
          const isMe = entry.fid === myFid;
          
          return (
            <div
              key={entry.fid}
              className={`
                flex ${isMobile ? 'flex-col sm:flex-row' : 'flex-row'} items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg touch-manipulation
                ${idx < 3 ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30' : 'bg-gray-800/50'}
                ${isMe ? 'ring-2 ring-yellow-400/50' : ''}
                overflow-hidden
              `}
            >
              {/* Medal/Rank */}
              <div className={`flex items-center gap-2 sm:gap-4 flex-shrink-0 ${isMobile ? 'w-full justify-between' : ''}`}>
                <div className={`
                  text-lg sm:text-2xl font-bold w-6 sm:w-8 flex-shrink-0
                  ${idx === 0 ? 'text-yellow-400' : ''}
                  ${idx === 1 ? 'text-gray-300' : ''}
                  ${idx === 2 ? 'text-orange-400' : ''}
                `}>
                  {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
                </div>
                
                {/* Player Info - Truncate on mobile */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-base truncate">
                    Player {shortFid}
                    {isMe && <span className="text-xs sm:text-sm ml-1 text-yellow-400">(You)</span>}
                  </div>
                  <div className="text-xs text-gray-400 hidden sm:block">
                    {entry.games_played} games • {entry.daily_streak} day streak
                  </div>
                  {isMobile && (
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span>🎮</span> {entry.games_played}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🔥</span> {entry.daily_streak}d
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Points - Right-aligned, abbreviated on mobile */}
              <div className={`text-right flex-shrink-0 ${isMobile ? 'w-full justify-end mt-2' : ''}`}>
                <div className="text-lg sm:text-xl font-bold text-yellow-400">
                  {formatPoints(entry.points, isMobile)} pts
                </div>
                {isMobile && (
                  <div className="text-xs text-gray-400 mt-1">
                    Won: {formatPoints(entry.total_won, true)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer hint for mobile */}
      {isMobile && (
        <div className="mt-4 pt-2 border-t border-gray-600/30 text-xs text-center text-gray-400">
          💡 Swipe up to see more stats
        </div>
      )}
    </div>
  );
}
