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
}

export interface Airdrop {
  id: string;
  tokenType: 'governance' | 'stake' | 'pool' | 'investment' | 'payment';
  amount: number;
  description: string;
  timestamp: number;
  claimed: boolean;
}

export interface StakePosition {
  id: string;
  stakeOptionId: string;
  amount: number;
  startDate: number;
  endDate: number;
  rewards: number;
  status: 'active' | 'completed' | 'withdrawn';
}

export interface InstallmentPurchase {
  id: string;
  productId: string;
  totalAmount: number;
  installments: number;
  paidInstallments: number;
  installmentAmount: number;
  nextPaymentDate: number;
  status: 'active' | 'completed' | 'overdue';
} 