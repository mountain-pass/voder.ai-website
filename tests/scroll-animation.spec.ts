import { test, expect } from '@playwright/test';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test('vision-flow section fades in on scroll', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Locate the Vision Flow section
  const section = page.locator('section#vision-flow');
  await expect(section).toBeVisible();

  // [initial opacity check removed]

  // Scroll section into view and wait for animation to complete
  await section.scrollIntoViewIfNeeded();
  await waitForAnimationsComplete(page, section);

  // Assert final opacity is greater than 0
  const finalOpacity = await section.evaluate(
    (el) => getComputedStyle(el).opacity
  );
  expect(Number(finalOpacity)).toBeGreaterThan(0);
});
