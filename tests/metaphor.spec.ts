import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Metaphor Section', () => {
  test('should render and have no accessibility violations', async ({
    page,
  }) => {
    // 1. Navigate to the root of the app (adjust URL if needed)
    await page.goto('/');

    // 2. Wait for the MetaphorSection component to appear
    const metaphorSection = page.locator(
      'section[data-testid="metaphor-section"]'
    );
    await expect(metaphorSection).toBeVisible();

    // 3. Accessibility scan with AxeBuilder
    const results = await new AxeBuilder({ page })
      .include('section[data-testid="metaphor-section"]')
      .analyze();
    expect(results.violations).toHaveLength(0);
  });
});
