'use client';
import { Navbar } from '@/components/Navbar';
import KenoGame from '@/components/games/KenoGame';

export default function KenoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-24 relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="thunder-gradient">⚡ Thunder Keno</span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Pick 1-10 numbers and win up to 50,000x your bet
            </p>
          </div>
          <KenoGame />
        </div>
      </main>
    </>
  );
}
