import { test, expect } from '@playwright/test';

test('BrandEntry component renders a Threlte canvas at /brandentry', async ({
  page,
}) => {
  await page.goto('/brandentry');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
});
