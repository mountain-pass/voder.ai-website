import { test, expect } from '@playwright/test';

test('dynamically loads Three.js and GSAP on initial load', async ({ page }) => {
  // Navigate to the app’s entry point
  await page.goto('/', { waitUntil: 'load' });
  // Wait for full page load before assertions
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(
    () => Boolean((window as any).THREE) && Boolean((window as any).gsap),
    { timeout: 15000 }
  );

  // Assert that Three.js and GSAP globals are defined
  const hasThree = await page.evaluate(() => Boolean((window as any).THREE));
  const hasGsap = await page.evaluate(() => Boolean((window as any).gsap));

  expect(hasThree).toBe(true);
  expect(hasGsap).toBe(true);
});
