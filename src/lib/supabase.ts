import { createClient } from '@supabase/supabase-js'

// Client-side (bezpieczne w browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
)

// Server-side helper - TYLKO dla API routes
export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin can only be used server-side')
  }
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper functions
export async function getUserPoints(fid: number) {
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('fid', fid)
    .single()
  
  if (error && error.code === 'PGRST116') {
    return { fid, points: 1000, games_played: 0 }
  }
  
  return data
}

export async function getGameHistory(fid: number, limit = 10) {
  const { data } = await supabase
    .from('game_history')
    .select('*')
    .eq('fid', fid)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return data || []
}
