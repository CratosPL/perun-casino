export function formatThunderPrice(thunderAmount: bigint): string {
  // INITIAL_PRICE = 0.001 USDC per 1000 Thunder
  // = 0.000001 USDC per Thunder
  
  const amount = Number(thunderAmount) / 1e18; // Convert to Thunder count
  const pricePerThunder = 0.000001; // 0.001 USDC per 1000 Thunder
  const totalPrice = amount * pricePerThunder;
  
  return totalPrice < 0.01 
    ? "~$0.001" 
    : `$${totalPrice.toFixed(6)}`;
}
