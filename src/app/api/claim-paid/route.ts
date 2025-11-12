import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const PAYMENT_WALLET = '0xC950198D7fB2532BF9325Ef0d5bE82E5d555055C'

const publicClient = createPublicClient({
  chain: base,
  transport: http()
})

export async function POST(req: NextRequest) {
  try {
    const { fid, txHash } = await req.json()
    
    console.log('📥 Received claim request:', { fid, txHash })
    
    if (!fid || !txHash) {
      return Response.json({ error: 'Missing data' }, { status: 400 })
    }
    
    // 1. Sprawdź czy transakcja istnieje i jest potwierdzona
    console.log('🔍 Checking transaction...')
    const tx = await publicClient.getTransactionReceipt({ 
      hash: txHash as `0x${string}`
    })
    
    if (!tx) {
      console.log('❌ Transaction not found')
      return Response.json({ error: 'Transaction not found' }, { status: 404 })
    }
    
    console.log('✅ Transaction found:', tx)
    
    // 2. Zweryfikuj czy payment poszedł do Twojego walleta
    if (tx.to?.toLowerCase() !== PAYMENT_WALLET.toLowerCase()) {
      console.log('❌ Invalid recipient:', tx.to)
      return Response.json({ error: 'Invalid recipient' }, { status: 400 })
    }
    
    // 3. Sprawdź kwotę (minimum 0.00001 ETH = 10000000000000 wei)
    const txDetails = await publicClient.getTransaction({ 
      hash: txHash as `0x${string}`
    })
    
    const minAmount = BigInt('10000000000000') // 0.00001 ETH in wei
    console.log('💰 Transaction value:', txDetails.value.toString(), 'wei')
    console.log('💰 Minimum required:', minAmount.toString(), 'wei')
    
    if (txDetails.value < minAmount) {
      console.log('❌ Payment too low')
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
      console.log('❌ Already claimed')
      return Response.json({ error: 'Already claimed' }, { status: 400 })
    }
    
    // 5. Pobierz user data
    const { data: user, error: userError } = await supabase
      .from('user_points')
      .select('points')
      .eq('fid', fid)
      .single()
    
    if (userError || !user) {
      console.log('❌ User not found:', userError)
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
    
    const bonusAmount = 200
    const newBalance = user.points + bonusAmount
    
    console.log('✅ Adding bonus:', bonusAmount, 'New balance:', newBalance)
    
    // 6. Zaktualizuj punkty
    const { error: updateError } = await supabase
      .from('user_points')
      .update({ points: newBalance })
      .eq('fid', fid)
    
    if (updateError) {
      console.log('❌ Update error:', updateError)
      throw updateError
    }
    
    // 7. Zapisz paid claim
    const { error: insertError } = await supabase
      .from('paid_claims')
      .insert({
        fid,
        tx_hash: txHash,
        amount: txDetails.value.toString(),
        bonus_amount: bonusAmount,
        created_at: new Date().toISOString()
      })
    
    if (insertError) {
      console.log('❌ Insert error:', insertError)
      throw insertError
    }
    
    console.log('✅ Claim successful!')
    
    return Response.json({
      success: true,
      bonus: bonusAmount,
      newBalance
    })
    
  } catch (error) {
    console.error('❌ Paid claim error:', error)
    return Response.json({ 
      error: 'Failed to process payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
