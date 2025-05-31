import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvestmentProvider, useInvestment } from './InvestmentProvider';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useTokens } from '@/components/auth/TokenProvider'; // Corrected path
import JourneyLogger from '@/utils/journeyLogger';
import { StakePosition, InstallmentPurchase } from '@/types/investment';

// Mock hooks and logger
jest.mock('@/hooks/usePrivyAuth');
jest.mock('@/components/auth/TokenProvider');
jest.mock('@/utils/journeyLogger');

const mockUsePrivyAuth = usePrivyAuth as jest.Mock;
const mockUseTokens = useTokens as jest.Mock;
const mockJourneyLogger = JourneyLogger as jest.Mocked<typeof JourneyLogger>;

// Test component to consume context
const TestConsumer = () => {
  const ctx = useInvestment();
  return <div data-testid="context-consumer">{JSON.stringify(ctx)}</div>;
};

const findStakeOptionById = (id: string) => {
  // Replicate mockStakeOptions from provider for consistent test data
  const mockStakeOptionsFromProvider = [
    { id: 'stake-1', name: 'Token Básico', minTokens: 10, apy: 5, duration: 30, rewards: 0.5 },
    { id: 'stake-2', name: 'Token Premium', minTokens: 50, apy: 12, duration: 90, rewards: 2.5 },
  ];
  return mockStakeOptionsFromProvider.find(opt => opt.id === id);
};

