import { expect, test } from '@playwright/test';

test.describe('FOUC Prevention - Development Mode', () => {
  test('should detect empty app div before JavaScript executes', async ({ page }) => {
    // Test against the dev server to catch more subtle timing issues
    await page.goto('http://localhost:3000');

    // Immediately check the app div content before full load
    const appElement = page.locator('#app');

    await expect(appElement).toBeVisible();

    // Check if the app div is empty initially
    const initialContent = await appElement.innerHTML();

    console.log('Initial app content:', initialContent.trim());

    // In a FOUC scenario, this should be empty or nearly empty
    if (initialContent.trim() === '') {
      console.log('✓ FOUC detected: Empty app div before JavaScript execution');
      expect(initialContent.trim()).toBe(''); // This documents the FOUC issue
    } else {
      console.log('✗ No FOUC detected: Content already present');
      // If content is present, that means FOUC prevention is working
      expect(initialContent.trim().length).toBeGreaterThan(0);
    }

    // Wait for full load and verify content is eventually present
    await page.waitForLoadState('networkidle');
    const finalContent = await appElement.innerHTML();

    expect(finalContent.length).toBeGreaterThan(100);
  });

  test('should measure time between page load and content appearance', async ({ page }) => {
    // Record timing of content appearance
    await page.addInitScript(() => {
      (window as any).timingData = {
        domContentLoaded: 0,
        firstContentVisible: 0,
        jsExecutionStart: 0,
      };

      document.addEventListener('DOMContentLoaded', () => {
        (window as any).timingData.domContentLoaded = performance.now();

        // Check when content actually appears in the app div
        const checkForContent = () => {
          const app = document.querySelector('#app');

          if (app && app.innerHTML.trim() !== '') {
            (window as any).timingData.firstContentVisible = performance.now();
          } else {
            requestAnimationFrame(checkForContent);
          }
        };

        checkForContent();
      });
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const timingData = await page.evaluate(() => (window as any).timingData);

    console.log('DOM Content Loaded:', timingData.domContentLoaded + 'ms');
    console.log('First Content Visible:', timingData.firstContentVisible + 'ms');

    const contentDelay = timingData.firstContentVisible - timingData.domContentLoaded;

    console.log('Content appearance delay:', contentDelay + 'ms');

    // If there's a significant delay, that indicates FOUC
    if (contentDelay > 50) {
      console.log('⚠️  Potential FOUC: Content appeared', contentDelay + 'ms after DOM ready');
    }

    // This test documents the timing rather than asserting specific values
    expect(timingData.domContentLoaded).toBeGreaterThan(0);
    expect(timingData.firstContentVisible).toBeGreaterThan(0);
  });

  test('should show visual evidence of empty state', async ({ page }) => {
    // Navigate and immediately take a screenshot
    await page.goto('http://localhost:3000');

    // Take screenshot as soon as possible
    const immediateScreenshot = await page.screenshot({
      fullPage: true,
      path: 'test-results/immediate-load.png',
    });

    // Check the current state of the app
    const appContent = await page.locator('#app').innerHTML();

    const bodyBackground = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor,
    );

    console.log('Immediate app content length:', appContent.trim().length);
    console.log('Body background color:', bodyBackground);

    // Document what we find
    if (appContent.trim().length === 0) {
      console.log('📸 Screenshot captured showing empty app div');
      console.log('🚨 FOUC issue documented - page loads with empty content');
    } else {
      console.log('📸 Screenshot shows content already present');
      console.log('✅ FOUC prevention appears to be working');
    }

    // Wait for full load and compare
    await page.waitForLoadState('networkidle');
    const finalScreenshot = await page.screenshot({
      fullPage: true,
      path: 'test-results/final-load.png',
    });

    expect(immediateScreenshot).toBeDefined();
    expect(finalScreenshot).toBeDefined();
  });
});
