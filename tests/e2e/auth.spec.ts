import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MOCK_WALLET_ADDRESS = '0xMockAddressForE2ETesting';
const MOCK_PRIVY_USER_WALLET_ADDRESS = '0xMockPrivySocialLoginUser'; // Different address for Privy user

// Helper function to set journey state in localStorage
const setJourneyState = async (page: Page, walletAddress: string, journeyState: object) => {
  await page.evaluate(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: `journey_${walletAddress}`, value: journeyState });
};

// Helper function to simulate a generic wallet login
const simulateGenericWalletLogin = async (page: Page) => {
  await setJourneyState(page, MOCK_WALLET_ADDRESS, {
    currentStep: 1,
    missions: [
      { id: 'login', title: 'Conectar Carteira', completed: true, unlocked: true, reward: {type: 'tokens', amount: 10, description: '10 tokens'} },
      { id: 'faucet', title: 'Usar Faucet', completed: false, unlocked: true, icon: '🚰', description: 'Obtenha tokens gratuitos.', reward: {type: 'tokens', amount:5, description: '5 tokens'} },
      { id: 'stake', title: 'Fazer Stake', completed: false, unlocked: false, icon: '📈', requirements: ['faucet'], description: 'Invista seus tokens.', reward: {type: 'access', description: 'Acesso avançado'} },
    ],
    totalTokensEarned: 10,
    completedMissions: ['login']
  });
  await page.reload();
};

// Helper function to simulate a Privy social login
const simulatePrivySocialLogin = async (page: Page) => {
  // Simulate a state as if Privy social login was successful
  // This includes setting the journey state for the Privy user's mock wallet address
  await setJourneyState(page, MOCK_PRIVY_USER_WALLET_ADDRESS, {
    currentStep: 1, // Assuming login mission is completed
    missions: [ // Potentially different initial missions or same, depending on app logic
      { id: 'login', title: 'Conectar Carteira (Social)', completed: true, unlocked: true, reward: {type: 'tokens', amount: 10, description: '10 tokens social'} },
      { id: 'faucet', title: 'Usar Faucet Social', completed: false, unlocked: true, icon: '🚰', description: 'Obtenha tokens gratuitos (social).', reward: {type: 'tokens', amount:5, description: '5 tokens social'} },
    ],
    totalTokensEarned: 10,
    completedMissions: ['login']
  });
  // In a real app, Privy might set its own cookies/localStorage items.
  // This helper assumes `JourneyProvider` uses `user.wallet.address` which we can control by setting the right journey state.
  // We also assume the application's `usePrivyAuth` hook would reflect `isConnected: true`
  // and `user.wallet.address` as `MOCK_PRIVY_USER_WALLET_ADDRESS` after a successful Privy social login.
  // For Playwright, this means we are testing the application's state *after* Privy has done its work.
  await page.reload(); // Reload to apply localStorage changes
};


