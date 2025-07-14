import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test('brand introduction banner is present, accessible, and passes Axe core scan', async ({
  page,
}) => {
  // Go to the home page
  await page.goto('/');

  // Locate the banner section
  const banner = page.getByRole('banner', { name: 'Voder brand introduction' });
  await expect(banner).toBeVisible();

  // Verify it contains a non-interactive canvas
  const canvas = banner.locator('canvas[aria-hidden="true"]');
  await expect(canvas).toHaveCount(1);

  // Verify the "skip to main content" link exists and can receive focus
  const skipLink = page.locator('a.skip-link[href="#main-content"]');
  await expect(skipLink).toHaveCount(1);
  await skipLink.focus();
  await expect(skipLink).toBeFocused();

  // Wait for animations to complete before accessibility scan
  await waitForAnimationsComplete(page, banner);

  // Accessibility scan
  const results = await new AxeBuilder({ page })
    .include('section[role="banner"]')
    .exclude('a.skip-link')
    .analyze();
  expect(results.violations).toHaveLength(0);
});
