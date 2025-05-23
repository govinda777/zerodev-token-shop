import { test, expect } from '@playwright/test';

// Use a porta fornecida pelo ambiente ou caia para 3000 como padrão
const APP_PORT = process.env.APP_PORT || '3000';
const BASE_URL = `http://localhost:${APP_PORT}`;

test.describe('Application Loading', () => {
  test('should load the application successfully', { tag: '@no-critical' }, async ({ page }) => {
    // Navigate to the application
    await page.goto(BASE_URL);

    // Wait for the page to be loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    // Wait for the main content to be visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible({ timeout: 10000 });

    // Verify the page title
    await expect(page).toHaveTitle(/ZeroDev Token Shop/, { timeout: 10000 });

    // Verify that the header is visible and contains the correct text
    const header = page.locator('h1:has-text("ZeroDev Token Shop")');
    await expect(header).toBeVisible({ timeout: 10000 });

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/app-loaded.png', fullPage: true });
  });
}); 