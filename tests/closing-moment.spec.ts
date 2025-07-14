import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test('Closing Moment section is present, accessible, and passes Axe core scan', async ({
  page,
}) => {
  // Go to the home page
  await page.goto('/');

  // Locate the closing-moment section by landmark role
  const section = page.locator('section[role="contentinfo"]');
  await expect(section).toHaveCount(1);

  // Verify the hidden screen-reader heading
  const srHeading = section.locator('h2#closing-heading.visually-hidden');
  await expect(srHeading).toHaveCount(1);
  await expect(srHeading).toHaveText('Voder brand conclusion');

  // Verify the visible content
  await expect(
    section.getByRole('heading', { level: 3, name: 'The Compiler for Prompts' })
  ).toBeVisible();
  await expect(section.getByText('Coming Soon')).toBeVisible();
  await expect(
    section.getByText('Built with Voder. (Of course.)')
  ).toBeVisible();

  // Wait for animations to complete before accessibility scan
  await waitForAnimationsComplete(page, section);

  const results = await new AxeBuilder({ page })
    .include('section[role="contentinfo"]')
    .analyze();
  expect(results.violations).toHaveLength(0);
});
