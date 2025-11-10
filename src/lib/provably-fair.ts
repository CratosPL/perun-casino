import crypto from 'crypto'

export interface GameSeeds {
  clientSeed: string
  serverSeed: string
  serverSeedHash: string
  nonce: number
}

export interface VerifiableResult {
  result: number[]
  seeds: GameSeeds
  verificationHash: string
}

// Generate server seed pair
export function generateServerSeed(): { seed: string; hash: string } {
  const seed = crypto.randomBytes(32).toString('hex')
  const hash = crypto.createHash('sha256').update(seed).digest('hex')
  
  return { seed, hash }
}

// Generate hash for verification
export function generateVerificationHash(
  clientSeed: string,
  serverSeed: string,
  nonce: number
): string {
  const combined = `${clientSeed}:${serverSeed}:${nonce}`
  return crypto.createHash('sha256').update(combined).digest('hex')
}

// Verify server seed matches hash
export function verifyServerSeed(serverSeed: string, serverSeedHash: string): boolean {
  const computedHash = crypto.createHash('sha256').update(serverSeed).digest('hex')
  return computedHash === serverSeedHash
}

// ✅ ZAKTUALIZOWANE: Generate Keno numbers (10 z 40 zamiast 20 z 80)
export function generateKenoNumbers(
  clientSeed: string,
  serverSeed: string,
  nonce: number
): number[] {
  const hash = generateVerificationHash(clientSeed, serverSeed, nonce)
  const numbers: number[] = []
  
  let currentHash = hash
  let index = 0
  
  // ✅ ZMIENIONE: 10 liczb zamiast 20
  while (numbers.length < 10) {
    // Take 4 characters (2 bytes) from hash
    if (index + 4 > currentHash.length) {
      // Rehash if we run out
      currentHash = crypto.createHash('sha256').update(currentHash).digest('hex')
      index = 0
    }
    
    const byte = parseInt(currentHash.slice(index, index + 4), 16)
    index += 4
    
    // ✅ ZMIENIONE: Map to 1-40 range (było 1-80)
    const num = (byte % 40) + 1
    
    // Ensure unique
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  
  return numbers
}

// Verify game result
export function verifyGameResult(
  clientSeed: string,
  serverSeed: string,
  serverSeedHash: string,
  nonce: number,
  claimedResult: number[]
): { valid: boolean; message: string } {
  // 1. Verify server seed wasn't changed
  if (!verifyServerSeed(serverSeed, serverSeedHash)) {
    return { valid: false, message: 'Server seed hash mismatch' }
  }
  
  // 2. Regenerate result
  const regeneratedResult = generateKenoNumbers(clientSeed, serverSeed, nonce)
  
  // 3. Compare
  const resultsMatch = JSON.stringify(regeneratedResult.sort()) === JSON.stringify(claimedResult.sort())
  
  return {
    valid: resultsMatch,
    message: resultsMatch ? 'Result verified ✅' : 'Result mismatch ❌'
  }
}

// Generate verification URL (for transparency)
export function generateVerificationUrl(
  clientSeed: string,
  serverSeed: string,
  nonce: number,
  result: number[]
): string {
  const params = new URLSearchParams({
    client: clientSeed,
    server: serverSeed,
    nonce: nonce.toString(),
    result: JSON.stringify(result)
  })
  
  return `/verify?${params.toString()}`
}
