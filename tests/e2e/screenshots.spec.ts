import { expect, test } from '@playwright/test';

/**
 * Screenshot validation tests for 013.0-BIZ-BRAND-ENTRY story
 *
 * This test suite validates the brand identity landing page across multiple viewports
 * as required by the story acceptance criteria and ADR-0025.
 *
 * Requirements:
 * - Desktop (1920x1080): Full-page screenshot showing complete layout
 * - Tablet (768x1024): Responsive design validation
 * - Mobile (375x667): Mobile optimization verification
 * - Brand colors (#0A0A0A, #24D1D5) render correctly in all viewports
 * - Typography (Inter fonts) displays properly across all screen sizes
 */

const viewports = [
  {
    name: 'desktop',
    width: 1920,
    height: 1080,
    description: 'Desktop layout validation',
  },
  {
    name: 'tablet',
    width: 768,
    height: 1024,
    description: 'Tablet responsive design validation',
  },
  {
    name: 'mobile',
    width: 375,
    height: 667,
    description: 'Mobile optimization verification',
  },
];

test.describe('Brand Identity Screenshot Validation', () => {
  viewports.forEach(({ name, width, height, description: _description }) => {
    test(`Brand identity renders correctly on ${name} (${width}x${height})`, async ({ page }) => {
      // Set up console error monitoring (ignore expected cookie domain errors on localhost)
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const errorText = msg.text();

          // Ignore expected cookie domain errors when testing on localhost
          if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
            consoleErrors.push(errorText);
          }
        }
      });

      // Set viewport size
      await page.setViewportSize({ width, height });

      // Navigate to the homepage
      await page.goto('/');

      // Wait for the page to be fully loaded and rendered
      await page.waitForLoadState('networkidle');

      // Wait for any fonts to load
      await page.waitForTimeout(1000);

      // Verify key brand elements are present
      await expect(page.locator('.logo-text')).toContainText('VODER');
      await expect(page.locator('.hero-title')).toContainText('Keep Shipping Fast');
      await expect(page.locator('.status-text')).toContainText('Coming Soon');

      // Take full-page screenshot
      await page.screenshot({
        path: `screenshots/brand-${name}-${width}x${height}.png`,
        fullPage: true,
        animations: 'disabled',
      });

      // Verify brand colors are applied correctly
      const logoText = page.locator('.logo-text');

      const heroTitle = page.locator('.hero-title');

      const body = page.locator('body');

      // Check computed styles for brand colors
      const bodyBgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);

      const heroColor = await heroTitle.evaluate((el) => getComputedStyle(el).color);

      // Verify Voder Black background (#0A0A0A = rgb(10, 10, 10))
      expect(bodyBgColor).toBe('rgb(10, 10, 10)');

      // Verify Soft Teal Glow accent (#24D1D5 = rgb(36, 209, 213))
      expect(heroColor).toBe('rgb(36, 209, 213)');

      // Verify Inter font family is applied
      const logoFontFamily = await logoText.evaluate((el) => getComputedStyle(el).fontFamily);

      expect(logoFontFamily).toContain('Inter');

      // Verify no console errors occurred during page execution
      expect(consoleErrors).toHaveLength(0);
    });
  });

  test('Visual comparison across all viewports', async ({ page }) => {
    // Set up console error monitoring (ignore expected cookie domain errors on localhost)
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();

        // Ignore expected cookie domain errors when testing on localhost
        if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
          consoleErrors.push(errorText);
        }
      }
    });

    // This test captures screenshots at all viewports for visual comparison
    const screenshots = [];

    for (const { name, width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const screenshotPath = `screenshots/comparison-${name}-${width}x${height}.png`;

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        animations: 'disabled',
      });

      screenshots.push({ name, path: screenshotPath, viewport: `${width}x${height}` });
    }

    // Log screenshot information for assessment purposes
    console.log('Brand identity screenshots generated:', screenshots);

    // Verify no console errors occurred during page execution
    expect(consoleErrors).toHaveLength(0);
  });

  test('Accessibility and semantic structure validation', async ({ page }) => {
    // Set up console error monitoring (ignore expected cookie domain errors on localhost)
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();

        // Ignore expected cookie domain errors when testing on localhost
        if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
          consoleErrors.push(errorText);
        }
      }
    });

    // Test at desktop viewport for accessibility validation
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify semantic HTML structure
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await expect(page.locator('main[role="main"]')).toBeVisible();

    // Verify accessibility features
    await expect(page.locator('.skip-link')).toBeInViewport();
    await expect(page.locator('[aria-label="Voder"]')).toBeVisible();

    // Take accessibility-focused screenshot
    await page.screenshot({
      path: 'screenshots/accessibility-validation.png',
      fullPage: true,
      animations: 'disabled',
    });

    // Verify no console errors occurred during page execution
    expect(consoleErrors).toHaveLength(0);
  });

  test('Performance and loading validation', async ({ page }) => {
    // Set up console error monitoring (ignore expected cookie domain errors on localhost)
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();

        // Ignore expected cookie domain errors when testing on localhost
        if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
          consoleErrors.push(errorText);
        }
      }
    });

    // Test at mobile viewport for performance validation
    await page.setViewportSize({ width: 375, height: 667 });

    // Measure loading performance
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Verify reasonable load time (should be under 3 seconds for minimal assets with analytics)
    expect(loadTime).toBeLessThan(3000);

    // Take performance validation screenshot
    await page.screenshot({
      path: 'screenshots/performance-mobile.png',
      fullPage: true,
      animations: 'disabled',
    });

    console.log(`Page load time: ${loadTime}ms`);

    // Verify no console errors occurred during page execution
    expect(consoleErrors).toHaveLength(0);
  });
});
