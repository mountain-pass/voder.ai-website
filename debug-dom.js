import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });

  const page = await browser.newPage();

  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body', { state: 'visible' });

  // Scroll to panel
  await page.evaluate(() => {
    const panel = document.querySelector('.panel');

    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(1000);

  // Debug the DOM
  const debug = await page.evaluate(() => {
    const panel = document.querySelector('.panel');

    const panelContent = document.querySelector('.panel-content');

    return {
      panel: {
        exists: !!panel,
        html: panel ? panel.outerHTML.substring(0, 200) : 'NOT FOUND',
      },
      panelContent: {
        exists: !!panelContent,
        html: panelContent ? panelContent.outerHTML.substring(0, 200) : 'NOT FOUND',
      },
      allPanels: Array.from(document.querySelectorAll('.panel')).length,
      allPanelContents: Array.from(document.querySelectorAll('.panel-content')).length,
    };
  });

  console.log('DOM Debug:', JSON.stringify(debug, null, 2));

  await browser.close();
})();
