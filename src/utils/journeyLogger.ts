// Journey Logger - Specific for tracking user journeys and interactions

export interface JourneyLogEntry {
  id: string;
  event: 'FIRST_LOGIN' | 'TOKEN_REWARD' | 'PURCHASE' | 'STAKE' | 'UNSTAKE' | 'AIRDROP_CLAIM' | 'GOVERNANCE_VOTE' | 'POOL_JOIN' | 'INSTALLMENT_CREATE' | 'INSTALLMENT_PAYMENT' | 'NFT_RECEIVED';
  walletAddress: string;
  timestamp: number;
  amount?: number;
  tokenType?: 'reward' | 'governance' | 'stake' | 'pool';
  productId?: string;
  transactionId?: string;
  details?: Record<string, unknown>;
}

// In a real application, this would send to an analytics service or database
// For now, we'll use localStorage to persist logs for demo purposes
class JourneyLogger {
  private static readonly STORAGE_KEY = 'journey_logs';
  private static readonly MAX_LOGS = 1000;

  static log(entry: Omit<JourneyLogEntry, 'id'>): void {
    try {
      const logs = this.getLogs();
      const newLog = {
        ...entry,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        timestamp: entry.timestamp || Date.now()
      };

      logs.unshift(newLog);

      // Keep only the latest MAX_LOGS entries
      if (logs.length > this.MAX_LOGS) {
        logs.splice(this.MAX_LOGS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
      
      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Journey Log:', newLog);
      }
    } catch (error) {
      console.error('Failed to log journey event:', error);
    }
  }

  static getLogs(): JourneyLogEntry[] {
    try {
      const logs = localStorage.getItem(this.STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  static getLogsForUser(walletAddress: string): JourneyLogEntry[] {
    return this.getLogs().filter(log => log.walletAddress === walletAddress);
  }

  static getLogsByEvent(event: JourneyLogEntry['event']): JourneyLogEntry[] {
    return this.getLogs().filter(log => log.event === event);
  }

  static clearLogs(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Specific journey tracking methods
  static logFirstLogin(walletAddress: string, rewardAmount: number): void {
    this.log({
      event: 'FIRST_LOGIN',
      walletAddress,
      amount: rewardAmount,
      timestamp: Date.now(),
      details: {
        isFirstTime: true,
        welcomeReward: rewardAmount,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString(),
        sessionId: Date.now() + Math.random().toString(36).substr(2, 9)
      }
    });
  }

  static logTokenReward(walletAddress: string, amount: number, source: string): void {
    this.log({
      event: 'TOKEN_REWARD',
      walletAddress,
      amount,
      timestamp: Date.now(),
      details: {
        source,
        type: 'automatic_reward'
      }
    });
  }

  static logPurchase(walletAddress: string, productId: string, amount: number, installments?: number): void {
    this.log({
      event: 'PURCHASE',
      walletAddress,
      productId,
      amount,
      timestamp: Date.now(),
      details: {
        installments,
        paymentType: installments ? 'installment' : 'full'
      }
    });
  }

  static logStake(walletAddress: string, amount: number, stakeOptionId: string): void {
    this.log({
      event: 'STAKE',
      walletAddress,
      amount,
      timestamp: Date.now(),
      details: {
        stakeOptionId,
        action: 'stake_tokens'
      }
    });
  }

  static logUnstake(walletAddress: string, amount: number, rewards: number): void {
    this.log({
      event: 'UNSTAKE',
      walletAddress,
      amount,
      timestamp: Date.now(),
      details: {
        rewards,
        totalReceived: amount + rewards,
        action: 'unstake_tokens'
      }
    });
  }

  static logAirdropClaim(walletAddress: string, amount: number, tokenType: JourneyLogEntry['tokenType']): void {
    this.log({
      event: 'AIRDROP_CLAIM',
      walletAddress,
      amount,
      tokenType: tokenType,
      timestamp: Date.now(),
      details: {
        claimType: 'airdrop',
        tokenType
      }
    });
  }

  static logPoolJoin(walletAddress: string, poolId: string, amount: number): void {
    this.log({
      event: 'POOL_JOIN',
      walletAddress,
      amount,
      timestamp: Date.now(),
      details: {
        poolId,
        action: 'join_liquidity_pool'
      }
    });
  }

  static logInstallmentCreate(walletAddress: string, productId: string, totalAmount: number, installments: number): void {
    this.log({
      event: 'INSTALLMENT_CREATE',
      walletAddress,
      productId,
      amount: totalAmount,
      timestamp: Date.now(),
      details: {
        installments,
        installmentAmount: totalAmount / installments,
        action: 'create_installment_plan'
      }
    });
  }

  static logInstallmentPayment(walletAddress: string, purchaseId: string, amount: number, remainingInstallments: number): void {
    this.log({
      event: 'INSTALLMENT_PAYMENT',
      walletAddress,
      amount,
      timestamp: Date.now(),
      details: {
        purchaseId,
        remainingInstallments,
        action: 'pay_installment'
      }
    });
  }

  static logNFTReceived(walletAddress: string, nftId: string, source: string): void {
    this.log({
      event: 'NFT_RECEIVED',
      walletAddress,
      timestamp: Date.now(),
      details: {
        nftId,
        source,
        action: 'receive_nft'
      }
    });
  }

  // Analytics methods
  static getUserStats(walletAddress: string): {
    totalPurchases: number;
    totalStaked: number;
    totalRewards: number;
    airdropsClaimed: number;
    joinDate: number | null;
  } {
    const userLogs = this.getLogsForUser(walletAddress);
    
    return {
      totalPurchases: userLogs.filter(log => log.event === 'PURCHASE').length,
      totalStaked: userLogs
        .filter(log => log.event === 'STAKE')
        .reduce((sum, log) => sum + (log.amount || 0), 0),
      totalRewards: userLogs
        .filter(log => log.event === 'TOKEN_REWARD')
        .reduce((sum, log) => sum + (log.amount || 0), 0),
      airdropsClaimed: userLogs.filter(log => log.event === 'AIRDROP_CLAIM').length,
      joinDate: userLogs.find(log => log.event === 'FIRST_LOGIN')?.timestamp || null
    };
  }
}

export default JourneyLogger; 