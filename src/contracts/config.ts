// Smart Contract Addresses on Sepolia Testnet
export const CONTRACTS = {
  // Token Contract (ERC-20) - Real deployment
  TOKEN: process.env.NEXT_PUBLIC_TOKEN_CONTRACT || "0xcac5c82D2523c5986D80620061500dAAb94A9B8c",
  
  // Faucet Contract - Real deployment
  FAUCET: process.env.NEXT_PUBLIC_FAUCET_CONTRACT || "0xb1e4C7a5919b35e30b9fB3e8deB1FA593652962E",
  
  // Staking Contract - Using placeholder (not deployed yet)
  STAKING: process.env.NEXT_PUBLIC_STAKING_CONTRACT || "0x3456789012345678901234567890123456789012",
  
  // NFT Contract (ERC-721) - Using placeholder (not deployed yet)
  NFT: process.env.NEXT_PUBLIC_NFT_CONTRACT || "0x4567890123456789012345678901234567890123",
  
  // NFT Marketplace Contract - Using placeholder (not deployed yet)
  NFT_MARKETPLACE: process.env.NEXT_PUBLIC_NFT_MARKETPLACE_CONTRACT || "0x5678901234567890123456789012345678901234",
  
  // Airdrop Contract - Using placeholder (not deployed yet)
  AIRDROP: process.env.NEXT_PUBLIC_AIRDROP_CONTRACT || "0x6789012345678901234567890123456789012345",
  
  // Subscription Contract - Using placeholder (not deployed yet)
  SUBSCRIPTION: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT || "0x7890123456789012345678901234567890123456",
  
  // Passive Income Contract - Using placeholder (not deployed yet)
  PASSIVE_INCOME: process.env.NEXT_PUBLIC_PASSIVE_INCOME_CONTRACT || "0x8901234567890123456789012345678901234567",
} as const;

// Check which contracts are using placeholders
const PLACEHOLDER_CONTRACTS = Object.entries(CONTRACTS).filter(([key, address]) => 
  address.includes('1234567890')
).map(([key]) => key);

// Flag para usar mocks apenas para contratos não deployados
export const USE_MOCK_CONTRACTS = process.env.NODE_ENV === 'development' && 
  PLACEHOLDER_CONTRACTS.length > 0;

// Helper function to check if a specific contract is deployed
export const isContractDeployed = (contractKey: keyof typeof CONTRACTS): boolean => {
  return !CONTRACTS[contractKey].includes('1234567890');
};

// Helper function to check if we should use mock for a specific contract
export const shouldUseMockForContract = (contractKey: keyof typeof CONTRACTS): boolean => {
  return USE_MOCK_CONTRACTS && !isContractDeployed(contractKey);
};

// Network Configuration
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  name: "Sepolia",
  rpcUrl: process.env.NEXT_PUBLIC_ZERODEV_RPC || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  blockExplorer: "https://sepolia.etherscan.io",
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  name: "ZeroDev Token",
  symbol: "ZDT",
  decimals: 18,
  initialSupply: "1000000", // 1M tokens
} as const;

// Mission Rewards Configuration
export const MISSION_REWARDS = {
  LOGIN: 10,
  FAUCET: 25,
  STAKE: 0, // No direct token reward, unlocks features
  BUY_NFT: 0, // No direct token reward, receives NFT
  AIRDROP: 50,
  SUBSCRIPTION: 0, // No direct token reward, unlocks premium
  PASSIVE_INCOME: 100,
} as const;

// Staking Pools Configuration
export const STAKING_POOLS = {
  BASIC: {
    id: "basic",
    name: "Pool Básico",
    apy: 5,
    minStake: 10,
    lockPeriod: 30, // days
  },
  PREMIUM: {
    id: "premium", 
    name: "Pool Premium",
    apy: 12,
    minStake: 50,
    lockPeriod: 90, // days
  },
  ELITE: {
    id: "elite",
    name: "Pool Elite", 
    apy: 20,
    minStake: 100,
    lockPeriod: 180, // days
  },
} as const;

// NFT Configuration
export const NFT_CONFIG = {
  MEMBER_NFT: {
    id: 1,
    name: "Member NFT",
    price: 1, // 1 token
    description: "NFT de membro da comunidade",
    image: "/images/nft/member.png",
  },
  PREMIUM_NFT: {
    id: 2,
    name: "Premium NFT",
    price: 5, // 5 tokens
    description: "NFT premium com benefícios exclusivos",
    image: "/images/nft/premium.png",
  },
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 1,
    name: "Plano Mensal",
    price: 50, // 50 tokens
    duration: 30, // days
    benefits: ["Acesso a renda passiva", "Airdrops exclusivos", "Suporte prioritário"],
  },
  ANNUAL: {
    id: 2,
    name: "Plano Anual",
    price: 500, // 500 tokens (2 months free)
    duration: 365, // days
    benefits: ["Acesso a renda passiva", "Airdrops exclusivos", "Suporte prioritário", "NFTs exclusivos"],
  },
} as const;

// Airdrop Configuration
export const AIRDROP_CONFIG = {
  MEMBER_AIRDROP: {
    id: "member-airdrop",
    name: "Airdrop de Membros",
    amount: 50,
    requirement: "NFT_HOLDER",
    description: "Airdrop exclusivo para holders de NFT",
  },
  STAKER_AIRDROP: {
    id: "staker-airdrop", 
    name: "Airdrop de Stakers",
    amount: 25,
    requirement: "STAKER",
    description: "Airdrop para usuários que fazem staking",
  },
} as const;

// Passive Income Configuration
export const PASSIVE_INCOME_CONFIG = {
  DAILY_RATE: 0.1, // 0.1% daily return
  MIN_SUBSCRIPTION_REQUIRED: true,
  AUTO_COMPOUND: true,
  WITHDRAWAL_COOLDOWN: 7, // days
} as const; 