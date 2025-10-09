import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'mobile-landscape', width: 667, height: 375 },
];

test.describe('Business Area Screenshot Validation', () => {
  test.beforeAll(async () => {
    const screenshotsDir = path.join(process.cwd(), 'screenshots');

    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);

      let deletedCount = 0;

      for (const file of files) {
        if (file.endsWith('.png')) {
          const filePath = path.join(screenshotsDir, file);

          try {
            fs.unlinkSync(filePath);
            deletedCount++;
          } catch (error) {
            if ((error as any).code !== 'ENOENT') {
              throw error;
            }
          }
        }
      }
      console.log(`Cleaned up ${deletedCount} existing screenshot files`);
    }
  });

  test('Production site verification', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('.logo-text')).toContainText('VODER');
    await expect(page.locator('.hero-title')).toContainText('AI Coding Without the Slop');
  });

  viewports.forEach(({ name, width, height }) => {
    test(`Brand Entry - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check if 3D animation is available or disabled due to performance
      const canvasVisible = await page.evaluate(() => {
        const canvas = document.querySelector('.hero-animation canvas');

        const fallback = document.querySelector('.animation-fallback');

        return canvas && !fallback;
      });

      if (canvasVisible) {
        // Wait for 3D animation to be fully loaded and visible
        await expect(page.locator('.hero-animation canvas')).toBeVisible({ timeout: 10000 });
      } else {
        // On mobile devices, 3D animation may be disabled for performance
        // Wait for hero animation container instead
        await expect(page.locator('.hero-animation')).toBeVisible({ timeout: 10000 });
      }

      // Ensure we're at the top of the page
      await page.evaluate(() => window.scrollTo(0, 0));

      await page.screenshot({
        path: `screenshots/brand-entry-${name}-${width}x${height}.png`,
        fullPage: false,
        animations: 'disabled',
      });

      // Verify all brand elements are visible
      await expect(page.locator('.logo-text')).toBeVisible();
      await expect(page.locator('.hero-title')).toBeVisible();

      // Only check canvas visibility if 3D animation is enabled
      if (canvasVisible) {
        await expect(page.locator('.hero-animation canvas')).toBeVisible();
      } else {
        // Verify the hero animation container is present (may contain fallback)
        await expect(page.locator('.hero-animation')).toBeVisible();
      }
    });

    test(`Problem Statement - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for problem title to be visible, then scroll to it
      await expect(page.locator('#problem-title')).toBeVisible();
      await page.evaluate(() => {
        const element = document.querySelector('#problem-title');

        if (element) {
          element.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      });

      await page.screenshot({
        path: `screenshots/problem-statement-${name}-${width}x${height}.png`,
        fullPage: false,
        animations: 'disabled',
      });

      // Verify problem statement elements are visible
      await expect(page.locator('#problem-title')).toBeVisible();
      await expect(page.locator('.problem-description')).toBeVisible();
    });

    test(`Interest Capture - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for interest capture section to be visible, then scroll to it
      await expect(page.locator('.interest-capture')).toBeVisible();
      await page.evaluate(() => {
        const element = document.querySelector('.interest-capture');

        if (element) {
          element.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      });

      await page.screenshot({
        path: `screenshots/interest-capture-${name}-${width}x${height}.png`,
        fullPage: false,
        animations: 'disabled',
      });

      // Verify interest capture elements are visible
      await expect(page.locator('.signup-title')).toBeVisible();
      await expect(page.locator('.signup-form')).toBeVisible();
    });
  });
});
