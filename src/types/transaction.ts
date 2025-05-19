export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  type: 'purchase' | 'reward' | 'transfer';
  metadata?: {
    productId?: string;
    productName?: string;
    amount?: number;
  };
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  status: boolean;
  gasUsed: string;
  effectiveGasPrice: string;
} 