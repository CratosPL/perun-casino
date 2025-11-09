import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { fid } = await req.json()
    
    if (!fid) {
      return Response.json({ error: 'Missing FID' }, { status: 400 })
    }
    
    const supabase = getSupabaseAdmin()
    
    // Call daily bonus function - bez .single()!
    const { data, error } = await supabase
      .rpc('claim_daily_bonus', { p_fid: fid })
    
    if (error) {
      if (error.message.includes('Already claimed')) {
        return Response.json({ error: 'Already claimed today' }, { status: 429 })
      }
      throw error
    }
    
    // ✅ POPRAWKA: data jest array z TABLE returns
    const result = Array.isArray(data) ? data[0] : data
    
    return Response.json({
      success: true,
      bonus: result.bonus_amount,
      streak: result.new_streak,
      newBalance: result.new_balance
    })
    
  } catch (error) {
    console.error('Daily bonus error:', error)
    return Response.json({ 
      error: 'Failed to claim bonus',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
