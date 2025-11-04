import { createConnector } from 'wagmi';
import { custom } from 'viem';
import sdk from '@farcaster/frame-sdk';

export function farcasterConnector() {
  let provider: any = null;

  return createConnector((config) => ({
    id: 'farcaster',
    name: 'Farcaster',
    type: 'farcaster' as any,
    
    async connect() {
      const context = await sdk.context;
      const address = context?.user?.custody as `0x${string}`;
      
      if (!address) {
        throw new Error('No Farcaster wallet found');
      }

      // Create custom provider using Farcaster's embedded wallet
      provider = await sdk.wallet.ethProvider;
      
      return {
        accounts: [address],
        chainId: 8453, // Base mainnet
      };
    },
    
    async disconnect() {
      provider = null;
    },
    
    async getAccounts() {
      const context = await sdk.context;
      const address = context?.user?.custody;
      return address ? [address as `0x${string}`] : [];
    },
    
    async getChainId() {
      return 8453; // Base mainnet
    },
    
    async isAuthorized() {
      const context = await sdk.context;
      return !!context?.user?.custody;
    },
    
    async getProvider() {
      if (!provider) {
        provider = await sdk.wallet.ethProvider;
      }
      return custom(provider);
    },
    
    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {},
  }));
}

