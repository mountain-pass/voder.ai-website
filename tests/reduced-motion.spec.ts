import { test, expect } from '@playwright/test';

test.describe('Reduced-motion fallback', () => {
  test('skips complex animations when prefers-reduced-motion is reduce', async ({
    page,
  }) => {
    // Emulate reduced motion setting
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Capture console messages
    const consoleMessages: string[] = [];
    page.on('console', (msg) => consoleMessages.push(msg.text()));

    // Navigate to home
    await page.goto('/');

    // Assert the fallback log appears
    expect(consoleMessages).toContain(
      'Reduced motion detected, skipping complex animations.'
    );

    // Only the BrandEntry canvas should exist (no Three.js canvas)
    const canvases = await page.$$('canvas');
    expect(canvases.length).toBe(1);
  });
});
