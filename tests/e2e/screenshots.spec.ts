import { expect, type Page, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const viewports = [
  { name: 'desktop-landscape', width: 1920, height: 1080 },
  { name: 'laptop-landscape', width: 1366, height: 768 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'mobile-portrait', width: 375, height: 667 },
  { name: 'mobile-landscape', width: 667, height: 375 },
  { name: 'mobile-portrait', width: 390, height: 844 },
  { name: 'mobile-landscape', width: 844, height: 390 },
];

// Helper function to generate consistent screenshot names
function getScreenshotName(section: string, name: string, width: number, height: number): string {
  // Extract device type and orientation from name
  const parts = name.split('-');

  const device = parts[0]; // desktop, laptop, tablet, mobile

  const orientation = parts.length > 1 ? parts.slice(1).join('-') : 'portrait';

  const size = `${width}x${height}`;

  // For landscape devices, use 'landscape', for portrait devices use 'portrait'
  let finalOrientation = orientation;

  if (orientation === 'portrait' && (name === 'desktop' || name === 'laptop')) {
    finalOrientation = 'landscape'; // Desktop/laptop are typically landscape
  }

  return `${section}-${device}-${finalOrientation}-${size}.png`;
}

// Helper function to wait for page to be ready for screenshots
async function waitForPageReady(page: Page) {
  // Wait for basic page load and network to be idle
  await page.waitForLoadState('networkidle');

  // Wait for all potential elements that could appear
  await page.waitForSelector('body', { state: 'visible' });

  // Wait for either animation container to be present (but don't require specific content)
  try {
    await page.waitForSelector('.hero-animation', { timeout: 10000 });
  } catch {
    // If no animation container, that's fine - continue
  }
}

// Helper function to measure heights
async function measureHeights(
  page: Page,
  viewport: string,
): Promise<{ contentHeightVh: number; isExactly80vh: boolean } | null> {
  const measurements = await page.evaluate(() => {
    const panel = document.querySelector('.panel');

    const panelContent = document.querySelector('.panel-content');

    if (!panel || !panelContent) {
      return { error: 'Elements not found', panel: !!panel, panelContent: !!panelContent };
    }

    const panelRect = panel.getBoundingClientRect();

    const contentRect = panelContent.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    // Debug: Check computed styles
    const panelStyles = window.getComputedStyle(panel);

    const contentStyles = window.getComputedStyle(panelContent);

    return {
      viewport: {
        height: viewportHeight,
      },
      panel: {
        height: panelRect.height,
        heightVh: (panelRect.height / viewportHeight) * 100,
        computedHeight: panelStyles.height,
        computedMinHeight: panelStyles.minHeight,
      },
      content: {
        height: contentRect.height,
        heightVh: (contentRect.height / viewportHeight) * 100,
        computedHeight: contentStyles.height,
        computedMinHeight: contentStyles.minHeight,
      },
    };
  });

  if (measurements && !('error' in measurements)) {
    console.log(`\n📏 Height Measurements for ${viewport}:`);
    console.log(`   Viewport: ${measurements.viewport.height}px`);
    console.log(
      `   Panel (container): ${measurements.panel.height.toFixed(1)}px (${measurements.panel.heightVh.toFixed(1)}vh)`,
    );
    console.log(
      `   Panel computed height: ${measurements.panel.computedHeight}, min-height: ${measurements.panel.computedMinHeight}`,
    );
    console.log(
      `   Content (actual): ${measurements.content.height.toFixed(1)}px (${measurements.content.heightVh.toFixed(1)}vh)`,
    );
    console.log(
      `   Content computed height: ${measurements.content.computedHeight}, min-height: ${measurements.content.computedMinHeight}`,
    );

    // Check if panel content is exactly 80vh
    const contentFitsInPanel = measurements.content.height <= measurements.panel.height;

    const overflowAmount = measurements.content.height - measurements.panel.height;

    console.log(
      `   ${contentFitsInPanel ? '✅' : '❌'} Content ${contentFitsInPanel ? 'fits within' : 'OVERFLOWS'} panel ${contentFitsInPanel ? '' : `by ${overflowAmount.toFixed(1)}px (${((overflowAmount / measurements.viewport.height) * 100).toFixed(1)}vh)`}`,
    );

    return {
      contentHeightVh: measurements.content.heightVh,
      isExactly80vh: Math.abs(measurements.content.heightVh - 80) < 0.5,
    };
  } else {
    console.log(`❌ Measurement failed for ${viewport}:`, measurements);

    return null;
  }
}

// Helper function to safely scroll to element
async function scrollToElement(page: Page, selector: string): Promise<boolean> {
  try {
    // Check if element exists in DOM (don't require it to be visible/in viewport)
    const elementExists = await page.evaluate((sel) => {
      return document.querySelector(sel) !== null;
    }, selector);

    if (!elementExists) {
      console.log(`Element ${selector} not found in DOM, trying next option`);

      return false;
    }

    // Element exists - force scroll to it even if off-screen
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);

    // Wait for scroll animation to complete
    await page.waitForTimeout(500);

    // Verify element is now at least partially in viewport
    const isInViewport = await page.evaluate((sel) => {
      const element = document.querySelector(sel);

      if (!element) return false;

      const rect = element.getBoundingClientRect();

      // Element is visible if any part of it is in the viewport
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }, selector);

    if (isInViewport) {
      console.log(`Successfully scrolled to ${selector}`);

      return true;
    } else {
      console.log(`Scrolled to ${selector} but it's still not in viewport, trying next option`);

      return false;
    }
  } catch (error) {
    console.log(`Error scrolling to ${selector}: ${error}, trying next option`);

    return false;
  }
}

