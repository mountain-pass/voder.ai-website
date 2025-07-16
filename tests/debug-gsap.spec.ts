import { test, expect } from '@playwright/test';

test('debug GSAP animation', async ({ page }) => {
  const consoleMessages: string[] = [];
  
  page.on('console', (msg) => {
    consoleMessages.push(msg.text());
  });

  await page.goto('/');
  await page.waitForSelector('#main-content');
  await page.waitForTimeout(2000); // Wait for setup
  
  // Check initial background color
  const mainContent = page.locator('#main-content');
  const initialBg = await mainContent.evaluate(el => getComputedStyle(el).backgroundColor);
  
  // Check if GSAP can animate this element at all
  const animationResult = await page.evaluate(() => {
    const element = document.querySelector('#main-content') as HTMLElement;
    if (!element) return 'element not found';
    
    // Test direct style change
    element.style.backgroundColor = '#FF0000';
    const afterDirect = getComputedStyle(element).backgroundColor;
    
    // Reset and test GSAP
    element.style.backgroundColor = '';
    
    // Import GSAP
    const { gsap } = (window as any);
    if (!gsap) return 'gsap not found';
    
    // Try simple GSAP animation
    gsap.set(element, { backgroundColor: '#00FF00' });
    const afterGsap = getComputedStyle(element).backgroundColor;
    
    return {
      direct: afterDirect,
      gsap: afterGsap
    };
  });
  
  expect(animationResult).not.toBe('element not found');
  expect(animationResult).not.toBe('gsap not found');
});
