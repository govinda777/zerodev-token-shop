import { Transaction } from '@/types/transaction';

const STORAGE_KEYS = {
  TOKEN_BALANCE: (address: string) => `token_balance_${address}`,
  TRANSACTIONS: (address: string) => `transactions_${address}`,
  WELCOME_REWARD: (address: string) => `welcome_reward_${address}`,
} as const;

export const getTokenBalance = async (address: string): Promise<number> => {
  const balance = localStorage.getItem(STORAGE_KEYS.TOKEN_BALANCE(address));
  return balance ? parseInt(balance, 10) : 0;
};

export const addTokens = async (address: string, amount: number): Promise<void> => {
  const currentBalance = await getTokenBalance(address);
  const newBalance = currentBalance + amount;
  localStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE(address), newBalance.toString());
};

export const spendTokens = async (address: string, amount: number): Promise<boolean> => {
  const currentBalance = await getTokenBalance(address);
  
  if (currentBalance < amount) {
    return false;
  }

  const newBalance = currentBalance - amount;
  localStorage.setItem(STORAGE_KEYS.TOKEN_BALANCE(address), newBalance.toString());
  return true;
};

export const getTransactions = (address: string): Transaction[] => {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS(address));
  return transactions ? JSON.parse(transactions) : [];
};

export const addTransaction = (address: string, transaction: Transaction): void => {
  const transactions = getTransactions(address);
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS(address), JSON.stringify(transactions));
};

export const hasReceivedWelcomeReward = (address: string): boolean => {
  return localStorage.getItem(STORAGE_KEYS.WELCOME_REWARD(address)) === 'true';
};

export const markWelcomeRewardReceived = (address: string): void => {
  localStorage.setItem(STORAGE_KEYS.WELCOME_REWARD(address), 'true');
}; 