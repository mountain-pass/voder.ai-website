const { test, expect } = require('@playwright/test');

test('homepage smoke test', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('h1');
  // updated to match hero heading
  await expect(header).toHaveText('Tell Us What You Want. Let Voder Build It.');
  const descriptionMeta = page.locator('meta[name="description"]');
  await expect(descriptionMeta).toHaveCount(1);
  const typingElems = page.locator('.typing-animation');
  await expect(typingElems.first()).toBeVisible();
  const fadeElems = page.locator('.fade-in');
  await expect(fadeElems.first()).toBeVisible();

  // Verify Problem Framing section is rendered exactly as expected
  const problem = page.locator('section', {
    hasText:
      'Today’s code generation tools still leave you stuck fiddling with source code. Voder lets you work at a higher level—focused on application behaviour, brand identity, and business outcomes.'
  });
  await expect(problem).toBeVisible();

  // updated to reflect new visual flow text
  const svgText = page.locator('svg text', {
    hasText:
      'Business Intent → Source Prompts → Voder → Working Software'
  });
  await expect(svgText).toBeVisible();

  const ogImageMeta = page.locator('meta[property="og:image"]');
  await expect(ogImageMeta).toHaveAttribute('content', '/assets/preview.png');

  const response = await page.request.get('/assets/preview.png');
  expect(response.status()).toBe(200);
});