'use client';

import { Navbar } from '@/components/Navbar';
import DailyBonus from '@/components/DailyBonus';
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function Home() {
  const [fid, setFid] = useState<number>(999999);
  const [isDev, setIsDev] = useState(true);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(2500);

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        
        if (context?.user?.fid) {
          setFid(context.user.fid);
          setIsDev(false);
          
          // Fetch user data (streak and balance)
          fetchUserData(context.user.fid);
        }
      } catch (error) {
        console.log('Running in dev mode');
        setIsDev(true);
      }
    };
    
    init();
  }, []);

  const fetchUserData = async (userFid: number) => {
    try {
      const res = await fetch(`/api/user/${userFid}`);
      if (res.ok) {
        const data = await res.json();
        setUserStreak(data.daily_streak || 0);
        setUserBalance(data.points || 2500);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleBonusClaimed = (bonus: number, newBalance: number) => {
    setUserBalance(newBalance);
    fetchUserData(fid); // Refresh streak
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="container mx-auto px-6 py-32">
          
          {/* Hero Section */}
          <div className="max-w-5xl mx-auto text-center space-y-12">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card px-5 py-3">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-lightning-primary)' }}></span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Play for Free • Points-Based Gaming
                {isDev && <span className="ml-2 text-yellow-400">(Dev Mode)</span>}
              </span>
            </div>

            {/* Main heading */}
            <div className="space-y-6 relative">
              <div className="absolute -left-20 top-0 text-6xl opacity-20 thunder-icon">⚡</div>
              <div className="absolute -right-20 top-0 text-6xl opacity-20 thunder-icon" style={{ animationDelay: '1.5s' }}>⚡</div>
              
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-[0.9]">
                <span className="thunder-gradient">Thunder</span>
                <br />
                <span style={{ color: 'var(--color-text-primary)' }}>Casino</span>
              </h1>
              <p className="text-2xl font-semibold thunder-gradient">
                Arcade Games • Pure Fun
              </p>
            </div>

            {/* Description */}
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Play provably fair arcade games with points. Compete on leaderboards, 
              earn daily bonuses, and challenge your friends. No crypto required.
            </p>

            {/* Quick Stats - UPDATED */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto py-8">
              <div className="glass-card p-6">
                <div className="text-3xl font-bold thunder-gradient">2,500</div>
                <div className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Starting Points
                </div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold thunder-gradient">∞</div>
                <div className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Free to Play
                </div>
              </div>
              <div className="glass-card p-6">
                <div className="text-3xl font-bold thunder-gradient">100%</div>
                <div className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Provably Fair
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <div className="glass-card p-8 text-center space-y-4">
                <div className="feature-icon mx-auto">🎲</div>
                <h3 className="text-xl font-semibold">Provably Fair</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Every game result is cryptographically verifiable on-chain. 
                  Transparent and honest gaming.
                </p>
              </div>

              <div className="glass-card p-8 text-center space-y-4">
                <div className="feature-icon mx-auto">🏆</div>
                <h3 className="text-xl font-semibold">Compete & Win</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Climb the leaderboards. Challenge friends. 
                  Daily bonuses and special events.
                </p>
              </div>

              <div className="glass-card p-8 text-center space-y-4">
                <div className="feature-icon mx-auto">⚡</div>
                <h3 className="text-xl font-semibold">Instant Play</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  No downloads, no waiting. Connect with Farcaster and start playing immediately.
                </p>
              </div>
            </div>

            {/* Daily Bonus Section - UPDATED */}
            <div className="pt-32 space-y-8">
              <h2 className="text-4xl font-bold thunder-gradient">Daily Rewards</h2>
              <div className="max-w-2xl mx-auto">
                <DailyBonus 
                  fid={fid}
                  streak={userStreak}
                  onClaimed={handleBonusClaimed}
                />
              </div>
            </div>

            {/* How it Works - UPDATED */}
            <div className="pt-32 space-y-12">
              <h2 className="text-4xl font-bold thunder-gradient">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="glass-card p-8 text-center space-y-4">
                  <div className="step-badge mx-auto">1</div>
                  <h3 className="text-xl font-semibold">Connect & Start</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Connect with your Farcaster account. Get <strong>2,500 free points</strong> to start playing immediately.
                  </p>
                </div>

                <div className="glass-card p-8 text-center space-y-4">
                  <div className="step-badge mx-auto">2</div>
                  <h3 className="text-xl font-semibold">Play & Compete</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Choose your game. Place your bets. Watch the action unfold with provably fair results.
                  </p>
                </div>

                <div className="glass-card p-8 text-center space-y-4">
                  <div className="step-badge mx-auto">3</div>
                  <h3 className="text-xl font-semibold">Earn & Share</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Claim daily bonuses, climb leaderboards, share your wins. Build your reputation!
                  </p>
                </div>
              </div>
            </div>

            {/* Provably Fair Explanation */}
            <div className="pt-32 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold thunder-gradient">How Provably Fair Works</h2>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                  Every game is mathematically verifiable. You can prove we can't cheat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* Before You Play */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔒</span>
                    <h3 className="text-xl font-bold">Before You Play</h3>
                  </div>
                  <ol className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <li className="flex gap-3">
                      <span className="font-bold text-yellow-400 shrink-0">1.</span>
                      <span>Server generates a <strong>secret seed</strong> and shows you its <strong>hash</strong> (encrypted fingerprint)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-yellow-400 shrink-0">2.</span>
                      <span>You provide your own <strong>client seed</strong> (or let us generate one)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-yellow-400 shrink-0">3.</span>
                      <span>Server <strong>cannot change</strong> its seed after showing the hash</span>
                    </li>
                  </ol>
                </div>

                {/* After You Play */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✅</span>
                    <h3 className="text-xl font-bold">After You Play</h3>
                  </div>
                  <ol className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 shrink-0">4.</span>
                      <span>Server <strong>reveals</strong> its secret seed to you</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 shrink-0">5.</span>
                      <span>You verify: <code className="bg-gray-800 px-2 py-1 rounded text-xs">hash(revealed_seed) === shown_hash</code></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 shrink-0">6.</span>
                      <span>You can <strong>regenerate</strong> the exact result using both seeds</span>
                    </li>
                  </ol>
                </div>

                {/* The Math */}
                <div className="glass-card p-6 space-y-4 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔬</span>
                    <h3 className="text-xl font-bold">The Mathematics</h3>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <code className="text-xs text-green-400 break-all">
                      Result = SHA256(client_seed + server_seed + nonce)
                    </code>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    This is <strong>cryptographically impossible</strong> to manipulate. If we changed the server seed after seeing your picks, 
                    the hash wouldn't match. It's the same technology that secures Bitcoin transactions.
                  </p>
                  <div className="flex gap-4 text-xs flex-wrap">
                    <div className="flex-1 min-w-[200px] p-3 bg-blue-900/20 rounded">
                      <div className="font-bold mb-1">🛡️ Immutable</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>Can't be changed after commitment</div>
                    </div>
                    <div className="flex-1 min-w-[200px] p-3 bg-purple-900/20 rounded">
                      <div className="font-bold mb-1">🔍 Transparent</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>Every step is verifiable</div>
                    </div>
                    <div className="flex-1 min-w-[200px] p-3 bg-green-900/20 rounded">
                      <div className="font-bold mb-1">⚡ Instant</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>Verify in your browser</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Example */}
              <div className="max-w-3xl mx-auto glass-card p-6 bg-gradient-to-br from-gray-800 to-gray-900">
                <h4 className="font-bold mb-4 text-center">📖 Real Example</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center gap-4">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Server Seed Hash (before):</span>
                    <code className="bg-gray-950 px-3 py-1 rounded text-xs text-blue-400">a3f4b2c1...</code>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Your Client Seed:</span>
                    <code className="bg-gray-950 px-3 py-1 rounded text-xs text-yellow-400">1731153600-abc</code>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Nonce:</span>
                    <code className="bg-gray-950 px-3 py-1 rounded text-xs">42</code>
                  </div>
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center gap-4">
                      <span style={{ color: 'var(--color-text-secondary)' }}>Result:</span>
                      <code className="bg-gray-950 px-3 py-1 rounded text-xs text-green-400">15, 23, 47, 58...</code>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center gap-4">
                      <span style={{ color: 'var(--color-text-secondary)' }}>Revealed Server Seed (after):</span>
                      <code className="bg-gray-950 px-3 py-1 rounded text-xs text-purple-400">f7e8d9c0...</code>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-green-400 font-bold text-xs">✅ SHA256(f7e8d9c0...) = a3f4b2c1... ← VERIFIED!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Points & Rewards System - UPDATED */}
            <div className="pt-32 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold thunder-gradient">Points & Rewards System</h2>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                  Understand how points work and maximize your rewards
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                
                {/* Starting Points - UPDATED */}
                <div className="glass-card p-6 space-y-4">
                  <div className="text-4xl mb-2">🎁</div>
                  <h3 className="text-xl font-bold">Starting Points</h3>
                  <div className="text-3xl font-bold thunder-gradient">2,500</div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Every new player gets 2,500 free points to start. No purchase required, no wallet needed.
                  </p>
                </div>

                {/* Daily Bonus - UPDATED */}
                <div className="glass-card p-6 space-y-4">
                  <div className="text-4xl mb-2">📅</div>
                  <h3 className="text-xl font-bold">Daily Bonus</h3>
                  <div className="text-3xl font-bold thunder-gradient">100-300</div>
                  <ul className="text-sm space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <li>• Base: <strong>100 points/day</strong></li>
                    <li>• Streak bonus: <strong>+20 per day</strong></li>
                    <li>• Max: <strong>300 points/day</strong></li>
                    <li>• Special: <strong>+500 @ 7 days</strong></li>
                    <li>• Mega: <strong>+1500 @ 30 days</strong></li>
                  </ul>
                </div>

                {/* Balance Limits - NEW */}
  <div className="glass-card p-6 space-y-4">
    <div className="text-4xl mb-2">🚀</div>
    <h3 className="text-xl font-bold">Unlimited Growth</h3>
    <div className="text-3xl font-bold thunder-gradient">∞</div>
    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
      No balance limits! Accumulate as many points as you can and dominate the leaderboard!
    </p>
                </div>
              </div>

              {/* Fair Play Rules */}
              <div className="max-w-3xl mx-auto glass-card p-6">
                <h3 className="text-xl font-bold mb-4 text-center">⚖️ Fair Play Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="text-green-400 font-semibold">✅ Allowed:</div>
                    <ul className="space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                      <li>• Play as much as you want</li>
                      <li>• Change client seed anytime</li>
                      <li>• Verify every game result</li>
                      <li>• Share wins on social media</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-red-400 font-semibold">❌ Not Allowed:</div>
                    <ul className="space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                      <li>• Multiple accounts (same user)</li>
                      <li>• Bot/automated play</li>
                      <li>• Exploiting bugs</li>
                      <li>• Points trading (coming soon)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section - UPDATED */}
            <div className="pt-32 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold thunder-gradient">Frequently Asked Questions</h2>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                
                <details className="glass-card p-6 cursor-pointer group">
                  <summary className="font-bold text-lg list-none flex items-center justify-between">
                    <span>Is this real gambling?</span>
                    <span className="text-yellow-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    No. Thunder Casino is a <strong>free-to-play points-based game</strong> for entertainment only. 
                    Points have no monetary value and cannot be withdrawn for real money.
                  </p>
                </details>

                <details className="glass-card p-6 cursor-pointer group">
                  <summary className="font-bold text-lg list-none flex items-center justify-between">
                    <span>Can I trust the results?</span>
                    <span className="text-yellow-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Absolutely. Every game uses <strong>provably fair technology</strong> - the same cryptographic methods 
                    used by Bitcoin and major crypto casinos. You can verify every result yourself. We mathematically 
                    cannot cheat even if we wanted to.
                  </p>
                </details>

                <details className="glass-card p-6 cursor-pointer group">
                  <summary className="font-bold text-lg list-none flex items-center justify-between">
                    <span>What happens if I run out of points?</span>
                    <span className="text-yellow-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    No worries! You can claim <strong>daily bonuses</strong> (100-300 points per day, scaling with your streak). 
                    Plus special bonuses at 7 days (+500) and 30 days (+1500). Just come back daily and keep playing!
                  </p>
                </details>

                <details className="glass-card p-6 cursor-pointer group">
                  <summary className="font-bold text-lg list-none flex items-center justify-between">
                    <span>Will points convert to tokens?</span>
                    <span className="text-yellow-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    We're exploring token integration on Base Network, but <strong>no timeline is set</strong>. 
                    Points currently have no monetary value. If token conversion launches, it will be announced 
                    well in advance with clear terms. Early players may receive benefits, but nothing is guaranteed.
                  </p>
                </details>

                <details className="glass-card p-6 cursor-pointer group">
                  <summary className="font-bold text-lg list-none flex items-center justify-between">
                    <span>How do I verify a game result?</span>
                    <span className="text-yellow-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-4 space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <p>After each game:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Click the <strong>🔒 Provably Fair</strong> section in the game</li>
                      <li>View your client seed and server seed hash</li>
                      <li>After playing, see the revealed server seed</li>
                      <li>Click <strong>"🔍 Verify This Game"</strong> button</li>
                      <li>Our verification page shows the math is correct</li>
                    </ol>
                    <p className="pt-2">
                      Or use any SHA256 calculator to verify the hash yourself!
                    </p>
                  </div>
                </details>

                <details className="glass-card p-6 cursor-pointer group">
                  <summary className="font-bold text-lg list-none flex items-center justify-between">
                    <span>Is my data safe?</span>
                    <span className="text-yellow-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Yes. We use <strong>Farcaster authentication</strong> (decentralized social protocol) and 
                    <strong>Supabase</strong> (enterprise-grade database with row-level security). We never store 
                    passwords or sensitive data. Your Farcaster ID is your only identifier.
                  </p>
                </details>
              </div>
            </div>

            {/* Future Vision */}
            <div className="pt-32 space-y-8">
              <div className="glass-card p-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" 
                     style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                  <span className="text-sm font-semibold thunder-gradient">
                    💭 FUTURE VISION
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold">What's Next for Thunder Casino?</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-lg font-semibold mb-2">🎮 More Games</div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Slots, dice, crash games, and more arcade classics coming soon.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-lg font-semibold mb-2">🏆 Tournaments</div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Compete in weekly tournaments with real prizes and bragging rights.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-lg font-semibold mb-2">👥 Social Features</div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Challenge friends, share wins, form teams. Gaming is better together.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg border-2 border-yellow-500/30">
                    <div className="text-lg font-semibold mb-2">⚡ Token Bridge</div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      <strong>Under research:</strong> Convert points to $THUNDER tokens on Base. 
                      <span className="block mt-2 text-xs text-yellow-400">
                        Timeline uncertain. No guarantees. Stay tuned.
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <p className="text-sm text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                    <strong>Important:</strong> Points currently have no monetary value and are for entertainment only. 
                    Any future token conversion would be announced well in advance with clear terms.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
