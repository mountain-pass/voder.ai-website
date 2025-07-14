import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';

test('banner canvas renders the model (not just black)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  // scroll so ScrollTrigger will fire
  await page.locator('section[role="banner"]').scrollIntoViewIfNeeded();
  // wait for 3D model to finish loading
  await page.waitForFunction(
    () => (window as any).__bannerModelLoaded === true
  );
  // wait for Three.js to render at least one frame
  await page.waitForTimeout(500);
  const canvas = await page.$('section[role="banner"] canvas')!;
  const buffer = await canvas.screenshot();
  // pick center pixel
  const png = PNG.sync.read(buffer);
  const { data, width, height } = png;
  const idx = (Math.floor(height / 2) * width + Math.floor(width / 2)) * 4;
  // assert that one of R,G,B channels is nonzero
  expect(data[idx] + data[idx + 1] + data[idx + 2]).toBeGreaterThan(0);
});
