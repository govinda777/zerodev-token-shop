export interface StakeOption {
  id: string;
  name: string;
  description: string;
  minTokens: number;
  apy: number; // Annual Percentage Yield
  duration: number; // days
  rewards: number;
}

export interface GovernanceToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  description: string;
  votingPower: number;
  available: number;
}

export interface TokenPool {
  id: string;
  name: string;
  tokens: string[];
  apy: number;
  totalLiquidity: number;
  minContribution: number;
}

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  benefits: string[];
  price: number;
  available: boolean;
}

export interface Airdrop {
  id: string;
  name: string;
  tokenType: 'governance' | 'stake' | 'pool' | 'investment' | 'payment';
  amount: number;
  description: string;
  timestamp: number;
  claimed: boolean;
  isEligible: boolean;
  expiryDate: number;
}

export interface StakePosition {
  id: string;
  stakeOptionId: string;
  optionName: string;
  amount: number;
  startDate: number;
  endDate: number;
  rewards: number;
  apy: number;
  status: 'active' | 'completed' | 'withdrawn';
}

export interface InstallmentPurchase {
  id: string;
  productId: string;
  productName: string;
  totalAmount: number;
  installments: number;
  totalInstallments: number;
  paidInstallments: number;
  installmentAmount: number;
  nextPaymentDate: number;
  status: 'active' | 'completed' | 'overdue';
} 