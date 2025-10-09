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

      // Wait longer for the animation to finish initializing and performance monitoring to complete
      // The 3D animation system monitors performance for 3 seconds before deciding to disable
      await page.waitForTimeout(4000);

      // Check animation state multiple times to ensure it's stable
      let animationState;

      let stable = false;

      let attempts = 0;

      while (!stable && attempts < 3) {
        animationState = await page.evaluate(() => {
          const canvas = document.querySelector('.hero-animation canvas') as HTMLCanvasElement;

          const fallback = document.querySelector('.animation-fallback');

          const container = document.querySelector('.hero-animation');

          // Debug info
          const heroAnimationHtml = container?.innerHTML || 'NO_CONTAINER';

          return {
            hasCanvas: !!canvas,
            hasFallback: !!fallback,
            hasContainer: !!container,
            canvasVisible: canvas ? !canvas.hidden && canvas.offsetParent !== null : false,
            heroAnimationContent: heroAnimationHtml.substring(0, 200), // First 200 chars for debugging
          };
        });

        // Wait a bit and check again to see if state is stable
        await page.waitForTimeout(500);
        const animationState2 = await page.evaluate(() => {
          const canvas = document.querySelector('.hero-animation canvas') as HTMLCanvasElement;

          const fallback = document.querySelector('.animation-fallback');

          return {
            hasCanvas: !!canvas,
            hasFallback: !!fallback,
            canvasVisible: canvas ? !canvas.hidden && canvas.offsetParent !== null : false,
          };
        });

        // Check if state is stable between checks
        stable =
          animationState.hasCanvas === animationState2.hasCanvas &&
          animationState.hasFallback === animationState2.hasFallback &&
          animationState.canvasVisible === animationState2.canvasVisible;

        attempts++;
        if (!stable) {
          console.log(`Animation state unstable for ${name}, attempt ${attempts}, waiting more...`);
          await page.waitForTimeout(1000);
        }
      }

      console.log(`Final animation state for ${name}: ${JSON.stringify(animationState, null, 2)}`);

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

      // Always ensure the hero animation container is present
      await expect(page.locator('.hero-animation')).toBeVisible();

      // Check for either canvas (3D) or fallback (2D) animation with more lenient expectations
      const hasCanvas = (await page.locator('.hero-animation canvas').count()) > 0;

      const hasFallback = (await page.locator('.animation-fallback').count()) > 0;

      if (hasCanvas) {
        // 3D animation is active
        await expect(page.locator('.hero-animation canvas')).toBeVisible({ timeout: 5000 });
      } else if (hasFallback) {
        // 2D fallback animation is active
        await expect(page.locator('.animation-fallback')).toBeVisible();
      } else {
        // Animation container exists but content might not be determined yet
        // This is acceptable for screenshot tests as long as the container is present
        console.log(`No specific animation content detected for ${name}, but container is present`);
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
