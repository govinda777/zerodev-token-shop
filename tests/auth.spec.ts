import { test, expect } from '@playwright/test';

// Use a porta fornecida pelo ambiente ou caia para 3000 como padrão
const APP_PORT = process.env.APP_PORT || '3000';
const BASE_URL = `http://localhost:${APP_PORT}`;

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should display login button when not authenticated', async ({ page }) => {
    // Verify login/connect button is visible
    const loginButton = page.getByRole('button', { name: /connect|login|sign in/i });
    await expect(loginButton).toBeVisible();
  });

  test('should open authentication modal on login click', async ({ page }) => {
    // Click on login button
    const loginButton = page.getByRole('button', { name: /connect|login|sign in/i });
    await loginButton.click();
    
    // Verify auth modal is displayed
    const authModal = page.locator('.auth-modal, .wallet-modal');
    await expect(authModal).toBeVisible({ timeout: 5000 });
    
    // Take screenshot of the auth modal
    await page.screenshot({ path: 'test-results/auth-modal.png' });
  });

  test('should show user profile when authenticated', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      window.localStorage.setItem('mock-auth-token', 'test-token');
      window.localStorage.setItem('mock-user-authenticated', 'true');
    });
    
    // Refresh to apply localStorage changes
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if user profile/avatar is visible
    const userProfile = page.locator('.user-profile, .user-avatar');
    await expect(userProfile).toBeVisible();
    
    // Click on user profile to show account details
    await userProfile.click();
    
    // Verify account details are shown
    const accountMenu = page.locator('.account-menu, .profile-dropdown');
    await expect(accountMenu).toBeVisible();
    
    // Verify logout option is available
    const logoutOption = page.getByRole('button', { name: /logout|sign out|disconnect/i });
    await expect(logoutOption).toBeVisible();
  });

  test('should handle logout correctly', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      window.localStorage.setItem('mock-auth-token', 'test-token');
      window.localStorage.setItem('mock-user-authenticated', 'true');
    });
    
    // Refresh to apply localStorage changes
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Access user menu
    const userProfile = page.locator('.user-profile, .user-avatar');
    await userProfile.click();
    
    // Click logout
    const logoutOption = page.getByRole('button', { name: /logout|sign out|disconnect/i });
    await logoutOption.click();
    
    // Verify that login button is displayed again
    const loginButton = page.getByRole('button', { name: /connect|login|sign in/i });
    await expect(loginButton).toBeVisible({ timeout: 5000 });
  });
}); 