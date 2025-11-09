'use client'
import { useEffect, useState } from 'react'

interface LeaderboardEntry {
  fid: number
  points: number
  games_played: number
  total_won: number
  daily_streak: number
}

interface Props {
  myFid?: number
}

export default function Leaderboard({ myFid }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myRank, setMyRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const load = async () => {
      try {
        const url = `/api/leaderboard?limit=10${myFid ? `&fid=${myFid}` : ''}`
        const res = await fetch(url)
        const data = await res.json()
        
        if (data.success) {
          setLeaderboard(data.leaderboard)
          setMyRank(data.myRank)
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }
    
    load()
    const interval = setInterval(load, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [myFid])
  
  if (loading) {
    return <div className="text-center p-8">Loading leaderboard...</div>
  }
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6 text-center thunder-gradient">
        🏆 Leaderboard
      </h2>
      
      {myRank && (
        <div className="mb-4 p-3 bg-yellow-900/20 rounded-lg text-center">
          <span className="text-sm">Your Rank: </span>
          <span className="font-bold text-yellow-400">#{myRank}</span>
        </div>
      )}
      
      <div className="space-y-2">
        {leaderboard.map((entry, idx) => (
          <div
            key={entry.fid}
            className={`
              flex items-center justify-between p-4 rounded-lg
              ${idx < 3 ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30' : 'bg-gray-800/50'}
              ${entry.fid === myFid ? 'ring-2 ring-yellow-400' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                text-2xl font-bold w-8
                ${idx === 0 ? 'text-yellow-400' : ''}
                ${idx === 1 ? 'text-gray-300' : ''}
                ${idx === 2 ? 'text-orange-400' : ''}
              `}>
                {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
              </div>
              
              <div>
                <div className="font-semibold">
                  Player {entry.fid}
                  {entry.fid === myFid && <span className="text-xs ml-2 text-yellow-400">(You)</span>}
                </div>
                <div className="text-xs text-gray-400">
                  {entry.games_played} games • {entry.daily_streak} day streak
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-yellow-400">
                {entry.points.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
