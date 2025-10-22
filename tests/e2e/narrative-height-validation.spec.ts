/**
 * @fileoverview E2E test to validate 80vh height constraint in actual browser
 */

import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

viewports.forEach(({ name, width, height }) => {
  test(`narrative content should fill exactly 80vh on ${name} (${width}x${height})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto('http://localhost:3000');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Get the narrative panel element
    const narrativeContent = page.locator('.panel');

    await expect(narrativeContent).toBeVisible();

    // Get the computed height
    const boundingBox = await narrativeContent.boundingBox();

    expect(boundingBox).not.toBeNull();

    const actualHeight = boundingBox!.height;

    const expectedHeight = height * 0.8; // 80% of viewport height

    // Allow 2px tolerance for rounding
    const tolerance = 2;

    expect(actualHeight).toBeGreaterThanOrEqual(expectedHeight - tolerance);
    expect(actualHeight).toBeLessThanOrEqual(expectedHeight + tolerance);

    console.log(`${name}: actual height ${actualHeight}px, expected ${expectedHeight}px`);
  });
});

test('narrative content positioning should have 10vh margins', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');

  await page.waitForLoadState('networkidle');

  // Check CSS properties directly
  const narrativeContent = page.locator('.panel');

  const marginTop = await narrativeContent.evaluate((el) => {
    return window.getComputedStyle(el).marginTop;
  });

  const marginBottom = await narrativeContent.evaluate((el) => {
    return window.getComputedStyle(el).marginBottom;
  });

  // 10vh of 1080px = 108px
  const expected = '108px';

  expect(marginTop).toBe(expected);
  expect(marginBottom).toBe(expected);
});

test('narrative content should fill space with proper flex layout', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');

  await page.waitForLoadState('networkidle');

  const narrativeContent = page.locator('.panel');

  // Check CSS display properties
  const display = await narrativeContent.evaluate((el) => {
    const styles = window.getComputedStyle(el);

    return {
      display: styles.display,
      justifyItems: styles.justifyItems,
      alignContent: styles.alignContent,
      minHeight: styles.minHeight,
    };
  });

  expect(display.display).toBe('grid');
  expect(display.justifyItems).toBe('center');
  expect(display.alignContent).toBe('center');
  // Note: min-height instead of fixed height for the new system
});
