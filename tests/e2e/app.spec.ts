import { expect,test } from '@playwright/test';

test('home page renders and title is correct', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Voder - The Compiler for Prompts/);
  const app = page.locator('#app');

  await expect(app).toBeVisible();
});
