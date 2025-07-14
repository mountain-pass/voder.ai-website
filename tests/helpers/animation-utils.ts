import { Page, Locator } from '@playwright/test';

/**
 * Waits for animations to complete before running accessibility tests.
 * This function scrolls to the target section and waits for all GSAP and scroll-triggered animations to finish.
 *
 * @param page - The Playwright page object
 * @param targetSection - The locator for the section to scroll to and wait for animations
 */
export async function waitForAnimationsComplete(
  page: Page,
  targetSection: Locator
): Promise<void> {
  // Wait for network idle first
  await page.waitForLoadState('networkidle');

  // Scroll to the target section to trigger any scroll-based animations
  await targetSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Give time for scroll to complete

  // Wait for any GSAP or scroll-triggered animations to complete
  await page.waitForFunction(
    () => {
      // Check if GSAP is loaded and has active animations
      if (typeof window.gsap !== 'undefined') {
        // Check if any GSAP tweens are active
        const activeTweens = window.gsap
          .getTweensOf('*')
          .filter((tween) => tween.isActive());
        if (activeTweens.length > 0) {
          return false;
        }
      }

      // Check for elements with animation classes
      const animatingElements = document.querySelectorAll(
        '.animating, [data-animating="true"]'
      );
      if (animatingElements.length > 0) {
        return false;
      }

      // All animations complete
      return true;
    },
    { timeout: 5000 }
  ); // 5 second timeout instead of default 30s
}
