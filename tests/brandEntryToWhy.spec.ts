import { test, expect } from '@playwright/test';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test('BrandEntry to The Why transition fades overlay and reveals Why section', async ({ page }) => {
  // 1. Navigate to the homepage
  await page.goto('/');

  // 2. Scroll down past the banner to trigger the transition
  await page.locator('#main-content').scrollIntoViewIfNeeded();

  // 3. Wait for animations to complete in the Why section
  const whySection = page.locator('#main-content');
  await waitForAnimationsComplete(page, whySection);

  // 4. Verify the 3D overlay faded to ~0.3 opacity
  const overlayOpacity = await page.$eval(
    '.three-d-transition',
    (el) => parseFloat(getComputedStyle(el).opacity)
  );
  expect(overlayOpacity).toBeGreaterThanOrEqual(0.25);
  expect(overlayOpacity).toBeLessThanOrEqual(0.35);

  // 5. Verify the Why section heading and subheading are visible
  await expect(page.locator('#why-heading')).toBeVisible();
  await expect(page.locator('p.subheading')).toBeVisible();
});
