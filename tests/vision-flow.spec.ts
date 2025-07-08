import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('How It Works section is accessible', async ({ page }) => {
  // 1. Navigate to the home page
  await page.goto('/');

  // 2. Locate the section with id="vision-flow"
  const section = page.locator('section#vision-flow');
  await expect(section).toBeVisible();

  // 3. Verify the heading text
  const heading = section.locator('h2');
  await expect(heading).toHaveText('How It Works');

  // 4. Run Axe accessibility scan scoped to this section
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('section#vision-flow')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
