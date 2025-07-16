import { test, expect } from '@playwright/test';

test.describe('Why to Problem Space Transition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for sections to load
    await page.waitForSelector('#main-content');
    await page.waitForSelector('#problem-heading');
  });

  test('4-second transition choreography works correctly', async ({ page }) => {
    // Initial state check - Why section should be visible
    const whyHeading = page.locator('#why-heading');
    const mainContent = page.locator('#main-content');
    
    await expect(whyHeading).toBeVisible();
    await expect(whyHeading).toHaveCSS('opacity', '1');
    
    // Check initial background color (Deep Navy)
    await expect(mainContent).toHaveCSS('background-color', 'rgb(15, 26, 46)');
    
    // Problem section content should start hidden
    const problemHeading = page.locator('#problem-heading');
    await expect(problemHeading).toHaveCSS('opacity', '0');
    
    // Scroll to trigger the transition - scroll to the problem section
    await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
    
    // Wait for transition to complete (4 seconds + buffer)
    await page.waitForTimeout(5000);
    
    // Final state checks
    // Background should have darkened to Voder Black
    await expect(mainContent).toHaveCSS('background-color', 'rgb(10, 10, 10)');
    
    // Why text should be dissolved (opacity 0)
    await expect(whyHeading).toHaveCSS('opacity', '0');
    
    // Problem content should be revealed
    await expect(problemHeading).toHaveCSS('opacity', '1');
    
    // Visual chaos should be visible (if not reduced motion)
    const prefersReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    
    if (!prefersReducedMotion) {
      const visualChaos = page.locator('.visual-chaos');
      await expect(visualChaos).toHaveCSS('opacity', '1');
    }
  });

  test('transition respects reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Wait for sections to load
    await page.waitForSelector('#main-content');
    await page.waitForSelector('#problem-heading');
    
    // Visual chaos should not exist when reduced motion is enabled
    const visualChaos = page.locator('.visual-chaos');
    await expect(visualChaos).toHaveCount(0);
    
    // Content should still be functional
    const problemHeading = page.locator('#problem-heading');
    await expect(problemHeading).toBeVisible();
  });

  test('accessibility announcements work during transition', async ({ page }) => {
    await page.goto('/');
    
    // Wait for our dedicated live region to be created
    const liveRegion = page.locator('#why-problem-transition-live-region');
    await expect(liveRegion).toBeAttached();
    
    // Trigger transition by scrolling to problem section
    await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
    
    // Check for accessibility announcements
    await page.waitForTimeout(1000);
    const announcement = await liveRegion.textContent();
    expect(announcement).toContain('Transitioning from Why section to Problem Space');
  });

  test('transition can be skipped with Escape key', async ({ page }) => {
    await page.goto('/');
    
    // Start transition by scrolling to problem section
    await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
    
    // Wait for transition to start by checking background starts changing
    const mainContent = page.locator('#main-content');
    await page.waitForTimeout(1000); // Give transition time to start
    
    // Press Escape to skip (should work whether transition started or not)
    await page.keyboard.press('Escape');
    
    // Wait a moment for skip to take effect
    await page.waitForTimeout(100);
    
    // Should show final state regardless of when Escape was pressed
    const problemHeading = page.locator('#problem-heading');
    await expect(problemHeading).toHaveCSS('opacity', '1');
    
    await expect(mainContent).toHaveCSS('background-color', 'rgb(10, 10, 10)');
  });
});
