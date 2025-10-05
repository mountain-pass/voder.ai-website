import { expect, test } from '@playwright/test';

test.describe('Text Flash Prevention', () => {
  test.skip('should not show text content before 3D system is ready', async ({ page }) => {
    // TODO: Implement animation-first CSS pattern for proper text hiding
    // Navigate to page with network throttling to simulate real conditions
    await page.route('**/*', (route) => {
      // Add a small delay to simulate loading conditions
      setTimeout(() => route.continue(), 50);
    });

    // Start navigation
    const navigationPromise = page.goto('/');

    // Take screenshot immediately after navigation starts but before completion
    await page.waitForLoadState('domcontentloaded');

    // Check that hero text elements are not visible (opacity: 0) before js-loaded class
    const heroTitle = page.locator('.hero-title');

    const heroDescription = page.locator('.hero-description');

    const comingSoonIndicator = page.locator('.coming-soon-indicator');

    // Verify elements exist but are hidden initially
    await expect(heroTitle).toBeAttached();
    await expect(heroDescription).toBeAttached();
    await expect(comingSoonIndicator).toBeAttached();

    // Critical test: these elements should have opacity: 0 initially
    await expect(heroTitle).toHaveCSS('opacity', '0');
    await expect(heroDescription).toHaveCSS('opacity', '0');
    await expect(comingSoonIndicator).toHaveCSS('opacity', '0');

    // Wait for navigation to complete
    await navigationPromise;

    // Wait for js-loaded class to be applied
    await expect(page.locator('body.js-loaded')).toBeVisible();

    // Now text should be visible
    await expect(heroTitle).toHaveCSS('opacity', '1');
    await expect(comingSoonIndicator).toHaveCSS('opacity', '1');
    await expect(heroDescription).toHaveCSS('opacity', '0.9');
  });

  test.skip('should prevent flash with inline critical CSS', async ({ page }) => {
    // TODO: Implement animation-first CSS pattern for proper text hiding
    // Navigate directly without network simulation
    await page.goto('/');
  });
});
