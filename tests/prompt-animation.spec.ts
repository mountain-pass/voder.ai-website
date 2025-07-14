import { test, expect } from '@playwright/test';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test('Prompt iteration swaps prompt and UI mockup text on scroll', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');

  // Locate the Prompt Iteration section
  const section = page.locator('section[aria-labelledby="prompt-iteration-heading"]');
  await expect(section).toBeVisible();

  // Trigger scroll to initiate GSAP animation
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));

  // Wait for animations to complete
  await waitForAnimationsComplete(page, section);

  // Verify prompt content updated
  const promptText = await section.locator('pre.prompt-content').textContent();
  expect(promptText?.trim()).toBe('Premium, minimalist.');

  // Verify UI mockup heading updated
  const uiHeading = await section.locator('div.ui-mockup h3').textContent();
  expect(uiHeading?.trim()).toBe('Begin your journey.');
});
