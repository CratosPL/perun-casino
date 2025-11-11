import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// Funkcja obliczająca bonus (taka sama jak w komponencie)
function calculateDailyBonus(streak: number): number {
  const baseBonus = 100;
  const bonusPerDay = 20;
  const maxBonus = 300;

  // Specjalne bonusy
  if (streak === 7) return 500;   // 7 dni → 500 pts
  if (streak === 30) return 1500; // 30 dni → 1500 pts

  const bonus = baseBonus + (streak - 1) * bonusPerDay;
  return Math.min(bonus, maxBonus);
}

export async function POST(req: NextRequest) {
  try {
    const { fid } = await req.json()
    
    if (!fid) {
      return Response.json({ error: 'Missing FID' }, { status: 400 })
    }
    
    const supabase = getSupabaseAdmin()
    
    // 1. Pobierz dane użytkownika
    const { data: user, error: userError } = await supabase
      .from('user_points')
      .select('points, last_daily_bonus, daily_streak')
      .eq('fid', fid)
      .single()
    
    if (userError || !user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    
    // 2. Sprawdź czy już odebrał dzisiaj
    const now = new Date()
    const lastBonus = user.last_daily_bonus ? new Date(user.last_daily_bonus) : null
    
    if (lastBonus) {
      const timeDiff = now.getTime() - lastBonus.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      // Jeśli minęło mniej niż 24h
      if (hoursDiff < 24) {
        const hoursLeft = Math.ceil(24 - hoursDiff)
        return Response.json({ 
          error: `Already claimed today. Try again in ${hoursLeft}h` 
        }, { status: 429 })
      }
    }
    
    // 3. Oblicz streak
    let newStreak = 1
    if (lastBonus) {
      const daysSinceLastBonus = Math.floor((now.getTime() - lastBonus.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysSinceLastBonus === 1) {
        // Kolejny dzień - zwiększ streak
        newStreak = (user.daily_streak || 0) + 1
      } else if (daysSinceLastBonus > 1) {
        // Przerwa - reset streak
        newStreak = 1
      }
    }
    
    // 4. Oblicz bonus
    const bonusAmount = calculateDailyBonus(newStreak)
    const newBalance = user.points + bonusAmount
    
    // 5. Zaktualizuj użytkownika
    const { error: updateError } = await supabase
      .from('user_points')
      .update({
        points: newBalance,
        last_daily_bonus: now.toISOString(),
        daily_streak: newStreak
      })
      .eq('fid', fid)
    
    if (updateError) {
      throw updateError
    }
    
    return Response.json({
      success: true,
      bonus: bonusAmount,
      streak: newStreak,
      newBalance
    })
    
  } catch (error) {
    console.error('Daily bonus error:', error)
    return Response.json({ 
      error: 'Failed to claim bonus',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
