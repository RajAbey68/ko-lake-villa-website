#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Ko Lake Villa - Comprehensive Deployment Verification\n');

let testsPassed = 0;
let testsFailed = 0;
let warnings = 0;

// Potential deployment URLs to test
const DEPLOYMENT_URLS = [
  'https://ko-lake-villa-website.vercel.app',
  'https://ko-lake-villa-website-git-guestypro.vercel.app',
  'https://ko-lake-villa-website-qh2sb5rq1-rajabey68s-projects.vercel.app',
  'https://ko-lake-villa-website-rjleoyrvn-rajabey68s-projects.vercel.app'
];

function log(emoji, message, isWarning = false) {
  console.log(`${emoji} ${message}`);
  if (isWarning) warnings++;
}

function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 30000, ...options }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function testHttpResponse(url, expectedStatus = 200, description) {
  try {
    const { stdout } = await execPromise(`curl -s -o /dev/null -w "%{http_code}" -L --connect-timeout 10 --max-time 30 "${url}"`);
    const statusCode = parseInt(stdout.trim().replace('%', ''));
    
    if (statusCode === expectedStatus) {
      log('✅', `${description}: HTTP ${statusCode}`);
      testsPassed++;
      return { success: true, statusCode };
    } else if (statusCode >= 200 && statusCode < 400 && expectedStatus === 200) {
      log('✅', `${description}: HTTP ${statusCode} (acceptable)`);
      testsPassed++;
      return { success: true, statusCode };
    } else {
      log('❌', `${description}: Expected ${expectedStatus}, got ${statusCode}`);
      testsFailed++;
      return { success: false, statusCode };
    }
  } catch (error) {
    log('❌', `${description}: Network error - ${error.error?.message || 'Connection failed'}`);
    testsFailed++;
    return { success: false, statusCode: null, error: error.error?.message };
  }
}

async function testPageContent(url, expectedContent, description, isRequired = true) {
  try {
    const { stdout } = await execPromise(`curl -s -L --connect-timeout 10 --max-time 30 "${url}"`);
    
    if (stdout.includes(expectedContent)) {
      log('✅', `${description}: Content found`);
      if (isRequired) testsPassed++;
      return { success: true, content: stdout.substring(0, 200) };
    } else {
      const message = `${description}: Content "${expectedContent}" not found`;
      if (isRequired) {
        log('❌', message);
        testsFailed++;
      } else {
        log('⚠️', message, true);
      }
      return { success: false, content: stdout.substring(0, 200) };
    }
  } catch (error) {
    const message = `${description}: Error - ${error.error?.message || 'Request failed'}`;
    if (isRequired) {
      log('❌', message);
      testsFailed++;
    } else {
      log('⚠️', message, true);
    }
    return { success: false, error: error.error?.message };
  }
}

async function findWorkingDeploymentURL() {
  log('🔍', 'Finding active deployment URL...\n');
  
  for (const url of DEPLOYMENT_URLS) {
    console.log(`Testing: ${url}`);
    const result = await testHttpResponse(url, 200, `Testing ${url.split('//')[1]}`);
    
    if (result.success) {
      log('🎯', `Active deployment found: ${url}\n`);
      return url;
    }
  }
  
  log('💥', 'No working deployment URL found!\n');
  return null;
}

async function testWebsitePages(baseUrl) {
  log('🌐', 'Testing website pages...\n');

  const pages = [
    { path: '/', name: 'Homepage', content: 'Ko Lake Villa' },
    { path: '/contact', name: 'Contact page', content: '+94 71 776 5780' },
    { path: '/gallery', name: 'Gallery page', content: 'Ko Lake Villa Gallery' },
    { path: '/deals', name: 'Deals page', content: 'Deals' },
    { path: '/accommodation', name: 'Accommodation page', content: 'accommodation' },
    { path: '/experiences', name: 'Experiences page', content: 'experiences' },
    { path: '/dining', name: 'Dining page', content: 'dining' },
    { path: '/excursions', name: 'Excursions page', content: 'excursions' },
    { path: '/faq', name: 'FAQ page', content: 'FAQ' },
    { path: '/booking', name: 'Booking page', content: 'booking' }
  ];

  for (const page of pages) {
    const url = `${baseUrl}${page.path}`;
    await testHttpResponse(url, 200, `${page.name} loads`);
    await testPageContent(url, page.content, `${page.name} has correct content`, false);
  }
}

