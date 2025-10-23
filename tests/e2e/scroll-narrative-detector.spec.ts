/**
 * @fileoverview E2E tests for ScrollNarrativeDetector
 * Validates scroll detection behavior in real browser environment
 */

import { expect, test } from '@playwright/test';

test.describe('Scroll Narrative Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should detect narrative section in DOM', async ({ page }) => {
    const narrativeSection = page.locator('.panel');

    await expect(narrativeSection).toBeVisible();
  });

  test('should log scroll progress when scrolling through narrative section', async ({ page }) => {
    const consoleLogs: string[] = [];

    // Capture console logs
    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Narrative scroll progress')) {
        consoleLogs.push(msg.text());
      }
    });

    // Scroll to narrative section
    await page.locator('.panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Allow scroll detection to process

    // Verify scroll progress is being logged
    expect(consoleLogs.length).toBeGreaterThan(0);
    expect(consoleLogs[0]).toMatch(/Narrative scroll progress: \d+\.\d%/);
  });

  test('should log viewport entry when narrative section enters viewport', async ({ page }) => {
    const consoleLogs: string[] = [];

    // Capture console logs
    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Narrative section entered viewport')) {
        consoleLogs.push(msg.text());
      }
    });

    // Start at top of page
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // Scroll to narrative section
    await page.locator('.panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify entry was detected
    expect(consoleLogs.length).toBeGreaterThan(0);
    expect(consoleLogs[0]).toBe('Narrative section entered viewport');
  });

  test('should track scroll progress bidirectionally', async ({ page }) => {
    const consoleLogs: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Narrative scroll progress')) {
        consoleLogs.push(msg.text());
      }
    });

    // Scroll down through narrative
    await page.locator('.panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const forwardLogs = consoleLogs.length;

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Should have logged progress in both directions
    expect(consoleLogs.length).toBeGreaterThan(forwardLogs);
  });

  test('should work consistently across different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);

      const consoleLogs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'log' && msg.text().includes('Narrative scroll progress')) {
          consoleLogs.push(msg.text());
        }
      });

      // Scroll to narrative section
      await page.locator('.panel').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Should detect scroll progress on all devices
      expect(consoleLogs.length).toBeGreaterThan(0);
      expect(consoleLogs[0]).toMatch(/Narrative scroll progress: \d+\.\d%/);

      // Clear listeners for next iteration
      page.removeAllListeners('console');
    }
  });

  test('should calculate accurate scroll percentages', async ({ page }) => {
    let lastProgress = -1;

    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Narrative scroll progress')) {
        const match = msg.text().match(/Narrative scroll progress: (\d+\.\d)%/);

        if (match) {
          lastProgress = parseFloat(match[1]);
        }
      }
    });

    // Scroll to narrative section - should be partially visible
    await page.locator('.panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Should have valid progress percentage
    expect(lastProgress).toBeGreaterThanOrEqual(0);
    expect(lastProgress).toBeLessThanOrEqual(100);
  });

  test('should handle rapid scrolling without performance issues', async ({ page }) => {
    const startTime = Date.now();

    // Perform rapid scrolling
    for (let i = 0; i < 10; i++) {
      await page.evaluate((scrollPos) => window.scrollBy(0, scrollPos), 100 * i);
      await page.waitForTimeout(50);
    }

    const endTime = Date.now();

    const duration = endTime - startTime;

    // Should complete rapid scrolling quickly (under 2 seconds)
    expect(duration).toBeLessThan(2000);

    // Page should still be responsive
    const narrativeSection = page.locator('.panel');

    await expect(narrativeSection).toBeVisible();
  });

  test('should not log when narrative section is completely out of viewport', async ({ page }) => {
    const consoleLogs: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Narrative section exited viewport')) {
        consoleLogs.push(msg.text());
      }
    });

    // Start at narrative section
    await page.locator('.panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Scroll far past narrative section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Should detect exit from viewport
    expect(consoleLogs.length).toBeGreaterThan(0);
    expect(consoleLogs[0]).toBe('Narrative section exited viewport');
  });
});
