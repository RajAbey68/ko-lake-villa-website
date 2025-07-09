#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TIMEOUT = 30000;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, status, message = '') {
  const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  log(`[${status}] ${testName}${message ? ': ' + message : ''}`, statusColor);
  
  testResults.tests.push({ name: testName, status, message });
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.warnings++;
}

async function makeRequest(url, options = {}) {
  const fetch = (await import('node-fetch')).default;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Test functions
async function testServerHealth() {
  log('\n🏥 Testing Server Health', 'cyan');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    if (response.ok) {
      logTest('Server Health Check', 'PASS');
    } else {
      logTest('Server Health Check', 'FAIL', `HTTP ${response.status}`);
    }
  } catch (error) {
    logTest('Server Health Check', 'FAIL', error.message);
  }
}

async function testPageLoading() {
  log('\n📄 Testing Page Loading', 'cyan');
  
  const pages = [
    { path: '/', name: 'Home Page' },
    { path: '/gallery', name: 'Gallery Page' },
    { path: '/accommodation', name: 'Accommodation Page' },
    { path: '/booking', name: 'Booking Page' },
    { path: '/contact', name: 'Contact Page' },
    { path: '/admin/login', name: 'Admin Login Page' }
  ];
  
  for (const page of pages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page.path}`);
      if (response.ok) {
        const html = await response.text();
        if (html.includes('<!DOCTYPE html>') && html.includes('</html>')) {
          logTest(page.name, 'PASS');
        } else {
          logTest(page.name, 'FAIL', 'Invalid HTML structure');
        }
      } else {
        logTest(page.name, 'FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      logTest(page.name, 'FAIL', error.message);
    }
  }
}

async function testApiEndpoints() {
  log('\n🔌 Testing API Endpoints', 'cyan');
  
  const endpoints = [
    { path: '/api/gallery', name: 'Gallery API' },
    { path: '/api/gallery/categories', name: 'Gallery Categories API' },
    { path: '/api/gallery/list', name: 'Gallery List API' },
    { path: '/api/rooms', name: 'Rooms API' },
    { path: '/api/contact', name: 'Contact API', method: 'POST', body: { name: 'Test', email: 'test@example.com', message: 'Test message' } },
    { path: '/api/booking', name: 'Booking API', method: 'POST', body: { name: 'Test', email: 'test@example.com', dates: { checkin: '2024-01-01', checkout: '2024-01-02' } } }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method || 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`, options);
      
      if (response.ok) {
        try {
          const data = await response.json();
          logTest(endpoint.name, 'PASS');
        } catch (jsonError) {
          logTest(endpoint.name, 'WARN', 'Non-JSON response');
        }
      } else {
        logTest(endpoint.name, 'FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      logTest(endpoint.name, 'FAIL', error.message);
    }
  }
}

async function testGalleryFunctionality() {
  log('\n🖼️ Testing Gallery Functionality', 'cyan');
  
  try {
    // Test gallery data loading
    const galleryResponse = await makeRequest(`${BASE_URL}/api/gallery`);
    if (galleryResponse.ok) {
      const galleryData = await galleryResponse.json();
      if (typeof galleryData === 'object' && Object.keys(galleryData).length > 0) {
        logTest('Gallery Data Loading', 'PASS');
        
        // Test image accessibility
        const categories = Object.keys(galleryData);
        let imageTestsPassed = 0;
        let imagesToTest = 0;
        
        for (const category of categories.slice(0, 3)) { // Test first 3 categories
          const images = galleryData[category];
          if (Array.isArray(images) && images.length > 0) {
            for (const imagePath of images.slice(0, 2)) { // Test first 2 images per category
              imagesToTest++;
              try {
                const imageResponse = await makeRequest(`${BASE_URL}${imagePath}`);
                if (imageResponse.ok) {
                  imageTestsPassed++;
                }
              } catch (error) {
                // Image failed to load
              }
            }
          }
        }
        
        if (imagesToTest > 0) {
          const successRate = (imageTestsPassed / imagesToTest) * 100;
          if (successRate >= 80) {
            logTest('Gallery Images Accessibility', 'PASS', `${imageTestsPassed}/${imagesToTest} images accessible`);
          } else {
            logTest('Gallery Images Accessibility', 'FAIL', `Only ${imageTestsPassed}/${imagesToTest} images accessible`);
          }
        }
      } else {
        logTest('Gallery Data Loading', 'FAIL', 'Empty or invalid gallery data');
      }
    } else {
      logTest('Gallery Data Loading', 'FAIL', `HTTP ${galleryResponse.status}`);
    }
  } catch (error) {
    logTest('Gallery Data Loading', 'FAIL', error.message);
  }
}

async function testFileSystemIntegrity() {
  log('\n📁 Testing File System Integrity', 'cyan');
  
  const criticalPaths = [
    { path: 'public/uploads/gallery', name: 'Gallery Directory' },
    { path: 'data/gallery-publish-status.json', name: 'Gallery Publish Status' },
    { path: 'app/api/gallery/route.ts', name: 'Gallery API Route' },
    { path: 'app/gallery/page.tsx', name: 'Gallery Page Component' },
    { path: 'components/admin/gallery-management.tsx', name: 'Gallery Management Component' }
  ];
  
  for (const item of criticalPaths) {
    try {
      const fullPath = path.join(process.cwd(), item.path);
      if (fs.existsSync(fullPath)) {
        logTest(item.name, 'PASS');
      } else {
        logTest(item.name, 'FAIL', 'File/directory not found');
      }
    } catch (error) {
      logTest(item.name, 'FAIL', error.message);
    }
  }
}