async function testAPIEndpoints(baseUrl) {
  log('\n🔌', 'Testing API endpoints...\n');

  const endpoints = [
    { path: '/api/health', name: 'Health API', expectedStatus: 200 },
    { path: '/api/gallery/list', name: 'Gallery List API', expectedStatus: 200 },
    { path: '/api/gallery/categories', name: 'Gallery Categories API', expectedStatus: 200 },
    { path: '/api/rooms', name: 'Rooms API', expectedStatus: 200 }
  ];

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint.path}`;
    await testHttpResponse(url, endpoint.expectedStatus, endpoint.name);
  }
}

async function testCriticalContent(baseUrl) {
  log('\n📋', 'Testing critical content...\n');

  // Contact information
  await testPageContent(`${baseUrl}/contact`, '+94 71 776 5780', 'GM phone number');
  await testPageContent(`${baseUrl}/contact`, '+94 77 315 0602', 'Team Lead phone number');
  await testPageContent(`${baseUrl}/contact`, '+94 711730345', 'Owner phone number');
  await testPageContent(`${baseUrl}/contact`, 'The Reception is open from 7am to 10:30pm', 'Reception hours');

  // Brand elements
  await testPageContent(`${baseUrl}/`, 'Ko Lake Villa', 'Brand name on homepage');
  await testPageContent(`${baseUrl}/gallery`, 'Ko Lake Villa Gallery', 'Gallery title');
  
  // Navigation elements
  await testPageContent(`${baseUrl}/`, 'Accommodation', 'Navigation - Accommodation link');
  await testPageContent(`${baseUrl}/`, 'Gallery', 'Navigation - Gallery link');
  await testPageContent(`${baseUrl}/`, 'Contact', 'Navigation - Contact link');
}

async function testAdminPages(baseUrl) {
  log('\n🔐', 'Testing admin pages (should redirect)...\n');

  const adminPages = [
    { path: '/admin/gallery', name: 'Admin Gallery', expectedStatus: 307 },
    { path: '/admin/dashboard', name: 'Admin Dashboard', expectedStatus: 307 },
    { path: '/admin/login', name: 'Admin Login', expectedStatus: 200 }
  ];

  for (const page of adminPages) {
    const url = `${baseUrl}${page.path}`;
    await testHttpResponse(url, page.expectedStatus, `${page.name} (${page.expectedStatus === 307 ? 'redirect expected' : 'should load'})`);
  }
}

async function testPerformanceAndSEO(baseUrl) {
  log('\n⚡', 'Testing performance and SEO...\n');

  try {
    // Test page load time
    const startTime = Date.now();
    await testHttpResponse(baseUrl, 200, 'Homepage load time test');
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      log('✅', `Page load time: ${loadTime}ms (good)`);
      testsPassed++;
    } else if (loadTime < 5000) {
      log('⚠️', `Page load time: ${loadTime}ms (acceptable)`, true);
    } else {
      log('❌', `Page load time: ${loadTime}ms (too slow)`);
      testsFailed++;
    }

    // Test for basic SEO elements
    await testPageContent(baseUrl, '<title>', 'Has page title');
    await testPageContent(baseUrl, '<meta name="description"', 'Has meta description', false);
    await testPageContent(baseUrl, '<meta name="viewport"', 'Has viewport meta tag', false);

  } catch (error) {
    log('⚠️', `Performance test error: ${error.message}`, true);
  }
}

async function testAirbnbRedirects(baseUrl) {
  log('\n🏠', 'Testing Airbnb booking redirects...\n');

  const redirects = [
    { path: '/klv', name: 'Entire Villa booking' },
    { path: '/klv1', name: 'Master Family Suite booking' },
    { path: '/klv3', name: 'Triple/Twin Rooms booking' },
    { path: '/klv6', name: 'Group Room booking' }
  ];

  for (const redirect of redirects) {
    try {
      const { stdout } = await execPromise(`curl -s -I -L --connect-timeout 10 --max-time 30 "${baseUrl}${redirect.path}"`);
      
      if (stdout.includes('airbnb') || stdout.includes('302') || stdout.includes('301')) {
        log('✅', `${redirect.name} redirect works`);
        testsPassed++;
      } else {
        log('❌', `${redirect.name} redirect not working`);
        testsFailed++;
      }
    } catch (error) {
      log('⚠️', `${redirect.name} redirect test failed: ${error.message}`, true);
    }
  }
}

async function main() {
  try {
    // Step 1: Find working deployment URL
    const baseUrl = await findWorkingDeploymentURL();
    
    if (!baseUrl) {
      log('💥', 'CRITICAL: No active deployment found!');
      console.log('\n🔍 Checked URLs:');
      DEPLOYMENT_URLS.forEach(url => console.log(`  - ${url}`));
      console.log('\n💡 Deployment may be in progress or failed.');
      process.exit(1);
    }

    // Update todo status
    console.log('🎯 Active URL:', baseUrl);

    // Step 2: Test all functionality
    await testWebsitePages(baseUrl);
    await testAPIEndpoints(baseUrl);
    await testCriticalContent(baseUrl);
    await testAdminPages(baseUrl);
    await testPerformanceAndSEO(baseUrl);
    await testAirbnbRedirects(baseUrl);

    // Step 3: Final results
    console.log('\n' + '='.repeat(60));
    console.log('📊 DEPLOYMENT VERIFICATION RESULTS');
    console.log('='.repeat(60));
    log('✅', `Tests Passed: ${testsPassed}`);
    log('❌', `Tests Failed: ${testsFailed}`);
    log('⚠️', `Warnings: ${warnings}`);
    console.log(`🌐 Tested URL: ${baseUrl}`);

    if (testsFailed === 0) {
      console.log('\n🎉 SUCCESS: Ko Lake Villa website is fully deployed and functional!');
      console.log(`\n🔗 Live website: ${baseUrl}`);
      console.log('✅ All critical functionality verified');
      console.log('✅ All pages loading correctly');
      console.log('✅ API endpoints responding');
      console.log('✅ Contact information present');
      console.log('✅ Navigation working');
      console.log('✅ Admin security in place');
      
      if (warnings > 0) {
        console.log(`\n⚠️  Note: ${warnings} warnings found (non-critical)`);
      }
      
      process.exit(0);
    } else {
      console.log(`\n💥 ISSUES FOUND: ${testsFailed} critical problems detected`);
      console.log('❌ Deployment has issues that need attention');
      process.exit(1);
    }

  } catch (error) {
    log('💥', `Verification failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n⏸️  Verification interrupted by user');
  process.exit(0);
});

main();
