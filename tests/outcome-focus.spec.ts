import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('Outcome Focus section is present, accessible, and passes Axe core scan', async ({
  page,
}) => {
  // Go to the home page
  await page.goto('/');

  // Locate the section by its ARIA label
  const section = page.locator(
    'section[aria-labelledby="outcome-focus-heading"]'
  );
  await expect(section).toHaveCount(1);

  // Verify the heading and subtext
  await expect(
    section.getByRole('heading', { level: 2, name: 'Outcomes, not overhead.' })
  ).toBeVisible();
  await expect(
    section.getByText(
      'Voder bridges the gap between strategy and shipping — without adding layers, delays, or drift.'
    )
  ).toBeVisible();

  // Verify exactly four benefit items with emojis
  const items = section.locator('div[role="complementary"]');
  await expect(items).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    const item = items.nth(i);
    await expect(item.locator('span[aria-hidden="true"]')).toHaveCount(1);
  }

  const results = await new AxeBuilder({ page })
    .include('section[aria-labelledby="outcome-focus-heading"]')
    .exclude('div[role="complementary"]')
    .analyze();
  expect(results.violations).toHaveLength(0);
});
