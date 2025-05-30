"use client";

import { useState, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, parseEther, formatEther, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import { usePrivyAuth } from './usePrivyAuth';
import { CONTRACTS } from '@/contracts/config';
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
  const { isConnected, user } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Create public client for reading blockchain data
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  // Create wallet client for transactions
  const getWalletClient = useCallback(() => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    
    return createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });
  }, []);

  // Get user address
  const getUserAddress = useCallback(async (): Promise<string> => {
    if (!isConnected || !user?.wallet?.address) {
      throw new Error('User not connected');
    }
    return user.wallet.address as `0x${string}`;
  }, [isConnected, user]);

  // Generic contract interaction helper
  const executeTransaction = useCallback(async (
    contractAddress: string,
    abi: readonly string[],
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
    abi: readonly string[],
    functionName: string,
    args: unknown[] = []
  ): Promise<unknown> => {
    try {
      const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi,
        client: publicClient,
      });

      return await contract.read[functionName](args);
    } catch (error) {
      console.error(`Error reading ${functionName}:`, error);
      throw error;
    }
  }, [publicClient]);

  // Token operations
  const tokenOperations = {
    // Get token balance
    getBalance: async (userAddress?: string): Promise<string> => {
      const address = userAddress || await getUserAddress();
      const balance = await readContract(CONTRACTS.TOKEN, TOKEN_ABI, 'balanceOf', [address]);
      return formatEther(balance as bigint);
    },

    // Transfer tokens
    transfer: async (to: string, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.TOKEN, TOKEN_ABI, 'transfer', [to, amountWei]);
    },

    // Approve tokens
    approve: async (spender: string, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.TOKEN, TOKEN_ABI, 'approve', [spender, amountWei]);
    },

    // Get allowance
    getAllowance: async (owner: string, spender: string): Promise<string> => {
      const allowance = await readContract(CONTRACTS.TOKEN, TOKEN_ABI, 'allowance', [owner, spender]);
      return formatEther(allowance as bigint);
    },
  };

  // Faucet operations
  const faucetOperations = {
    // Check if user can claim
    canClaim: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.FAUCET, FAUCET_ABI, 'canClaim', [address]) as Promise<boolean>;
    },

    // Request tokens from faucet
    requestTokens: async (): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.FAUCET, FAUCET_ABI, 'requestTokens');
    },

    // Get last claim time
    getLastClaim: async (userAddress?: string): Promise<number> => {
      const address = userAddress || await getUserAddress();
      const timestamp = await readContract(CONTRACTS.FAUCET, FAUCET_ABI, 'lastClaim', [address]);
      return Number(timestamp);
    },
  };

  // Staking operations
  const stakingOperations = {
    // Stake tokens
    stake: async (poolId: number, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.STAKING, STAKING_ABI, 'stake', [poolId, amountWei]);
    },

    // Unstake tokens
    unstake: async (poolId: number, amount: string): Promise<TransactionResult> => {
      const amountWei = parseEther(amount);
      return executeTransaction(CONTRACTS.STAKING, STAKING_ABI, 'unstake', [poolId, amountWei]);
    },

    // Get user stake info
    getUserStake: async (userAddress: string, poolId: number): Promise<unknown> => {
      return readContract(CONTRACTS.STAKING, STAKING_ABI, 'userStakes', [userAddress, poolId]);
    },

    // Calculate rewards
    calculateRewards: async (userAddress: string, poolId: number): Promise<string> => {
      const rewards = await readContract(CONTRACTS.STAKING, STAKING_ABI, 'calculateRewards', [userAddress, poolId]);
      return formatEther(rewards as bigint);
    },

    // Claim rewards
    claimRewards: async (poolId: number): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.STAKING, STAKING_ABI, 'claimRewards', [poolId]);
    },
  };

  // NFT operations
  const nftOperations = {
    // Get NFT balance
    getBalance: async (userAddress?: string): Promise<number> => {
      const address = userAddress || await getUserAddress();
      const balance = await readContract(CONTRACTS.NFT, NFT_ABI, 'balanceOf', [address]);
      return Number(balance);
    },

    // Get NFT owner
    getOwner: async (tokenId: number): Promise<string> => {
      return readContract(CONTRACTS.NFT, NFT_ABI, 'ownerOf', [tokenId]) as Promise<string>;
    },

    // Buy NFT from marketplace
    buyNFT: async (tokenId: number): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.NFT_MARKETPLACE, NFT_MARKETPLACE_ABI, 'buyNFT', [tokenId]);
    },

    // Check if NFT is listed
    isListed: async (tokenId: number): Promise<boolean> => {
      return readContract(CONTRACTS.NFT_MARKETPLACE, NFT_MARKETPLACE_ABI, 'isListed', [tokenId]) as Promise<boolean>;
    },

    // Get listing price
    getListingPrice: async (tokenId: number): Promise<string> => {
      const price = await readContract(CONTRACTS.NFT_MARKETPLACE, NFT_MARKETPLACE_ABI, 'getListingPrice', [tokenId]);
      return formatEther(price as bigint);
    },
  };

  // Airdrop operations
  const airdropOperations = {
    // Check if user has received airdrop
    hasReceived: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.AIRDROP, AIRDROP_ABI, 'hasReceivedAirdrop', [address]) as Promise<boolean>;
    },

    // Check if user is eligible
    isEligible: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.AIRDROP, AIRDROP_ABI, 'isEligible', [address]) as Promise<boolean>;
    },

    // Claim airdrop
    claimAirdrop: async (): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.AIRDROP, AIRDROP_ABI, 'claimAirdrop');
    },
  };

  // Subscription operations
  const subscriptionOperations = {
    // Check if subscription is active
    isActive: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.SUBSCRIPTION, SUBSCRIPTION_ABI, 'isSubscriptionActive', [address]) as Promise<boolean>;
    },

    // Subscribe to plan
    subscribe: async (planId: number): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.SUBSCRIPTION, SUBSCRIPTION_ABI, 'subscribe', [planId]);
    },

    // Get subscription info
    getSubscription: async (userAddress?: string): Promise<unknown> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.SUBSCRIPTION, SUBSCRIPTION_ABI, 'userSubscriptions', [address]);
    },
  };

  // Passive income operations
  const passiveIncomeOperations = {
    // Check if passive income is active
    isActive: async (userAddress?: string): Promise<boolean> => {
      const address = userAddress || await getUserAddress();
      return readContract(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI, 'isActive', [address]) as Promise<boolean>;
    },

    // Activate passive income
    activate: async (): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI, 'activatePassiveIncome');
    },

    // Calculate pending rewards
    getPendingRewards: async (userAddress?: string): Promise<string> => {
      const address = userAddress || await getUserAddress();
      const rewards = await readContract(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI, 'calculatePendingRewards', [address]);
      return formatEther(rewards as bigint);
    },

    // Claim rewards
    claimRewards: async (): Promise<TransactionResult> => {
      return executeTransaction(CONTRACTS.PASSIVE_INCOME, PASSIVE_INCOME_ABI, 'claimRewards');
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