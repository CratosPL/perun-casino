'use client';

import { Navbar } from '@/components/Navbar';
import { BuyThunder } from '@/components/casino/BuyThunder';
import { SellThunder } from '@/components/casino/SellThunder';
import { KenoGame } from '@/components/games/KenoGame';

export default function Home() {
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
                Built on Base Network
              </span>
            </div>

            {/* Main heading with lightning icons */}
            <div className="space-y-6 relative">
              <div className="absolute -left-20 top-0 text-6xl opacity-20 thunder-icon">⚡</div>
              <div className="absolute -right-20 top-0 text-6xl opacity-20 thunder-icon" style={{ animationDelay: '1.5s' }}>⚡</div>
              
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-[0.9]">
                <span className="thunder-gradient">Perun</span>
                <br />
                <span style={{ color: 'var(--color-text-primary)' }}>
                  Casino
                </span>
              </h1>
              <p className="text-2xl font-semibold thunder-gradient">
                God of Thunder Games
              </p>
            </div>

            {/* Description */}
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Arcade-style games with micro-stakes. Buy Thunder Coins with USDC, 
              play provably fair mini-games, compete on leaderboards. Convert coins back anytime.
            </p>

            {/* Buy & Sell Thunder Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <BuyThunder />
              <SellThunder />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24">
              
              <div className="glass-card p-8 text-center space-y-4">
                <div className="feature-icon mx-auto">🎲</div>
                <h3 className="text-xl font-semibold">Provably Fair</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Every game result is cryptographically verifiable. No house manipulation.
                </p>
              </div>

              <div className="glass-card p-8 text-center space-y-4">
                <div className="feature-icon mx-auto">💸</div>
                <h3 className="text-xl font-semibold">Micro-Stakes</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Start with just $1. Small amounts, casual fun. Convert coins back to USDC anytime.
                </p>
              </div>

              <div className="glass-card p-8 text-center space-y-4">
                <div className="feature-icon mx-auto">🔒</div>
                <h3 className="text-xl font-semibold">Safe & Secure</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Non-custodial. Your wallet, your coins. Built on Base L2.
                </p>
              </div>
            </div>

            {/* Games Section */}
            <div className="pt-32 space-y-12">
              <h2 className="text-4xl font-bold thunder-gradient">Play Now</h2>
              <div className="max-w-2xl mx-auto">
                <KenoGame />
              </div>
            </div>

            {/* How it works */}
            <div className="pt-32 space-y-12">
              <h2 className="text-4xl font-bold thunder-gradient">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                
                <div className="glass-card p-8 text-center space-y-4">
                  <div className="step-badge mx-auto">1</div>
                  <h3 className="text-xl font-semibold">Buy Thunder Coins</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Purchase Thunder Coins with USDC. Dynamic bonding curve pricing. Start with just $1!
                  </p>
                </div>

                <div className="glass-card p-8 text-center space-y-4">
                  <div className="step-badge mx-auto">2</div>
                  <h3 className="text-xl font-semibold">Play Epic Games</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    KENO, Slots, Dice. All provably fair. Bet your Thunders in casual arcade games.
                  </p>
                </div>

                <div className="glass-card p-8 text-center space-y-4">
                  <div className="step-badge mx-auto">3</div>
                  <h3 className="text-xl font-semibold">Convert & Compete</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Exchange Thunder Coins back to USDC anytime. Compete on leaderboards for rewards!
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
