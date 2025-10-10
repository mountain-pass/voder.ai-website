import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility Validation', () => {
  test('should be accessible across all device types', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Wait for 3D animation container to be present
    await page.waitForSelector('#hero-animation', { timeout: 10000 });

    // Run axe accessibility analysis
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Assert no accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for proper landmark structure
    await expect(page.locator('main[role="main"]')).toBeVisible();
    await expect(page.locator('header[role="banner"]')).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.locator('h1');

    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('AI Coding Without the Slop');

    const h2Elements = page.locator('h2');

    await expect(h2Elements).toHaveCount(2); // "Sound Familiar?" and "Get notified when we launch"
  });

  test('should have accessible skip link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Focus the skip link (first focusable element)
    await page.keyboard.press('Tab');

    // Check skip link is focused and visible
    const skipLink = page.locator('.skip-link');

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Verify skip link functionality
    await skipLink.click();

    // Check that main content is focused or that we've scrolled to it
    const mainContent = page.locator('#main-content');

    await expect(mainContent).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check email input accessibility
    const emailInput = page.locator('#email');

    await expect(emailInput).toHaveAttribute('aria-describedby', 'email-hint');
    await expect(emailInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check form has proper aria-label
    const form = page.locator('#interest-form');

    await expect(form).toHaveAttribute('aria-label', 'Email signup form');

    // Check form status has aria-live
    const formStatus = page.locator('#form-status');

    await expect(formStatus).toHaveAttribute('aria-live', 'polite');

    // Check screen reader only text
    const emailHint = page.locator('#email-hint');

    await expect(emailHint).toHaveClass(/sr-only/);
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test tab navigation order
    const focusableElements = ['.skip-link', '#email', '.signup-button'];

    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab');
      const currentElement = page.locator(focusableElements[i]);

      await expect(currentElement).toBeFocused();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Run axe with color-contrast rule specifically
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('body')
      .withRules(['color-contrast'])
      .analyze();

    // Assert no color contrast violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test keyboard form interaction
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Email input

    const emailInput = page.locator('#email');

    await expect(emailInput).toBeFocused();

    // Type in email
    await emailInput.fill('test@example.com');

    // Navigate to submit button
    await page.keyboard.press('Tab');
    const submitButton = page.locator('.signup-button');

    await expect(submitButton).toBeFocused();

    // Submit form with keyboard
    await page.keyboard.press('Enter');

    // Check form status appears
    const formStatus = page.locator('#form-status');

    await expect(formStatus).toBeVisible({ timeout: 5000 });
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The site should still function with reduced motion
    // Check that essential content is visible
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('.signup-button')).toBeVisible();
  });
});
