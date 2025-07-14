import { test, expect } from '@playwright/test';

test('only one banner canvas is present', async ({ page }) => {
  await page.goto('/');

  // Exactly one <canvas> element in the entire document
  const allCanvases = await page.$$('canvas');
  expect(allCanvases.length).toBe(1);

  // That canvas must live inside the banner section
  const bannerCanvasCount = await page.$$eval(
    'section[role="banner"] canvas',
    (els) => els.length
  );
  expect(bannerCanvasCount).toBe(1);
});
