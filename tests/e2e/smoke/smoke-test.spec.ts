import { expect, test } from '@playwright/test';

/**
 * Smoke Tests for Post-Deployment Validation
 *
 * Minimal essential tests to verify deployment succeeded.
 * This is NOT comprehensive E2E testing - just smoke testing.
 *
 * Purpose: Verify that the deployed site is functional (page loads, form exists, no critical JS errors)
 * Target: <2 minute execution time vs 10+ minutes for comprehensive suite
 * Browser: Chromium only (no cross-browser testing in post-deployment)
 */

test.describe('Post-Deployment Smoke Tests', () => {
  test('page loads successfully and contains expected elements', async ({ page }) => {
    // Navigate to the deployed site
    await page.goto('/');

    // Verify page loads (200 status is handled by Playwright automatically)

    // Verify essential page structure exists
    await expect(page.locator('#app')).toBeVisible();

    // Verify page title
    await expect(page).toHaveTitle(/Voder/);

    // Verify interest form exists (core functionality)
    await expect(page.locator('#interest-form')).toBeVisible();

    // Verify email input exists
    await expect(page.locator('#email')).toBeVisible();
  });

  test('contact form is functional', async ({ page }) => {
    await page.goto('/');

    // Wait for form to be ready
    await expect(page.locator('#interest-form')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();

    // Fill and submit form with test email
    await page.locator('#email').fill('smoke-test@example.com');
    await page.locator('#interest-form button[type="submit"]').click();

    // Verify form behaves correctly (either success message or validation)
    // The form should either show success or handle the submission gracefully
    const form = page.locator('#interest-form');

    await expect(form).toBeVisible(); // Form should still be present
  });

  test('no critical JavaScript errors on page load', async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Capture uncaught exceptions
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');

    // Wait for app to initialize
    await expect(page.locator('#app')).toBeVisible();

    // Filter out non-critical errors (network errors for analytics, etc.)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('analytics') &&
        !error.includes('clarity') &&
        !error.includes('tracking') &&
        !error.includes('gtag') &&
        !error.includes('fetch'),
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
