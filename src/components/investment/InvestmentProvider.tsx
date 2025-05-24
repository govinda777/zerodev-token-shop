"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/useAuth';
import { useTokens } from '@/components/auth/TokenProvider';
import JourneyLogger from '@/utils/journeyLogger';
import type { 
  StakeOption, 
  GovernanceToken, 
  TokenPool, 
  NFT, 
  Airdrop, 
  StakePosition,
  InstallmentPurchase 
} from '@/types/investment';

interface InvestmentContextType {
  // Staking
  stakeOptions: StakeOption[];
  stakePositions: StakePosition[];
  stakeTokens: (optionId: string, amount: number) => Promise<boolean>;
  unstakeTokens: (positionId: string) => Promise<boolean>;
  
  // Governance Tokens
  governanceTokens: GovernanceToken[];
  buyGovernanceToken: (tokenId: string, amount: number) => Promise<boolean>;
  
  // Token Pools
  tokenPools: TokenPool[];
  joinPool: (poolId: string, amount: number) => Promise<boolean>;
  
  // NFTs
  nfts: NFT[];
  ownedNFTs: NFT[];
  
  // Airdrops
  airdrops: Airdrop[];
  claimAirdrop: (airdropId: string) => Promise<boolean>;
  
  // Installments
  installmentPurchases: InstallmentPurchase[];
  createInstallmentPurchase: (productId: string, totalAmount: number, installments: number) => Promise<boolean>;
  payInstallment: (purchaseId: string) => Promise<boolean>;
  
