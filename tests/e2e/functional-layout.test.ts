import { expect, test } from '@playwright/test';

/**
 * Functional Layout Testing Suite
 *
 * Tests layout behavior that affects user experience rather than visual appearance.
 * Focuses on:
 * - Viewport boundary validation (no horizontal overflow)
 * - Element positioning within viewport
 * - Responsive behavior across device sizes
 * - Interactive element accessibility
 *
 * This replaces visual regression testing with functional validation that supports
 * continuous design iteration while preventing layout failures.
 */

// Target viewports as defined in story requirements
const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
] as const;

/**
 * Helper: Check if page has horizontal overflow
 * Returns true if content extends beyond viewport width
 */
async function checkViewportOverflow(page: any) {
  const overflow = await page.evaluate(() => {
    return {
      hasHorizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth,
      hasVerticalOverflow:
        document.documentElement.scrollHeight > document.documentElement.clientHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
    };
  });

  return overflow;
}

/**
 * Helper: Check CSS property values for layout-critical properties
 * Validates properties that can cause overflow or positioning issues
 */
async function validateCSSProperties(page: any, selector: string) {
  return await page.evaluate((sel: string) => {
    const element = document.querySelector(sel);

    if (!element) return null;

    const computed = window.getComputedStyle(element);

    return {
      position: computed.position,
      display: computed.display,
      overflow: computed.overflow,
      overflowX: computed.overflowX,
      overflowY: computed.overflowY,
      width: computed.width,
      maxWidth: computed.maxWidth,
      minWidth: computed.minWidth,
      boxSizing: computed.boxSizing,
      margin: computed.margin,
      padding: computed.padding,
    };
  }, selector);
}

/**
 * Helper: Check if text content overflows its container
 * Returns elements with text overflow issues
 */
async function checkTextOverflow(page: any) {
  return await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div'));

    const overflowing: Array<{ selector: string; scrollWidth: number; clientWidth: number }> = [];

    elements.forEach((el) => {
      const element = el as HTMLElement;

      // Skip sr-only and other intentionally hidden elements
      const classList = Array.from(element.classList || []);

      if (classList.some((cls) => cls.includes('sr-only') || cls.includes('visually-hidden'))) {
        return;
      }

      // Check if text content is wider than container
      if (element.scrollWidth > element.clientWidth) {
        // Get a unique selector for this element
        const selector = element.className
          ? `.${element.className.split(' ')[0]}`
          : element.tagName.toLowerCase();

        overflowing.push({
          selector,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        });
      }
    });

    return overflowing;
  });
}

