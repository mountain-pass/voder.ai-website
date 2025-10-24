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

  test.describe('Progressive Reveal', () => {
    test('should initially hide reveal elements', async ({ page }) => {
      const revealElements = page.locator('[data-reveal-start]');

      const firstEl = revealElements.first();

      // Before scrolling into view, elements should be hidden
      const initialOpacity = await firstEl.evaluate((el) => getComputedStyle(el).opacity);

      expect(parseFloat(initialOpacity)).toBeLessThanOrEqual(0.1);
    });

    test('should progressively reveal elements as user scrolls', async ({ page }) => {
      // Scroll to scroll-stage
      await page.evaluate(() => {
        const stage = document.querySelector('.scroll-stage');

        stage?.scrollIntoView({ behavior: 'instant' });
      });

      const kicker = page.locator('.scroll-stage .kicker');

      await expect(kicker).toBeVisible();

      // Initial opacity should be very low
      let opacity = await kicker.evaluate((el) => parseFloat(getComputedStyle(el).opacity));

      expect(opacity).toBeLessThanOrEqual(0.2);

      // Scroll within scroll-stage
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(200);

      // Opacity should increase
      opacity = await kicker.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
      expect(opacity).toBeGreaterThan(0.2);
    });

    test('should fully reveal elements after their timing range', async ({ page }) => {
      const kicker = page.locator('.scroll-stage .kicker');

      // Scroll past kicker's reveal range (0-0.15)
      await page.evaluate(() => {
        const stage = document.querySelector('.scroll-stage');

        if (stage) {
          const stageTop = stage.getBoundingClientRect().top;

          const scrollDistance = Math.abs(stageTop) + window.innerHeight;

          window.scrollTo(0, scrollDistance);
        }
      });

      await page.waitForTimeout(200);

      // Element should be fully visible
      const opacity = await kicker.evaluate((el) => parseFloat(getComputedStyle(el).opacity));

      expect(opacity).toBeGreaterThanOrEqual(0.9);
    });

    test('should handle multiple elements with different timing', async ({ page }) => {
      await page.evaluate(() => {
        const stage = document.querySelector('.scroll-stage');

        stage?.scrollIntoView({ behavior: 'instant' });
      });

      const kicker = page.locator('.scroll-stage .kicker'); // 0-0.15

      const headline = page.locator('.scroll-stage .headline'); // 0.05-0.25

      // Early in scroll: kicker visible, headline still hidden
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(200);

      const kickerOpacity = await kicker.evaluate((el) => parseFloat(getComputedStyle(el).opacity));

      const headlineOpacity = await headline.evaluate((el) =>
        parseFloat(getComputedStyle(el).opacity),
      );

      expect(kickerOpacity).toBeGreaterThan(headlineOpacity);
    });
  });

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
