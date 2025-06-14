"use client";

import { useState, useCallback, useMemo } from 'react';
import { createPublicClient, createWalletClient, custom, http, parseEther, formatEther, getContract, Abi } from 'viem';
import { sepolia } from 'viem/chains';
import { usePrivy } from '@privy-io/react-auth';
import { CONTRACTS, USE_MOCK_CONTRACTS, NETWORK_CONFIG, shouldUseMockForContract, isContractDeployed } from '@/contracts/config';
import { 
  TOKEN_ABI, 
  FAUCET_ABI, 
  STAKING_ABI, 
  NFT_ABI, 
  NFT_MARKETPLACE_ABI, 
  AIRDROP_ABI, 
  SUBSCRIPTION_ABI, 
  PASSIVE_INCOME_ABI 
} from '@/contracts/abis';

export interface BlockchainError {
  code: string;
  message: string;
  details?: unknown;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: BlockchainError;
}

export function useBlockchain() {
  const { user } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  
  const isConnected = !!user?.wallet?.address;

  // Create public client for reading blockchain data
  const publicClient = useMemo(() => {
    console.log('🔧 Creating publicClient with RPC:', NETWORK_CONFIG.rpcUrl);
    return createPublicClient({
      chain: {
        ...sepolia,
        rpcUrls: {
          default: {
            http: [NETWORK_CONFIG.rpcUrl],
          },
          public: {
            http: [NETWORK_CONFIG.rpcUrl],
          },
        },
      },
      transport: http(NETWORK_CONFIG.rpcUrl),
    });
  }, []);

  // Create wallet client for transactions
  const getWalletClient = useCallback(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    
    return createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum as any),
    });
  }, []);

  // Get user address
  const getUserAddress = useCallback(async (): Promise<string> => {
    if (!user?.wallet?.address) {
      throw new Error('Wallet not connected');
    }
    return user.wallet.address as `0x${string}`;
  }, [user]);

  // Generic contract interaction helper
  const executeTransaction = useCallback(async (
    contractAddress: string,
    abi: Abi,
    functionName: string,
    args: unknown[] = [],
    value?: bigint
  ): Promise<TransactionResult> => {
    setIsLoading(true);
    
    try {
      const walletClient = getWalletClient();
      const userAddress = await getUserAddress();
      
      const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi,
        client: { public: publicClient, wallet: walletClient },
      });

      const hash = await contract.write[functionName](args, {
        account: userAddress,
        value,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      return {
        success: receipt.status === 'success',
        hash,
      };
    } catch (error: unknown) {
      console.error(`Error executing ${functionName}:`, error);
      
      return {
        success: false,
        error: {
          code: (error as { code?: string })?.code || 'UNKNOWN_ERROR',
          message: (error as { message?: string })?.message || 'Transaction failed',
          details: error,
        },
      };
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, getWalletClient, getUserAddress]);

  // Read contract data helper
  const readContract = useCallback(async (
    contractAddress: string,
    abi: Abi,
    functionName: string,
    args: unknown[] = []
  ): Promise<unknown> => {
    try {
      // Verificar se o publicClient está disponível
      if (!publicClient) {
        throw new Error('Public client not available. Please check your wallet connection.');
      }

      // Verificar se o endereço do contrato é válido (não é um placeholder)
      if (contractAddress.includes('1234567890') || contractAddress === '0x1234567890123456789012345678901234567890') {
        throw new Error(`Contract not deployed. Address ${contractAddress} is a placeholder.`);
      }

      // Validar o endereço
      if (!contractAddress || contractAddress === '0x...' || contractAddress.length !== 42) {
        throw new Error(`Invalid contract address: ${contractAddress}`);
      }

      const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi,
        client: publicClient,
      });

      // Em vez de verificar contract.read, vamos usar readContract diretamente
      return await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args,
      });
    } catch (error) {
      console.error(`Error reading ${functionName} from ${contractAddress}:`, error);
      throw error;
    }
  }, [publicClient]);

  // Token operations
  const tokenOperations = {
    // Get token balance
    getBalance: async (userAddress?: string): Promise<string> => {
      const address = userAddress || await getUserAddress();
      const balance = await readContract(CONTRACTS.TOKEN, TOKEN_ABI as Abi, 'balanceOf', [address]);
      return formatEther(balance as bigint);
    },

    // Transfer tokens
    transfer: async (to: string, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.TOKEN, TOKEN_ABI as Abi, 'transfer', [to, amountWei]);
    },

    // Approve tokens
    approve: async (spender: string, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.TOKEN, TOKEN_ABI as Abi, 'approve', [spender, amountWei]);
    },

    // Get allowance
    getAllowance: async (owner: string, spender: string): Promise<string> => {
      const allowance = await readContract(CONTRACTS.TOKEN, TOKEN_ABI as Abi, 'allowance', [owner, spender]);
      return formatEther(allowance as bigint);
    },
  };

  // Faucet operations
  const faucetOperations = {
    // Check if user can claim
    canClaim: async (userAddress?: string): Promise<boolean> => {
      if (shouldUseMockForContract('FAUCET')) {
        // Mock: usuário pode clamar a cada 24 horas
        const address = userAddress || await getUserAddress();
        const lastClaim = localStorage.getItem(`faucet_last_claim_${address}`);
        if (!lastClaim) return true;
        const timeDiff = Date.now() - parseInt(lastClaim);
        return timeDiff > 24 * 60 * 60 * 1000; // 24 horas
      }
      
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.FAUCET, FAUCET_ABI as Abi, 'canClaim', [address]) as Promise<boolean>;
    },

    // Request tokens from faucet
    requestTokens: async (): Promise<TransactionResult> => {
      if (shouldUseMockForContract('FAUCET')) {
        // Mock: simular requisição de tokens
        const address = await getUserAddress();
        const canClaim = await faucetOperations.canClaim(address);
        
        if (!canClaim) {
          return {
            success: false,
            error: {
              code: 'COOLDOWN_ACTIVE',
              message: 'You must wait 24 hours between claims'
            }
          };
        }
        
        // Simular sucesso e salvar timestamp
        localStorage.setItem(`faucet_last_claim_${address}`, Date.now().toString());
        
        return {
          success: true,
          hash: `0x${Math.random().toString(16).slice(2, 66)}` // Hash mock
        };
      }
      
      return executeTransaction(CONTRACTS.FAUCET, FAUCET_ABI as Abi, 'requestTokens');
    },

    // Get last claim time - SEMPRE retorna em milliseconds para consistência
    getLastClaim: async (userAddress?: string): Promise<number> => {
      if (shouldUseMockForContract('FAUCET')) {
        const address = userAddress || await getUserAddress();
        const lastClaim = localStorage.getItem(`faucet_last_claim_${address}`);
        return lastClaim ? parseInt(lastClaim) : 0; // Já está em milliseconds
      }
      
      const address = userAddress || await getUserAddress();
      const timestamp = await readContract(CONTRACTS.FAUCET, FAUCET_ABI as Abi, 'lastClaim', [address]);
      // Contrato retorna seconds, converter para milliseconds para consistência
      return Number(timestamp) * 1000;
    },
  };

  // Staking operations
  const stakingOperations = {
    // Stake tokens
    stake: async (poolId: number, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.STAKING, STAKING_ABI as Abi, 'stake', [poolId, amountWei]);
    },

    // Unstake tokens
    unstake: async (poolId: number, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.STAKING, STAKING_ABI as Abi, 'unstake', [poolId, amountWei]);
    },

    // Get user stake info
    getUserStake: async (userAddress: string, poolId: number): Promise<unknown> => {
      if (shouldUseMockForContract('STAKING')) {
        // Return mock data for undeployed staking contract
        return {
          amount: BigInt(0),
          timestamp: BigInt(0),
          rewards: BigInt(0)
        };
      }
      return readContract(CONTRACTS.STAKING, STAKING_ABI as Abi, 'userStakes', [userAddress, poolId]);
    },

    // Calculate rewards
    calculateRewards: async (userAddress: string, poolId: number): Promise<string> => {
      if (shouldUseMockForContract('STAKING')) {
        return "0"; // Mock rewards
      }
      const rewards = await readContract(CONTRACTS.STAKING, STAKING_ABI as Abi, 'calculateRewards', [userAddress, poolId]);
      return formatEther(rewards as bigint);
    },

    // Claim rewards
    claimRewards: async (poolId: number): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.STAKING, STAKING_ABI as Abi, 'claimRewards', [poolId]);
    },
  };

  // NFT operations
  const nftOperations = {
    // Get NFT balance
    getBalance: async (userAddress?: string): Promise<number> => {
      const address = userAddress || await getUserAddress();
      const balance = await readContract(CONTRACTS.NFT, NFT_ABI as Abi, 'balanceOf', [address]);
      return Number(balance);
    },

    // Get NFT owner
    getOwner: async (tokenId: number): Promise<string> => {
      return readContract(CONTRACTS.NFT, NFT_ABI as Abi, 'ownerOf', [tokenId]) as Promise<string>;
    },

    // Buy NFT from marketplace
    buyNFT: async (tokenId: number): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.NFT_MARKETPLACE, NFT_MARKETPLACE_ABI as Abi, 'buyNFT', [tokenId]);
    },

    // Check if NFT is listed
    isListed: async (tokenId: number): Promise<boolean> => {
      return readContract(CONTRACTS.NFT_MARKETPLACE, NFT_MARKETPLACE_ABI as Abi, 'isListed', [tokenId]) as Promise<boolean>;
    },

    // Get listing price
    getListingPrice: async (tokenId: number): Promise<string> => {
      const price = await readContract(CONTRACTS.NFT_MARKETPLACE, NFT_MARKETPLACE_ABI as Abi, 'getListingPrice', [tokenId]);
      return formatEther(price as bigint);
    },
  };

  // Airdrop operations
  const airdropOperations = {
    // Check if user has received airdrop
    hasReceived: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.AIRDROP, AIRDROP_ABI as Abi, 'hasReceivedAirdrop', [address]) as Promise<boolean>;
    },

    // Check if user is eligible
    isEligible: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.AIRDROP, AIRDROP_ABI as Abi, 'isEligible', [address]) as Promise<boolean>;
    },

    // Claim airdrop
    claimAirdrop: async (): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.AIRDROP, AIRDROP_ABI as Abi, 'claimAirdrop');
    },
  };

  // Subscription operations
  const subscriptionOperations = {
    // Check if subscription is active
    isActive: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.SUBSCRIPTION, SUBSCRIPTION_ABI as Abi, 'isSubscriptionActive', [address]) as Promise<boolean>;
    },

    // Subscribe to plan
    subscribe: async (planId: number): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.SUBSCRIPTION, SUBSCRIPTION_ABI as Abi, 'subscribe', [planId]);
    },

    // Get subscription info
    getSubscription: async (userAddress?: string): Promise<unknown> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.SUBSCRIPTION, SUBSCRIPTION_ABI as Abi, 'userSubscriptions', [address]);
    },
  };

  // Passive income operations
  const passiveIncomeOperations = {
    // Check if passive income is active
    isActive: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI as Abi, 'isActive', [address]) as Promise<boolean>;
    },

    // Activate passive income
    activate: async (): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI as Abi, 'activatePassiveIncome');
    },

    // Calculate pending rewards
    getPendingRewards: async (userAddress?: string): Promise<string> => {
      const address = userAddress || await getUserAddress();
      const rewards = await readContract(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI as Abi, 'calculatePendingRewards', [address]);
      return formatEther(rewards as bigint);
    },

    // Claim rewards
    claimRewards: async (): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI as Abi, 'claimRewards');
    },
  };

  return {
    isLoading,
    isConnected,
    tokenOperations,
    faucetOperations,
    stakingOperations,
    nftOperations,
    airdropOperations,
    subscriptionOperations,
    passiveIncomeOperations,
    executeTransaction,
    readContract,
  };
} 