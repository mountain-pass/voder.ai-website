import { test, expect } from '@playwright/test';

test.describe('Reduced-motion fallback', () => {
  test('skips complex animations when prefers-reduced-motion is reduce', async ({ page }) => {
    // Emulate reduced motion setting
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Register console listener before navigation
    const consoleMessagePromise = page.waitForEvent('console', {
      predicate: (m) =>
        m.text().includes('Reduced motion detected, skipping complex animations.'),
      timeout: 15000,
    });

    // Navigate to home and wait until network is idle
    await page.goto('/', { waitUntil: 'networkidle' });

    // Assert the reduced motion log was captured
    const msg = await consoleMessagePromise;
    expect(msg.text()).toContain(
      'Reduced motion detected, skipping complex animations.'
    );

    // Only the BrandEntry canvas should exist (no Three.js canvas)
    const canvases = await page.$$('canvas');
    expect(canvases.length).toBe(1);
  });
});
