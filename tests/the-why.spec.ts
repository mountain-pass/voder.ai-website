import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test('The Why section is present, accessible, and passes Axe core scan', async ({
  page,
}) => {
  // Navigate to home page
  await page.goto('/');

  // Target the main "Why" section
  const section = page.locator('#main-content');

  // Check the main heading
  await expect(
    section.getByRole('heading', {
      level: 1,
      name: 'We believe software should start with intent.',
    })
  ).toBeVisible();

  // Check the subheading text
  await expect(section.locator('p.subheading')).toHaveText(
    'Not code. Not files. Not frameworks. But the spark behind them all.'
  );

  // Check the decorative element
  await expect(
    section.locator('div.three-d-transition[aria-hidden="true"]')
  ).toHaveCount(1);

  // Wait for animations to complete before accessibility scan
  await waitForAnimationsComplete(page, section);

  // Run Axe accessibility scan scoped to this section
  const results = await new AxeBuilder({ page })
    .include('#main-content')
    .analyze();
  expect(results.violations).toHaveLength(0);
});
