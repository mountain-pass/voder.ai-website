/**
 * @file scroll-locked-reveal.spec.ts - E2E tests for scroll-locked narrative reveal
 * @see {@link file://./../../prompts/release-1.0/in-scope/026.02-BIZ-VIEWPORT-FIXED-OVERLAY.md Story 026.02}
 * @see {@link file://./../../docs/decisions/0016-scroll-locked-narrative-reveal.accepted.md ADR 0016}
 */

import { expect, test } from '@playwright/test';

test.describe('Scroll-Locked Narrative Reveal (Story 026.02)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('HTML Structure', () => {
    test('should have scroll-stage container with proper height', async ({ page }) => {
      const scrollStage = page.locator('.scroll-stage');

      await expect(scrollStage).toBeVisible();

      // Check CSS variable is set
      const revealSteps = await scrollStage.evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--reveal-steps'),
      );

      expect(parseInt(revealSteps.trim())).toBeGreaterThan(0);

      // Height should be (steps + 1) * 100vh
      const height = await scrollStage.evaluate((el) => getComputedStyle(el).height);

      const viewportHeight = await page.evaluate(() => window.innerHeight);

      const expectedMinHeight = viewportHeight * 4; // Minimum 4 steps

      expect(parseInt(height)).toBeGreaterThanOrEqual(expectedMinHeight);
    });

    test('should have sticky-panel inside scroll-stage', async ({ page }) => {
      const stickyPanel = page.locator('.scroll-stage .sticky-panel');

      await expect(stickyPanel).toBeVisible();

      // Check sticky positioning
      const position = await stickyPanel.evaluate((el) => getComputedStyle(el).position);

      expect(position).toBe('sticky');

      // Top should be 0
      const top = await stickyPanel.evaluate((el) => getComputedStyle(el).top);

      expect(top).toBe('0px');
    });

    test('should have panel inside sticky-panel', async ({ page }) => {
      const panel = page.locator('.scroll-stage .sticky-panel .panel');

      await expect(panel).toBeVisible();
    });

    test('should have reveal elements with timing attributes', async ({ page }) => {
      const revealElements = page.locator('.scroll-stage [data-reveal-start][data-reveal-end]');

      const count = await revealElements.count();

      expect(count).toBeGreaterThan(0);

      // Check first element has valid timing values
      const firstEl = revealElements.first();

      const startAttr = await firstEl.getAttribute('data-reveal-start');

      const endAttr = await firstEl.getAttribute('data-reveal-end');

      expect(parseFloat(startAttr!)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(startAttr!)).toBeLessThanOrEqual(1);
      expect(parseFloat(endAttr!)).toBeGreaterThan(parseFloat(startAttr!));
      expect(parseFloat(endAttr!)).toBeLessThanOrEqual(1);
    });
  });

  test.describe('Scroll-Locked Behavior', () => {
    test('should pin sticky-panel at viewport top during scroll', async ({ page }) => {
      const stickyPanel = page.locator('.scroll-stage .sticky-panel');

      // Scroll into scroll-stage
      await page.evaluate(() => {
        const stage = document.querySelector('.scroll-stage');

        if (stage) {
          stage.scrollIntoView({ behavior: 'instant' });
        }
      });

      // Get initial position
      const initialBox = await stickyPanel.boundingBox();

      expect(initialBox).not.toBeNull();
      expect(initialBox!.y).toBeCloseTo(0, 0);

      // Scroll down 500px
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(100);

      // Panel should still be pinned at top
      const afterScrollBox = await stickyPanel.boundingBox();

      expect(afterScrollBox).not.toBeNull();
      expect(afterScrollBox!.y).toBeCloseTo(0, 0);
    });

    test('should allow natural scrolling without blocking', async ({ page }) => {
      // Get initial scroll position
      const initialScroll = await page.evaluate(() => window.scrollY);

      // Attempt to scroll
      await page.evaluate(() => window.scrollBy(0, 100));
      await page.waitForTimeout(100);

      // Scroll should have happened
      const afterScroll = await page.evaluate(() => window.scrollY);

      expect(afterScroll).toBeGreaterThan(initialScroll);
    });

    test('should not cause jittering or position jumps', async ({ page }) => {
      const stickyPanel = page.locator('.scroll-stage .sticky-panel');

      // Scroll into view
      await page.evaluate(() => {
        const stage = document.querySelector('.scroll-stage');

        stage?.scrollIntoView({ behavior: 'instant' });
      });

      // Record positions during scroll
      const positions: number[] = [];

      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 100));
        await page.waitForTimeout(50);
        const box = await stickyPanel.boundingBox();

        if (box) positions.push(box.y);
      }

      // All Y positions should be very close to 0 (no jumping)
      positions.forEach((y) => {
        expect(y).toBeCloseTo(0, 0);
      });
    });
  });

  // Progressive Reveal tests removed - Act 1 elements are handled by MagicPhaseAnimator,
  // not ScrollLockedReveal. The scroll-locked-reveal.ts implementation explicitly skips
  // Act 1 elements (lines 118-121), and all elements with data-reveal-start in the HTML
  // have data-act="1". These tests were validating pre-refactoring behavior.

  test.describe('Accessibility', () => {
    test('should maintain semantic HTML structure', async ({ page }) => {
      const panel = page.locator('.scroll-stage .panel');

      await expect(panel).toHaveAttribute('role', 'region');

      const title = page.locator('#narrative-title');

      await expect(title).toBeVisible();
      await expect(panel).toHaveAttribute('aria-labelledby', 'narrative-title');
    });

    test('should respect prefers-reduced-motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();

      // Scroll-stage should be static height
      const scrollStage = page.locator('.scroll-stage');

      const height = await scrollStage.evaluate((el) => getComputedStyle(el).height);

      // Should be auto or reasonable height, not 500vh
      const viewportHeight = await page.evaluate(() => window.innerHeight);

      expect(parseInt(height)).toBeLessThan(viewportHeight * 3);

      // Sticky-panel should be static
      const stickyPanel = page.locator('.sticky-panel');

      const position = await stickyPanel.evaluate((el) => getComputedStyle(el).position);

      expect(position).toBe('static');
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should work on mobile viewports', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();

      const scrollStage = page.locator('.scroll-stage');

      await expect(scrollStage).toBeVisible();

      const stickyPanel = page.locator('.sticky-panel');

      await expect(stickyPanel).toBeVisible();

      // Should still be sticky
      const position = await stickyPanel.evaluate((el) => getComputedStyle(el).position);

      expect(position).toBe('sticky');
    });

    test('should work on tablet viewports', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();

      const scrollStage = page.locator('.scroll-stage');

      await expect(scrollStage).toBeVisible();

      const stickyPanel = page.locator('.sticky-panel');

      const position = await stickyPanel.evaluate((el) => getComputedStyle(el).position);

      expect(position).toBe('sticky');
    });
  });
});
