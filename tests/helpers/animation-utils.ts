import { Page, Locator } from '@playwright/test';

// Extend Window interface for GSAP
declare global {
  interface Window {
    gsap?: {
      getTweensOf?: (targets: string | Element | Element[]) => Array<{ isActive: () => boolean }>;
    };
  }
}

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
      // For Vision Flow section, check if initial animation is complete
      const visionFlowSection = document.querySelector('section#vision-flow');
      if (visionFlowSection) {
        // If it's currently animating, wait for completion
        if (visionFlowSection.hasAttribute('data-animating')) {
          return false;
        }
        // If initial animation is complete, consider animations done
        if (visionFlowSection.hasAttribute('data-initial-animation-complete')) {
          return true;
        }
        // If no animation markers, check if section is visible (reduced motion case)
        const style = getComputedStyle(visionFlowSection);
        if (style.opacity !== '0') {
          return true;
        }
      }

      // Check if GSAP is loaded and has active animations
      // guard against missing getTweensOf
      if (typeof window.gsap?.getTweensOf === 'function') {
        const activeTweens = window.gsap.getTweensOf('*').filter((tween) => tween.isActive());
        if (activeTweens.length > 0) {
          return false;

      }
      // fall through when gsap or getTweensOf isn’t available
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
