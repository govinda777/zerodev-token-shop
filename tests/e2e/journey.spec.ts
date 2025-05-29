import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // Default, should be in playwright.config.ts
const MOCK_WALLET_ADDRESS = '0xMockAddressForE2ETesting';

// Helper function to set journey state in localStorage
const setJourneyState = async (page: Page, journeyState: object) => {
  await page.evaluate(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: `journey_${MOCK_WALLET_ADDRESS}`, value: journeyState });
};

// Helper function to simulate that the user is connected via Privy (very basic)
// This would ideally be more robust, perhaps by also setting Privy's specific auth tokens if known and possible.
// For now, we assume the app primarily checks `isConnected` from our mockable hook context or a simple flag.
// The critical part for journey is setting the `journey_MOCK_WALLET_ADDRESS` localStorage.
const simulateLogin = async (page: Page) => {
  // This is a placeholder. In a real scenario, you might:
  // 1. Actually log in via UI (if simple and not using external OAuth popups).
  // 2. Set specific auth cookies/localStorage items that Privy uses.
  // 3. Have a debug endpoint to set the auth state.
  // For now, we'll rely on setting the journey state which implies a logged-in user for those tests.
  // The JourneyProvider initializes based on user?.wallet?.address.
  // We also need to signal that `usePrivyAuth`'s `isConnected` is true.
  // This is hard to do from Playwright without application-side test hooks.
  // So, for tests requiring login, we'll ensure localStorage is set and *assume*
  // the application can be put into a state where `isConnected` is true for `MOCK_WALLET_ADDRESS`.
  // A common pattern is to have a global setup that makes `usePrivyAuth` return a mock when e2e tests are running.
  
  // Minimal setup for journey:
  await setJourneyState(page, {
    currentStep: 1, // Assuming login is step 0, now on step 1
    missions: [
      { id: 'login', title: 'Conectar Carteira', completed: true, unlocked: true, reward: {type: 'tokens', amount: 10, description: '10 tokens'} },
      { id: 'faucet', title: 'Usar Faucet', completed: false, unlocked: true, icon: '🚰', description: 'Obtenha tokens gratuitos.', reward: {type: 'tokens', amount:5, description: '5 tokens'} },
      { id: 'stake', title: 'Fazer Stake', completed: false, unlocked: false, icon: '📈', requirements: ['faucet'], description: 'Invista seus tokens.', reward: {type: 'access', description: 'Acesso avançado'} },
    ],
    totalTokensEarned: 10,
    completedMissions: ['login']
  });
  // Reload for localStorage changes to take effect and JourneyProvider to initialize
  await page.reload();
};


