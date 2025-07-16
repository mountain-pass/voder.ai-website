import { test, expect } from '@playwright/test';

test('canvas elements are properly distributed across sections', async ({ page }) => {
  await page.goto('/');

  // Two canvas elements should exist: one for Brand Entry, one for Problem Section Visual Chaos
  const allCanvases = await page.$$('canvas');
  expect(allCanvases.length).toBe(2);

  // The banner section should have exactly one canvas (Brand Entry)
  const bannerCanvasCount = await page.$$eval(
    'section[role="banner"] canvas',
    (els) => els.length
  );
  expect(bannerCanvasCount).toBe(1);

  // The problem section should have exactly one canvas (Visual Chaos)
  const problemCanvasCount = await page.$$eval(
    'section[data-test-id="problem-section"] canvas',
    (els) => els.length
  );
  expect(problemCanvasCount).toBe(1);
});
