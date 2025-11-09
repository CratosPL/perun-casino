'use client'
import { useSearchParams } from 'next/navigation'
import { verifyGameResult, generateKenoNumbers } from '@/lib/provably-fair'
import { Suspense } from 'react'

function VerifyContent() {
  const searchParams = useSearchParams()
  
  const clientSeed = searchParams.get('client') || ''
  const serverSeed = searchParams.get('server') || ''
  const nonce = parseInt(searchParams.get('nonce') || '0')
  const claimedResult = JSON.parse(searchParams.get('result') || '[]')
  
  const verification = verifyGameResult(
    clientSeed,
    serverSeed,
    '', // Hash not needed here
    nonce,
    claimedResult
  )
  
  const regenerated = generateKenoNumbers(clientSeed, serverSeed, nonce)
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Game Verification</h1>
        
        <div className={`p-6 rounded-lg mb-8 ${
          verification.valid ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'
        }`}>
          <div className="text-2xl font-bold mb-2">
            {verification.valid ? '✅ Result Verified' : '❌ Verification Failed'}
          </div>
          <div>{verification.message}</div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Client Seed:</h3>
            <div className="font-mono break-all text-sm">{clientSeed}</div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Server Seed:</h3>
            <div className="font-mono break-all text-sm">{serverSeed}</div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Nonce:</h3>
            <div className="font-mono text-sm">{nonce}</div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Claimed Result:</h3>
            <div className="font-mono text-sm">{claimedResult.join(', ')}</div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Regenerated Result:</h3>
            <div className="font-mono text-sm">{regenerated.join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
