import { expect, test } from '@playwright/test';

/**
 * Performance validation test for 3D cube shader complexity issue
 *
 * This test reproduces the performance problem identified in:
 * docs/problems/009-3d-cube-performance-issues.open.md
 *
 * Root cause: Complex volumetric raymarching shader overwhelms mobile GPUs
 * causing test timeouts and poor user experience.
 */

test.describe('3D Cube Performance Validation', () => {
  test('should complete Mobile Chrome operations within performance budget without PERFORMANCE_MODE', async ({
    page,
    browserName,
  }) => {
    // Only run on Mobile Chrome to reproduce the specific issue
    test.skip(
      browserName !== 'chromium',
      'This test validates Mobile Chrome specific performance issues',
    );

    const startTime = Date.now();

    // Navigate to page without performance mode
    await page.goto('/?performance=false'); // Explicitly disable performance mode

    // Wait for 3D animation to initialize
    await page.waitForSelector('#hero-animation', { timeout: 10000 });

    // Perform the operations that were timing out
    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    const formStatus = page.locator('#form-status');

    // Test the email validation interaction that was failing
    await emailInput.fill('invalid-email');
    await submitButton.click();
    await expect(formStatus).toBeVisible({ timeout: 15000 }); // Reduced timeout to catch performance issues

    const executionTime = Date.now() - startTime;

    // This test should fail when shader complexity is too high
    // Performance budget: Mobile Chrome should complete in under 25 seconds
    // (Original issue: was taking 30+ seconds and timing out)
    expect(executionTime).toBeLessThan(25000); // 25 second performance budget
  });

  test('should complete Mobile Chrome operations quickly with PERFORMANCE_MODE enabled', async ({
    page,
    browserName,
  }) => {
    // Only run on Mobile Chrome
    test.skip(
      browserName !== 'chromium',
      'This test validates Mobile Chrome performance optimization',
    );

    const startTime = Date.now();

    // Navigate to page with performance mode enabled
    await page.goto('/?performance=true'); // Enable performance mode

    // Wait for 3D animation to initialize
    await page.waitForSelector('#hero-animation', { timeout: 10000 });

    // Perform the same operations
    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    const formStatus = page.locator('#form-status');

    await emailInput.fill('invalid-email');
    await submitButton.click();
    await expect(formStatus).toBeVisible({ timeout: 10000 });

    const executionTime = Date.now() - startTime;

    // With performance optimizations, this should complete much faster
    // Target: Under 15 seconds (based on experimental results showing 12.3s)
    expect(executionTime).toBeLessThan(15000); // 15 second optimized budget
  });

  test('should show performance improvement between normal and performance mode', async ({
    page,
    browserName,
  }) => {
    // Only run on Mobile Chrome
    test.skip(
      browserName !== 'chromium',
      'This test validates Mobile Chrome performance comparison',
    );

    // Test without performance mode
    const startTimeNormal = Date.now();

    await page.goto('/?performance=false');
    await page.waitForSelector('#hero-animation', { timeout: 10000 });

    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    const formStatus = page.locator('#form-status');

    await emailInput.fill('test@example.com');
    await submitButton.click();
    await expect(formStatus).toBeVisible({ timeout: 15000 });
    const normalModeTime = Date.now() - startTimeNormal;

    // Clear and test with performance mode
    await page.goto('/?performance=true');
    const startTimePerformance = Date.now();

    await page.waitForSelector('#hero-animation', { timeout: 10000 });

    const emailInputPerf = page.locator('#email');

    const submitButtonPerf = page.locator('.signup-button');

    const formStatusPerf = page.locator('#form-status');

    await emailInputPerf.fill('test@example.com');
    await submitButtonPerf.click();
    await expect(formStatusPerf).toBeVisible({ timeout: 10000 });
    const performanceModeTime = Date.now() - startTimePerformance;

    // Performance mode should be at least 10% faster (we observed 20% improvement)
    const improvementRatio = (normalModeTime - performanceModeTime) / normalModeTime;

    expect(improvementRatio).toBeGreaterThan(0.1); // At least 10% improvement

    console.log(`Performance improvement: ${(improvementRatio * 100).toFixed(1)}%`);
    console.log(`Normal mode: ${normalModeTime}ms, Performance mode: ${performanceModeTime}ms`);
  });
});
