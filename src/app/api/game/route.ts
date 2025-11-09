import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { 
  generateKenoNumbers, 
  generateServerSeed,
  generateVerificationUrl,
  generateVerificationHash
} from '@/lib/provably-fair'

const KENO_PAYOUTS: Record<number, Record<number, number>> = {
  1: { 1: 3 },
  2: { 2: 12 },
  3: { 2: 1, 3: 40 },
  4: { 2: 1, 3: 5, 4: 100 },
  5: { 3: 2, 4: 15, 5: 500 },
  6: { 3: 1, 4: 5, 5: 80, 6: 1500 },
  7: { 4: 2, 5: 20, 6: 200, 7: 5000 },
  8: { 5: 10, 6: 80, 7: 500, 8: 10000 },
  9: { 5: 5, 6: 30, 7: 200, 8: 2000, 9: 20000 },
  10: { 5: 2, 6: 20, 7: 100, 8: 1000, 9: 5000, 10: 50000 }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fid, gameType, betAmount, selectedNumbers, clientSeed } = body
    
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
    }
    
    const supabase = getSupabaseAdmin()
    
    // 1. Get user data including seeds ✅ POPRAWKA: dodano total_wagered, total_won, games_played
    const { data: user } = await supabase
      .from('user_points')
      .select('points, current_server_seed, current_server_seed_hash, nonce, client_seed, total_wagered, total_won, games_played')
      .eq('fid', fid)
      .single()
    
    if (!user) {
      // New user - initialize with seeds
      const { seed, hash } = generateServerSeed()
      
      await supabase
        .from('user_points')
        .insert({
          fid,
          points: 1000,
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
    
    // ✅ POPRAWKA: Dodaj default values jeśli null
    const currentWagered = user.total_wagered || 0
    const currentWon = user.total_won || 0
    const currentGames = user.games_played || 0
    
    if (currentPoints < betAmount) {
      return Response.json({ error: 'Insufficient points' }, { status: 400 })
    }
    
    // 2. Generate provably fair result
    const drawnNumbers = generateKenoNumbers(clientSeed, serverSeed, nonce)
    
    const matches = selectedNumbers.filter((n: number) => drawnNumbers.includes(n)).length
    const multiplier = KENO_PAYOUTS[selectedNumbers.length]?.[matches] || 0
    const payout = betAmount * multiplier
    const newBalance = currentPoints - betAmount + payout
    
    // 3. Generate next server seed for next game
    const nextSeed = generateServerSeed()
    
    // 4. Update user ✅ POPRAWKA: użyj zmiennych z default values
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
          multiplier
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
        payout
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
