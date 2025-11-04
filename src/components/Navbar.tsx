'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMiniKit } from '@/lib/minikit-provider';

export function Navbar() {
  const [coinsBalance] = useState(0);
  const { isSDKLoaded, user } = useMiniKit();

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
              PERUN
            </div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
              Casino
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
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
          <Link 
            href="/dashboard" 
            className="text-sm font-medium hover:text-white transition"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Dashboard
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Coins Balance */}
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{coinsBalance.toLocaleString()}</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                Thunders
              </span>
            </div>
          </div>

          {/* User Profile or Login */}
          {isSDKLoaded && user.fid ? (
            // Logged in - show user profile
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              {user.pfpUrl && (
                <img 
                  src={user.pfpUrl} 
                  alt={user.username || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {user.displayName || user.username || `User ${user.fid}`}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  FID: {user.fid}
                </span>
              </div>
            </div>
          ) : (
            // Not logged in - show message
            <div className="glass-card px-5 py-3">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Open in Base app
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
