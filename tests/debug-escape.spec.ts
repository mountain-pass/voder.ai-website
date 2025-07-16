import { test, expect } from '@playwright/test';

test('debug escape key functionality', async ({ page }) => {
  const consoleMessages: string[] = [];
  
  page.on('console', (msg) => {
    consoleMessages.push(msg.text());
  });

  await page.goto('/');
  await page.waitForSelector('#main-content');
  await page.waitForTimeout(2000); // Wait for setup
  
  // Check if transition is set up correctly
  const transitionActive = await page.evaluate(() => {
    return {
      liveRegionExists: !!document.querySelector('#why-problem-transition-live-region'),
      problemSectionExists: !!document.querySelector('[data-test-id="problem-section"]'),
      mainContentExists: !!document.querySelector('#main-content')
    };
  });
  
  // Scroll to trigger transition
  await page.locator('[data-test-id="problem-section"]').scrollIntoViewIfNeeded();
  
  // Wait for transition to start
  await page.waitForTimeout(1000);
  
  // Check live region content to see if transition started
  const liveRegion = page.locator('#why-problem-transition-live-region');
  const announcement = await liveRegion.textContent();
  
  // Press Escape
  await page.keyboard.press('Escape');
  
  // Wait a moment for skip to take effect
  await page.waitForTimeout(500);
  
  // Check final states
  const finalStates = await page.evaluate(() => {
    const problemHeading = document.querySelector('#problem-heading') as HTMLElement;
    const mainContent = document.querySelector('#main-content') as HTMLElement;
    return {
      problemHeadingOpacity: problemHeading ? getComputedStyle(problemHeading).opacity : 'not found',
      mainContentBg: mainContent ? getComputedStyle(mainContent).backgroundColor : 'not found'
    };
  });
  
  console.log('Console messages:', consoleMessages);
  console.log('Transition setup:', transitionActive);
  console.log('Live region announcement:', announcement);
  console.log('Final states:', finalStates);
});
