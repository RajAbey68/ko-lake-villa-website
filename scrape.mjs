import { chromium } from 'playwright-core';

(async () => {
  let browser = null;
  try {
    console.log('Launching browser...');
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to page...');
    await page.goto('https://skill-bridge-rajabey68.replit.app/', { waitUntil: 'networkidle' });
    
    console.log('Extracting content...');
    const content = await page.content();
    
    console.log('--- HTML CONTENT START ---');
    console.log(content);
    console.log('--- HTML CONTENT END ---');

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
})();