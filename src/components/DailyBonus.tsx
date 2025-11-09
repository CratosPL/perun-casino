'use client'
import { useState } from 'react'

interface Props {
  fid: number
  lastClaimed?: string
  streak: number
  onClaimed: (bonus: number, newBalance: number) => void
}

export default function DailyBonus({ fid, lastClaimed, streak, onClaimed }: Props) {
  const [claiming, setClaiming] = useState(false)
  
  const canClaim = !lastClaimed || 
    (new Date().getTime() - new Date(lastClaimed).getTime()) > 24 * 60 * 60 * 1000
  
  const nextBonusIn = lastClaimed 
    ? Math.max(0, 24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(lastClaimed).getTime()))
    : 0
  
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }
  
  const handleClaim = async () => {
    setClaiming(true)
    try {
      const res = await fetch('/api/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid })
      })
      
      const data = await res.json()
      
      if (data.success) {
        onClaimed(data.bonus, data.newBalance)
        alert(`🎉 Claimed ${data.bonus} points! Streak: ${data.streak} days`)
      } else {
        alert(data.error || 'Failed to claim')
      }
    } catch (error) {
      console.error(error)
      alert('Network error')
    } finally {
      setClaiming(false)
    }
  }
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">Daily Bonus</h3>
          <p className="text-sm text-gray-400">
            {streak > 0 ? `🔥 ${streak} day streak!` : 'Start your streak'}
          </p>
        </div>
        
        <button
          onClick={handleClaim}
          disabled={!canClaim || claiming}
          className={`
            px-6 py-3 rounded-lg font-bold transition-all
            ${canClaim 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105' 
              : 'bg-gray-600 cursor-not-allowed'}
          `}
        >
          {claiming ? 'Claiming...' : canClaim ? '🎁 Claim' : `⏰ ${formatTime(nextBonusIn)}`}
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Base: 100 points + {streak * 10} streak bonus
      </div>
    </div>
  )
}
