import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');

  // Ensure mock UI is active
  const isMock = await page.evaluate(() => !!document.querySelector('[data-cy="column-annotation-container"]'));
  if (!isMock) {
    await page.click('button:has-text("Mock UI")');
    await page.waitForTimeout(1000);
  }

  // Scroll sidebar down
  await page.evaluate(() => {
    const sidebar = document.querySelector('.MuiBox-root > .MuiBox-root > div[style*="overflow-y: auto"]'); 
    // Find the scrollable parent of the Assessment Tool tree
    const assessmentEl = document.querySelector('[data-tour="tour-assessment"]');
    if (assessmentEl) {
       // get closest scrollable
       let p = assessmentEl.parentElement;
       while(p) {
         if(window.getComputedStyle(p).overflowY === 'auto' || window.getComputedStyle(p).overflowY === 'scroll') {
           p.scrollTop = 500;
           break;
         }
         p = p.parentElement;
       }
    }
  });

  await page.waitForTimeout(500);

  // Click Take Tour
  await page.click('button:has-text("Take UI Tour")');
  await page.waitForTimeout(500);

  // Click Next
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(1000);

  // Measure tooltip position
  const tooltipRect = await page.evaluate(() => {
    const tooltip = document.querySelector('.__floater__body');
    if (!tooltip) return null;
    return tooltip.getBoundingClientRect();
  });

  // Measure target position
  const targetRect = await page.evaluate(() => {
    const el = document.querySelector('[data-tour="tour-assessment"]');
    return el ? el.getBoundingClientRect() : null;
  });

  console.log("Tooltip:", tooltipRect);
  console.log("Target:", targetRect);

  await browser.close();
})();
