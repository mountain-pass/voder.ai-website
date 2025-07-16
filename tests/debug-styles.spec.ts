import { test, expect } from '@playwright/test';

test('debug CSS specificity', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#main-content');
  await page.waitForTimeout(2000);
  
  // Check all style sources for main-content
  const styleInfo = await page.evaluate(() => {
    const element = document.querySelector('#main-content') as HTMLElement;
    if (!element) return 'element not found';
    
    const computed = getComputedStyle(element);
    const inline = element.style.backgroundColor;
    
    // Try setting directly with important
    element.style.setProperty('background-color', 'rgb(255, 0, 0)', 'important');
    const afterImportant = getComputedStyle(element).backgroundColor;
    
    // Reset
    element.style.removeProperty('background-color');
    
    return {
      computed: computed.backgroundColor,
      inline: inline,
      afterImportant: afterImportant,
      className: element.className,
      id: element.id
    };
  });
  
  // Try GSAP with important
  const gsapResult = await page.evaluate(() => {
    const element = document.querySelector('#main-content') as HTMLElement;
    const gsap = (window as any).gsap;
    
    if (!gsap || !element) return 'missing';
    
    // Try GSAP with important
    gsap.set(element, { backgroundColor: 'rgb(0, 255, 0) !important' });
    const afterGsapImportant = getComputedStyle(element).backgroundColor;
    
    // Try regular GSAP
    gsap.set(element, { backgroundColor: 'rgb(0, 0, 255)' });
    const afterGsapRegular = getComputedStyle(element).backgroundColor;
    
    return {
      afterGsapImportant,
      afterGsapRegular
    };
  });
  
  console.log('Style info:', styleInfo);
  console.log('GSAP result:', gsapResult);
});
