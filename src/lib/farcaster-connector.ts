import { createConnector } from 'wagmi';
import { getAddress } from 'viem';
import { ChainNotConfiguredError } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';

export type FarcasterConnectorOptions = {};

export function farcasterConnector(options: FarcasterConnectorOptions = {}) {
  let provider: any;

  return createConnector((config) => ({
    id: 'farcasterFrame',
    name: 'Farcaster',
    type: 'injected',

    async connect({ chainId } = {}) {
      try {
        provider = await sdk.wallet.getEthereumProvider();
        if (!provider) throw new Error('Farcaster wallet not available');

        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found');
        }

        const chainIdHex = await provider.request({ method: 'eth_chainId' });
        const connectedChainId = parseInt(chainIdHex, 16);

        return {
          accounts: accounts.map((a: string) => getAddress(a)),
          chainId: chainId || connectedChainId,
        };
      } catch (error: any) {
        if (error.code === -32602 || error.message?.includes('rejected')) {
          throw error;
        }
        throw error;
      }
    },

    async disconnect() {
      provider = null;
    },

    async getAccounts() {
      if (!provider) {
        provider = await sdk.wallet.getEthereumProvider();
      }
      if (!provider) return [];

      try {
        const accounts = await provider.request({ method: 'eth_accounts' });
        return (accounts || []).map((a: string) => getAddress(a));
      } catch {
        return [];
      }
    },

    async getChainId() {
      if (!provider) {
        provider = await sdk.wallet.getEthereumProvider();
      }
      if (!provider) return 8453;

      try {
        const chainIdHex = await provider.request({ method: 'eth_chainId' });
        return parseInt(chainIdHex, 16);
      } catch {
        return 8453;
      }
    },

    async isAuthorized() {
      try {
        if (!provider) {
          provider = await sdk.wallet.getEthereumProvider();
        }
        if (!provider) return false;

        const accounts = await provider.request({ method: 'eth_accounts' });
        return (accounts || []).length > 0;
      } catch {
        return false;
      }
    },

async switchChain({ chainId }: { chainId: number }) {
  if (!provider) {
    provider = await sdk.wallet.getEthereumProvider();
  }
  if (!provider) throw new ChainNotConfiguredError();

  try {
    const chainHex = '0x' + chainId.toString(16);
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainHex }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      throw new ChainNotConfiguredError();
    }
    throw error;
  }
},


    async watchAsset(params: { 
      address: string; 
      decimals: number; 
      image?: string; 
      symbol: string;
    }) {
      if (!provider) {
        provider = await sdk.wallet.getEthereumProvider();
      }
      if (!provider) throw new Error('Provider not available');

      return provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: params.address,
            decimals: params.decimals,
            image: params.image,
            symbol: params.symbol,
          },
        },
      });
    },

    onAccountsChanged(accounts: string[]) {
      config.emitter.emit('change', { 
        accounts: accounts.map((a: string) => getAddress(a)) 
      });
    },

    onChainChanged(chainId: string) {
      config.emitter.emit('change', { chainId: parseInt(chainId, 16) });
    },

    onDisconnect() {
      config.emitter.emit('disconnect');
    },
  }));
}
