export function formatThunderPrice(rawPrice: bigint): string {
  const usdc = Number(rawPrice) / 1e6;
  if (usdc > 100000) {
    return "~$0.001";
  }
  return `$${usdc.toFixed(4)}`;
}
