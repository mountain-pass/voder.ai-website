import { test, expect } from '@playwright/test';

test('no console errors on page load', async ({ page }, testInfo) => {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/');
  // capture full-page screenshot for console test
  expect(errors, `console.error was called with: ${errors.join('; ')}`).toEqual(
    []
  );
});
