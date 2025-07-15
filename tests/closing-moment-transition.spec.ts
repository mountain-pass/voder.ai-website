import { test, expect } from '@playwright/test';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test.describe('Outcome Focus → Closing Moment transition', () => {
  test('initial state shows all benefits and headline visible', async ({ page }) => {
    await page.goto('/');

    // Verify all four benefits are visible
    await expect(page.locator('[data-testid="benefit-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="benefit-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="benefit-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="benefit-4"]')).toBeVisible();

    // Verify outcomes headline is visible
    await expect(page.locator('[data-testid="outcomes-headline"]')).toBeVisible();
  });

  test('scroll triggers closing moment and reveals final elements', async ({ page }) => {
    await page.goto('/');

    // Scroll to 85% of the outcome focus section to trigger transition
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.85));
    const section = page.locator('section[role="contentinfo"]');
    await waitForAnimationsComplete(page, section);

    // Verify background transitioned to black
    await expect(section).toHaveCSS('background-color', 'rgb(10, 10, 10)');

    // Verify final elements are visible
    await expect(page.locator('[data-testid="compiler-tagline"]')).toBeVisible();
    await expect(page.locator('[data-testid="coming-soon"]')).toBeVisible();
    await expect(page.locator('[data-testid="voder-logo"]')).toBeVisible();
  });

  test('reduced-motion skip with Escape reveals final elements', async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Skip animation
    await page.keyboard.press('Escape');

    // Verify final elements are visible immediately
    await expect(page.locator('[data-testid="compiler-tagline"]')).toBeVisible();
    await expect(page.locator('[data-testid="coming-soon"]')).toBeVisible();
    await expect(page.locator('[data-testid="voder-logo"]')).toBeVisible();
  });
});