test.describe('E2E Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    // Ensure MOCK_WALLET_ADDRESS is also cleared from any potential privy related items if any were set by privy itself.
    // For now, clearing all localStorage is the broadest approach.
  });

  test.describe('Login and Initial Page Load', () => {
    test('Unauthenticated user sees login prompt', async ({ page }) => {
      await page.goto(BASE_URL);
      // Text from LoginDemo or the main page when not logged in
      await expect(page.getByText('Faça login para acessar o marketplace')).toBeVisible(); 
      // This button is part of LoginDemo as per previous understanding
      await expect(page.getByRole('button', { name: 'Conectar Carteira' })).toBeVisible(); 
      // Text from JourneyDashboard when not logged in
      await expect(page.getByText('Jornada do Usuário')).toBeVisible();
      await expect(page.getByText('Conecte sua carteira para começar sua jornada e desbloquear funcionalidades!')).toBeVisible();
      // This part of JourneyDashboard should only be visible for authenticated users
      await expect(page.getByText('Missões Concluídas')).not.toBeVisible();
    });

    test('Authenticated user (simulated generic wallet) sees JourneyDashboard and initial mission state', async ({ page }) => {
      await page.goto(BASE_URL);
      await simulateGenericWalletLogin(page); // Uses generic MOCK_WALLET_ADDRESS
      
      await expect(page.getByText('Sua Jornada')).toBeVisible();
      await expect(page.getByText('Missões Concluídas')).toBeVisible();
      // Login mission card should not be visible as per JourneyDashboard logic (returns null if login is completed)
      await expect(page.locator('.card', { hasText: 'Conectar Carteira' })).not.toBeVisible();
      
      const faucetMissionCard = page.locator('.card', { hasText: 'Usar Faucet' });
      await expect(faucetMissionCard).toBeVisible();
      // Ensure the actual component is rendered, not the placeholder
      await expect(faucetMissionCard.getByText('Componente da missão não encontrado.')).not.toBeVisible(); 
      await expect(faucetMissionCard.getByRole('button', { name: 'Obter Tokens' })).toBeVisible();
      
      const stakeMissionCard = page.locator('.card', { hasText: 'Fazer Stake' });
      await expect(stakeMissionCard).toBeVisible();
      await expect(stakeMissionCard.getByText('Bloqueada')).toBeVisible();
    });
  });

  test.describe('Privy Social Login Simulation', () => {
    test('User simulates successful login via Privy (social) and sees dashboard', async ({ page }) => {
      await page.goto(BASE_URL);
      // Here, we don't interact with Privy's UI. We set the state *as if* Privy login was successful.
      // The key is that `simulatePrivySocialLogin` sets up localStorage for a *different* mock user.
      // The application's `usePrivyAuth` would need to be in a state where it reports this user as connected.
      // For this test, we assume the journey state is the primary driver for what's displayed post-login.
      await simulatePrivySocialLogin(page);

      // Assertions should be similar to the generic authenticated user,
      // but potentially with different mission titles if they were customized in simulatePrivySocialLogin.
      await expect(page.getByText('Sua Jornada')).toBeVisible();
      await expect(page.getByText('Missões Concluídas')).toBeVisible();

      // Login mission card (social) should not be visible
      await expect(page.locator('.card', { hasText: 'Conectar Carteira (Social)' })).not.toBeVisible();
      
      const faucetMissionCard = page.locator('.card', { hasText: 'Usar Faucet Social' });
      await expect(faucetMissionCard).toBeVisible();
      await expect(faucetMissionCard.getByText('Componente da missão não encontrado.')).not.toBeVisible();
      // Assuming FaucetComponent (mock or real) has 'Obter Tokens' button
      await expect(faucetMissionCard.getByRole('button', { name: 'Obter Tokens' })).toBeVisible(); 
    });
  });

  test.describe('MetaMask Connection Stub', () => {
    test('Checks for MetaMask connection option and acknowledges limitations', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Locate the primary connection button. Based on existing tests, it's 'Conectar Carteira'.
      const connectWalletButton = page.getByRole('button', { name: 'Conectar Carteira' });
      await expect(connectWalletButton).toBeVisible();
      
      // Simulate a click.
      // What happens next depends on the Privy configuration.
      // It might open Privy modal where MetaMask is an option, or directly try to connect if configured.
      await connectWalletButton.click();
      
      // Assertion for an expected client-side change:
      // Option 1: Privy modal opens. Look for a known element in the Privy modal.
      //   e.g., await expect(page.locator('.privy-modal-content')).toBeVisible({ timeout: 10000 });
      //   e.g., await expect(page.getByText('Connect a wallet to continue')).toBeVisible({ timeout: 10000 }); (text within Privy modal)
      // Option 2: Button text changes to a loading state.
      //   e.g., await expect(page.getByRole('button', { name: 'Conectando...' })).toBeVisible();
      // For this stub, let's assume a modal or some text indicating wallet connection options appears.
      // This is a placeholder assertion and needs to be adapted to the actual UI.
      await expect(page.getByText(/Choose your wallet|Connect a wallet to continue/i)).toBeVisible({ timeout: 10000 });


      // Add a comment about limitations.
      console.log('Test Stub: Clicked "Conectar Carteira". Full MetaMask interaction requires browser extension testing capabilities (e.g., Synpress) or a dApp-specific E2E testing wallet solution if Privy provides one.');
      test.info().annotations.push({
        type: 'Note',
        description: 'This test only verifies the initial step of MetaMask connection. Full E2E interaction with the MetaMask extension is not covered due to Playwright limitations. Specialized tools like Synpress might be needed.',
      });
      expect(true).toBeTruthy(); // End test with a positive assertion.
    });
  });
});
