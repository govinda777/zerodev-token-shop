import { test, expect, Page } from '@playwright/test';

const APP_PORT = process.env.APP_PORT || '3000';
const BASE_URL = `http://localhost:${APP_PORT}`;
const MOCK_USER_ADDRESS = '0xMockE2EUser';

// Helper to simulate a logged-in state with a specific token balance
const simulateLoginWithBalance = async (page: Page, balance: number) => {
  await page.evaluate(({ address, tokenBalance }) => {
    // Mock for usePrivyAuth
    localStorage.setItem('privyConnected', 'true'); // Simplified mock for isConnected
    localStorage.setItem('privyAddress', address);

    // Mock for useTokens
    localStorage.setItem(address, tokenBalance.toString()); // Sets balance for the given address
    localStorage.setItem(`initial_grant_${address}`, 'true'); // Assume initial grant already happened
  }, { address: MOCK_USER_ADDRESS, tokenBalance: balance });

  await page.reload();
  await page.waitForLoadState('networkidle');
  // Wait for a key element of ProductGrid to be visible
  await expect(page.getByText('Marketplace de Tokens')).toBeVisible({ timeout: 10000 });
};


test.describe('Enhanced Token Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Clear local storage to ensure clean state for login simulation
    await page.evaluate(() => localStorage.clear());
    await page.waitForLoadState('networkidle');
  });

  test('should display available products in ProductGrid', async ({ page }) => {
    // Products should be visible even without login, as per ProductGrid logic
    await expect(page.getByText('Marketplace de Tokens')).toBeVisible();
    // Check for one of the product names from ProductProvider's static list
    await expect(page.getByText('Premium Service')).toBeVisible();
    const productCards = page.locator('article.card:has-text("Tokens")'); // General selector for cards with price
    expect(await productCards.count()).toBeGreaterThan(0);
  });

  test('successful purchase if balance is sufficient', async ({ page }) => {
    const initialBalance = 100;
    const productToBuyName = 'Premium Service'; // Assumes this product exists and is from ProductProvider
    const productToBuyPrice = 5; // Price of "Premium Service"

    await simulateLoginWithBalance(page, initialBalance);

    // Attach listener for dialogs (alerts)
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss(); // Or accept() if needed
    });

    // Locate the specific product card and its buy button
    const productCard = page.locator('article.card', { hasText: productToBuyName });
    await expect(productCard).toBeVisible();
    const buyButton = productCard.getByRole('button', { name: 'Comprar Agora' });
    await expect(buyButton).toBeEnabled();
    
    await buyButton.click();

    await waitFor(() => {
      expect(alertMessage).toContain(`Compra realizada com sucesso! Você comprou ${productToBuyName}`);
    });

    // Verify balance update (optional, requires balance display or checking localStorage)
    // This requires the app to actually re-fetch/update balance from localStorage for useTokens mock.
    // Or, we can check localStorage directly as a proxy for the balance.
    const newBalance = await page.evaluate((address) => localStorage.getItem(address), MOCK_USER_ADDRESS);
    expect(parseInt(newBalance || '0')).toBe(initialBalance - productToBuyPrice);

    // Verify purchase history (optional, requires UI or localStorage check)
    // This would involve checking the `purchases` state in ProductProvider, potentially via localStorage if it's persisted there.
    // For now, focus on the alert and balance.
  });

  test('purchase fails if balance is insufficient', async ({ page }) => {
    const initialBalance = 3; // Product "Premium Service" costs 5
    const productToBuyName = 'Premium Service';

    await simulateLoginWithBalance(page, initialBalance);

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    const productCard = page.locator('article.card', { hasText: productToBuyName });
    await expect(productCard).toBeVisible();
    const buyButton = productCard.getByRole('button', { name: 'Comprar Agora' });
    
    // The button should be disabled by ProductCard's logic: `disabled={balance < product.price || isLoading}`
    // The test for ProductGrid unit test covers the ProductCard mock behavior.
    // Here in E2E, we test the actual rendered ProductCard.
    await expect(buyButton).toBeDisabled();
    // And it should show "Saldo Insuficiente" text
    await expect(buyButton).toContainText('Saldo Insuficiente');

    // If we were to force a click (e.g., if disabled was not correctly implemented),
    // ProductGrid's handleBuy also has a check.
    // For a robust test, we confirm it's disabled. If somehow enabled and clicked:
    // await buyButton.click({ force: true }); // To bypass disabled state for testing underlying logic
    // await waitFor(() => {
    //   expect(alertMessage).toContain(`Saldo insuficiente! Você tem ${initialBalance} tokens, mas precisa de`);
    // });

    // Verify balance is unchanged
    const currentBalance = await page.evaluate((address) => localStorage.getItem(address), MOCK_USER_ADDRESS);
    expect(parseInt(currentBalance || '0')).toBe(initialBalance);
  });

  // Placeholder for a test where buyProduct itself returns false for other reasons
  // This would require deeper mocking capabilities for ProductProvider.buyProduct within E2E.
  test('purchase shows generic error if buyProduct fails for other reasons', async ({ page }) => {
    test.skip(true, "Skipping due to complexity in mocking ProductProvider.buyProduct's return value in E2E for this specific scenario.");
    // 1. Simulate login with sufficient balance.
    // 2. Intercept or modify ProductProvider's buyProduct to return `false` for a specific item,
    //    even if conditions like balance are met. This is the tricky part.
    //    Example: await page.evaluate(() => { /* modify buyProduct's behavior */ });
    // 3. Click buy button.
    // 4. Expect alert: 'Erro ao processar a compra. Tente novamente.'
  });
});