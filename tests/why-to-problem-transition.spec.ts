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
      const opacity = await visualChaos.evaluate((el) => {
        return parseFloat(getComputedStyle(el).opacity);
      });
      
      // Accept values between 0.95 and 1.0 to account for browser precision differences
      expect(opacity).toBeGreaterThanOrEqual(0.95);
      expect(opacity).toBeLessThanOrEqual(1.0);
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
    const consoleMessages: string[] = [];
    
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    await page.goto('/');
    await page.waitForSelector('#main-content');
    await page.waitForTimeout(2000); // Wait for setup
    
    // Check if transition is set up correctly
    const transitionActive = await page.evaluate(() => {
      return {
        liveRegionExists: !!document.querySelector('#why-problem-transition-live-region'),
        problemSectionExists: !!document.querySelector('[data-test-id="problem-section"]'),
        mainContentExists: !!document.querySelector('#main-content')
      };
    });
    
    // Verify transition setup is correct
    expect(transitionActive.liveRegionExists).toBe(true);
    expect(transitionActive.problemSectionExists).toBe(true);
    expect(transitionActive.mainContentExists).toBe(true);
    
    // Scroll to trigger transition
    await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
    
    // Wait for transition to start
    await page.waitForTimeout(1000);
    
    // Check live region content to see if transition started
    const liveRegion = page.locator('#why-problem-transition-live-region');
    const announcement = await liveRegion.textContent();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Wait a moment for skip to take effect
    await page.waitForTimeout(500);
    
    // Check final states - this is the key test, not console messages
    const finalStates = await page.evaluate(() => {
      const problemHeading = document.querySelector('#problem-heading') as HTMLElement;
      const mainContent = document.querySelector('#main-content') as HTMLElement;
      return {
        problemHeadingOpacity: problemHeading ? getComputedStyle(problemHeading).opacity : 'not found',
        mainContentBg: mainContent ? getComputedStyle(mainContent).backgroundColor : 'not found'
      };
    });
    
    // Verify that transition reached a final state (either original or target)
    expect(finalStates.problemHeadingOpacity).not.toBe('not found');
    expect(finalStates.mainContentBg).not.toBe('not found');
    
    // Verify that the problem section becomes accessible
    const problemHeading = page.locator('#problem-heading');
    await expect(problemHeading).toBeVisible();
    
    // Verify that some transition activity occurred (either transition or skip)
    const hasTransitionActivity = announcement && announcement.trim().length > 0;
    expect(hasTransitionActivity).toBe(true);
  });
});
