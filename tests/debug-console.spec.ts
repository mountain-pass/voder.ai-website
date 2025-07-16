import { test, expect } from '@playwright/test';

test('debug console output', async ({ page }) => {
  const consoleMessages: string[] = [];
  
  page.on('console', (msg) => {
    consoleMessages.push(msg.text());
  });

  await page.goto('/');
  await page.waitForSelector('#main-content');
  
  // Wait a bit for console messages
  await page.waitForTimeout(3000);
  
  console.log('Console messages:', consoleMessages);
  
  // Check if we see any of our debug messages
  const hasWhyProblemLogs = consoleMessages.some(msg => 
    msg.includes('WhyToProblemSpaceTransition') || 
    msg.includes('Creating WhyToProblemSpaceTransition')
  );
  
  expect(hasWhyProblemLogs).toBe(true);
  
  // Also check if the trigger functions exist
  const triggerExists = await page.evaluate(() => {
    return typeof (window as any).__testTimeline === 'function';
  });
  
  expect(triggerExists).toBe(true);
});
