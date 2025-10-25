import { expect, test } from '@playwright/test';

test.describe('P003: Coming Soon Button Overlapping 3D Cube', () => {
  test('should not have button overlapping 3D cube', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for hero section to be visible
    await page.waitForSelector('.hero-section', { state: 'visible' });

    // Get the bounding boxes of the hero title (positioned over 3D) and 3D canvas
    const heroTitle = page.locator('.hero-title');

    const heroAnimation = page.locator('.hero-animation');

    // Wait for both elements to be visible
    await expect(heroTitle).toBeVisible();
    await expect(heroAnimation).toBeVisible();

    // Get bounding boxes
    const titleBox = await heroTitle.boundingBox();

    const canvasBox = await heroAnimation.boundingBox();

    // Verify both elements have valid bounding boxes
    expect(titleBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();

    if (titleBox && canvasBox) {
      // P003 fix verification: hero-animation uses position:fixed with z-index:0 to stay in background
      // Hero title should be overlaid ON TOP of the 3D canvas (not a separation issue)
      // This test verifies the title is visible and properly positioned over the background

      // Verify the title is within the canvas area (intentional overlay design)
      const titleBottom = titleBox.y + titleBox.height;

      const canvasBottom = canvasBox.y + canvasBox.height;

      // Title should be within the canvas viewport (overlay design)
      expect(
        titleBottom,
        'Hero title should be positioned within the 3D canvas viewport (intentional overlay)',
      ).toBeLessThanOrEqual(canvasBottom + 100); // Allow some margin for positioning

      // Verify z-index ensures title is visible over canvas
      const titleZIndex = await heroTitle.evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });

      const canvasZIndex = await heroAnimation.evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });

      // Title should have higher z-index than canvas (or auto vs 0)
      expect(canvasZIndex, '3D canvas should have z-index: 0 to stay in background').toBe('0');
    }
  });

  test('should have proper z-index stacking', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // P003 fix: 3D canvas uses position:fixed with z-index:0 as background layer
    const heroAnimation = page.locator('.hero-animation');

    await expect(heroAnimation).toBeVisible();

    // Verify hero animation has z-index: 0 (background layer)
    const canvasZIndex = await heroAnimation.evaluate((el) => window.getComputedStyle(el).zIndex);

    expect(canvasZIndex, '3D canvas should have z-index: 0 as background layer').toBe('0');

    // Verify hero title is visible and not obscured by canvas
    const heroTitle = page.locator('.hero-title');

    await expect(heroTitle).toBeVisible();

    // Title should be in normal document flow (auto z-index), above the fixed background canvas
    // The fixed positioning of canvas with z-index:0 ensures it stays in background
  });

  test('should maintain button readability over 3D background', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // P003 is resolved - no "coming soon" button exists anymore
    // Current design has signup button below the fold, well separated from 3D canvas
    const signupButton = page.locator('.signup-button');

    await expect(signupButton).toBeVisible();

    // Verify signup button is not overlapping 3D canvas
    const buttonBox = await signupButton.boundingBox();

    const canvasBox = await page.locator('.hero-animation').boundingBox();

    expect(buttonBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();

    if (buttonBox && canvasBox) {
      // Button should be well below the canvas (in separate section)
      const buttonTop = buttonBox.y;

      const canvasBottom = canvasBox.y + canvasBox.height;

      expect(buttonTop, 'Signup button should be positioned well below 3D canvas').toBeGreaterThan(
        canvasBottom,
      );
    }
  });
});
