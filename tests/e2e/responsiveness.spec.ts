import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const viewports = [
  { name: 'Mobile', width: 375, height: 667 }, // iPhone SE
  { name: 'Tablet', width: 768, height: 1024 }, // iPad Air
  { name: 'Desktop', width: 1280, height: 720 }, // Standard Desktop
];

test.describe('E2E Responsiveness Tests', () => {
  for (const viewport of viewports) {
    test(`Home page layout is responsive on ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(BASE_URL);

      // Wait for a key element to be visible to ensure the page has loaded.
      // The "Conectar Carteira" button is usually present on initial load for unauthenticated users.
      // If testing an authenticated state, this would need to be adjusted.
      await expect(page.getByRole('button', { name: 'Conectar Carteira' })).toBeVisible({ timeout: 15000 });

      // 1. Visibility Checks for Key Structural Elements
      const header = page.locator('header'); // Assuming <header> tag is used
      await expect(header).toBeVisible();
      await expect(header).toBeInViewport(); // Check if it's actually in the viewport

      // Hero section title - using a more specific locator if available is better.
      // For example, if the hero title is always within a <section id="hero"> or similar.
      // The text "ZeroDev Token Shop" is split into "ZeroDev" and "Token Shop" visually.
      // Let's target the container or a part of it.
      // Assuming the h1 tag contains "ZeroDev"
      const heroTitlePart1 = page.getByRole('heading', { name: /ZeroDev/i, level: 1 });
      await expect(heroTitlePart1).toBeVisible();
      // And "Token Shop" is also present, likely within the same h1 or a child span
      const heroTitlePart2 = page.getByText('Token Shop'); // This might be too generic
      await expect(page.locator('h1', { has: page.getByText('Token Shop')})).toBeVisible();


      // Journey/Mission display area
      // This could be the JourneyDashboard container or a specific section.
      // When not logged in, JourneyDashboard shows: "Jornada do Usuário" and "Conecte sua carteira..."
      const journeySectionTitle = page.getByRole('heading', { name: 'Jornada do Usuário' });
      await expect(journeySectionTitle).toBeVisible();
      
      // If there's a specific container for the dashboard/main content area, use it.
      // For example, if JourneyDashboard is wrapped in a section with a data-testid or specific class.
      // Let's assume JourneyDashboard is within a <section> tag.
      const journeyDashboardContainer = page.locator('section:has-text("Jornada do Usuário")');
      await expect(journeyDashboardContainer).toBeVisible();


      const footer = page.locator('footer'); // Assuming <footer> tag is used
      await expect(footer).toBeVisible();
      // Depending on page length, footer might not be in viewport initially on tall viewports.
      // So, toBeInViewport() might be too strict without scrolling. isVisible is usually enough.


      // 2. (Optional) Basic Layout Integrity Check - Header vs Main Content
      // This check is a heuristic and might need adjustment based on actual CSS and layout.
      // We'll use the journeyDashboardContainer identified above as "main content" for this check.
      const headerBox = await header.boundingBox();
      const journeyBox = await journeyDashboardContainer.boundingBox();

      if (headerBox && journeyBox) {
        const headerBottom = headerBox.y + headerBox.height;
        // Check that the journey section starts below or very close to the bottom of the header.
        // Allow a small tolerance (e.g., 5-10 pixels) for margins, paddings, or slight overlaps if design allows.
        expect(journeyBox.y).toBeGreaterThanOrEqual(headerBottom - 10);

        // Additionally, ensure they don't have an absurd overlap in width either,
        // though this is less common for header/main content.
        // For example, ensure main content is not significantly wider than viewport if it causes horizontal scroll.
        // This is better handled by checking for absence of horizontal scrollbars.
      } else {
        // If bounding boxes are null, the elements might not be rendered as expected.
        // The toBeVisible() checks above should catch this, but good to be aware.
        test.fail(false, `Bounding box for header or journey section was null. Header: ${headerBox}, Journey: ${journeyBox}`);
      }
      
      // Check that there's no unexpected horizontal scrollbar
      const hasHorizontalScrollbar = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
      expect(hasHorizontalScrollbar).toBe(false);

    });
  }
});
