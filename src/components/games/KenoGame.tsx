'use client'
import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export default function KenoGame() {
  const [fid, setFid] = useState<number>(0)
  const [points, setPoints] = useState(1000)
  const [loading, setLoading] = useState(true)
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [betAmount, setBetAmount] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const [isDev, setIsDev] = useState(false)
  
  // Provably Fair States
  const [clientSeed, setClientSeed] = useState<string>('')
  const [serverSeedHash, setServerSeedHash] = useState<string>('')
  const [showProvablyFair, setShowProvablyFair] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready()
        const context = await sdk.context
        
        if (context?.user?.fid) {
          console.log('✅ Running in Farcaster')
          setFid(context.user.fid)
          setIsDev(false)
        } else {
          throw new Error('No Farcaster user context')
        }
      } catch (error) {
        console.log('⚡ Dev Mode - Running locally')
        setIsDev(true)
        setFid(999999)
        
        const saved = localStorage.getItem('dev_points')
        setPoints(saved ? parseFloat(saved) : 1000)
      } finally {
        setLoading(false)
      }
    }
    
    init()
    generateNewClientSeed()
  }, [])

  useEffect(() => {
    if (isDev && !loading) {
      localStorage.setItem('dev_points', points.toString())
    }
  }, [points, isDev, loading])

  const generateNewClientSeed = () => {
    const seed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    setClientSeed(seed)
  }

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num))
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num])
    }
  }

  const handlePlay = async () => {
    if (selectedNumbers.length === 0 || betAmount > points || betAmount <= 0) {
      return
    }

    setIsPlaying(true)
    setLastResult(null)

    try {
      if (isDev) {
        await new Promise(r => setTimeout(r, 800))
        
        const drawnNumbers: number[] = []
        while (drawnNumbers.length < 20) {
          const n = Math.floor(Math.random() * 80) + 1
          if (!drawnNumbers.includes(n)) drawnNumbers.push(n)
        }
        
        const matches = selectedNumbers.filter(n => drawnNumbers.includes(n)).length
        const PAYOUTS: Record<number, number> = {
          0: 0, 1: 0, 2: 0, 3: 1, 4: 2, 5: 5,
          6: 10, 7: 50, 8: 100, 9: 500, 10: 1000
        }
        
        const multiplier = PAYOUTS[matches] || 0
        const payout = betAmount * multiplier
        const newPoints = points - betAmount + payout
        
        setPoints(newPoints)
        setLastResult({ drawnNumbers, matches, multiplier, payout })
        setIsPlaying(false)
        return
      }

      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          gameType: 'keno',
          betAmount,
          selectedNumbers,
          clientSeed
        })
      })

      const data = await response.json()

      if (data.success) {
        setPoints(data.newBalance)
        setLastResult({
          ...data.result,
          provablyFair: data.provablyFair
        })
        
        if (data.provablyFair?.nextServerSeedHash) {
          setServerSeedHash(data.provablyFair.nextServerSeedHash)
        }
        
        if (data.result.payout > 100) {
          sdk.actions.openUrl(
            `https://warpcast.com/~/compose?text=Just won ${data.result.payout} points in Thunder Casino! 🎰⚡`
          )
        }
      } else {
        alert(data.error || 'Game failed')
      }
    } catch (error) {
      console.error('Play error:', error)
      alert('Network error')
    } finally {
      setIsPlaying(false)
    }
  }

  const clearSelection = () => setSelectedNumbers([])

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin text-4xl mb-4">⚡</div>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">
          ⚡ Thunder Keno
          {isDev && <span className="text-xs ml-2 text-yellow-400">(Dev)</span>}
        </h1>
        <div className="text-2xl font-mono">
          Points: <span className="text-yellow-400">{points.toFixed(2)}</span>
        </div>
        {isDev && (
          <div className="text-xs text-gray-400 mt-1">
            💡 Local mode - Deploy to Warpcast for production
          </div>
        )}
      </div>

      {/* Last Result */}
      {lastResult && (
        <div className={`mb-6 p-4 rounded-lg ${lastResult.payout > 0 ? 'bg-green-900' : 'bg-red-900'}`}>
          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              {lastResult.payout > 0 ? '🎉 WIN!' : '😢 No Win'}
            </div>
            <div>Matches: {lastResult.matches} / {selectedNumbers.length}</div>
            <div>Multiplier: {lastResult.multiplier}x</div>
            <div className="text-2xl font-bold">
              Payout: {lastResult.payout} points
            </div>
            <div className="mt-2 text-sm">
              Drawn: {lastResult.drawnNumbers.slice(0, 20).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Number Grid */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">
            Selected: {selectedNumbers.length}/10
          </span>
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        </div>
        
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 80 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={isPlaying}
              className={`
                aspect-square flex items-center justify-center rounded font-bold text-sm
                transition-all
                ${selectedNumbers.includes(num)
                  ? 'bg-yellow-500 text-black scale-110'
                  : 'bg-gray-700 hover:bg-gray-600'}
                ${lastResult?.drawnNumbers.includes(num) 
                  ? 'ring-2 ring-blue-400' 
                  : ''}
                ${isPlaying ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Bet Controls */}
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Bet Amount:</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min={1}
            max={points}
            disabled={isPlaying}
            className="w-full px-4 py-3 bg-gray-700 rounded text-lg"
          />
          <div className="mt-2 flex gap-2">
            {[10, 50, 100, 500].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={isPlaying || amount > points}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 disabled:opacity-50 transition-colors"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePlay}
          disabled={
            isPlaying || 
            selectedNumbers.length === 0 || 
            betAmount > points ||
            betAmount <= 0
          }
          className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xl rounded-lg hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPlaying ? 'Playing...' : `Play (Bet ${betAmount} points)`}
        </button>
      </div>

      {/* Payout Table */}
      <div className="mt-8 text-sm bg-gray-800 rounded-lg p-4">
        <h3 className="font-bold mb-3 text-center">Payout Table:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between px-2">
            <span>5 matches</span>
            <span className="text-yellow-400">2x</span>
          </div>
          <div className="flex justify-between px-2">
            <span>6 matches</span>
            <span className="text-yellow-400">20x</span>
          </div>
          <div className="flex justify-between px-2">
            <span>7 matches</span>
            <span className="text-yellow-400">100x</span>
          </div>
          <div className="flex justify-between px-2">
            <span>8 matches</span>
            <span className="text-yellow-400">1,000x</span>
          </div>
          <div className="flex justify-between px-2">
            <span>9 matches</span>
            <span className="text-yellow-400">5,000x</span>
          </div>
          <div className="flex justify-between px-2">
            <span>10 matches</span>
            <span className="text-yellow-400 font-bold">50,000x 🎰</span>
          </div>
        </div>
      </div>

      {/* ✅ Provably Fair Section - ZAWSZE WIDOCZNE */}
      <div className="mt-8 bg-gray-800 rounded-lg p-4">
        {isDev ? (
          // Dev Mode - Show preview
          <div className="text-center space-y-4 p-6">
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="text-xl font-bold">Provably Fair System</h3>
            <p className="text-sm text-gray-400">
              In production, every game will show cryptographic verification data here.
            </p>
            <div className="mt-4 p-4 bg-gray-900 rounded space-y-2 text-xs text-left">
              <div className="text-gray-500">Preview of production features:</div>
              <div>✓ Your client seed (changeable)</div>
              <div>✓ Server seed hash (shown before game)</div>
              <div>✓ Revealed server seed (shown after game)</div>
              <div>✓ Verification link to prove fairness</div>
            </div>
            <p className="text-xs text-yellow-400 mt-4">
              💡 Deploy to Warpcast to see full provably fair verification
            </p>
          </div>
        ) : (
          // Production - Full Provably Fair UI
          <>
            <button
              onClick={() => setShowProvablyFair(!showProvablyFair)}
              className="w-full flex items-center justify-between text-left font-semibold"
            >
              <span className="flex items-center gap-2">
                🔒 Provably Fair
                <span className="text-xs text-green-400">Verified</span>
              </span>
              <span className="text-gray-400">{showProvablyFair ? '▼' : '▶'}</span>
            </button>
            
            {showProvablyFair && (
              <div className="mt-4 space-y-4 text-xs">
                <div className="p-3 bg-gray-900 rounded">
                  <div className="text-gray-400 mb-1">Your Client Seed:</div>
                  <div className="font-mono break-all text-yellow-400">
                    {clientSeed || 'Generating...'}
                  </div>
                  <button
                    onClick={generateNewClientSeed}
                    className="mt-2 text-blue-400 hover:underline text-xs"
                  >
                    🔄 Change Seed
                  </button>
                </div>
                
                <div className="p-3 bg-gray-900 rounded">
                  <div className="text-gray-400 mb-1">Next Server Seed Hash:</div>
                  <div className="font-mono break-all text-[10px] text-green-400">
                    {serverSeedHash || 'Play a game to see'}
                  </div>
                  <div className="text-gray-500 text-[10px] mt-1">
                    ℹ️ This hash is generated BEFORE you play
                  </div>
                </div>
                
                {lastResult?.provablyFair && (
                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                      ✅ Last Game Verification
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-900 rounded">
                        <div className="text-gray-400 mb-1">Revealed Server Seed:</div>
                        <div className="font-mono break-all text-[10px] text-purple-400">
                          {lastResult.provablyFair.serverSeed}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-900 rounded">
                        <div className="text-gray-400 mb-1">Server Seed Hash (shown before):</div>
                        <div className="font-mono break-all text-[10px] text-blue-400">
                          {lastResult.provablyFair.serverSeedHash}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-900 rounded">
                        <div className="text-gray-400 mb-1">Nonce:</div>
                        <div className="font-mono text-sm">
                          {lastResult.provablyFair.nonce}
                        </div>
                      </div>
                      
                      {lastResult.provablyFair.verificationUrl && (
                        <a
                          href={lastResult.provablyFair.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                        >
                          🔍 Verify This Game
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="text-[10px] text-gray-500 p-3 bg-gray-900 rounded">
                  <div className="font-semibold mb-1">How Provably Fair Works:</div>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Server generates seed and shows you the HASH before game</li>
                    <li>You provide your own client seed (or change it)</li>
                    <li>Game result = SHA256(client + server + nonce)</li>
                    <li>After game, server reveals seed - you verify hash matches</li>
                    <li>Impossible for server to cheat!</li>
                  </ol>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
