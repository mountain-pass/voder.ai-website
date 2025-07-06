import { test, expect } from '@playwright/test';

test('homepage smoke test', async ({ page }, testInfo) => {
  await page.goto('/');

  // Hero heading
  const header = page.locator('h1');
  await expect(header).toHaveText('Tell Us What You Want. Let Voder Build It.');

  // Description meta tag
  const descriptionMeta = page.locator('meta[name="description"]');
  await expect(descriptionMeta).toHaveCount(1);

  // Typing animation
  const typingElems = page.locator('.typing-animation');
  await expect(typingElems.first()).toBeVisible();

  // Fade-in elements
  const fadeElems = page.locator('.fade-in');
  await expect(fadeElems.first()).toBeVisible();

  // Problem Framing section
  const problem = page.locator('section', {
    hasText:
      'Today’s code generation tools still leave you stuck fiddling with source code. Voder lets you work at a higher level—focused on application behaviour, brand identity, and business outcomes.'
  });
  await expect(problem).toBeVisible();

  // Visual flow SVG text
  const svgText = page.locator('svg text', {
    hasText: 'Business Intent → Source Prompts → Voder → Working Software'
  });
  await expect(svgText).toHaveCount(1);

  // OG image meta
  const ogImageMeta = page.locator('meta[property="og:image"]');
  await expect(ogImageMeta).toHaveAttribute('content', '/assets/preview.png');

  // Preview image response
  const response = await page.request.get('/assets/preview.png');
  expect(response.status()).toBe(200);

  // Verify document title
  await expect(page).toHaveTitle('voder.ai');

  // Verify <meta property="og:title">
  const ogTitleMeta = page.locator('meta[property="og:title"]');
  await expect(ogTitleMeta).toHaveAttribute(
    'content',
    'voder.ai — The Compiler for Prompts.'
  );

  // Verify <meta property="og:description">
  const ogDescMeta = page.locator('meta[property="og:description"]');
  await expect(ogDescMeta).toHaveAttribute(
    'content',
    'We version our code. We version our infrastructure. Now it’s time to version our prompts.'
  );

  // Footer text
  const footer = page.locator('footer');
  await expect(footer).toHaveText('Voder. 2025.');
});