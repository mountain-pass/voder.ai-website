const { test, expect } = require('@playwright/test');

test.describe('Reveal.js navigation', () => {
  test('keyboard navigation with arrow keys', async ({ page }, testInfo) => {
    // Open slide 1 directly via URL hash
    await page.goto('/#/1');
    // By default it should land on slide 1
    await expect(page).toHaveURL(/#\/1/);

    // Press right arrow to advance to slide 2
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/#\/2/);

    // Press left arrow to go back to slide 1
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/#\/1/);

    // capture full-page screenshot
    await page.screenshot({
      path: `outputs/screenshots/navigation-keyboard-${testInfo.project.name}.png`,
      fullPage: true
    });
  });

  test('deep-linking via slide hash', async ({ page }, testInfo) => {
    // Open slide 3 directly via URL hash
    await page.goto('/#/3');
    // Verify the URL stays on slide 3
    await expect(page).toHaveURL(/#\/3/);

    // Ensure that the current slide element has class "present"
    const current = page.locator('.slides > section.present');
    await expect(current).toHaveCount(1);

    // capture full-page screenshot
    await page.screenshot({
      path: `outputs/screenshots/navigation-deeplink-${testInfo.project.name}.png`,
      fullPage: true
    });
  });
});