  isLoading: boolean;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

// Mock data
const mockStakeOptions: StakeOption[] = [
  {
    id: 'stake-1',
    name: 'Token Básico',
    description: 'Opção de staking básica com rendimento de 5% ao ano',
    minTokens: 10,
    apy: 5,
    duration: 30,
    rewards: 0.5
  },
  {
    id: 'stake-2',
    name: 'Token Premium',
    description: 'Opção premium com rendimento de 12% ao ano',
    minTokens: 50,
    apy: 12,
    duration: 90,
    rewards: 2.5
  },
  {
    id: 'stake-3',
    name: 'Token Elite',
    description: 'Para investidores experientes - 20% ao ano',
    minTokens: 100,
    apy: 20,
    duration: 180,
    rewards: 10
  }
];

const mockGovernanceTokens: GovernanceToken[] = [
  {
    id: 'gov-1',
    name: 'DAO Token',
    symbol: 'DAO',
    price: 5,
    description: 'Token de governança para participar das decisões da DAO',
    votingPower: 1
  },
  {
    id: 'gov-2',
    name: 'Council Token',
    symbol: 'COUNCIL',
    price: 25,
    description: 'Token de conselho com maior poder de voto',
    votingPower: 5
  }
];

const mockTokenPools: TokenPool[] = [
  {
    id: 'pool-1',
    name: 'Pool Estável',
    tokens: ['USDC', 'DAI'],
    apy: 8,
    totalLiquidity: 1000000,
    minContribution: 20
  },
  {
    id: 'pool-2',
    name: 'Pool de Alto Rendimento',
    tokens: ['ETH', 'BTC'],
    apy: 15,
    totalLiquidity: 500000,
    minContribution: 50
  }
];

const mockNFTs: NFT[] = [
  {
    id: 'nft-1',
    name: 'Pioneer Badge',
    description: 'Badge para primeiros usuários da plataforma',
    image: '/nft-pioneer.png',
    rarity: 'common',
    benefits: ['5% discount on all purchases', 'Early access to new features']
  },
  {
    id: 'nft-2',
    name: 'Golden Membership',
    description: 'NFT de membro ouro com benefícios exclusivos',
    image: '/nft-gold.png',
    rarity: 'rare',
    benefits: ['10% discount', 'Priority support', 'Exclusive events access']
  },
  {
    id: 'nft-3',
    name: 'Diamond Status',
    description: 'Status diamante para grandes investidores',
    image: '/nft-diamond.png',
    rarity: 'legendary',
    benefits: ['20% discount', 'Personal advisor', 'VIP access', 'Monthly airdrops']
  }
];

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address } = useAuth();
  const { balance, removeTokens, addTokens } = useTokens();
  const [isLoading, setIsLoading] = useState(false);
  
  const [stakePositions, setStakePositions] = useState<StakePosition[]>([]);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [installmentPurchases, setInstallmentPurchases] = useState<InstallmentPurchase[]>([]);

  // Initialize with mock airdrops for connected users
  useEffect(() => {
    if (isConnected && address) {
      const mockAirdrops: Airdrop[] = [
        {
          id: 'airdrop-1',
          tokenType: 'governance',
          amount: 5,
          description: 'Airdrop de boas-vindas - Tokens de Governança',
          timestamp: Date.now() - 86400000, // 1 day ago
          claimed: false
        },
        {
          id: 'airdrop-2',
          tokenType: 'stake',
          amount: 10,
          description: 'Tokens de recompensa por participação',
          timestamp: Date.now() - 172800000, // 2 days ago
          claimed: true
        }
      ];
      setAirdrops(mockAirdrops);

      // Grant Pioneer NFT to users automatically after first login
      const hasReceivedPioneerNFT = localStorage.getItem(`pioneer_nft_${address}`);
      if (!hasReceivedPioneerNFT) {
        const pioneerNFT = mockNFTs.find(nft => nft.id === 'nft-1');
        if (pioneerNFT) {
          setOwnedNFTs(prev => [...prev, pioneerNFT]);
          localStorage.setItem(`pioneer_nft_${address}`, 'true');
          JourneyLogger.logNFTReceived(address, pioneerNFT.id, 'welcome_grant');
        }
      }
    }
  }, [isConnected, address]);

  const stakeTokens = async (optionId: string, amount: number): Promise<boolean> => {
    if (!isConnected || !address || balance < amount) return false;
    
    setIsLoading(true);
    try {
      const option = mockStakeOptions.find(o => o.id === optionId);
      if (!option || amount < option.minTokens) return false;

      removeTokens(amount);
      
      const newPosition: StakePosition = {
        id: `position-${Date.now()}`,
        stakeOptionId: optionId,
        amount,
        startDate: Date.now(),
        endDate: Date.now() + (option.duration * 24 * 60 * 60 * 1000),
        rewards: (amount * option.apy / 100 / 365) * option.duration,
        status: 'active'
      };
      
      setStakePositions(prev => [...prev, newPosition]);
      
      // Log staking action
      JourneyLogger.logStake(address, amount, optionId);
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const unstakeTokens = async (positionId: string): Promise<boolean> => {
    if (!address) return false;
    
    setIsLoading(true);
    try {
      const position = stakePositions.find(p => p.id === positionId);
      if (!position || position.status !== 'active') return false;

      const totalReceived = position.amount + position.rewards;
      addTokens(totalReceived);
      setStakePositions(prev => 
        prev.map(p => p.id === positionId ? { ...p, status: 'withdrawn' as const } : p)
      );
      
      // Log unstaking action
      JourneyLogger.logUnstake(address, position.amount, position.rewards);
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const buyGovernanceToken = async (tokenId: string, amount: number): Promise<boolean> => {
    if (!address) return false;
    
    const token = mockGovernanceTokens.find(t => t.id === tokenId);
    if (!token || balance < token.price * amount) return false;

    setIsLoading(true);
    try {
      removeTokens(token.price * amount);
      
      // Log governance token purchase
      JourneyLogger.log({
        event: 'GOVERNANCE_VOTE',
        walletAddress: address,
        amount: token.price * amount,
        timestamp: Date.now(),
        details: {
          tokenId,
          tokenName: token.name,
          quantity: amount,
          action: 'purchase_governance_token'
        }
      });
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const joinPool = async (poolId: string, amount: number): Promise<boolean> => {
    if (!address) return false;
    
    const pool = mockTokenPools.find(p => p.id === poolId);
    if (!pool || amount < pool.minContribution || balance < amount) return false;

    setIsLoading(true);
    try {
      removeTokens(amount);
      
      // Log pool joining
      JourneyLogger.logPoolJoin(address, poolId, amount);
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const claimAirdrop = async (airdropId: string): Promise<boolean> => {
    if (!address) return false;
    
    setIsLoading(true);
    try {
      const airdrop = airdrops.find(a => a.id === airdropId);
      if (!airdrop || airdrop.claimed) return false;

      addTokens(airdrop.amount);
      setAirdrops(prev => 
        prev.map(a => a.id === airdropId ? { ...a, claimed: true } : a)
      );
      
      // Log airdrop claim
      JourneyLogger.logAirdropClaim(address, airdrop.amount, airdrop.tokenType);
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const createInstallmentPurchase = async (
    productId: string, 
    totalAmount: number, 
    installments: number
  ): Promise<boolean> => {
    if (!address) return false;
    
    // Check if user has required stake (mock check)
    const hasRequiredStake = stakePositions.some(p => p.status === 'active' && p.amount >= 50);
    if (!hasRequiredStake) return false;

    setIsLoading(true);
    try {
      const installmentAmount = totalAmount / installments;
      
      const newPurchase: InstallmentPurchase = {
        id: `installment-${Date.now()}`,
        productId,
        totalAmount,
        installments,
        paidInstallments: 0,
        installmentAmount,
        nextPaymentDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'active'
      };
      
      setInstallmentPurchases(prev => [...prev, newPurchase]);
      
      // Log installment creation
      JourneyLogger.logInstallmentCreate(address, productId, totalAmount, installments);
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const payInstallment = async (purchaseId: string): Promise<boolean> => {
    if (!address) return false;
    
    setIsLoading(true);
    try {
      const purchase = installmentPurchases.find(p => p.id === purchaseId);
      if (!purchase || balance < purchase.installmentAmount) return false;

      removeTokens(purchase.installmentAmount);
      
      setInstallmentPurchases(prev => 
        prev.map(p => {
          if (p.id === purchaseId) {
            const newPaidInstallments = p.paidInstallments + 1;
            return {
              ...p,
              paidInstallments: newPaidInstallments,
              status: newPaidInstallments >= p.installments ? 'completed' as const : 'active' as const,
              nextPaymentDate: newPaidInstallments < p.installments 
                ? Date.now() + (30 * 24 * 60 * 60 * 1000) 
                : p.nextPaymentDate
            };
          }
          return p;
        })
      );
      
      // Log installment payment
      const remainingInstallments = purchase.installments - (purchase.paidInstallments + 1);
      JourneyLogger.logInstallmentPayment(address, purchaseId, purchase.installmentAmount, remainingInstallments);
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const value: InvestmentContextType = {
    stakeOptions: mockStakeOptions,
    stakePositions,
    stakeTokens,
    unstakeTokens,
    governanceTokens: mockGovernanceTokens,
    buyGovernanceToken,
    tokenPools: mockTokenPools,
    joinPool,
    nfts: mockNFTs,
    ownedNFTs,
    airdrops,
    claimAirdrop,
    installmentPurchases,
    createInstallmentPurchase,
    payInstallment,
    isLoading
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestment() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
} 