import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const myFid = searchParams.get('fid')
    const timeframe = searchParams.get('timeframe') || 'all-time' // all-time, weekly, daily
    
    const supabase = getSupabaseAdmin()
    
    let query = supabase
      .from('user_points')
      .select('fid, points, games_played, total_won, total_wagered, daily_streak, last_activity')
    
    // Filter by timeframe
    if (timeframe === 'weekly') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      query = query.gte('last_activity', weekAgo.toISOString())
    } else if (timeframe === 'daily') {
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      query = query.gte('last_activity', dayAgo.toISOString())
    }
    
    // ✅ POPRAWKA: Sortuj po total_won (skill), nie points (luck + bonuses)
    const { data: leaderboard } = await query
      .order('total_won', { ascending: false })
      .order('total_wagered', { ascending: false }) // Tiebreaker
      .limit(limit)
    
    // Get my rank if FID provided
    let myRank = null
    let myData = null
    
    if (myFid) {
      const { data: userData } = await supabase
        .from('user_points')
        .select('*')
        .eq('fid', parseInt(myFid))
        .single()
      
      if (userData) {
        // Calculate rank
        const { count } = await supabase
          .from('user_points')
          .select('*', { count: 'exact', head: true })
          .gt('total_won', userData.total_won)
        
        myRank = (count || 0) + 1
        myData = userData
      }
    }
    
    return Response.json({
      success: true,
      leaderboard: leaderboard || [],
      myRank,
      myData,
      timeframe
    })
    
  } catch (error) {
    console.error('Leaderboard error:', error)
    return Response.json({ 
      error: 'Failed to fetch leaderboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
