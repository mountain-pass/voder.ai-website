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

      // Wait for 3D animation to be fully loaded and visible
      await expect(page.locator('.hero-animation canvas')).toBeVisible({ timeout: 10000 });

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
      await expect(page.locator('.hero-animation canvas')).toBeVisible();
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
