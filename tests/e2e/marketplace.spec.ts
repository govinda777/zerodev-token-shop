import { test, expect, Page } from '@playwright/test';
import { MISSION_REWARDS, STAKING_POOLS, NFT_CONFIG } from '@/contracts/config'; // For reward amounts

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MOCK_WALLET_ADDRESS = '0xMockE2EUser';

// Default missions structure for the journey
const defaultMissions = [
  { id: 'login', title: 'Login Mission', completed: false, unlocked: true, reward: { type: 'tokens', amount: MISSION_REWARDS.LOGIN || 10 } },
  { id: 'faucet', title: 'Faucet Mission', completed: false, unlocked: false, icon: '🚰', requirements: ['login'], reward: { type: 'tokens', amount: MISSION_REWARDS.FAUCET || 5 } },
  { id: 'stake', title: 'Stake Mission', completed: false, unlocked: false, icon: '📈', requirements: ['faucet'], reward: { type: 'access', description: 'Advanced investments' } },
  { id: 'buy-nft', title: 'Buy NFT Mission', completed: false, unlocked: false, icon: '🎨', requirements: ['stake'], reward: { type: 'nft', description: 'Special NFT' } },
];

// Helper to simulate login and set initial journey & token state
const simulateLoginWithJourneyAndBalance = async (
  page: Page,
  initialBalance: number,
  completedMissions: string[] = ['login'], // 'login' is usually the first completed mission
  currentJourneyStep: number = 1
) => {
  const journeyState = {
    currentStep: currentJourneyStep,
    missions: defaultMissions.map(m => ({ ...m, completed: completedMissions.includes(m.id), unlocked: m.requirements ? m.requirements.every(req => completedMissions.includes(req)) : m.unlocked })),
    totalTokensEarned: completedMissions.reduce((sum, missionId) => {
      const mission = defaultMissions.find(m => m.id === missionId);
      return sum + (mission?.reward?.type === 'tokens' ? mission.reward.amount : 0);
    }, 0),
    completedMissions,
  };

  await page.evaluate(({ address, tokenBalance, currentJourney }) => {
    localStorage.setItem('privyConnected', 'true');
    localStorage.setItem('privyAddress', address);
    localStorage.setItem(address, tokenBalance.toString()); // For useTokens
    localStorage.setItem(`initial_grant_${address}`, 'true');
    localStorage.setItem(`journey_${address}`, JSON.stringify(currentJourney)); // For useJourney
  }, { address: MOCK_WALLET_ADDRESS, tokenBalance: initialBalance, currentJourney: journeyState });

  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('Sua Jornada')).toBeVisible({ timeout: 10000 }); // Wait for JourneyDashboard
};

// Helper to get current token balance from localStorage
const getCurrentBalance = async (page: Page) => {
  const balanceStr = await page.evaluate((address) => localStorage.getItem(address), MOCK_WALLET_ADDRESS);
  return parseInt(balanceStr || '0');
};

// Helper to get current journey state from localStorage
const getCurrentJourneyState = async (page: Page) => {
  const journeyStr = await page.evaluate((address) => localStorage.getItem(`journey_${address}`), MOCK_WALLET_ADDRESS);
  return journeyStr ? JSON.parse(journeyStr) : null;
};


