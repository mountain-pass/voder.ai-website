import { expect, test } from '@playwright/test';

/**
 * Screenshot validation tests for 013.0-BIZ-BRAND-ENTRY story
 *
 * This test suite validates the brand identity landing page across multiple viewports
 * as required by the story acceptance criteria and ADR-0025.
 *
 * Requirements:
 * - Desktop (1920x1080): Full-page screenshot showing complete layout
 * - Tablet (768x1024): Responsive design validation
 * - Mobile (375x667): Mobile optimization verification
 * - Brand colors (#0A0A0A, #24D1D5) render correctly in all viewports
 * - Typography (Inter fonts) displays properly across all screen sizes
 */

const viewports = [
  {
    name: 'desktop',
    width: 1920,
    height: 1080,
    description: 'Desktop layout validation',
  },
  {
    name: 'tablet',
    width: 768,
    height: 1024,
    description: 'Tablet responsive design validation',
  },
  {
    name: 'mobile',
    width: 375,
    height: 667,
    description: 'Mobile optimization verification',
  },
];

test.describe('Brand Identity Screenshot Validation', () => {
  // Enhanced production verification test to detect holding pages and validate performance
  test('Production site verification - comprehensive health check', async ({ page }) => {
    // Set up console error monitoring
    const consoleErrors: string[] = [];

    const networkErrors: string[] = [];

    const performanceMetrics = {
      loadStart: 0,
      loadEnd: 0,
      networkIdle: 0,
    };

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();

        // Ignore expected cookie domain errors on localhost/testing environments
        if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
          consoleErrors.push(errorText);
        }
      }
    });

    page.on('response', (response) => {
      if (!response.ok() && response.status() >= 400) {
        networkErrors.push(`${response.status()} ${response.statusText()} - ${response.url()}`);
      }
    });

    // Record performance timing
    performanceMetrics.loadStart = Date.now();

    // Navigate to the homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    performanceMetrics.networkIdle = Date.now();

    // Get page content for holding page detection
    const pageContent = await page.content();

    const pageTitle = await page.title();

    // Enhanced holding page detection with more indicators
    const holdingPageIndicators = [
      'namecheap',
      'holding page',
      'domain parking',
      'under construction',
      'default page',
      'apache test',
      'nginx test',
      'iis',
      'cpanel',
      'plesk',
      'this domain is for sale',
      'parked domain',
      'sedo domain parking',
      'godaddy',
      'bluehost',
      'hostgator',
      'temporarily unavailable',
      'maintenance mode',
      'site not found',
      'domain expired',
      'suspended',
      'bandwidth exceeded',
      'account suspended',
    ];

    const lowerContent = pageContent.toLowerCase();

    const lowerTitle = pageTitle.toLowerCase();

    // Check for holding page indicators
    for (const indicator of holdingPageIndicators) {
      if (lowerContent.includes(indicator) || lowerTitle.includes(indicator)) {
        throw new Error(
          `Detected holding page indicator: "${indicator}" in ${lowerContent.includes(indicator) ? 'content' : 'title'}`,
        );
      }
    }

    // Verify expected Voder content is present (proves it's our site, not holding page)
    await expect(page.locator('.logo-text')).toContainText('VODER');
    await expect(page.locator('.hero-title')).toContainText('Keep Shipping Fast');
    await expect(page.locator('.hero-description')).toContainText('AI development');

    // Verify page title matches our site
    expect(pageTitle).toContain('Voder');
    expect(pageTitle).toContain('Keep Shipping Fast');

    // Verify no console errors occurred during load
    if (consoleErrors.length > 0) {
      throw new Error(`Console errors detected: ${consoleErrors.join(', ')}`);
    }

    // Verify no network errors
    if (networkErrors.length > 0) {
      throw new Error(`Network errors detected: ${networkErrors.join(', ')}`);
    }

    // Performance validation - site should load reasonably fast
    const loadTime = performanceMetrics.networkIdle - performanceMetrics.loadStart;

    console.log(`Page load time: ${loadTime}ms`);

    // Allow up to 10 seconds for load (generous for production environments)
    expect(loadTime).toBeLessThan(10000);

    performanceMetrics.loadEnd = Date.now();
  });

  viewports.forEach(({ name, width, height, description: _description }) => {
    test(`Brand identity renders correctly on ${name} (${width}x${height})`, async ({ page }) => {
      // Set up console error monitoring (ignore expected cookie domain errors on localhost)
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const errorText = msg.text();

          // Ignore expected cookie domain errors when testing on localhost
          if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
            consoleErrors.push(errorText);
          }
        }
      });

      // Set viewport size
      await page.setViewportSize({ width, height });

      // Navigate to the homepage
      await page.goto('/');

      // Wait for the page to be fully loaded and rendered
      await page.waitForLoadState('networkidle');

      // Wait for any fonts to load
      await page.waitForTimeout(1000);

      // Verify key brand elements are present
      await expect(page.locator('.logo-text')).toContainText('VODER');
      await expect(page.locator('.hero-title')).toContainText('Keep Shipping Fast');
      await expect(page.locator('.status-text')).toContainText('Coming Soon');

      // Take full-page screenshot
      await page.screenshot({
        path: `screenshots/brand-${name}-${width}x${height}.png`,
        fullPage: true,
        animations: 'disabled',
      });

      // Verify brand colors are applied correctly
      const logoText = page.locator('.logo-text');

      const heroTitle = page.locator('.hero-title');

      const body = page.locator('body');

      // Check computed styles for brand colors
      const bodyBgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);

      const heroColor = await heroTitle.evaluate((el) => getComputedStyle(el).color);

      // Verify Voder Black background (#0A0A0A = rgb(10, 10, 10))
      expect(bodyBgColor).toBe('rgb(10, 10, 10)');

      // Verify Soft Teal Glow accent (#24D1D5 = rgb(36, 209, 213))
      expect(heroColor).toBe('rgb(36, 209, 213)');

      // Verify Inter font family is applied
      const logoFontFamily = await logoText.evaluate((el) => getComputedStyle(el).fontFamily);

      expect(logoFontFamily).toContain('Inter');

      // Verify no console errors occurred during page execution
      expect(consoleErrors).toHaveLength(0);
    });
  });

  test('Visual comparison across all viewports', async ({ page }) => {
    // Set up console error monitoring (ignore expected cookie domain errors on localhost)
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();

        // Ignore expected cookie domain errors when testing on localhost
        if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
          consoleErrors.push(errorText);
        }
      }
    });

    // This test captures screenshots at all viewports for visual comparison
    const screenshots = [];

    for (const { name, width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const screenshotPath = `screenshots/comparison-${name}-${width}x${height}.png`;

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        animations: 'disabled',
      });

      screenshots.push({ name, path: screenshotPath, viewport: `${width}x${height}` });
    }

    // Log screenshot information for assessment purposes
    console.log('Brand identity screenshots generated:', screenshots);

    // Verify no console errors occurred during page execution
    expect(consoleErrors).toHaveLength(0);
  });

  test('Accessibility and semantic structure validation', async ({ page }) => {
    // Set up console error monitoring (ignore expected cookie domain errors on localhost)
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();

        // Ignore expected cookie domain errors when testing on localhost
        if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
          consoleErrors.push(errorText);
        }
      }
    });

    // Test at desktop viewport for accessibility validation
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify semantic HTML structure
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await expect(page.locator('main[role="main"]')).toBeVisible();

    // Verify accessibility features
    // Skip link should exist but be visually hidden until focused
    await expect(page.locator('.skip-link')).toBeAttached();

    // Focus the skip link to make it visible, then check it's in viewport
    await page.locator('.skip-link').focus();
    await expect(page.locator('.skip-link')).toBeInViewport();

    // Check other accessibility elements
    await expect(page.locator('[aria-label="Voder"]')).toBeVisible();

    // Take accessibility-focused screenshot
    await page.screenshot({
      path: 'screenshots/accessibility-validation.png',
      fullPage: true,
      animations: 'disabled',
    });

    // Verify no console errors occurred during page execution
    expect(consoleErrors).toHaveLength(0);
  });

  test('Performance and loading validation', async ({ page }) => {
    // Set up console error monitoring (ignore expected cookie domain errors on localhost)
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();

        // Ignore expected cookie domain errors when testing on localhost
        if (!errorText.includes('Cookie') || !errorText.includes('invalid domain')) {
          consoleErrors.push(errorText);
        }
      }
    });

    // Test at mobile viewport for performance validation
    await page.setViewportSize({ width: 375, height: 667 });

    // Enhanced performance measurement with multiple metrics
    const performanceMetrics = {
      navigationStart: 0,
      loadTime: 0,
      domContentLoaded: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      networkRequests: 0,
    };

    // Track network requests
    page.on('request', () => {
      performanceMetrics.networkRequests++;
    });

    // Start performance measurement
    performanceMetrics.navigationStart = Date.now();

    await page.goto('/');

    // Measure DOM content loaded
    await page.waitForLoadState('domcontentloaded');
    performanceMetrics.domContentLoaded = Date.now() - performanceMetrics.navigationStart;

    // Wait for network idle and measure full load time
    await page.waitForLoadState('networkidle');
    performanceMetrics.loadTime = Date.now() - performanceMetrics.navigationStart;

    // Get Core Web Vitals using browser APIs
    const coreWebVitals = await page.evaluate(() => {
      return new Promise<{ fcp?: number; lcp?: number }>((resolve) => {
        // Use Performance Observer to get FCP and LCP
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          const metrics: { fcp?: number; lcp?: number } = {};

          for (const entry of entries) {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
          }

          // Clean up and resolve
          observer.disconnect();
          resolve(metrics);
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve({});
        }, 2000);
      });
    });

    // Update metrics with Core Web Vitals
    if (coreWebVitals.fcp) {
      performanceMetrics.firstContentfulPaint = coreWebVitals.fcp;
    }
    if (coreWebVitals.lcp) {
      performanceMetrics.largestContentfulPaint = coreWebVitals.lcp;
    }

    // Log comprehensive performance metrics
    console.log('Performance Metrics:', {
      loadTime: `${performanceMetrics.loadTime}ms`,
      domContentLoaded: `${performanceMetrics.domContentLoaded}ms`,
      firstContentfulPaint: performanceMetrics.firstContentfulPaint
        ? `${performanceMetrics.firstContentfulPaint}ms`
        : 'N/A',
      largestContentfulPaint: performanceMetrics.largestContentfulPaint
        ? `${performanceMetrics.largestContentfulPaint}ms`
        : 'N/A',
      networkRequests: performanceMetrics.networkRequests,
    });

    // Performance assertions - more realistic thresholds for mobile devices
    expect(performanceMetrics.loadTime).toBeLessThan(5000); // Should load in under 5 seconds for mobile
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000); // DOM should be ready reasonably quickly
    expect(performanceMetrics.networkRequests).toBeLessThan(20); // Keep network requests reasonable

    // Core Web Vitals assertions (if available)
    if (performanceMetrics.firstContentfulPaint > 0) {
      expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2000); // FCP under 2s is good
    }
    if (performanceMetrics.largestContentfulPaint > 0) {
      expect(performanceMetrics.largestContentfulPaint).toBeLessThan(2500); // LCP under 2.5s is good
    }

    // Take performance validation screenshot
    await page.screenshot({
      path: 'screenshots/performance-mobile.png',
      fullPage: true,
      animations: 'disabled',
    });

    console.log(`Page load time: ${performanceMetrics.loadTime}ms`);

    // Verify no console errors occurred during page execution
    expect(consoleErrors).toHaveLength(0);
  });
});

