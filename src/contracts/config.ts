// Smart Contract Addresses on Sepolia Testnet
export const CONTRACTS = {
  // Token Contract (ERC-20)
  TOKEN: "0x1234567890123456789012345678901234567890", // TODO: Deploy real contract
  
  // Faucet Contract
  FAUCET: "0x2345678901234567890123456789012345678901", // TODO: Deploy real contract
  
  // Staking Contract
  STAKING: "0x3456789012345678901234567890123456789012", // TODO: Deploy real contract
  
  // NFT Contract (ERC-721)
  NFT: "0x4567890123456789012345678901234567890123", // TODO: Deploy real contract
  
  // NFT Marketplace Contract
  NFT_MARKETPLACE: "0x5678901234567890123456789012345678901234", // TODO: Deploy real contract
  
  // Airdrop Contract
  AIRDROP: "0x6789012345678901234567890123456789012345", // TODO: Deploy real contract
  
  // Subscription Contract
  SUBSCRIPTION: "0x7890123456789012345678901234567890123456", // TODO: Deploy real contract
  
  // Passive Income Contract
  PASSIVE_INCOME: "0x8901234567890123456789012345678901234567", // TODO: Deploy real contract
} as const;

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