test.describe('Enhanced E2E Marketplace/Journey Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear()); // Clear LS before each test
  });

  test.describe('Mission Progression - Faucet', () => {
    test('Complete Faucet mission via fallback, update balance & journey, and check cooldown', async ({ page }) => {
      const initialBalance = 20;
      await simulateLoginWithJourneyAndBalance(page, initialBalance, ['login'], 1);

      // Assuming fallback is hit as direct contract interaction is not the focus of this E2E test of app logic.
      // The component's `handleClaim` has its own fallback with setTimeout.

      const faucetCard = page.locator('.card', { hasText: 'Token Faucet' });
      const claimButton = faucetCard.getByRole('button', { name: 'Reivindicar Tokens' });
      await expect(claimButton).toBeVisible();

      await claimButton.click();
      
      await expect(faucetCard.getByRole('button', { name: /Processando/i })).toBeVisible();
      await expect(faucetCard.getByRole('button', { name: /Processando/i })).toBeHidden({ timeout: 10000 });

      // After successful claim, button should show cooldown.
      await expect(faucetCard.getByText(/Próxima reivindicação em:/)).toBeVisible({ timeout: 7000 });
      // And the "Reivindicar Tokens" button itself should not be present (replaced by cooldown div)
      await expect(claimButton).toBeHidden();


      const expectedBalanceAfterFaucet = initialBalance + (MISSION_REWARDS.FAUCET || 5);
      expect(await getCurrentBalance(page)).toBe(expectedBalanceAfterFaucet);

      const journeyState = await getCurrentJourneyState(page);
      expect(journeyState.completedMissions).toContain('faucet');
      expect(journeyState.missions.find((m:any) => m.id === 'faucet').completed).toBe(true);
      expect(journeyState.missions.find((m:any) => m.id === 'stake').unlocked).toBe(true);

      // Also check if the "Missão Concluída!" message appears if it's the first time.
      // The FaucetComponent shows "Missão Concluída! Você pode continuar usando o faucet diariamente."
      // This should be visible along with the cooldown.
      await expect(faucetCard.getByText('Missão Concluída! Você pode continuar usando o faucet diariamente.')).toBeVisible();
    });
  });

  test.describe('Mission Progression - Stake', () => {
    test('Complete Stake mission via fallback, update balance & journey', async ({ page }) => {
      const initialBalance = 50; // Enough to stake
      const stakeAmount = STAKING_POOLS.BASIC.minStake; // e.g. 10
      await simulateLoginWithJourneyAndBalance(page, initialBalance, ['login', 'faucet'], 2);

      await page.evaluate(() => {
        // @ts-ignore
        window.MOCK_BLOCKCHAIN_FAIL_STAKE = true;
      });

      const stakeCard = page.locator('.card', { hasText: 'Staking de Tokens' });
      await expect(stakeCard).toBeVisible();

      await stakeCard.locator('.card', { hasText: STAKING_POOLS.BASIC.name }).click();
      await expect(stakeCard.getByRole('heading', { name: `Fazer Stake - ${STAKING_POOLS.BASIC.name}`})).toBeVisible();

      await stakeCard.getByPlaceholder(`Mínimo: ${STAKING_POOLS.BASIC.minStake} tokens`).fill(stakeAmount.toString());
      await stakeCard.getByRole('button', { name: 'Fazer Stake' }).click();

      await expect(stakeCard.getByRole('button', { name: /Processando Stake.../i })).toBeVisible();
      await expect(stakeCard.getByRole('button', { name: /Processando Stake.../i })).toBeHidden({ timeout: 10000 });
      
      await expect(stakeCard.getByText('Missão de Staking Concluída!')).toBeVisible({timeout: 7000});

      const expectedBalanceAfterStake = initialBalance - stakeAmount;
      expect(await getCurrentBalance(page)).toBe(expectedBalanceAfterStake);

      const journeyState = await getCurrentJourneyState(page);
      expect(journeyState.completedMissions).toContain('stake');
      expect(journeyState.missions.find((m:any) => m.id === 'stake').completed).toBe(true);
      expect(journeyState.missions.find((m:any) => m.id === 'buy-nft').unlocked).toBe(true);

      await page.evaluate(() => { /* @ts-ignore */ delete window.MOCK_BLOCKCHAIN_FAIL_STAKE; });
    });

    test('Stake attempt fails if balance is insufficient', async ({ page }) => {
      const initialBalance = STAKING_POOLS.BASIC.minStake - 1; // Not enough to stake
      await simulateLoginWithJourneyAndBalance(page, initialBalance, ['login', 'faucet'], 2);

      const stakeCard = page.locator('.card', { hasText: 'Staking de Tokens' });
      await expect(stakeCard).toBeVisible();

      await stakeCard.locator('.card', { hasText: STAKING_POOLS.BASIC.name }).click();
      await expect(stakeCard.getByRole('heading', { name: `Fazer Stake - ${STAKING_POOLS.BASIC.name}`})).toBeVisible();

      const stakeAmountInput = stakeCard.getByPlaceholder(`Mínimo: ${STAKING_POOLS.BASIC.minStake} tokens`);
      await stakeAmountInput.fill(STAKING_POOLS.BASIC.minStake.toString());

      // Button should be disabled due to insufficient balance
      const stakeButton = stakeCard.getByRole('button', { name: 'Fazer Stake' });
      await expect(stakeButton).toBeDisabled();

      // Verify validation message if present (StakingComponent has one)
      await expect(stakeCard.getByText('Saldo insuficiente')).toBeVisible();

      // Verify balance is unchanged
      expect(await getCurrentBalance(page)).toBe(initialBalance);

      // Verify journey state is unchanged for stake mission
      const journeyState = await getCurrentJourneyState(page);
      expect(journeyState.completedMissions).not.toContain('stake');
    });
  });

  test.describe('Mission Progression - Buy NFT', () => {
    test('Complete Buy NFT mission via fallback, update balance & journey', async ({ page }) => {
      const initialBalance = 100;
      const nftToBuy = NFT_CONFIG.MEMBER_NFT;
      await simulateLoginWithJourneyAndBalance(page, initialBalance, ['login', 'faucet', 'stake'], 3);

      const nftMarketplaceCard = page.locator('.card', { hasText: 'NFT Marketplace' });
      const nftCardInMarketplace = page.locator('div.card', { hasText: nftToBuy.name });
      await expect(nftCardInMarketplace.first()).toBeVisible({timeout: 10000});

      const buyButton = nftCardInMarketplace.first().getByRole('button', { name: '🛒 Comprar NFT' });
      await expect(buyButton).toBeEnabled();
      await buyButton.click();

      await expect(nftCardInMarketplace.first().getByRole('button', { name: /Comprando.../i })).toBeVisible();
      await expect(nftCardInMarketplace.first().getByRole('button', { name: /Comprando.../i })).toBeHidden({ timeout: 10000 });

      await expect(nftCardInMarketplace.first().getByText('✅ Possuído')).toBeVisible({timeout: 7000});
      const buyNftMissionCardInJourney = page.locator('.card', { hasText: "Buy NFT Mission" });
      await expect(buyNftMissionCardInJourney.getByText('Missão de NFT Concluída!')).toBeVisible();

      const expectedBalanceAfterNFT = initialBalance - nftToBuy.price;
      expect(await getCurrentBalance(page)).toBe(expectedBalanceAfterNFT);

      const journeyState = await getCurrentJourneyState(page);
      expect(journeyState.completedMissions).toContain('buy-nft');
      expect(journeyState.missions.find((m:any) => m.id === 'buy-nft').completed).toBe(true);
    });

    test('Buy NFT attempt fails if balance is insufficient', async ({ page }) => {
      const initialBalance = NFT_CONFIG.MEMBER_NFT.price - 1; // Not enough for Member NFT
      const nftToBuy = NFT_CONFIG.MEMBER_NFT;
      await simulateLoginWithJourneyAndBalance(page, initialBalance, ['login', 'faucet', 'stake'], 3);

      const nftMarketplaceCard = page.locator('.card', { hasText: 'NFT Marketplace' });
      const nftCardInMarketplace = page.locator('div.card', { hasText: nftToBuy.name });
      await expect(nftCardInMarketplace.first()).toBeVisible({timeout: 10000});

      const buyButton = nftCardInMarketplace.first().getByRole('button', { name: '🛒 Comprar NFT' });
      // The button text changes to "Saldo Insuficiente" and becomes disabled
      await expect(buyButton).toContainText('Saldo Insuficiente');
      await expect(buyButton).toBeDisabled();

      // Verify balance is unchanged
      expect(await getCurrentBalance(page)).toBe(initialBalance);

      // Verify journey state is unchanged for NFT mission
      const journeyState = await getCurrentJourneyState(page);
      expect(journeyState.completedMissions).not.toContain('buy-nft');
    });
  });

  // The "Journey Completion" test can remain as is, as it sets the final state directly
  // to verify the UI for a fully completed journey.
  test.describe('Journey Completion', () => {
    test('All missions completed shows congratulations and ProductGrid', async ({ page }) => {
      const finalBalance = 100; // Example final balance
      await simulateLoginWithJourneyAndBalance(page, finalBalance, ['login', 'faucet', 'stake', 'buy-nft'], 4);

      // Reloading with the final state set by simulateLoginWithJourneyAndBalance
      // The helper already reloads the page.

      await expect(page.getByText('Sua Jornada')).toBeVisible();
      // Login card is not rendered if completed as per JourneyDashboard logic
      await expect(page.locator('.card', { hasText: defaultMissions.find(m=>m.id==='login')!.title })).not.toBeVisible();

      // Verify other missions are marked completed in their respective cards
      // Faucet card should show completed state (e.g. cooldown or specific text)
      const faucetCard = page.locator('.card', { hasText: defaultMissions.find(m=>m.id==='faucet')!.title });
      await expect(faucetCard.getByText(/Missão Concluída!|Próxima reivindicação em:/)).toBeVisible();

      // Stake card
      const stakeCard = page.locator('.card', { hasText: defaultMissions.find(m=>m.id==='stake')!.title });
      await expect(stakeCard.getByText('Missão de Staking Concluída!')).toBeVisible();
      
      // NFT card
      const nftCard = page.locator('.card', { hasText: defaultMissions.find(m=>m.id==='buy-nft')!.title });
      await expect(nftCard.getByText('Missão de NFT Concluída!')).toBeVisible();
      
      await expect(page.getByText('Parabéns! Jornada Completa!')).toBeVisible();
      await expect(page.getByText('Você desbloqueou todas as funcionalidades. Agora explore nossos produtos!')).toBeVisible();
      // ProductGrid itself should be visible now
      await expect(page.getByText('Marketplace de Tokens')).toBeVisible();
      await expect(page.locator('article.card', { hasText: 'Premium Service' })).toBeVisible(); // Check for an actual product
    });
  });
});
