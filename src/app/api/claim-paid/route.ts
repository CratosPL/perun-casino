import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

// Twój wallet (ten sam co w komponencie!)
const PAYMENT_WALLET = '0xC950198D7fB2532BF9325Ef0d5bE82E5d555055C' // ← ZMIEŃ NA SWÓJ

// Client do sprawdzania transakcji na Base
const publicClient = createPublicClient({
  chain: base,
  transport: http()
})

export async function POST(req: NextRequest) {
  try {
    const { fid, txHash } = await req.json()
    
    if (!fid || !txHash) {
      return Response.json({ error: 'Missing data' }, { status: 400 })
    }
    
    // 1. Sprawdź czy transakcja istnieje i jest potwierdzona
    const tx = await publicClient.getTransactionReceipt({ 
      hash: txHash as `0x${string}`
    })
    
    if (!tx) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 })
    }
    
    // 2. Zweryfikuj czy payment poszedł do Twojego walleta
    if (tx.to?.toLowerCase() !== PAYMENT_WALLET.toLowerCase()) {
      return Response.json({ error: 'Invalid recipient' }, { status: 400 })
    }
    
    // 3. Sprawdź kwotę (minimum 0.00003 ETH)
    const txDetails = await publicClient.getTransaction({ 
      hash: txHash as `0x${string}`
    })
    
const minAmount = BigInt('500000000000000') // 0.00003 ETH in wei
    if (txDetails.value < minAmount) {
      return Response.json({ error: 'Payment too low' }, { status: 400 })
    }
    
    const supabase = getSupabaseAdmin()
    
    // 4. Sprawdź czy ten txHash nie był już użyty
    const { data: existingClaim } = await supabase
      .from('paid_claims')
      .select('id')
      .eq('tx_hash', txHash)
      .single()
    
    if (existingClaim) {
      return Response.json({ error: 'Already claimed' }, { status: 400 })
    }
    
    // 5. Pobierz user data
    const { data: user } = await supabase
      .from('user_points')
      .select('points')
      .eq('fid', fid)
      .single()
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    
    const bonusAmount = 200 // Quick claim bonus
    const newBalance = user.points + bonusAmount
    
    // 6. Zaktualizuj punkty
    await supabase
      .from('user_points')
      .update({ points: newBalance })
      .eq('fid', fid)
    
    // 7. Zapisz paid claim (żeby nie można było użyć tego samego txHash 2x)
    await supabase
      .from('paid_claims')
      .insert({
        fid,
        tx_hash: txHash,
        amount: txDetails.value.toString(),
        bonus_amount: bonusAmount,
        created_at: new Date().toISOString()
      })
    
    return Response.json({
      success: true,
      bonus: bonusAmount,
      newBalance
    })
    
  } catch (error) {
    console.error('Paid claim error:', error)
    return Response.json({ 
      error: 'Failed to process payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