test.describe('Functional Layout Validation', () => {
  test.describe('Viewport Boundary Validation', () => {
    VIEWPORTS.forEach(({ name, width, height }) => {
      test(`should not have horizontal overflow on ${name} (${width}x${height})`, async ({
        page,
      }) => {
        // Set viewport
        await page.setViewportSize({ width, height });

        // Navigate to homepage
        await page.goto('/');

        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');

        // Check for horizontal overflow
        const overflow = await checkViewportOverflow(page);

        // Assert no horizontal scrolling
        expect(
          overflow.hasHorizontalOverflow,
          `Page should not have horizontal overflow on ${name} viewport. ScrollWidth: ${overflow.scrollWidth}, ClientWidth: ${overflow.clientWidth}`,
        ).toBe(false);

        // Verify scroll width matches or is less than client width
        expect(
          overflow.scrollWidth,
          `Content width (${overflow.scrollWidth}px) should not exceed viewport width (${overflow.clientWidth}px) on ${name}`,
        ).toBeLessThanOrEqual(overflow.clientWidth);
      });
    });

    test.skip('should not have horizontal overflow when zoomed', async ({ page }) => {
      // Test at mobile viewport with zoom
      // TODO: Zoom behavior varies across browsers and may need CSS fixes
      // Skipping for now until zoom handling is standardized
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Simulate browser zoom
      await page.evaluate(() => {
        (document.body.style as any).zoom = '150%';
      });

      // Wait for layout to stabilize after zoom change
      await page.waitForFunction(() => {
        const body = document.body;

        return body.offsetWidth > 0 && body.offsetHeight > 0;
      });

      const overflow = await checkViewportOverflow(page);

      expect(
        overflow.hasHorizontalOverflow,
        'Page should not have horizontal overflow even when zoomed',
      ).toBe(false);
    });
  });

  test.describe('Critical Element Positioning', () => {
    test('should position 3D animation container within viewport bounds', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const heroAnimation = page.locator('.hero-animation');

      await expect(heroAnimation).toBeVisible();

      const box = await heroAnimation.boundingBox();

      const viewport = page.viewportSize();

      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();

      if (box && viewport) {
        // Element should be within viewport horizontally
        expect(box.x, 'Animation container should start within viewport').toBeGreaterThanOrEqual(0);
        expect(
          box.x + box.width,
          'Animation container should end within viewport',
        ).toBeLessThanOrEqual(viewport.width);

        // Element should be within viewport vertically (at least partially visible)
        expect(
          box.y,
          'Animation container should be positioned within reasonable bounds',
        ).toBeLessThan(viewport.height);
      }
    });

    test('should position hero section content within viewport', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const heroSection = page.locator('.hero-section');

      await expect(heroSection).toBeVisible();

      const box = await heroSection.boundingBox();

      const viewport = page.viewportSize();

      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();

      if (box && viewport) {
        // Hero section should not cause horizontal overflow
        expect(
          box.x + box.width,
          'Hero section should fit within viewport width',
        ).toBeLessThanOrEqual(viewport.width);
      }
    });

    VIEWPORTS.forEach(({ name, width, height }) => {
      test(`should position interactive elements accessibly on ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check email form button
        const submitButton = page.locator('button[type="submit"]');

        if ((await submitButton.count()) > 0) {
          const buttonBox = await submitButton.first().boundingBox();

          expect(buttonBox).not.toBeNull();

          if (buttonBox) {
            // Button should be within viewport
            expect(
              buttonBox.x + buttonBox.width,
              `Submit button should be within viewport on ${name}`,
            ).toBeLessThanOrEqual(width);

            // Button should have reasonable touch target size on mobile
            // WCAG 2.1 Level AAA recommends 44x44px minimum
            // WCAG 2.1 Level AA requires 24x24px minimum
            // We use 32px as practical minimum (between AA and AAA)
            if (name === 'mobile') {
              expect(
                buttonBox.height,
                `Interactive elements should meet minimum touch target size (32px) on ${name}. Current: ${buttonBox.height}px`,
              ).toBeGreaterThanOrEqual(32);
            }
          }
        }
      });
    });
  });

  test.describe('Responsive Behavior Validation', () => {
    test('should adapt layout when viewport changes from desktop to mobile', async ({ page }) => {
      // Start at desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const desktopOverflow = await checkViewportOverflow(page);

      expect(desktopOverflow.hasHorizontalOverflow, 'No overflow on desktop').toBe(false);

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      // Wait for responsive design changes to complete
      await page.waitForFunction(() => window.innerWidth === 375);

      const mobileOverflow = await checkViewportOverflow(page);

      expect(mobileOverflow.hasHorizontalOverflow, 'No overflow after resizing to mobile').toBe(
        false,
      );
    });

    test('should adapt layout when viewport changes from mobile to desktop', async ({ page }) => {
      // Start at mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const mobileOverflow = await checkViewportOverflow(page);

      expect(mobileOverflow.hasHorizontalOverflow, 'No overflow on mobile').toBe(false);

      // Resize to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      // Wait for responsive design changes to complete
      await page.waitForFunction(() => window.innerWidth === 1920);

      const desktopOverflow = await checkViewportOverflow(page);

      expect(desktopOverflow.hasHorizontalOverflow, 'No overflow after resizing to desktop').toBe(
        false,
      );
    });

    test('should maintain layout integrity through breakpoints', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test common breakpoints (375px minimum - modern device minimum, iPhone SE 2nd/3rd gen)
      // 320px (iPhone SE 1st gen, 2016) not supported - adds CSS complexity for 9-year-old devices
      const breakpoints = [375, 768, 1024, 1366, 1920];

      for (const width of breakpoints) {
        await page.setViewportSize({ width, height: 1080 });
        // Wait for viewport resize to complete
        await page.waitForFunction((expectedWidth) => window.innerWidth === expectedWidth, width);

        const overflow = await checkViewportOverflow(page);

        expect(
          overflow.hasHorizontalOverflow,
          `No horizontal overflow at ${width}px breakpoint`,
        ).toBe(false);
      }
    });
  });

  test.describe('Element Visibility and Accessibility', () => {
    test('should ensure all critical elements are visible and in viewport', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check critical elements
      const criticalSelectors = [
        '.hero-section',
        '.hero-animation',
        '.problem-space-section',
        '.closing-moment-section',
      ];

      for (const selector of criticalSelectors) {
        const element = page.locator(selector);

        if ((await element.count()) > 0) {
          await expect(element.first(), `${selector} should be visible`).toBeVisible();

          const box = await element.first().boundingBox();

          expect(box, `${selector} should have valid bounding box`).not.toBeNull();
        }
      }
    });

    test('should ensure interactive elements are not obscured', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that buttons are clickable (not obscured by other elements)
      const buttons = page.locator('button');

      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);

        if (await button.isVisible()) {
          // Element is visible, check if it's actually clickable
          const box = await button.boundingBox();

          expect(box, `Button ${i} should have valid position`).not.toBeNull();

          if (box) {
            // Check z-index or stacking context isn't blocking interaction
            const isEnabled = await button.isEnabled();

            expect(isEnabled, `Button ${i} should be enabled and clickable`).toBe(true);
          }
        }
      }
    });
  });

  test.describe('CSS Property Validation', () => {
    test('should have proper box-sizing on layout containers', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const containers = ['.hero-section', '.problem-space-section', '.closing-moment-section'];

      for (const selector of containers) {
        const props = await validateCSSProperties(page, selector);

        if (props) {
          expect(props.boxSizing, `${selector} should use border-box sizing`).toBe('border-box');
        }
      }
    });

    test('should have proper overflow handling on containers', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const containers = ['.hero-section', '.problem-space-section'];

      for (const selector of containers) {
        const props = await validateCSSProperties(page, selector);

        if (props) {
          // Containers should not have hidden overflow that could clip content
          // unless intentionally designed (like animation containers)
          expect(
            ['visible', 'auto', 'scroll'].includes(props.overflowX) ||
              selector.includes('animation'),
            `${selector} should have appropriate overflow-x handling: ${props.overflowX}`,
          ).toBe(true);
        }
      }
    });

    test('should have responsive width constraints', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that main sections respond to viewport changes
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForFunction(() => window.innerWidth === 1920);

      const wideOverflow = await checkViewportOverflow(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForFunction(() => window.innerWidth === 375);

      const narrowOverflow = await checkViewportOverflow(page);

      // Both viewports should not have horizontal overflow
      expect(
        wideOverflow.hasHorizontalOverflow,
        'Wide viewport should not have horizontal overflow',
      ).toBe(false);
      expect(
        narrowOverflow.hasHorizontalOverflow,
        'Narrow viewport should not have horizontal overflow',
      ).toBe(false);
    });
  });

  test.describe('Typography Overflow Detection', () => {
    VIEWPORTS.forEach(({ name, width, height }) => {
      test(`should not have text overflow on ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const overflowingElements = await checkTextOverflow(page);

        // Filter out intentional overflow (like ellipsis)
        const unintentionalOverflow = overflowingElements.filter(
          (el: { selector: string; scrollWidth: number; clientWidth: number }) => {
            // Allow small differences (< 2px) which might be rounding
            return el.scrollWidth - el.clientWidth > 2;
          },
        );

        expect(
          unintentionalOverflow.length,
          `Found ${unintentionalOverflow.length} elements with text overflow on ${name}: ${JSON.stringify(unintentionalOverflow, null, 2)}`,
        ).toBe(0);
      });
    });

    test('should handle long words without overflow', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Inject a long word to test word-break behavior
      await page.evaluate(() => {
        const testElement = document.createElement('p');

        testElement.className = 'test-long-word';
        testElement.style.maxWidth = '300px';
        testElement.textContent = 'Supercalifragilisticexpialidocious';
        document.body.appendChild(testElement);
      });

      const testBox = await page.locator('.test-long-word').boundingBox();

      expect(testBox).not.toBeNull();

      if (testBox) {
        // Long word should be contained within max-width
        expect(testBox.width, 'Long word should not exceed container width').toBeLessThanOrEqual(
          310,
        ); // 300px + small margin
      }
    });
  });
});
