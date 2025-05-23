import { test, expect } from '@playwright/test';

// Use a porta fornecida pelo ambiente ou caia para 3000 como padrão
const APP_PORT = process.env.APP_PORT || '3000';
const BASE_URL = `http://localhost:${APP_PORT}`;

test.describe('Token Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application and wait for it to load
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should display available tokens', async ({ page }) => {
    // Verify that token items are displayed
    const tokenItems = page.locator('.token-item');
    await expect(tokenItems).toBeVisible();
    
    // Expect to have at least one token available
    expect(await tokenItems.count()).toBeGreaterThan(0);
  });

  test('should show token details when clicked', async ({ page }) => {
    // Click on the first token
    const firstToken = page.locator('.token-item').first();
    await firstToken.click();
    
    // Verify token details are shown
    const tokenDetails = page.locator('.token-details');
    await expect(tokenDetails).toBeVisible();
    
    // Verify price information is displayed
    const priceInfo = page.locator('.token-price');
    await expect(priceInfo).toBeVisible();
  });

  test('should allow connecting wallet', async ({ page }) => {
    // Find and click on the connect wallet button
    const connectWalletButton = page.getByRole('button', { name: /connect wallet/i });
    await connectWalletButton.click();
    
    // Wait for the wallet connection modal to appear
    const walletModal = page.locator('.wallet-connection-modal');
    await expect(walletModal).toBeVisible();
    
    // Take a screenshot of the wallet connection modal
    await page.screenshot({ path: 'test-results/wallet-modal.png' });
  });

  test('should handle purchase flow', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.localStorage.setItem('mock-wallet-connected', 'true');
    });
    
    // Refresh page to apply localStorage changes
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Select a token to purchase
    const buyButton = page.locator('.buy-token-button').first();
    await buyButton.click();
    
    // Verify purchase confirmation dialog
    const confirmationDialog = page.locator('.purchase-confirmation');
    await expect(confirmationDialog).toBeVisible();
    
    // Confirm purchase
    const confirmButton = page.getByRole('button', { name: /confirm/i });
    await confirmButton.click();
    
    // Verify success message appears
    const successMessage = page.locator('.success-message');
    await expect(successMessage).toBeVisible({ timeout: 15000 });
    
    // Take a screenshot of successful purchase
    await page.screenshot({ path: 'test-results/successful-purchase.png' });
  });
}); 