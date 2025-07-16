import { test, expect } from '@playwright/test';

test('debug timeline execution', async ({ page }) => {
  const consoleMessages: string[] = [];
  
  page.on('console', (msg) => {
    consoleMessages.push(msg.text());
  });

  await page.goto('/');
  await page.waitForSelector('#main-content');
  await page.waitForTimeout(2000); // Wait for setup
  
  // Get initial state
  const mainContent = page.locator('#main-content');
  const initialBg = await mainContent.evaluate(el => getComputedStyle(el).backgroundColor);
  
  // Trigger our timeline
  await page.evaluate(() => {
    const testFn = (window as Window & { __testTimeline?: () => void }).__testTimeline;
    if (testFn) {
      testFn();
    } else {
      throw new Error('testTimeline function not found');
    }
  });
  
  // Wait for animation to complete (4 seconds + buffer)
  await page.waitForTimeout(5000);
  
  // Check final state
  const finalBg = await mainContent.evaluate(el => getComputedStyle(el).backgroundColor);
  
  // Check if timeline execution logged anything
  const timelineMessages = consoleMessages.filter(msg => 
    msg.includes('Testing timeline') || msg.includes('transition') || msg.includes('Before:') || msg.includes('After')
  );
  
  // Print all console messages for debugging
  console.log('All console messages:', consoleMessages);
  console.log('Timeline messages:', timelineMessages);
  
  expect(timelineMessages.length).toBeGreaterThan(0);
  expect(finalBg).not.toBe(initialBg); // Should have changed
  expect(finalBg).toBe('rgb(10, 10, 10)'); // Should be Voder Black
});
