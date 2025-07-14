import { test, expect } from '@playwright/test';

test('dynamically loads Three.js and GSAP when reduced motion is not preferred', async ({
  page,
}) => {
  // Simulate user does NOT prefer reduced motion
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  // Navigate to the app’s entry point
  await page.goto('/');
  // Trigger scroll to initialize scroll-triggered animations
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));

  // Wait until both libraries have been attached to window
  await page.waitForFunction(
    () =>
      typeof (window as any).THREE === 'object' &&
      typeof (window as any).gsap === 'object'
  );

  // Assert that Three.js and GSAP are present
  const threeType = await page.evaluate(() => typeof (window as any).THREE);
  const gsapType = await page.evaluate(() => typeof (window as any).gsap);

  expect(threeType).toBe('object');
  expect(gsapType).toBe('object');
});
