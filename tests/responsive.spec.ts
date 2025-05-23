import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test('desktop layout should display correctly', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Navigate to the application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/desktop-layout.png' });
    
    // Check for desktop-specific elements
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Verify tokens are displayed in a grid
    const tokenGrid = page.locator('.token-grid, .tokens-container');
    await expect(tokenGrid).toBeVisible();
  });

  test('tablet layout should adapt correctly', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/tablet-layout.png' });
    
    // Check that the navigation is still visible or has transformed to a tablet view
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
  });

  test('mobile layout should display correctly', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/mobile-layout.png' });
    
    // Check for mobile menu button (hamburger)
    const mobileMenuButton = page.locator('.mobile-menu-button, .hamburger-menu');
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu to expand
    await mobileMenuButton.click();
    
    // Verify that mobile menu expands
    const expandedMenu = page.locator('.mobile-menu-expanded, .menu-items');
    await expect(expandedMenu).toBeVisible();
    
    // Take screenshot of expanded mobile menu
    await page.screenshot({ path: 'test-results/mobile-menu-expanded.png' });
  });

  test('should be accessible on iPhone', async ({ browser }) => {
    // Use iPhone 12 preset
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    // Navigate to the application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/iphone-layout.png' });
    
    // Test interaction on mobile
    const mobileMenuButton = page.locator('.mobile-menu-button, .hamburger-menu');
    await mobileMenuButton.click();
    
    // Test a typical mobile user journey
    const connectButton = page.getByRole('button', { name: /connect|login|sign in/i });
    await expect(connectButton).toBeVisible();
    
    // Close context after test
    await context.close();
  });
}); 