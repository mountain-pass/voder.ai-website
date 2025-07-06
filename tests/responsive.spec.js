import { test, expect } from '@playwright/test';

test.describe('Responsive layout', () => {
  test('mobile viewport (640×800) shows hero heading', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto('/');
    await expect(page.locator('h1.typing-animation')).toBeVisible();
  });

  test('tablet viewport (1024×768) shows hero heading', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await expect(page.locator('h1.typing-animation')).toBeVisible();
  });
});