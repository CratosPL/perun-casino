import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fid: string }> }  // ✅ Promise!
) {
  try {
    const { fid: fidString } = await params;  // ✅ Await params
    const fid = parseInt(fidString);
    console.log('📡 [API] GET /api/user - FID:', fid);

    if (isNaN(fid)) {
      return NextResponse.json({ error: 'Invalid FID' }, { status: 400 });
    }

    // Fetch user from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();

    console.log('📊 [API] Supabase response:', { data, error });

    if (error) {
      console.error('❌ [API] Supabase error:', error);
      // If user not found, return default points
      if (error.code === 'PGRST116') {
        console.log('🆕 [API] User not found, returning defaults');
        return NextResponse.json({
          fid,
          points: 2500,
          daily_streak: 0,
          total_wagered: 0,
          total_won: 0,
          games_played: 0,
          last_daily_claim: null,
          created_at: new Date().toISOString()
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ [API] Returning user data:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ [API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
