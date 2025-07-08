import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Problem Section E2E + Accessibility', () => {
  test('renders ProblemSection and is accessible', async ({ page }) => {
    // Navigate to the app’s root URL
    await page.goto('/');

    // Locate the ProblemSection component on the page
    const problemSection = page.locator(
      'section[data-test-id="problem-section"]'
    );

    // Verify that the section is visible
    await expect(problemSection).toBeVisible();

    // Check for expected heading text in ProblemSection
    await expect(problemSection.locator('h2')).toHaveText('The Problem Space');

    // Accessibility scan
    const results = await new AxeBuilder({ page })
      .include('section[data-test-id="problem-section"]')
      .analyze();
    expect(results.violations).toHaveLength(0);
  });
});
