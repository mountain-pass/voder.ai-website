import { test, expect } from '@playwright/test';

test('Debug page loading and JavaScript errors', async ({ page }) => {
  // Track console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  // Track JavaScript errors
  const errors: string[] = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  // Navigate to the app
  await page.goto('/');

  // Wait a bit for the page to load
  await page.waitForTimeout(2000);

  // Log what we found
  console.log('Console messages:', consoleMessages);
  console.log('JavaScript errors:', errors);

  // Check if body has any content
  const bodyText = await page.locator('body').textContent();
  console.log('Body content length:', bodyText?.length || 0);

  // Look for any sections
  const sections = await page.locator('section').count();
  console.log('Number of sections found:', sections);

  // If there are errors, they might be preventing rendering
  if (errors.length > 0) {
    throw new Error(`JavaScript errors found: ${errors.join(', ')}`);
  }
});
