import { test, expect } from '@playwright/test';

const sections = [
  'The Problem',
  'GPS vs Directions',
  'How It Works',
  'Prompt-Driven Iteration',
  'The Outcome',
  'The Compiler for Prompts.',
];

test('homepage narrative sections are visible', async ({ page }) => {
  await page.goto('/');

  for (const title of sections) {
    const heading = page.getByRole('heading', { level: 2, name: title });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
  }
});
