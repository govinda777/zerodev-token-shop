import { test, expect, devices, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const extendedViewports = [
  { name: 'Mobile', width: 375, height: 667, isMobile: true, tags: ['@no-critical'] },
  { name: 'Tablet', width: 768, height: 1024, isMobile: true, tags: ['@critical'] },
  { name: 'Desktop', width: 1280, height: 720, isMobile: false, tags: ['@no-critical'] },
  { name: 'iPhone 12', deviceName: 'iPhone 12', isMobile: true, tags: ['@no-critical'] }, // Reference device by name for clarity
];

test.describe('E2E Comprehensive Responsiveness Tests', () => {
  for (const viewport of extendedViewports) {
    test(`Layout and navigation on ${viewport.name} viewport`, { tag: viewport.tags }, async ({ page, browser }) => {
      let context;
      let currentPage: Page = page; // Default to using the passed 'page'

      if (viewport.deviceName) { // If deviceName is specified, create a new context
        context = await browser.newContext({ ...devices[viewport.deviceName] });
        currentPage = await context.newPage();
      } else if (viewport.width && viewport.height) { // Otherwise, set viewport on the existing page
        await currentPage.setViewportSize({ width: viewport.width, height: viewport.height });
      } else {
        throw new Error(`Viewport configuration for ${viewport.name} is incomplete.`);
      }

      await currentPage.goto(BASE_URL);
      try {
        await currentPage.waitForLoadState('networkidle', { timeout: 20000 });
      } catch (e) {
        console.warn(`Network idle timeout for ${viewport.name}, proceeding with test...`);
      }

      // Wait for a key element like "Conectar Carteira" (unauthenticated) or "Marketplace de Tokens" (main title)
      // This makes the test adaptable to whether the user is "logged in" via mocks or not.
      await expect(currentPage.getByRole('heading', { name: 'Marketplace de Tokens' })
        .or(currentPage.getByRole('button', { name: /Conectar Carteira/i }))
      ).toBeVisible({ timeout: 25000 });


      // 1. Visibility Checks for Key Structural Elements
      const header = currentPage.locator('header');
      await expect(header).toBeVisible();
      await expect(header).toBeInViewport();

      const heroTitlePart1 = currentPage.getByRole('heading', { name: /ZeroDev/i, level: 1 });
      await expect(heroTitlePart1).toBeVisible();
      await expect(currentPage.locator('h1', { has: currentPage.getByText('Token Shop')})).toBeVisible();

      const journeySectionTitle = currentPage.getByRole('heading', { name: 'Jornada do Usuário' });
      await expect(journeySectionTitle).toBeVisible();
      const journeyDashboardContainer = currentPage.locator('section:has-text("Jornada do Usuário")');
      await expect(journeyDashboardContainer).toBeVisible();

      const footer = currentPage.locator('footer');
      await expect(footer).toBeVisible();

      const headerBox = await header.boundingBox();
      const journeyBox = await journeyDashboardContainer.boundingBox();
      if (headerBox && journeyBox) {
        const headerBottom = headerBox.y + headerBox.height;
        expect(journeyBox.y).toBeGreaterThanOrEqual(headerBottom - 10);
      } else {
        test.fail(false, `Bounding box for header or journey section was null on ${viewport.name}. Header: ${headerBox}, Journey: ${journeyBox}`);
      }
      
      const hasHorizontalScrollbar = await currentPage.evaluate(() => document.body.scrollWidth > window.innerWidth);
      expect(hasHorizontalScrollbar, `Horizontal scrollbar detected on ${viewport.name}`).toBe(false);

      // 2. Navigation Checks
      // Using more generic selectors for navigation buttons/links, assuming they exist.
      // These ARIA labels for navigation areas are examples; replace with actual ones from your app.
      const mobileMenuButton = currentPage.locator('button[aria-label*="menu"], button[aria-label*="Menu"], button:has(svg.icon-menu)'); // Common patterns
      const desktopNav = currentPage.getByRole('navigation').filter({ hasText: /Marketplace|Produtos|Shop|Sobre/i }); // Look for nav with common links
      const mobileNavDrawer = currentPage.locator('div[role="dialog"], aside, section[aria-label*="mobile navigation"]'); // Common patterns for mobile drawer


      if (viewport.isMobile) {
        await expect(mobileMenuButton.first()).toBeVisible({ timeout: 10000 });
        await mobileMenuButton.first().click();
        await expect(mobileNavDrawer.first()).toBeVisible({ timeout: 10000 });
        // Example: Check for a link in the mobile nav
        await expect(mobileNavDrawer.first().getByRole('link', { name: /Marketplace|Shop/i }).first()).toBeVisible();
      } else { // Desktop
        await expect(desktopNav.first()).toBeVisible({ timeout: 10000 });
        // Example: Check for a link in the desktop nav
        await expect(desktopNav.first().getByRole('link', { name: /Marketplace|Shop/i }).first()).toBeVisible();
        // Mobile menu button should ideally be hidden on desktop
        if (await mobileMenuButton.count() > 0) { // Check if selector finds any
            await expect(mobileMenuButton.first()).toBeHidden();
        }
      }

      if (viewport.name === 'Tablet') {
         const isDesktopNavVisible = await desktopNav.first().isVisible().catch(() => false);
         const isMobileButtonVisible = await mobileMenuButton.first().isVisible().catch(() => false);
         expect(isDesktopNavVisible || isMobileButtonVisible, "On Tablet, either desktop nav or mobile menu button should be visible").toBe(true);
      }

      // 3. Element-Specific Checks
      if (!viewport.isMobile) {
        // ProductGrid is identified by "Marketplace de Tokens" heading and cards with "Tokens" text.
        // This check is now implicitly part of the main content visibility.
        // More specific grid structure checks can be added if needed.
        const productCards = currentPage.locator('article.card', { hasText: /Tokens/i });
        await expect(productCards.first()).toBeVisible();
      }

      // Screenshots
      await currentPage.screenshot({ path: `test-results/responsive-${viewport.name.toLowerCase().replace(/ /g, '_')}.png`, fullPage: true });

      if (context) { // If a new context was created (for device emulation)
        await context.close();
      }
    });
  }
});
