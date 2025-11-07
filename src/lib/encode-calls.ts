import { encodeFunctionData, parseUnits } from 'viem';
import USDCABI from './abis/USDC.json';
import ThunderBondingCurveABI from './abis/ThunderBondingCurve.json'; // ✅ Zmieniono

const THUNDER_CONTRACT = '0xCEE5a722fAFBbA2C30fE6B9f04EB70728323d469'; // ✅ Nowy adres
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
    abi: ThunderBondingCurveABI, // ✅ Zmieniono
    functionName: 'buy',
    args: [parseUnits(thunderAmount, 18)],
  });
}

export function encodeSellThunder(thunderAmount: string): `0x${string}` {
  return encodeFunctionData({
    abi: ThunderBondingCurveABI, // ✅ Zmieniono
    functionName: 'sell',
    args: [parseUnits(thunderAmount, 18)],
  });
}
