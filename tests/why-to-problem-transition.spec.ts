import { test, expect } from '@playwright/test';

test.describe('Why to Problem Space Transition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for sections to load
    await page.waitForSelector('#main-content');
    await page.waitForSelector('#problem-heading');
  });

  test('scroll-tied transition choreography works correctly', async ({ page }) => {
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
    
    // Gradually scroll to trigger the transition - scroll-tied animations need progressive scrolling
    await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
    
    // Wait for scroll animation to settle and for scroll-tied animations to respond
    await page.waitForTimeout(1000);
    
    // Scroll a bit more to ensure we're well into the transition zone
    await page.evaluate(() => {
      const problemSection = document.querySelector('[data-test-id="problem-section"]');
      if (problemSection) {
        problemSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    // Wait for scroll-tied animations to complete
    await page.waitForTimeout(1000);
    
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
    
    // Start scrolling to trigger transition
    await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
    
    // Scroll more to ensure we're in the middle of the transition
    await page.evaluate(() => {
      const problemSection = document.querySelector('[data-test-id="problem-section"]');
      if (problemSection) {
        problemSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    // Wait for scroll-tied animations to progress and trigger announcements
    await page.waitForTimeout(1500);
    
    // Check for accessibility announcements (may be initial or completion message)
    const announcement = await liveRegion.textContent();
    const hasTransitionAnnouncement = announcement && (
      announcement.includes('Transitioning from Why section to Problem Space') ||
      announcement.includes('Problem Space') ||
      announcement.includes('Transition skipped')
    );
    
    expect(hasTransitionAnnouncement).toBe(true);
  });

  test('transition can be skipped with Escape key', async ({ page }) => {
    await page.goto('/');
    
    // Start transition by scrolling to problem section
    await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
    
    // Wait a moment for scroll-tied transition to start
    await page.waitForTimeout(500);
    
    // Press Escape to skip (should complete the timeline immediately)
    await page.keyboard.press('Escape');
    
    // Wait a moment for skip to take effect
    await page.waitForTimeout(300);
    
    // Should show final state after escape is pressed
    const problemHeading = page.locator('#problem-heading');
    const mainContent = page.locator('#main-content');
    
    await expect(problemHeading).toHaveCSS('opacity', '1');
    await expect(mainContent).toHaveCSS('background-color', 'rgb(10, 10, 10)');
  });
});