test.describe('E2E User Journey Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear local storage to ensure clean state for each test, unless a specific state is needed.
    await page.evaluate(() => localStorage.clear());
    // It's good practice to ensure the app is loaded, but specific tests might navigate again.
    // await page.goto(BASE_URL); 
  });

  // Scenario 1: Login and Initial Page Load
  test.describe('Login and Initial Page Load', () => {
    test('Unauthenticated user sees login prompt', async ({ page }) => {
      await page.goto(BASE_URL);
      // Assuming LoginDemo component has a distinct element or text
      // In a real app, use data-testid attributes for robustness
      await expect(page.getByText('Faça login para acessar o marketplace')).toBeVisible(); // Text from LoginDemo
      await expect(page.getByRole('button', { name: 'Conectar Carteira' })).toBeVisible(); // Button from LoginDemo

      // Verify JourneyDashboard is NOT immediately visible (or its specific content)
      // This depends on how JourneyDashboard is structured. If it renders nothing or a specific
      // "connect wallet" message when !isConnected, that's what we check.
      // The prompt "Conecte sua carteira para começar sua jornada" is inside JourneyDashboard when !isConnected.
      await expect(page.getByText('Jornada do Usuário')).toBeVisible(); // Title in JourneyDashboard
      await expect(page.getByText('Conecte sua carteira para começar sua jornada e desbloquear funcionalidades!')).toBeVisible();
      // Check that mission cards are not shown in their interactive state
      await expect(page.getByText('Missões Concluídas')).not.toBeVisible(); // This part of dashboard is only for connected users
    });

    test('Authenticated user sees JourneyDashboard and initial mission state', async ({ page }) => {
      // For this test, we set up the state *as if* login has just occurred.
      // The `simulateLogin` helper will set localStorage for journey state.
      // We are assuming the application is architected to pick this up.
      await page.goto(BASE_URL); // Go to page first, then simulate login which reloads.
      await simulateLogin(page);
      
      // Verify JourneyDashboard IS visible and shows missions
      await expect(page.getByText('Sua Jornada')).toBeVisible(); // Title in JourneyDashboard
      await expect(page.getByText('Missões Concluídas')).toBeVisible();
      
      // Verify 'login' mission is completed
      const loginMissionCard = page.locator('.card', { hasText: 'Conectar Carteira' });
      // Login card might not be rendered at all after completion, as per JourneyDashboard logic.
      // Let's check if it's NOT there or marked completed.
      // The current JourneyDashboard logic is: if (mission.id === 'login' && mission.completed) return null;
      await expect(loginMissionCard).not.toBeVisible();


      // Verify 'faucet' mission is active (e.g., its component is rendered)
      const faucetMissionCard = page.locator('.card', { hasText: 'Usar Faucet' });
      await expect(faucetMissionCard).toBeVisible();
      // Assuming FaucetComponent has a distinct element when active.
      // The test for FaucetComponent in JourneyDashboard.test.tsx uses data-testid="mock-faucet-component"
      // For E2E, we'd look for the real component's content.
      // Let's assume FaucetComponent contains a button "Claim Tokens" or similar unique text.
      // This will be part of the ActiveMissionDisplay inside the card.
      // We need to ensure the FaucetComponent is actually rendered for interaction.
      // A placeholder for FaucetComponent's content:
      await expect(faucetMissionCard.getByText('Componente da missão não encontrado.')).not.toBeVisible(); // Ensure placeholder isn't shown
      // A more specific check would be for an element unique to FaucetComponent.
      // For now, its presence and lack of "Componente não encontrado" is a basic check.
      // If FaucetComponent was mocked with a data-testid in E2E (not typical), we could use that.
      // Let's assume the FaucetComponent has a button:
      // await expect(faucetMissionCard.getByRole('button', { name: /Claim|Obter/i })).toBeVisible();
      // The provided FaucetComponent has: <button ...>Obter Tokens</button>
      await expect(faucetMissionCard.getByRole('button', { name: 'Obter Tokens' })).toBeVisible();


      // Verify 'stake' mission is shown but not active (e.g. locked)
      const stakeMissionCard = page.locator('.card', { hasText: 'Fazer Stake' });
      await expect(stakeMissionCard).toBeVisible();
      await expect(stakeMissionCard.getByText('Bloqueada')).toBeVisible();
    });
  });

  // Scenario 2: Mission Progression (Faucet Mission)
  test.describe('Mission Progression - Faucet Mission', () => {
    test('Complete Faucet mission and see UI update', async ({ page }) => {
      // Pre-condition: User logged in, 'faucet' mission is active.
      await page.goto(BASE_URL);
      await simulateLogin(page); // This sets 'login' as complete, 'faucet' as active

      const faucetMissionCard = page.locator('.card', { hasText: 'Usar Faucet' });
      await expect(faucetMissionCard.getByRole('button', { name: 'Obter Tokens' })).toBeVisible();

      // Interaction: Click the "Obter Tokens" button in FaucetComponent
      // This button comes from the actual FaucetComponent
      await faucetMissionCard.getByRole('button', { name: 'Obter Tokens' }).click();
      
      // Verification
      // 1. Faucet mission is marked "Concluída!"
      //    Need to wait for potential async operations and UI updates.
      await expect(faucetMissionCard.getByText('Concluída!')).toBeVisible({ timeout: 5000 }); // Added timeout

      // 2. Next mission ('stake') becomes active.
      //    The JourneyProvider should update localStorage, and JourneyDashboard should re-render.
      //    We might need to reload or wait for the component to pick up the new state if not automatic.
      //    Given JourneyProvider updates state and localStorage, a page reload should show the new state.
      //    However, good SPAs update without reload. Let's assume it updates.

      const stakeMissionCard = page.locator('.card', { hasText: 'Fazer Stake' });
      await expect(stakeMissionCard).toBeVisible();
      // Check if StakeComponent is now rendered within stakeMissionCard (or its unique content)
      // Similar to faucet, assuming StakeComponent has a unique element.
      // The StakingComponent has a button "Fazer Stake de Tokens"
      await expect(stakeMissionCard.getByRole('button', { name: 'Fazer Stake de Tokens' })).toBeVisible({ timeout: 5000 });
      await expect(stakeMissionCard.getByText('Bloqueada')).not.toBeVisible();
    });
  });

  // Scenario 3: Journey Completion
  test.describe('Journey Completion', () => {
    test('All missions completed shows congratulations and ProductGrid', async ({ page }) => {
      // Pre-condition: User is logged in.
      // Action: Simulate completion of all missions by setting localStorage.
      const allMissionsCompletedState = {
        currentStep: 3,
        missions: [
          { id: 'login', title: 'Conectar Carteira', completed: true, unlocked: true, icon: '🔐', description: '...', reward: {type: 'tokens', amount: 10, description: '10 tokens'} },
          { id: 'faucet', title: 'Usar Faucet', completed: true, unlocked: true, icon: '🚰', description: '...', reward: {type: 'tokens', amount: 5, description: '5 tokens'} },
          { id: 'stake', title: 'Fazer Stake', completed: true, unlocked: true, icon: '📈', description: '...', reward: {type: 'access', description: 'Acesso avançado'} },
        ],
        totalTokensEarned: 15, // Example
        completedMissions: ['login', 'faucet', 'stake']
      };
      await page.goto(BASE_URL);
      await setJourneyState(page, allMissionsCompletedState);
      await page.reload(); // Ensure state is loaded

      // Verification in JourneyDashboard
      await expect(page.getByText('Sua Jornada')).toBeVisible();
      // All cards should show "Concluída!" or not be interactive buttons.
      // Login card is not rendered if completed.
      await expect(page.locator('.card', { hasText: 'Conectar Carteira' })).not.toBeVisible();
      
      const faucetCard = page.locator('.card', { hasText: 'Usar Faucet' });
      await expect(faucetCard.getByText('Concluída!')).toBeVisible();

      const stakeCard = page.locator('.card', { hasText: 'Fazer Stake' });
      await expect(stakeCard.getByText('Concluída!')).toBeVisible();
      
      // Verify main page elements for journey completion
      await expect(page.getByText('Parabéns! Jornada Completa!')).toBeVisible(); // This is in page.tsx
      await expect(page.getByText('Você desbloqueou todas as funcionalidades. Agora explore nossos produtos!')).toBeVisible();
      
      // Verify ProductGrid is rendered (assuming it has a unique element or data-testid)
      // The mock for ProductGrid uses data-testid="mock-product-grid"
      // In a real test, you'd look for its actual content or a real data-testid
      await expect(page.getByTestId('mock-product-grid')).toBeVisible();
    });
  });
});

// Example of how a playwright.config.ts might look (basic):
/*
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000', // Your app's base URL
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer: { // Optional: command to start dev server if not already running
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
*/
