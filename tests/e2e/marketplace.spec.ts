import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MOCK_WALLET_ADDRESS = '0xMockAddressForE2ETesting';

// Helper function to set journey state in localStorage
const setJourneyState = async (page: Page, journeyState: object) => {
  await page.evaluate(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: `journey_${MOCK_WALLET_ADDRESS}`, value: journeyState });
};

// Helper function to simulate login
const simulateLogin = async (page: Page) => {
  await setJourneyState(page, {
    currentStep: 1, // login completed
    missions: [
      { id: 'login', title: 'Conectar Carteira', completed: true, unlocked: true, reward: {type: 'tokens', amount: 10, description: '10 tokens'} },
      { id: 'faucet', title: 'Usar Faucet', completed: false, unlocked: true, icon: '🚰', description: 'Obtenha tokens gratuitos.', reward: {type: 'tokens', amount:5, description: '5 tokens'} },
      { id: 'stake', title: 'Fazer Stake', completed: false, unlocked: false, icon: '📈', requirements: ['faucet'], description: 'Invista seus tokens.', reward: {type: 'access', description: 'Acesso avançado'} },
      { id: 'buy-nft', title: 'Comprar NFT', completed: false, unlocked: false, icon: '🎨', requirements: ['stake'], description: 'Adquira seu primeiro NFT.', reward: {type: 'nft', description: 'NFT especial'} },
    ],
    totalTokensEarned: 10, // Only from login initially
    completedMissions: ['login']
  });
  await page.reload();
};

test.describe('E2E Marketplace/Journey Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Mission Progression - Faucet Mission', () => {
    test('Complete Faucet mission and see UI update, stake becomes active', async ({ page }) => {
      await page.goto(BASE_URL);
      await simulateLogin(page); 

      const faucetMissionCard = page.locator('.card', { hasText: 'Usar Faucet' });
      await expect(faucetMissionCard.getByRole('button', { name: 'Obter Tokens' })).toBeVisible();
      await faucetMissionCard.getByRole('button', { name: 'Obter Tokens' }).click();
      
      await expect(faucetMissionCard.getByText('Concluída!')).toBeVisible({ timeout: 5000 });

      const stakeMissionCard = page.locator('.card', { hasText: 'Fazer Stake' });
      await expect(stakeMissionCard).toBeVisible();
      // Assuming StakingComponent has a button "Fazer Stake de Tokens"
      await expect(stakeMissionCard.getByRole('button', { name: 'Fazer Stake de Tokens' })).toBeVisible({ timeout: 5000 });
      await expect(stakeMissionCard.getByText('Bloqueada')).not.toBeVisible();
    });
  });

  // New test suite for Stake Mission
  test.describe('Mission Progression - Stake Mission', () => {
    test('Complete Stake mission and see UI update, buy-nft becomes active', async ({ page }) => {
      // Pre-condition: User logged in, 'faucet' is complete, 'stake' is active.
      await page.goto(BASE_URL);
      await setJourneyState(page, {
        currentStep: 2, // login, faucet done
        missions: [
          { id: 'login', title: 'Conectar Carteira', completed: true, unlocked: true, reward: {type: 'tokens', amount: 10, description: '10 tokens'} },
          { id: 'faucet', title: 'Usar Faucet', completed: true, unlocked: true, icon: '🚰', description: 'Obtenha tokens gratuitos.', reward: {type: 'tokens', amount:5, description: '5 tokens'} },
          { id: 'stake', title: 'Fazer Stake', completed: false, unlocked: true, icon: '📈', requirements: ['faucet'], description: 'Invista seus tokens.', reward: {type: 'access', description: 'Acesso avançado'} },
          { id: 'buy-nft', title: 'Comprar NFT', completed: false, unlocked: false, icon: '🎨', requirements: ['stake'], description: 'Adquira seu primeiro NFT.', reward: {type: 'nft', description: 'NFT especial'} },
        ],
        totalTokensEarned: 15, // 10 from login, 5 from faucet
        completedMissions: ['login', 'faucet']
      });
      await page.reload();

      const stakeMissionCard = page.locator('.card', { hasText: 'Fazer Stake' });
      // Ensure StakeComponent's button "Fazer Stake de Tokens" is visible
      await expect(stakeMissionCard.getByRole('button', { name: 'Fazer Stake de Tokens' })).toBeVisible();

      // Interaction: Click the button in StakeComponent
      await stakeMissionCard.getByRole('button', { name: 'Fazer Stake de Tokens' }).click();
      
      // Verification
      await expect(stakeMissionCard.getByText('Concluída!')).toBeVisible({ timeout: 5000 });

      const buyNftMissionCard = page.locator('.card', { hasText: 'Comprar NFT' });
      await expect(buyNftMissionCard).toBeVisible();
      // Assuming NFTMarketplace component (for 'buy-nft' mission) has a button like "Comprar à Vista"
      await expect(buyNftMissionCard.getByRole('button', { name: 'Comprar à Vista' })).toBeVisible({ timeout: 5000 });
      await expect(buyNftMissionCard.getByText('Bloqueada')).not.toBeVisible();
    });
  });

  test.describe('Journey Completion', () => {
    test('All missions completed shows congratulations and ProductGrid', async ({ page }) => {
      const allMissionsCompletedState = {
        currentStep: 4, // login, faucet, stake, buy-nft
        missions: [
          { id: 'login', title: 'Conectar Carteira', completed: true, unlocked: true, icon: '🔐', description: '...', reward: {type: 'tokens', amount: 10, description: '10 tokens'} },
          { id: 'faucet', title: 'Usar Faucet', completed: true, unlocked: true, icon: '🚰', description: '...', reward: {type: 'tokens', amount: 5, description: '5 tokens'} },
          { id: 'stake', title: 'Fazer Stake', completed: true, unlocked: true, icon: '📈', description: '...', reward: {type: 'access', description: 'Acesso avançado'} },
          { id: 'buy-nft', title: 'Comprar NFT', completed: true, unlocked: true, icon: '🎨', description: '...', reward: {type: 'nft', description: 'NFT especial'} },
        ],
        totalTokensEarned: 15, // Example: 10 (login) + 5 (faucet). NFT reward doesn't add tokens.
        completedMissions: ['login', 'faucet', 'stake', 'buy-nft']
      };
      await page.goto(BASE_URL);
      await setJourneyState(page, allMissionsCompletedState);
      await page.reload(); 

      await expect(page.getByText('Sua Jornada')).toBeVisible();
      // Login card is not rendered if completed
      await expect(page.locator('.card', { hasText: 'Conectar Carteira' })).not.toBeVisible();
      
      // Verify other missions are marked completed
      await expect(page.locator('.card', { hasText: 'Usar Faucet' }).getByText('Concluída!')).toBeVisible();
      await expect(page.locator('.card', { hasText: 'Fazer Stake' }).getByText('Concluída!')).toBeVisible();
      await expect(page.locator('.card', { hasText: 'Comprar NFT' }).getByText('Concluída!')).toBeVisible();
      
      await expect(page.getByText('Parabéns! Jornada Completa!')).toBeVisible();
      await expect(page.getByText('Você desbloqueou todas as funcionalidades. Agora explore nossos produtos!')).toBeVisible();
      // Assuming ProductGrid is mocked with this data-testid
      await expect(page.getByTestId('mock-product-grid')).toBeVisible();
    });
  });
});
