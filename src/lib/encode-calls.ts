import { encodeAbiParameters, encodeFunctionData, parseUnits } from 'viem';
import USDCABI from './abis/USDC.json';
import ThunderABI from './abis/ThunderBondingCurve.json';

const THUNDER_CONTRACT = '0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519';

export function encodeApproveUSDC(amount: string = '1000000'): `0x${string}` {
  return encodeFunctionData({
    abi: USDCABI,
    functionName: 'approve',
    args: [THUNDER_CONTRACT as `0x${string}`, parseUnits(amount, 6)],
  });
}

export function encodeBuyThunder(thunderAmount: string): `0x${string}` {
  return encodeFunctionData({
    abi: ThunderABI,
    functionName: 'buy',
    args: [parseUnits(thunderAmount, 18)],
  });
}
