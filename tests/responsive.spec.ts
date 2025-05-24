import { test, expect, devices } from '@playwright/test';

// Use a porta fornecida pelo ambiente ou caia para 3000 como padrão
const APP_PORT = process.env.APP_PORT || '3000';
const BASE_URL = `http://localhost:${APP_PORT}`;

test.describe('Responsive Design Tests', () => {
  test('desktop layout should display correctly', { tag: '@no-critical' }, async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Navigate to the application
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/desktop-layout.png' });
    
    // Check for desktop-specific navigation element
    const navigation = page.getByRole('navigation', { name: 'Navegação principal' });
    await expect(navigation).toBeVisible();
    
    // Verify tokens are displayed in a grid
    const tokenGrid = page.locator('.token-grid, .tokens-container, .card-grid');
    await expect(tokenGrid).toBeVisible();
  });

  test('tablet layout should adapt correctly', { tag: '@critical' }, async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the application
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/tablet-layout.png' });
    
    // Check that the main navigation is visible or mobile menu button is present
    const mobileMenuButton = page.locator('button[aria-label*="menu"], .mobile-menu-button, button[aria-expanded]');
    const desktopNav = page.getByRole('navigation', { name: 'Navegação principal' });
    
    // Either desktop nav should be visible OR mobile menu button should be present
    const navigationVisible = await desktopNav.isVisible().catch(() => false);
    const mobileButtonVisible = await mobileMenuButton.isVisible().catch(() => false);
    
    expect(navigationVisible || mobileButtonVisible).toBe(true);
  });

  test('mobile layout should display correctly', { tag: '@no-critical' }, async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the application
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/mobile-layout.png' });
    
    // Check for mobile menu button (hamburger)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], .mobile-menu-button, button[aria-expanded]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu to expand
    await mobileMenuButton.click();
    
    // Verify that mobile navigation appears
    const mobileNav = page.getByRole('navigation', { name: 'Navegação mobile' });
    await expect(mobileNav).toBeVisible();
    
    // Take screenshot of expanded mobile menu
    await page.screenshot({ path: 'test-results/mobile-menu-expanded.png' });
  });

  test('should be accessible on iPhone', { tag: '@no-critical' }, async ({ browser }) => {
    // Use iPhone 12 preset
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    // Navigate to the application
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/iphone-layout.png' });
    
    // Test interaction on mobile - check for mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], .mobile-menu-button, button[aria-expanded]');
    await expect(mobileMenuButton).toBeVisible();
    await mobileMenuButton.click();
    
    // Test a typical mobile user journey - look for connect button
    const connectButton = page.getByRole('button', { name: /connect|login|sign in|conectar/i });
    await expect(connectButton).toBeVisible();
    
    // Close context after test
    await context.close();
  });
}); 