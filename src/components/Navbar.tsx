'use client';

import Link from 'next/link';
import { MiniKitConnect } from './MiniKitConnect';
import { useMiniKit } from '@/lib/minikit-provider';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export function Navbar() {
  const { user } = useMiniKit();
  const pathname = usePathname();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    if (!user?.fid) {
      console.log('❌ No user FID:', user); // ✅ DEBUG
      setLoading(false);
      return;
    }

    const loadPoints = async () => {
      try {
        console.log('🔍 Loading points for FID:', user.fid); // ✅ DEBUG
        
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

const { data, error } = await supabase
  .from('user_points')
  .select('points')
  .eq('fid', user.fid)
  .maybeSingle(); // ✅ zamiast .single()

        console.log('📊 Supabase response:', { data, error }); // ✅ DEBUG

        if (data) {
          setPoints(data.points);
          console.log('✅ Points loaded:', data.points); // ✅ DEBUG
        } else {
          console.log('❌ No data found for FID:', user.fid); // ✅ DEBUG
        }
      } catch (error) {
        console.error('❌ Failed to load points:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPoints();

    // Refresh co 5 sekund
    const interval = setInterval(loadPoints, 5000);
    return () => clearInterval(interval);
  }, [user?.fid]);

  return (
    <>
      {/* Top Bar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{ 
        background: 'rgba(10, 14, 39, 0.95)',
        borderColor: 'var(--color-border)'
      }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl thunder-icon">⚡</span>
            <div>
              <div className="text-lg font-bold tracking-tight thunder-gradient">
                Thunder
              </div>
            </div>
          </Link>

{user && (
  <div className="glass-card px-3 py-2 flex items-center gap-2">
    <span className="text-lg">⚡</span>
    <div className="flex flex-col leading-tight">
      {loading ? (
        <span className="text-xs text-gray-400">...</span>
      ) : (
        <span className="text-xs font-semibold">{points.toLocaleString()}</span>
      )}
      <span className="text-[8px] uppercase tracking-wider text-gray-400">
        pts
      </span>
    </div>
  </div>
)}

        </div>
      </nav>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 backdrop-blur-xl border-t safe-area-bottom" style={{ 
        background: 'rgba(10, 14, 39, 0.95)',
        borderColor: 'var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div className="container mx-auto px-2 h-16 flex items-center justify-around">
          
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
              isActive('/') ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link 
            href="/games" 
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
              pathname.startsWith('/games') ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium">Games</span>
          </Link>

          <Link 
            href="/leaderboard" 
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
              isActive('/leaderboard') ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-[10px] font-medium">Ranks</span>
          </Link>

          <button 
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
              user ? 'text-green-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            {user ? (
              <>
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[10px] font-medium">You</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-[10px] font-medium">Login</span>
              </>
            )}
          </button>

        </div>
      </nav>
    </>
  );
}
