import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { 
  generateKenoNumbers, 
  generateServerSeed,
  generateVerificationUrl
} from '@/lib/provably-fair'

// ✅ ZMIEŃ NA ANGIELSKIE (jak w frontendzie)
type RiskLevel = 'Classic' | 'Low' | 'Medium' | 'High';

// ✅ DOKŁADNE PAYOUTS z angielskimi kluczami
const PAYOUT_TABLES: Record<RiskLevel, Record<number, Record<number, number>>> = {
  Classic: {
    1: { 0: 0, 1: 3.96 },
    2: { 0: 0, 1: 1.90, 2: 4.50 },
    3: { 0: 0, 1: 1, 2: 3.10, 3: 10.4 },
    4: { 0: 0, 1: 0.80, 2: 1.80, 3: 5, 4: 22.50 },
    5: { 0: 0, 1: 0.25, 2: 1.40, 3: 4.10, 4: 16.50, 5: 36 },
    6: { 0: 0, 1: 0, 2: 1, 3: 3.68, 4: 7, 5: 16.50, 6: 40 },
    7: { 0: 0, 1: 0, 2: 0.47, 3: 3, 4: 4.50, 5: 14, 6: 31, 7: 60 },
    8: { 0: 0, 1: 0, 2: 0, 3: 2.20, 4: 4, 5: 13, 6: 22, 7: 55, 8: 70 },
    9: { 0: 0, 1: 0, 2: 0, 3: 1.55, 4: 3, 5: 8, 6: 15, 7: 44, 8: 60, 9: 85 },
    10: { 0: 0, 1: 0, 2: 0, 3: 1.40, 4: 2.25, 5: 4.50, 6: 8, 7: 17, 8: 50, 9: 80, 10: 100 }
  },
  Low: {
    1: { 0: 0.70, 1: 1.85 },
    2: { 0: 0, 1: 2, 2: 3.80 },
    3: { 0: 0, 1: 1.10, 2: 1.38, 3: 26 },
    4: { 0: 0, 1: 0, 2: 2.20, 3: 7.90, 4: 90 },
    5: { 0: 0, 1: 0, 2: 1.50, 3: 4.20, 4: 13, 5: 300 },
    6: { 0: 0, 1: 0, 2: 1.10, 3: 2, 4: 6.20, 5: 110, 6: 700 },
    7: { 0: 0, 1: 0, 2: 1.10, 3: 1.60, 4: 3.50, 5: 15, 6: 225, 7: 700 },
    8: { 0: 0, 1: 0, 2: 1.10, 3: 1.50, 4: 1, 5: 5.50, 6: 39, 7: 100, 8: 800 },
    9: { 0: 0, 1: 0, 2: 1.10, 3: 1.30, 4: 1.70, 5: 2.50, 6: 7.50, 7: 50, 8: 250, 9: 1000 },
    10: { 0: 0, 1: 0, 2: 1.10, 3: 1.20, 4: 1.30, 5: 1.80, 6: 3.50, 7: 13, 8: 50, 9: 250, 10: 1000 }
  },
  Medium: {
    1: { 0: 0.40, 1: 2.75 },
    2: { 0: 0, 1: 2, 2: 5.10 },
    3: { 0: 0, 1: 0, 2: 2.80, 3: 50 },
    4: { 0: 0, 1: 0, 2: 1.70, 3: 10, 4: 100 },
    5: { 0: 0, 1: 0, 2: 1.40, 3: 4, 4: 14, 5: 390 },
    6: { 0: 0, 1: 0, 2: 0, 3: 3, 4: 9, 5: 180, 6: 710 },
    7: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 7, 5: 30, 6: 400, 7: 800 },
    8: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 4, 5: 11, 6: 67, 7: 400, 8: 900 },
    9: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 2.50, 5: 5, 6: 15, 7: 100, 8: 500, 9: 1000 },
    10: { 0: 0, 1: 0, 2: 0, 3: 1.60, 4: 2, 5: 4, 6: 7, 7: 26, 8: 100, 9: 500, 10: 1000 }
  },
  High: {
    1: { 0: 0, 1: 3.96 },
    2: { 0: 0, 1: 0, 2: 17.1 },
    3: { 0: 0, 1: 0, 2: 0, 3: 81.5 },
    4: { 0: 0, 1: 0, 2: 0, 3: 10, 4: 259 },
    5: { 0: 0, 1: 0, 2: 0, 3: 4.50, 4: 48, 5: 450 },
    6: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 11, 5: 350, 6: 710 },
    7: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 7, 5: 90, 6: 400, 7: 800 },
    8: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 5, 5: 20, 6: 270, 7: 600, 8: 900 },
    9: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 4, 5: 11, 6: 56, 7: 500, 8: 800, 9: 1000 },
    10: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 3.50, 5: 8, 6: 13, 7: 63, 8: 500, 9: 800, 10: 1000 }
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fid, gameType, betAmount, selectedNumbers, clientSeed, riskLevel = 'Classic', numberOfPicks } = body
    
    // Validation
    if (!fid || !betAmount || betAmount <= 0) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }
    
    if (!clientSeed || clientSeed.length < 10) {
      return Response.json({ error: 'Client seed required (min 10 chars)' }, { status: 400 })
    }
    
    if (gameType === 'keno') {
      if (!selectedNumbers || selectedNumbers.length < 1 || selectedNumbers.length > 10) {
        return Response.json({ error: 'Select 1-10 numbers' }, { status: 400 })
      }
      
      if (!numberOfPicks || numberOfPicks < 1 || numberOfPicks > 10) {
        return Response.json({ error: 'Number of picks must be 1-10' }, { status: 400 })
      }
      
      if (selectedNumbers.length !== numberOfPicks) {
        return Response.json({ error: `Must select exactly ${numberOfPicks} numbers` }, { status: 400 })
      }
      
      // Validate numbers are 1-40
      if (selectedNumbers.some((n: number) => n < 1 || n > 40)) {
        return Response.json({ error: 'Numbers must be between 1-40' }, { status: 400 })
      }
    }
    
    const supabase = getSupabaseAdmin()
    
    // 1. Get user data including seeds
    const { data: user } = await supabase
      .from('user_points')
      .select('points, current_server_seed, current_server_seed_hash, nonce, client_seed, total_wagered, total_won, games_played')
      .eq('fid', fid)
      .single()
    
    if (!user) {
      const { seed, hash } = generateServerSeed()
      
      await supabase
        .from('user_points')
        .insert({
          fid,
          points: 2500,
          current_server_seed: seed,
          current_server_seed_hash: hash,
          client_seed: clientSeed,
          nonce: 0,
          total_wagered: 0,
          total_won: 0,
          games_played: 0
        })
      
      return Response.json({ error: 'User initialized, please play again' }, { status: 400 })
    }
    
    const currentPoints = user.points
    const serverSeed = user.current_server_seed
    const serverSeedHash = user.current_server_seed_hash
    const nonce = user.nonce
    
    const currentWagered = user.total_wagered || 0
    const currentWon = user.total_won || 0
    const currentGames = user.games_played || 0
    
    if (currentPoints < betAmount) {
      return Response.json({ error: 'Insufficient points' }, { status: 400 })
    }
    
    // 2. Generate provably fair result (10 numbers from 1-40)
    const drawnNumbers = generateKenoNumbers(clientSeed, serverSeed, nonce)
    
    const matches = selectedNumbers.filter((n: number) => drawnNumbers.includes(n)).length
    
    // ✅ POPRAWIONE: Sprawdź czy riskLevel jest poprawny
    const validRiskLevels: RiskLevel[] = ['Classic', 'Low', 'Medium', 'High'];
    const normalizedRiskLevel = validRiskLevels.includes(riskLevel as RiskLevel) 
      ? (riskLevel as RiskLevel) 
      : 'Classic';
    
    const payoutTable = PAYOUT_TABLES[normalizedRiskLevel];
    const multiplier = payoutTable[numberOfPicks]?.[matches] || 0;
    const payout = betAmount * multiplier;
    const newBalance = currentPoints - betAmount + payout;
    
    // 3. Generate next server seed for next game
    const nextSeed = generateServerSeed()
    
    // 4. Update user
    await supabase
      .from('user_points')
      .update({
        points: newBalance,
        current_server_seed: nextSeed.seed,
        current_server_seed_hash: nextSeed.hash,
        client_seed: clientSeed,
        nonce: nonce + 1,
        total_wagered: currentWagered + betAmount,
        total_won: currentWon + payout,
        games_played: currentGames + 1,
        last_activity: new Date().toISOString()
      })
      .eq('fid', fid)
    
    // 5. Generate verification URL
    const verificationUrl = generateVerificationUrl(
      clientSeed,
      serverSeed,
      nonce,
      drawnNumbers
    )
    
    // 6. Save to history with verification data
    await supabase
      .from('game_history')
      .insert({
        fid,
        game_type: gameType,
        bet_amount: betAmount,
        payout,
        result: {
          selectedNumbers,
          drawnNumbers,
          matches,
          multiplier,
          riskLevel: normalizedRiskLevel,
          numberOfPicks
        },
        client_seed: clientSeed,
        server_seed: serverSeed,
        server_seed_hash: serverSeedHash,
        nonce,
        verification_url: verificationUrl
      })
    
    return Response.json({
      success: true,
      result: {
        drawnNumbers,
        matches,
        multiplier,
        payout,
        numberOfPicks
      },
      newBalance,
      provablyFair: {
        clientSeed,
        serverSeed,
        serverSeedHash,
        nextServerSeedHash: nextSeed.hash,
        nonce,
        verificationUrl
      }
    })
    
  } catch (error) {
    console.error('Game error:', error)
    return Response.json({ 
      error: 'Game processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
