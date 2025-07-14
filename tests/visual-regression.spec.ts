import { test, expect } from '@playwright/test';

const sections = [
  { name: 'brand-entry', selector: 'section[role="banner"]' },
  { name: 'the-why', selector: 'section[role="main"] #main-content' },
  { name: 'problem-space', selector: 'section[data-test-id="problem-section"]' },
  { name: 'metaphor', selector: 'section[data-testid="metaphor-section"]' },
  { name: 'vision-flow', selector: 'section#vision-flow' },
  { name: 'prompt-driven-iteration', selector: 'section[aria-labelledby="prompt-iteration-heading"]' },
  { name: 'outcome-focus', selector: 'section[aria-labelledby="outcome-focus-heading"]' },
  { name: 'closing-moment', selector: 'section[role="contentinfo"]' },
];

test.describe('Visual regression for each section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const { name, selector } of sections) {
    test(name, async ({ page }) => {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      const screenshot = await section.screenshot();
      await expect(screenshot).toMatchSnapshot(
        `${name}.png`,
        { maxDiffPixelRatio: 0.10 }
      );
    });
  }
});