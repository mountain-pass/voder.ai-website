import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test.describe('Problem Section E2E + Accessibility', () => {
  test('renders ProblemSection and is accessible', async ({ page }) => {
    // Navigate to the app's root URL
    await page.goto('/');

    // Locate the ProblemSection component on the page
    const problemSection = page.locator(
      'section[data-test-id="problem-section"]'
    );

    // Verify that the section is visible
    await expect(problemSection).toBeVisible();

    // Check for expected heading text in ProblemSection
    await expect(problemSection.locator('h2')).toHaveText(
      'The problem isn’t your tools.'
    );
    await expect(problemSection.locator('p.secondary-heading')).toHaveText(
      'It’s the gap between your ideas and your implementation.'
    );

    // Wait for animations to complete before accessibility scan
    await waitForAnimationsComplete(page, problemSection);

    // Accessibility scan
    const results = await new AxeBuilder({ page })
      .include('section[data-test-id="problem-section"]')
      .analyze();
    expect(results.violations).toHaveLength(0);
  });
});
