// tests/responsive.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Responsive layout', () => {
  test('mobile viewport (640×800) shows hero heading', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('tablet viewport (1024×768) shows hero heading', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});