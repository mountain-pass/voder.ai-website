import { expect, test } from '@playwright/test';

test('home page renders and title is correct', async ({ page }) => {
  await page.goto('/');

  // Wait explicitly for the app container to be visible (guard against slow startup)
  await page.waitForSelector('#app', { state: 'visible', timeout: 10000 });

  await expect(page).toHaveTitle(/Voder - The Compiler for Prompts/);
  const app = page.locator('#app');

  await expect(app).toBeVisible();
});