// Helper function to try multiple selectors for scrolling
async function scrollToAnyElement(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    const success = await scrollToElement(page, selector);

    if (success) {
      console.log(`Successfully scrolled to ${selector}`);

      return;
    }
  }
  console.log('Could not scroll to any target element, using current position');
}

test.describe('Business Area Screenshot Validation', () => {
  // Clean up old screenshots before running tests
  test.beforeAll(async () => {
    const screenshotsDir = 'screenshots';

    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    } else {
      // Remove all existing screenshot files
      const files = fs.readdirSync(screenshotsDir);

      for (const file of files) {
        if (file.endsWith('.png')) {
          fs.unlinkSync(path.join(screenshotsDir, file));
        }
      }
      console.log('🧹 Cleaned up old screenshots');
    }
  });

  viewports.forEach(({ name, width, height }) => {
    test(`Brand Entry - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);

      // Ensure we're at the top of the page
      await page.evaluate(() => window.scrollTo(0, 0));

      // Take the screenshot - no assertions that can fail
      await page.screenshot({
        path: `screenshots/${getScreenshotName('brand-entry', name, width, height)}`,
        fullPage: false,
        animations: 'disabled',
      });

      console.log(`✓ Brand Entry screenshot taken for ${name} (${width}x${height})`);
    });

    test(`Problem Statement - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);

      // Try to scroll to problem statement area - use multiple possible selectors
      await scrollToAnyElement(page, [
        '.panel',
        '.headline',
        '.preamble',
        '.hinge',
        '.kicker',
        '#problem-title',
        '.problem-description',
      ]);

      // Measure heights for this viewport and assert .panel-content is exactly 80vh
      console.log(`🔍 Attempting to measure heights for ${name} (${width}x${height})`);
      const measurements = await measureHeights(page, `${name} (${width}x${height})`);

      // Take screenshot regardless of measurement result
      await page.screenshot({
        path: `screenshots/${getScreenshotName('problem-statement', name, width, height)}`,
        fullPage: false,
        animations: 'disabled',
      });

      console.log(`✓ Problem Statement screenshot taken for ${name} (${width}x${height})`);

      // Assert that .panel-content is exactly 80vh
      if (measurements) {
        expect(
          measurements.isExactly80vh,
          `Panel content should be exactly 80vh but was ${measurements.contentHeightVh.toFixed(1)}vh on ${name} (${width}x${height})`,
        ).toBe(true);
      } else {
        throw new Error(`Failed to measure heights for ${name} (${width}x${height})`);
      }
    });

    test(`Connect - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);

      // Try to scroll to GPS metaphor section (Connect business area)
      await scrollToAnyElement(page, ['.gps-metaphor', '.metaphor-explain', '.metaphor-contrast']);

      await page.screenshot({
        path: `screenshots/${getScreenshotName('connect', name, width, height)}`,
        fullPage: false,
        animations: 'disabled',
      });

      console.log(`✓ Connect screenshot taken for ${name} (${width}x${height})`);
    });

    test(`Love Alternative - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);

      // Try to scroll to Three Core Benefits section (Love Alternative business area)
      await scrollToAnyElement(page, ['.spec-driven-benefits', '.benefits-grid', '.benefit-item']);

      await page.screenshot({
        path: `screenshots/${getScreenshotName('love-alternative', name, width, height)}`,
        fullPage: false,
        animations: 'disabled',
      });

      console.log(`✓ Love Alternative screenshot taken for ${name} (${width}x${height})`);
    });

    test(`Interest Capture - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);

      // Try to scroll to interest capture area - use multiple possible selectors
      await scrollToAnyElement(page, ['.interest-capture', '.signup-form', '.email-form']);

      await page.screenshot({
        path: `screenshots/${getScreenshotName('interest-capture', name, width, height)}`,
        fullPage: false,
        animations: 'disabled',
      });

      console.log(`✓ Interest Capture screenshot taken for ${name} (${width}x${height})`);
    });
  });
});
