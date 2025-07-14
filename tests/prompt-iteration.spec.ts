import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test('Prompt-Driven Iteration section is accessible', async ({ page }) => {
  // 1. Navigate to the home page
  await page.goto('/');

  // 2. Locate the section by its ARIA label
  const section = page.locator(
    'section[aria-labelledby="prompt-iteration-heading"]'
  );
  await expect(section).toBeVisible();

  // 3. Verify the heading and subtext
  await expect(
    section.getByRole('heading', {
      level: 2,
      name: 'Change the prompt. Not the team.',
    })
  ).toBeVisible();
  await expect(section.locator('p.prompt-iteration-subtext')).toHaveText(
    'With Voder, your intent drives product delivery. No briefs. No handoffs. No misalignment.'
  );

  // 4. Verify prompt panel and UI mockup exist
  await expect(section.locator('div.prompt-panel[role="img"]')).toBeVisible();
  await expect(section.locator('div.ui-mockup[role="img"] h3')).toHaveText(
    'Let’s get you started!'
  );

  // Wait for animations to complete before accessibility scan
  await waitForAnimationsComplete(page, section);

  // 5. Run Axe accessibility scan scoped to this section
  const results = await new AxeBuilder({ page })
    .include('section[aria-labelledby="prompt-iteration-heading"]')
    .analyze();
  expect(results.violations).toHaveLength(0);
});
