import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  const criticalViolations = results.violations.filter(
    (v) => v.impact === 'critical'
  );

  expect(criticalViolations).toEqual([]);
});
