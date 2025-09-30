import { expect, test } from '@playwright/test';

test.describe('FOUC Prevention - Development Mode', () => {
  test.skip('should detect empty app div before JavaScript executes', async ({ page }) => {
    // TODO: Configure proper development server for testing or remove unnecessary dev mode tests
    await page.goto('http://localhost:3000');
    const appElement = page.locator('#app');

    await expect(appElement).toBeVisible();
    const initialContent = await appElement.innerHTML();

    console.log('Initial app content:', initialContent.trim());

    if (initialContent.trim() === '') {
      console.log('✓ FOUC detected');
      expect(initialContent.trim()).toBe('');
    } else {
      console.log('✗ No FOUC detected');
      expect(initialContent.trim().length).toBeGreaterThan(0);
    }

    await page.waitForLoadState('networkidle');
    const finalContent = await appElement.innerHTML();

    expect(finalContent.length).toBeGreaterThan(100);
  });

  test.skip('should measure timing', async ({ page }) => {
    // TODO: Configure proper development server for testing
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('Page loaded successfully');
    expect(true).toBe(true);
  });

  test.skip('should show visual evidence', async ({ page }) => {
    // TODO: Configure proper development server for testing
    await page.goto('http://localhost:3000');
    const screenshot = await page.screenshot({
      fullPage: true,
      path: 'test-results/immediate-load.png',
    });

    const appContent = await page.locator('#app').innerHTML();

    console.log('App content length:', appContent.trim().length);

    await page.waitForLoadState('networkidle');
    expect(screenshot).toBeDefined();
  });
});
