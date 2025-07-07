import { test, expect } from '@playwright/test';

test('Hero section UI on "/"', async ({ page }) => {
  await page.goto('/');

  // Prompt-creation bar with placeholder
  const promptBar = page.locator('[placeholder="Start to create."]');
  await expect(promptBar).toBeVisible();

  // Two pill buttons: Vibe & Code
  await expect(page.getByRole('button', { name: 'Vibe' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Code' })).toBeVisible();

  // Four tool icons (gear, globe, paperclip, microphone)
  for (const icon of ['gear', 'globe', 'paperclip', 'microphone']) {
    await expect(page.getByRole('img', { name: icon })).toBeVisible();
  }

  // Exactly five navigation pills with specific labels
  const navLabels = ['About', 'Philosophy', 'Media', 'Research', 'Founders'];
  const navItems = page.getByRole('navigation').locator('a');
  await expect(navItems).toHaveCount(5);
  for (const label of navLabels) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
  }

  // Help button
  await expect(page.getByRole('button', { name: 'Help' })).toBeVisible();
});
