import { expect, test } from '@playwright/test';

test.describe('Text Flash Prevention', () => {
  test('should not show text content before 3D system is ready', async ({ page }) => {
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

    const statusIndicator = page.locator('.status-indicator');

    // Verify elements exist but are hidden initially
    await expect(heroTitle).toBeAttached();
    await expect(heroDescription).toBeAttached();
    await expect(statusIndicator).toBeAttached();

    // Critical test: these elements should have opacity: 0 initially
    await expect(heroTitle).toHaveCSS('opacity', '0');
    await expect(heroDescription).toHaveCSS('opacity', '0');
    await expect(statusIndicator).toHaveCSS('opacity', '0');

    // Wait for navigation to complete
    await navigationPromise;

    // Wait for js-loaded class to be applied
    await expect(page.locator('body.js-loaded')).toBeVisible();

    // Now text should be visible
    await expect(heroTitle).toHaveCSS('opacity', '1');
    await expect(statusIndicator).toHaveCSS('opacity', '1');
    await expect(heroDescription).toHaveCSS('opacity', '0.9');
  });

  test('should prevent flash with inline critical CSS', async ({ page }) => {
    // Disable JavaScript to test CSS-only behavior
    await page.addInitScript(() => {
      // Override script execution to simulate delayed JS
      const originalAddEventListener = window.addEventListener;

      window.addEventListener = function (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) {
        if (type === 'DOMContentLoaded') {
          // Delay DOMContentLoaded handlers to simulate slow JS
          setTimeout(() => originalAddEventListener.call(this, type, listener, options), 100);
        } else {
          originalAddEventListener.call(this, type, listener, options);
        }
      };
    });

    await page.goto('/');

    // Even with delayed JavaScript, text should remain hidden due to inline CSS
    const heroTitle = page.locator('.hero-title');

    await expect(heroTitle).toHaveCSS('opacity', '0');

    // Wait for eventual JavaScript execution
    await page.waitForTimeout(200);
    await expect(page.locator('body')).toHaveClass(/js-loaded/);

    // Now text should be visible
    await expect(heroTitle).toHaveCSS('opacity', '1');
  });
});
