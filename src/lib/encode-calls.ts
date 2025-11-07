import { encodeFunctionData, parseUnits } from 'viem';
import USDCABI from './abis/USDC.json';
import ThunderCasinoV2ABI from './abis/ThunderBondingCurve.json';

const THUNDER_CONTRACT = '0xea0438580AaaA57BD27811428169566060073B6e';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export function encodeApproveUSDC(amount: string): `0x${string}` {
  return encodeFunctionData({
    abi: USDCABI,
    functionName: 'approve',
    args: [THUNDER_CONTRACT as `0x${string}`, parseUnits(amount, 6)],
  });
}

export function encodeBuyThunder(thunderAmount: string): `0x${string}` {
  return encodeFunctionData({
    abi: ThunderCasinoV2ABI,
    functionName: 'buy',
    args: [parseUnits(thunderAmount, 18)],
  });
}

export function encodeSellThunder(thunderAmount: string): `0x${string}` {
  return encodeFunctionData({
    abi: ThunderCasinoV2ABI,
    functionName: 'sell',
    args: [parseUnits(thunderAmount, 18)],
  });
}
