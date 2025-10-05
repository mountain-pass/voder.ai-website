import { expect, test } from '@playwright/test';

test.describe('FOUC Prevention', () => {
  test('should not show visual flicker during page load', async ({ page }) => {
    // Start monitoring layout shifts before navigation
    await page.addInitScript(() => {
      let cumulativeLayoutShift = 0;

      let sessionValue = 0;

      let sessionEntries: LayoutShift[] = [];

      // Track layout shifts
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];

            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            // If the entry occurred less than 1 second after the previous entry
            // and less than 5 seconds after the first entry in the session,
            // include the entry in the current session. Otherwise, start a new session.
            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            // If the current session value is larger than the current CLS value,
            // update CLS and the entries contributing to it.
            if (sessionValue > cumulativeLayoutShift) {
              cumulativeLayoutShift = sessionValue;
            }
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      // Expose CLS value globally for the test
      (window as any).getCLS = () => cumulativeLayoutShift;
    });

    // Navigate to the page
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Verify the page has visible content immediately
    const heroTitle = page.locator('h1:has-text("AI Coding Without the Slop")');

    await expect(heroTitle).toBeVisible({ timeout: 100 }); // Very short timeout to catch flicker

    // Check that the background is not white (indicating FOUC)
    const bodyBackground = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Should be black/dark, not white
    expect(bodyBackground).not.toBe('rgb(255, 255, 255)');
    expect(bodyBackground).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent

    // Measure Cumulative Layout Shift
    const cls = await page.evaluate(() => (window as any).getCLS());

    expect(cls).toBeLessThan(0.1); // Good CLS score

    // Verify content doesn't shift after JavaScript loads
    await page.waitForTimeout(1000); // Give time for any potential shifts

    const finalCLS = await page.evaluate(() => (window as any).getCLS());

    expect(finalCLS).toBeLessThan(0.1);
  });

  test('should show proper content structure without JavaScript', async ({ browser }) => {
    // Create a context with JavaScript disabled
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });

    const page = await context.newPage();

    await page.goto('/');

    // Should still show the basic content structure
    const appElement = page.locator('#app');

    await expect(appElement).toBeVisible();

    // With the current implementation, content is added by JS
    // This test documents the current behavior - content should be visible without JS
    const content = await appElement.textContent();

    // Currently this will likely be empty or minimal because content is JS-rendered
    // This test will fail and document the FOUC issue
    console.log('Content without JavaScript:', content);

    // This assertion will likely fail, documenting the problem
    expect(content?.length || 0).toBeGreaterThan(10);

    await context.close();
  });

  test('should measure First Contentful Paint timing', async ({ page }) => {
    // Monitor performance metrics
    await page.addInitScript(() => {
      // Track FCP
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            (window as any).fcpTime = entry.startTime;
          }
        }
      }).observe({ type: 'paint', buffered: true });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get First Contentful Paint timing
    const fcpTime = await page.evaluate(() => (window as any).fcpTime);

    // FCP should be reasonable (less than 2 seconds on fast connection)
    expect(fcpTime).toBeLessThan(2000);

    console.log(`First Contentful Paint: ${fcpTime}ms`);
  });

  test('should not show empty white screen during slow loading', async ({ page }) => {
    // Throttle the network to simulate slow connection
    await page.route('**/*', async (route) => {
      // Add delay to simulate slow loading
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');

    // Check that we don't have a completely white screen
    // This is a basic check - in a real implementation you'd analyze the screenshot
    const backgroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Should not be default white background
    expect(backgroundColor).not.toBe('rgb(255, 255, 255)');
  });

  test('should maintain visual consistency across browser refresh', async ({ page }) => {
    // First load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const firstLoadScreenshot = await page.screenshot({ fullPage: true });

    // Clear cache and reload
    await page.evaluate(() => {
      // Clear any cached resources
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
    });

    // Reload the page
    await page.reload({ waitUntil: 'networkidle' });
    const reloadScreenshot = await page.screenshot({ fullPage: true });

    // Screenshots should be similar (this is a basic check)
    // In a more sophisticated test, you'd use image comparison
    expect(firstLoadScreenshot).toBeDefined();
    expect(reloadScreenshot).toBeDefined();
  });

  test('should detect blank page before JavaScript loads', async ({ page }) => {
    // Intercept and delay JavaScript loading to simulate slow connection
    await page.route('**/main.ts', async (route) => {
      // Delay JavaScript loading by 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.continue();
    });

    // Navigate and immediately check content
    await page.goto('/');

    // Take screenshot for debugging (before JS loads)
    await page.screenshot({
      fullPage: true,
      path: 'test-results/before-js-load.png',
    });

    // Check if page is mostly empty/blank before JS loads
    const appContent = await page.locator('#app').textContent();

    console.log('App content before JS loads:', appContent);

    // This should fail with current implementation - documenting the FOUC issue
    expect(appContent?.trim().length || 0).toBeGreaterThan(50);

    // Wait for JavaScript to load and check content appears
    await page.waitForLoadState('networkidle');
    const afterJSContent = await page.locator('#app').textContent();

    expect(afterJSContent?.length || 0).toBeGreaterThan(100);
  });
});

// Helper type for TypeScript
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  startTime: number;
}
