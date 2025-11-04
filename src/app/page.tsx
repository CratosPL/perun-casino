export default function Home() {
  return (
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
            Buy Thunder Coins with USDC, play provably fair casino games, 
            and compete for monthly crypto rewards on Base blockchain.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <button className="btn-primary text-base">
              🎰 Play Games
            </button>
            <button className="btn-secondary text-base">
              Buy Thunders
            </button>
          </div>

          {/* Features Grid WITH ICONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24">
            
            <div className="glass-card p-8 text-center space-y-4">
              <div className="feature-icon mx-auto">
                🎲
              </div>
              <h3 className="text-xl font-semibold">Provably Fair</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Every game result is cryptographically verifiable. No house manipulation.
              </p>
            </div>

            <div className="glass-card p-8 text-center space-y-4">
              <div className="feature-icon mx-auto">
                ⚡
              </div>
              <h3 className="text-xl font-semibold">Instant Rewards</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Top 100 players earn USDC rewards monthly. No withdrawal delays.
              </p>
            </div>

            <div className="glass-card p-8 text-center space-y-4">
              <div className="feature-icon mx-auto">
                🔒
              </div>
              <h3 className="text-xl font-semibold">Safe & Secure</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Non-custodial. Your wallet, your coins. Built on Base L2.
              </p>
            </div>

          </div>

          {/* How it works WITH GRAPHIC BADGES */}
          <div className="pt-32 space-y-12">
            <h2 className="text-4xl font-bold thunder-gradient">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              <div className="glass-card p-8 text-center space-y-4">
                <div className="step-badge mx-auto">1</div>
                <h3 className="text-xl font-semibold">Buy Thunder Coins</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Purchase Thunder Coins with USDC. 100 Thunders = $1. Get bonus on bulk purchase.
                </p>
              </div>

              <div className="glass-card p-8 text-center space-y-4">
                <div className="step-badge mx-auto">2</div>
                <h3 className="text-xl font-semibold">Play Epic Games</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  CoinFlip, Dice, Slots. All provably fair. Bet your Thunders and win big.
                </p>
              </div>

              <div className="glass-card p-8 text-center space-y-4">
                <div className="step-badge mx-auto">3</div>
                <h3 className="text-xl font-semibold">Claim Rewards</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Top 100 monthly players earn real USDC rewards. Compete on leaderboard.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