describe('InvestmentProvider', () => {
  let mockAddTokens: jest.Mock;
  let mockRemoveTokens: jest.Mock;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    mockAddTokens = jest.fn();
    mockRemoveTokens = jest.fn();
    mockUsePrivyAuth.mockReturnValue({ isConnected: true, address: '0xTestUser' });
    mockUseTokens.mockReturnValue({ balance: 1000, addTokens: mockAddTokens, removeTokens: mockRemoveTokens });
    mockJourneyLogger.logStake.mockClear();
    mockJourneyLogger.logUnstake.mockClear();
    mockJourneyLogger.logInstallmentCreate.mockClear();
    mockJourneyLogger.logInstallmentPayment.mockClear();
    mockJourneyLogger.logNFTReceived.mockClear();

    originalLocalStorage = window.localStorage;
    // @ts-ignore
    delete window.localStorage;
    window.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    };
  });

  afterEach(() => {
    window.localStorage = originalLocalStorage;
    jest.clearAllMocks();
  });

  it('renders children and provides default values', () => {
    render(
      <InvestmentProvider>
        <TestConsumer />
      </InvestmentProvider>
    );
    expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
    const contextValue = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}');
    expect(contextValue.stakeOptions.length).toBeGreaterThan(0);
    expect(contextValue.stakePositions).toEqual([]);
    expect(contextValue.installmentPurchases).toEqual([]);
    expect(contextValue.isLoading).toBe(false);
    // Check for airdrops initialization
    expect(contextValue.airdrops.length).toBeGreaterThan(0); // From useEffect
  });

  it('grants Pioneer NFT on first load for a new user', async () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null); // New user
     render(
      <InvestmentProvider>
        <TestConsumer />
      </InvestmentProvider>
    );
    await waitFor(() => { // Wait for useEffect to run
      expect(mockJourneyLogger.logNFTReceived).toHaveBeenCalledWith('0xTestUser', 'nft-1', 'welcome_grant');
    });
    expect(window.localStorage.setItem).toHaveBeenCalledWith('pioneer_nft_0xTestUser', 'true');
    const contextValue = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}');
    expect(contextValue.ownedNFTs.some((nft: any) => nft.id === 'nft-1')).toBe(true);
  });

  it('does not grant Pioneer NFT if already received', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('true'); // User has received it
    render(
      <InvestmentProvider>
        <TestConsumer />
      </InvestmentProvider>
    );
    expect(mockJourneyLogger.logNFTReceived).not.toHaveBeenCalled();
  });


  describe('stakeTokens', () => {
    const stakeOptionId = 'stake-1';
    const stakeAmount = 20;

    it('successfully stakes tokens', async () => {
      let stakeTokensFunc: (optionId: string, amount: number) => Promise<boolean>;
      render(
        <InvestmentProvider>
          <button onClick={async () => {
            stakeTokensFunc = useInvestment().stakeTokens;
            await stakeTokensFunc(stakeOptionId, stakeAmount);
          }}>Stake</button>
          <TestConsumer />
        </InvestmentProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Stake' }));
      });

      expect(mockRemoveTokens).toHaveBeenCalledWith(stakeAmount);
      const contextValue = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}');
      expect(contextValue.stakePositions.length).toBe(1);
      const position = contextValue.stakePositions[0] as StakePosition;
      expect(position.amount).toBe(stakeAmount);
      expect(position.stakeOptionId).toBe(stakeOptionId);
      expect(mockJourneyLogger.logStake).toHaveBeenCalledWith('0xTestUser', stakeAmount, stakeOptionId);
    });

    it('fails if balance is insufficient', async () => {
      mockUseTokens.mockReturnValue({ balance: 10, addTokens: mockAddTokens, removeTokens: mockRemoveTokens });
      let result: boolean = true;
       let stakeTokensFunc: (optionId: string, amount: number) => Promise<boolean>;
      render(
        <InvestmentProvider>
          <button onClick={async () => {
             stakeTokensFunc = useInvestment().stakeTokens;
             result = await stakeTokensFunc(stakeOptionId, stakeAmount);
          }}>Stake</button>
        </InvestmentProvider>
      );
       await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Stake' }));
      });
      expect(result).toBe(false);
      expect(mockRemoveTokens).not.toHaveBeenCalled();
    });
  });

  describe('unstakeTokens', () => {
    const positionId = 'pos1';
    const initialStakeAmount = 50;
    const rewards = 5;
    const initialPosition: StakePosition = {
      id: positionId, stakeOptionId: 'stake-1', optionName: 'Test Stake', amount: initialStakeAmount,
      startDate: Date.now(), endDate: Date.now() + 100000, rewards, apy: 10, status: 'active'
    };

    it('successfully unstakes tokens', async () => {
      // Need to set initial stake position
      let unstakeTokensFunc: (positionId: string) => Promise<boolean>;
      let setStakePositionsDirectly: React.Dispatch<React.SetStateAction<StakePosition[]>> | null = null;

      // Hacky way to get setStakePositions, or pre-populate it via staking first
      // For this test, let's assume staking happened and then we unstake.
      // A more direct way would be to allow initial state to be passed to provider for tests.

      render(
        <InvestmentProvider>
          <button onClick={async () => {
            // Simulate having a position first. This is indirect.
            // A better test would mock the initial state of stakePositions.
            const stakeFunc = useInvestment().stakeTokens;
            await stakeFunc('stake-1', initialStakeAmount); // This will create a position

            const currentPositions = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}').stakePositions;
            const createdPositionId = currentPositions[0].id; // Get the dynamic ID

            unstakeTokensFunc = useInvestment().unstakeTokens;
            await unstakeTokensFunc(createdPositionId);
          }}>Unstake</button>
          <TestConsumer/>
        </InvestmentProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Unstake"}));
      });

      // Calculate expected rewards based on the mocked option for 'stake-1'
      const option = findStakeOptionById('stake-1')!;
      const expectedRewards = (initialStakeAmount * option.apy / 100 / 365) * option.duration;

      expect(mockAddTokens).toHaveBeenCalledWith(initialStakeAmount + expectedRewards);
      const contextValue = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}');
      const unstakedPosition = contextValue.stakePositions.find((p:StakePosition) => p.amount === initialStakeAmount);
      expect(unstakedPosition.status).toBe('withdrawn');
      expect(mockJourneyLogger.logUnstake).toHaveBeenCalledWith('0xTestUser', initialStakeAmount, expectedRewards);
    });
  });

  describe('createInstallmentPurchase', () => {
    const productId = 'prod-install';
    const totalAmount = 100;
    const installments = 4;

    it('successfully creates an installment purchase if user has active stake', async () => {
       // Simulate active stake
      let createInstallmentPurchaseFunc: (productId: string, totalAmount: number, installments: number) => Promise<boolean>;
      render(
        <InvestmentProvider>
           <button onClick={async () => {
            // 1. Stake first to meet requirement
            await useInvestment().stakeTokens('stake-2', 50); // stake-2 requires 50 minTokens

            // 2. Then create installment
            createInstallmentPurchaseFunc = useInvestment().createInstallmentPurchase;
            await createInstallmentPurchaseFunc(productId, totalAmount, installments);
          }}>Create Installment</button>
          <TestConsumer />
        </InvestmentProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Create Installment"}));
      });

      const contextValue = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}');
      expect(contextValue.installmentPurchases.length).toBe(1);
      const purchase = contextValue.installmentPurchases[0] as InstallmentPurchase;
      expect(purchase.productId).toBe(productId);
      expect(purchase.totalAmount).toBe(totalAmount);
      expect(purchase.installments).toBe(installments);
      expect(purchase.status).toBe('active');
      expect(mockJourneyLogger.logInstallmentCreate).toHaveBeenCalledWith('0xTestUser', productId, totalAmount, installments);
    });

    it('fails if user has no active stake meeting criteria', async () => {
      // No stakePositions set by default in this test path
      let result: boolean = true;
      let createFunc: (productId: string, totalAmount: number, installments: number) => Promise<boolean>;
       render(
        <InvestmentProvider>
          <button onClick={async () => {
            createFunc = useInvestment().createInstallmentPurchase;
            result = await createFunc(productId, totalAmount, installments);
          }}>Create</button>
        </InvestmentProvider>
      );
       await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Create"}));
      });

      expect(result).toBe(false);
    });
  });

  describe('payInstallment', () => {
    const purchaseId = 'inst-1';
    const installmentAmount = 25;
    const initialInstallmentPurchase: InstallmentPurchase = {
      id: purchaseId, productId: 'prod-x', productName: 'Test Product X', totalAmount: 100, installments: 4,
      paidInstallments: 0, installmentAmount, nextPaymentDate: Date.now(), status: 'active', totalInstallments: 4,
    };

    it('successfully pays an installment', async () => {
      // This requires initialInstallmentPurchase to be in state.
      let payInstallmentFunc: (purchaseId: string) => Promise<boolean>;
       render(
        <InvestmentProvider>
           <button onClick={async () => {
            // 1. Create an installment purchase first
            await useInvestment().stakeTokens('stake-2', 50); // Meet stake requirement
            await useInvestment().createInstallmentPurchase('prod-x', 100, 4);

            const currentPurchases = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}').installmentPurchases;
            const createdPurchaseId = currentPurchases[0].id;


            // 2. Pay
            payInstallmentFunc = useInvestment().payInstallment;
            await payInstallmentFunc(createdPurchaseId);
          }}>Pay</button>
          <TestConsumer/>
        </InvestmentProvider>
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: "Pay"}));
      });

      expect(mockRemoveTokens).toHaveBeenCalledWith(installmentAmount); // or initialInstallmentPurchase.installmentAmount
      const contextValue = JSON.parse(screen.getByTestId('context-consumer').textContent || '{}');
      const updatedPurchase = contextValue.installmentPurchases.find((p:InstallmentPurchase) => p.productId === 'prod-x');
      expect(updatedPurchase.paidInstallments).toBe(1);
      expect(updatedPurchase.status).toBe('active');
      expect(mockJourneyLogger.logInstallmentPayment).toHaveBeenCalledWith('0xTestUser', expect.any(String), installmentAmount, 3);
    });
  });

  it('useInvestment throws error if used outside provider', () => {
    const originalError = console.error;
    console.error = jest.fn(); // Suppress error boundary message
    expect(() => render(<TestConsumer />)).toThrow('useInvestment must be used within an InvestmentProvider');
    console.error = originalError;
  });
});
