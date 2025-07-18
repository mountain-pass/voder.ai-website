import { test } from '@playwright/test';

test.describe('Visual Screenshots - Website State Capture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('capture full page overview', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'screenshots/full-page-overview.png',
      fullPage: true 
    });
  });

  test('capture brand entry section states', async ({ page }) => {
    // Wait for canvas to be ready
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow for initial animation setup
    
    // Brand Entry initial state
    await page.screenshot({ 
      path: 'screenshots/brand-entry-initial.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    // Wait a bit and capture during/after animation
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'screenshots/brand-entry-mid-animation.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    // After animation completes
    await page.waitForTimeout(4000);
    await page.screenshot({ 
      path: 'screenshots/brand-entry-complete.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
  });

  test('capture section-by-section states', async ({ page }) => {
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // The Why section (uses #main-content)
    const whySection = page.locator('#main-content');
    await whySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/the-why-section.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    
    // Problem Space section (look for text content since structure is dynamic)
    await page.locator('text=The problem').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000); // Allow for transition
    await page.screenshot({ 
      path: 'screenshots/problem-space-section.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    // Metaphor section (look for GPS text)
    await page.locator('text=passenger seat').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/metaphor-section.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    
    // Vision Flow section
    await page.locator('text=How It Works').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/vision-flow-section.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    
    // Prompt Iteration section
    await page.locator('text=Change the prompt').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000); // Allow for any scroll animations
    await page.screenshot({ 
      path: 'screenshots/prompt-iteration-section.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    
    // Outcome Focus section
    await page.locator('text=Outcomes').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/outcome-focus-section.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    
    // Closing Moment section
    await page.locator('[data-testid="compiler-tagline"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/closing-moment-section.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
  });

  test('capture transition states', async ({ page }) => {
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // Scroll to trigger Why to Problem transition
    await page.locator('#main-content').scrollIntoViewIfNeeded();
    await page.screenshot({ 
      path: 'screenshots/transition-why-before.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    // Scroll slowly to capture transition
    await page.evaluate(() => {
      const problemSection = document.querySelector('*[class*="problem"]') || 
                            document.querySelector('h2, h3, p');
      if (problemSection) {
        problemSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // Capture during transition
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: 'screenshots/transition-why-to-problem-mid.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    // After transition completes
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'screenshots/transition-problem-after.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
  });

  test('capture interactive states', async ({ page }) => {
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // GPS Metaphor interaction - scroll to it first using more reliable selector
    await page.locator('[data-testid="metaphor-section"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Initial GPS state
    await page.screenshot({ 
      path: 'screenshots/gps-metaphor-initial.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    
    // Try to interact with GPS elements
    const gpsButton = page.locator('[data-mode="gps"]').first();
    if (await gpsButton.isVisible()) {
      await gpsButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: 'screenshots/gps-metaphor-gps-mode.png',
        clip: { x: 0, y: 0, width: 1200, height: 600 }
      });
    }
    
    const directionsButton = page.locator('[data-mode="directions"]').first();
    if (await directionsButton.isVisible()) {
      await directionsButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: 'screenshots/gps-metaphor-directions-mode.png',
        clip: { x: 0, y: 0, width: 1200, height: 600 }
      });
    }
  });

  test('capture mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Mobile full page
    await page.screenshot({ 
      path: 'screenshots/mobile-full-page.png',
      fullPage: true 
    });
    
    // Mobile brand entry
    await page.screenshot({ 
      path: 'screenshots/mobile-brand-entry.png',
      clip: { x: 0, y: 0, width: 375, height: 812 }
    });
  });

  test('capture different browser states', async ({ page, browserName }) => {
    await page.waitForLoadState('networkidle');
    
    // Browser-specific full page screenshot
    await page.screenshot({ 
      path: `screenshots/full-page-${browserName}.png`,
      fullPage: true 
    });
    
    // Browser-specific brand entry
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: `screenshots/brand-entry-${browserName}.png`,
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
  });

  test('capture accessibility states', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'screenshots/reduced-motion-state.png',
      fullPage: true 
    });
    
    // Focus states
    await page.keyboard.press('Tab');
    await page.screenshot({ 
      path: 'screenshots/focus-state-1.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
  });
});
