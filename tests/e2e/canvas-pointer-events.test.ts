import { expect, test } from '@playwright/test';

test.describe('Canvas Pointer Events', () => {
  test('canvas should not block form interactions', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify canvas is present and visible
    const canvas = page.locator('canvas[data-engine="three.js r180"]');

    await expect(canvas).toBeVisible();

    // Verify email input is clickable and interactable
    const emailInput = page.locator('#email');

    await expect(emailInput).toBeVisible();
    await emailInput.click();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Verify submit button is clickable (this was the main issue)
    const submitButton = page.locator('.signup-button');

    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // This click should work without canvas interference
    await submitButton.click();

    // Verify form status appears (indicating click was successful)
    const formStatus = page.locator('#form-status');

    await expect(formStatus).toBeVisible();
  });

  test('canvas should remain visually functional while allowing interactions', async ({ page }) => {
    await page.goto('/');

    // Wait for animation to initialize
    await page.waitForTimeout(2000);

    // Verify canvas is present and rendering
    const canvas = page.locator('canvas[data-engine="three.js r180"]');

    await expect(canvas).toBeVisible();

    // Verify canvas has expected dimensions
    const canvasBox = await canvas.boundingBox();

    expect(canvasBox?.width).toBeGreaterThan(100);
    expect(canvasBox?.height).toBeGreaterThan(100);

    // Verify form elements are still interactive over the canvas
    const emailInput = page.locator('#email');

    await emailInput.click();
    await emailInput.fill('interactive@test.com');

    // Clear the input to test continued interaction
    await emailInput.clear();
    await expect(emailInput).toHaveValue('');
  });
});