test.describe('3D Cube Viewport Validation', () => {
  /**
   * Viewport-specific screenshot validation for 025.0-BIZ-3D-ANIMATION story
   *
   * This test suite validates the 3D glass cube positioning, content overlay,
   * and visual hierarchy across different viewport sizes as required by the spec.
   *
   * Requirements:
   * - Viewport screenshots (not full-page) to validate cube positioning
   * - Content overlay validation - page content should layer over 3D background
   * - Cube visibility and scale across desktop, tablet, and mobile viewports
   * - Visual hierarchy validation between 3D background and page content
   */

  test('3D cube viewport positioning validation - desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for 3D cube to load
    await page.waitForSelector('.hero-animation canvas', { timeout: 10000 });

    // Wait additional time for 3D rendering
    await page.waitForTimeout(2000);

    // Take viewport screenshot (not full-page) to validate cube positioning
    await page.screenshot({
      path: 'screenshots/3d-cube-viewport-desktop-1920x1080.png',
      fullPage: false, // Viewport only
    });

    // Validate 3D canvas is present and properly sized
    const canvas = await page.locator('.hero-animation canvas');

    await expect(canvas).toBeVisible();
  });

  test('3D cube viewport positioning validation - tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // On tablet, animation is completely hidden - just wait for page to settle
    await page.waitForTimeout(1000);

    // Take viewport screenshot to validate clean layout without animation
    await page.screenshot({
      path: 'screenshots/3d-cube-viewport-tablet-768x1024.png',
      fullPage: false, // Viewport only
    });

    // Validate hero animation is completely hidden on tablet
    const heroAnimation = await page.locator('.hero-animation');

    await expect(heroAnimation).toBeHidden();
  });

  test('3D cube viewport positioning validation - mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // On mobile, animation is completely hidden - just wait for page to settle
    await page.waitForTimeout(1000);

    // Take viewport screenshot to validate clean layout without animation
    await page.screenshot({
      path: 'screenshots/3d-cube-viewport-mobile-375x667.png',
      fullPage: false, // Viewport only
    });

    // Validate hero animation is completely hidden on mobile
    const heroAnimation = await page.locator('.hero-animation');

    await expect(heroAnimation).toBeHidden();
  });

  test('Content overlay validation across viewports', async ({ page }) => {
    const testViewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 },
    ];

    const overlayScreenshots = [];

    for (const viewport of testViewports) {
      const { name, width, height } = viewport;

      await page.setViewportSize({ width, height });
      await page.goto('/', {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait for appropriate content to load (3D on desktop, hidden on mobile/tablet)
      if (width > 768) {
        await page.waitForSelector('.hero-animation canvas', { timeout: 10000 });
        await page.waitForTimeout(2000);
      } else {
        // On mobile/tablet, animation is hidden - just wait for page to settle
        await page.waitForTimeout(1000);
      }

      // Take viewport screenshot focusing on content overlay
      const overlayPath = `screenshots/3d-cube-overlay-${name}-${width}x${height}.png`;

      await page.screenshot({
        path: overlayPath,
        fullPage: false, // Viewport only to show overlay effect
      });

      overlayScreenshots.push({ name, path: overlayPath, viewport: `${width}x${height}` });

      // Validate that animation visibility and page content are correct per viewport
      const heroAnimation = await page.locator('.hero-animation');

      const pageContent = await page.locator('main, .hero-content, h1').first();

      if (width > 768) {
        // Desktop should have visible 3D animation
        const canvas = await page.locator('.hero-animation canvas');

        await expect(canvas).toBeVisible();
      } else {
        // Mobile/tablet should have completely hidden animation
        await expect(heroAnimation).toBeHidden();
      }

      await expect(pageContent).toBeVisible();
    }

    console.log('3D cube overlay validation screenshots:', overlayScreenshots);
  });
});