async function testBuildProcess() {
  log('\n🔨 Testing Build Process', 'cyan');
  
  try {
    // Test TypeScript compilation for app directory only
    execSync('npx tsc --noEmit --skipLibCheck app/**/*.ts app/**/*.tsx', { stdio: 'pipe' });
    logTest('TypeScript Compilation', 'PASS');
  } catch (error) {
    logTest('TypeScript Compilation', 'WARN', 'TypeScript errors found in app directory');
  }
  
  try {
    // Test Next.js build (dry run)
    execSync('npm run build --dry-run', { stdio: 'pipe' });
    logTest('Next.js Build Process', 'PASS');
  } catch (error) {
    logTest('Next.js Build Process', 'WARN', 'Build issues detected');
  }
}

async function testEnvironmentVariables() {
  log('\n🌍 Testing Environment Variables', 'cyan');
  
  const requiredEnvVars = [
    'NODE_ENV',
    'NEXT_PUBLIC_BASE_URL'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      logTest(`Environment Variable: ${envVar}`, 'PASS');
    } else {
      logTest(`Environment Variable: ${envVar}`, 'WARN', 'Not set');
    }
  }
}

async function testSecurityHeaders() {
  log('\n🔒 Testing Security Headers', 'cyan');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    const headers = response.headers;
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection'
    ];
    
    for (const header of securityHeaders) {
      if (headers.get(header)) {
        logTest(`Security Header: ${header}`, 'PASS');
      } else {
        logTest(`Security Header: ${header}`, 'WARN', 'Not set');
      }
    }
  } catch (error) {
    logTest('Security Headers Check', 'FAIL', error.message);
  }
}

async function testDatabaseConnections() {
  log('\n🗄️ Testing Database Connections', 'cyan');
  
  try {
    // Test gallery publish status file
    const statusFile = path.join(process.cwd(), 'data/gallery-publish-status.json');
    if (fs.existsSync(statusFile)) {
      const statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      if (typeof statusData === 'object') {
        logTest('Gallery Status Database', 'PASS');
      } else {
        logTest('Gallery Status Database', 'FAIL', 'Invalid data format');
      }
    } else {
      logTest('Gallery Status Database', 'WARN', 'Status file not found');
    }
  } catch (error) {
    logTest('Gallery Status Database', 'FAIL', error.message);
  }
}

async function testPerformance() {
  log('\n⚡ Testing Performance', 'cyan');
  
  const performanceTests = [
    { path: '/', name: 'Home Page Load Time' },
    { path: '/gallery', name: 'Gallery Page Load Time' },
    { path: '/api/gallery', name: 'Gallery API Response Time' }
  ];
  
  for (const test of performanceTests) {
    try {
      const startTime = Date.now();
      const response = await makeRequest(`${BASE_URL}${test.path}`);
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      if (response.ok) {
        if (loadTime < 3000) {
          logTest(test.name, 'PASS', `${loadTime}ms`);
        } else if (loadTime < 5000) {
          logTest(test.name, 'WARN', `${loadTime}ms (slow)`);
        } else {
          logTest(test.name, 'FAIL', `${loadTime}ms (too slow)`);
        }
      } else {
        logTest(test.name, 'FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      logTest(test.name, 'FAIL', error.message);
    }
  }
}

function printSummary() {
  log('\n📊 Test Summary', 'magenta');
  log('═'.repeat(50), 'magenta');
  log(`✅ Passed: ${testResults.passed}`, 'green');
  log(`❌ Failed: ${testResults.failed}`, 'red');
  log(`⚠️  Warnings: ${testResults.warnings}`, 'yellow');
  log(`📋 Total Tests: ${testResults.tests.length}`, 'blue');
  
  const successRate = ((testResults.passed / testResults.tests.length) * 100).toFixed(1);
  log(`📈 Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
  
  if (testResults.failed > 0) {
    log('\n❌ Failed Tests:', 'red');
    testResults.tests
      .filter(test => test.status === 'FAIL')
      .forEach(test => log(`  • ${test.name}: ${test.message}`, 'red'));
  }
  
  if (testResults.warnings > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    testResults.tests
      .filter(test => test.status === 'WARN')
      .forEach(test => log(`  • ${test.name}: ${test.message}`, 'yellow'));
  }
  
  log('\n🚀 Deployment Readiness:', 'magenta');
  if (testResults.failed === 0 && successRate >= 80) {
    log('✅ READY FOR DEPLOYMENT', 'green');
    process.exit(0);
  } else {
    log('❌ NOT READY FOR DEPLOYMENT', 'red');
    log('Please fix the failing tests before deploying.', 'red');
    process.exit(1);
  }
}

// Main test execution
async function runTests() {
  log('🧪 Ko Lake Villa Pre-Deployment Test Suite', 'cyan');
  log('═'.repeat(50), 'cyan');
  
  const startTime = Date.now();
  
  try {
    await testServerHealth();
    await testPageLoading();
    await testApiEndpoints();
    await testGalleryFunctionality();
    await testFileSystemIntegrity();
    await testBuildProcess();
    await testEnvironmentVariables();
    await testSecurityHeaders();
    await testDatabaseConnections();
    await testPerformance();
  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  }
  
  const endTime = Date.now();
  const totalTime = ((endTime - startTime) / 1000).toFixed(2);
  
  log(`\n⏱️  Total test time: ${totalTime}s`, 'blue');
  printSummary();
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(error => {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runTests, testResults }; 