const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouseAudit() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('https://skill-bridge-rajabey68.replit.app/', options);
  
  console.log('Performance Score:', runnerResult.lhr.categories.performance.score * 100);
  console.log('First Contentful Paint:', runnerResult.lhr.audits['first-contentful-paint'].displayValue);
  console.log('Largest Contentful Paint:', runnerResult.lhr.audits['largest-contentful-paint'].displayValue);
  console.log('Speed Index:', runnerResult.lhr.audits['speed-index'].displayValue);

  await chrome.kill();
}

runLighthouseAudit().catch(console.error);