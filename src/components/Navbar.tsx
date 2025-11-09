'use client';

import Link from 'next/link';
import { MiniKitConnect } from './MiniKitConnect';
import { useMiniKit } from '@/lib/minikit-provider';

export function Navbar() {
  const { user } = useMiniKit();

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{ 
      background: 'rgba(10, 14, 39, 0.8)',
      borderColor: 'var(--color-border)'
    }}>
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl thunder-icon">⚡</span>
          <div>
            <div className="text-xl font-bold tracking-tight thunder-gradient">
              Thunder
            </div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
              Casino
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm font-medium hover:text-white transition"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Home
          </Link>
          <Link 
            href="/games" 
            className="text-sm font-medium hover:text-white transition"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Games
          </Link>
          <Link 
            href="/leaderboard" 
            className="text-sm font-medium hover:text-white transition"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Leaderboard
          </Link>
        </div>

        {/* Right side - Points Display */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="glass-card px-5 py-3 flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">1,000</span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                  Points
                </span>
              </div>
            </div>
          )}

          <MiniKitConnect />
        </div>
      </div>
    </nav>
  );
}
