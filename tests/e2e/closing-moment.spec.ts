import { expect, test } from '@playwright/test';

/**
 * E2E tests for 021.0-BIZ-CLOSING-MOMENT story
 *
 * Tests the "Coming Soon" closing moment with email capture form functionality
 * including validation, submission, analytics tracking, and visual presentation.
 */

test.describe('Closing Moment - Email Capture Form', () => {
  test.beforeEach(async ({ page }) => {
    // Set up console monitoring for analytics events
    page.on('console', (msg) => {
      if (msg.type() === 'log' || msg.type() === 'warning') {
        console.log(`[${msg.type()}] ${msg.text()}`);
      }
    });

    await page.goto('/');

    // Wait for app to load
    await page.waitForSelector('#app', { state: 'visible', timeout: 10000 });

    // Wait for analytics initialization
    await page.waitForTimeout(500);
  });

  test('displays coming soon message and email capture form', async ({ page }) => {
    // Verify "Coming Soon" status message is present
    const statusText = page.locator('.status-text');

    await expect(statusText).toBeVisible();
    await expect(statusText).toContainText('Coming Soon');

    // Verify email capture section structure
    const interestCapture = page.locator('.interest-capture');

    await expect(interestCapture).toBeVisible();

    const signupTitle = page.locator('.signup-title');

    await expect(signupTitle).toBeVisible();
    await expect(signupTitle).toContainText('Get notified when we launch');

    // Verify form elements
    const form = page.locator('#interest-form');

    await expect(form).toBeVisible();

    const emailInput = page.locator('#email');

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address');

    const submitButton = page.locator('.signup-button');

    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Join the Waitlist');

    // Verify Netlify form attributes
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await expect(form).toHaveAttribute('name', 'waitlist-signup');
    await expect(form).toHaveAttribute('method', 'POST');

    // Verify hidden form-name input for Netlify JavaScript handling
    const formNameInput = page.locator('input[name="form-name"]');

    await expect(formNameInput).toBeHidden();
    await expect(formNameInput).toHaveValue('waitlist-signup');

    // Verify honeypot spam protection
    const honeypotInput = page.locator('input[name="bot-field"]');

    await expect(honeypotInput).toBeHidden();
  });

  test('validates email input correctly', async ({ page }) => {
    const emailInput = page.locator('#email');

    const submitButton = page.locator('button[type="submit"]');

    const formStatus = page.locator('#form-status');

    // Disable browser validation to test our JavaScript validation
    await emailInput.evaluate((input) => {
      const inputElement = input as HTMLInputElement;

      inputElement.removeAttribute('required');
      inputElement.type = 'text';
    });

    // Test empty email validation
    await submitButton.click();
    await expect(formStatus).toBeVisible();
    await expect(formStatus).toHaveClass('form-status error');
    await expect(formStatus).toContainText('Please enter your email address.');

    // Test invalid email validation
    await emailInput.fill('invalid-email');
    await submitButton.click();
    await expect(formStatus).toBeVisible();
    await expect(formStatus).toHaveClass('form-status error');
    await expect(formStatus).toContainText('Please enter a valid email address.');
  });

  test('handles form submission states correctly', async ({ page }) => {
    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    const formStatus = page.locator('#form-status');

    // Fill valid email
    await emailInput.fill('test@example.com');

    // Mock network response for successful submission
    await page.route('/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<html><body>Thank you</body></html>',
        });
      } else {
        await route.continue();
      }
    });

    // Submit form
    await submitButton.click();

    // Should show success state (loading happens too quickly to catch reliably)
    await expect(formStatus).toHaveClass('form-status success');
    await expect(formStatus).toContainText("Thank you! We'll notify you when Voder launches.");

    // Form should be cleared
    await expect(emailInput).toHaveValue('');
  });

  test('handles form submission errors gracefully', async ({ page }) => {
    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    const formStatus = page.locator('#form-status');

    // Fill valid email
    await emailInput.fill('test@example.com');

    // Mock network failure
    await page.route('/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    // Submit form
    await submitButton.click();

    // Should show error state (loading happens too quickly to catch reliably)
    await expect(formStatus).toHaveClass('form-status error');
    await expect(formStatus).toContainText('Something went wrong. Please try again.');
  });

  test('tracks analytics events on form submission', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Analytics tracking varies between browsers');
    test.skip(browserName === 'webkit', 'Analytics tracking varies between browsers');

    // Reload to ensure analytics tracking is set up
    await page.reload();
    await page.waitForSelector('#app', { state: 'visible' });

    // Wait for analytics initialization to complete
    await page.waitForTimeout(1000);

    // Override clarity function after analytics has fully loaded
    await page.evaluate(() => {
      // Create events array to store analytics calls
      (window as any).__clarityEvents = [];

      // Store the original clarity function if it exists
      const originalClarity = (window as any).clarity;

      // Create proxy function that captures calls and optionally calls original
      (window as any).clarity = function (method: string, ...args: any[]) {
        (window as any).__clarityEvents.push({ method, args });

        // Also call original clarity for system functions (but not for our test tracking)
        if (originalClarity && typeof originalClarity === 'function') {
          // Don't call original for our test-specific tracking to avoid real analytics pollution
          if (method !== 'set' || args[0] !== 'email_signup') {
            if (method !== 'event' || args[0] !== 'waitlist_signup') {
              originalClarity(method, ...args);
            }
          }
        }
      };
    });

    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    // Fill valid email
    const testEmail = 'analytics-test@example.com';

    await emailInput.fill(testEmail);

    // Mock successful form submission
    await page.route('/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 200, body: 'OK' });
      } else {
        await route.continue();
      }
    });

    // Submit form
    await submitButton.click();

    // Wait for analytics events to be tracked
    await page.waitForTimeout(500);

    // Debug: Log all events captured
    const events = await page.evaluate(() => {
      return (window as any).__clarityEvents || [];
    });

    // Should track email signup
    const emailSetEvent = events.find(
      (e: any) => e.method === 'set' && e.args[0] === 'email_signup',
    );

    expect(emailSetEvent).toBeDefined();
    expect(emailSetEvent?.args[1]).toBe(testEmail);

    // Should track waitlist signup event
    const waitlistEvent = events.find(
      (e: any) => e.method === 'event' && e.args[0] === 'waitlist_signup',
    );

    expect(waitlistEvent).toBeDefined();
  });

  test('form accessibility requirements', async ({ page }) => {
    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    const formStatus = page.locator('#form-status');

    // Test keyboard navigation
    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(submitButton).toBeFocused();

    // Test screen reader support
    await expect(emailInput).toHaveAttribute('aria-describedby', 'email-hint');

    const emailHint = page.locator('#email-hint');

    await expect(emailHint).toBeVisible(); // sr-only elements are visible to accessibility tools
    await expect(emailHint).toContainText("We'll notify you when Voder launches");

    // Test form status live region
    await expect(formStatus).toHaveAttribute('aria-live', 'polite');

    // Test form labeling
    const form = page.locator('#interest-form');

    await expect(form).toHaveAttribute('aria-label', 'Email signup form');

    // Test skip link functionality
    const skipLink = page.locator('.skip-link');

    // Skip link should be visually hidden initially
    await expect(skipLink).not.toBeInViewport();

    await skipLink.focus();
    await expect(skipLink).toBeInViewport(); // Should become visible when focused
  });

  test('preserves form data during validation errors', async ({ page }) => {
    const emailInput = page.locator('#email');

    const submitButton = page.locator('.signup-button');

    const formStatus = page.locator('#form-status');

    // Enter invalid email
    const invalidEmail = 'test@invalid';

    await emailInput.fill(invalidEmail);
    await submitButton.click();

    // Should show validation error
    await expect(formStatus).toHaveClass(/error/);

    // Email input should retain the value for user to fix
    await expect(emailInput).toHaveValue(invalidEmail);

    // Input should be focused for immediate correction
    await expect(emailInput).toBeFocused();
  });
});
