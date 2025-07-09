#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logResult(test, status, details = '') {
  const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  log(`[${status}] ${test}${details ? ': ' + details : ''}`, statusColor);
}

async function makeRequest(url) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    return response;
  } catch (error) {
    throw error;
  }
}

function checkFileStructure() {
  log('\n📁 Checking File Structure', 'cyan');
  
  const criticalPaths = [
    { path: 'app/gallery/page.tsx', name: 'Gallery Page Component' },
    { path: 'app/gallery/loading.tsx', name: 'Gallery Loading Component' },
    { path: 'app/gallery/error.tsx', name: 'Gallery Error Component' },
    { path: 'app/api/gallery/route.ts', name: 'Gallery API Route' },
    { path: 'app/api/gallery/list/route.ts', name: 'Gallery List API Route' },
    { path: 'app/api/gallery/categories/route.ts', name: 'Gallery Categories API Route' },
    { path: 'app/api/gallery/publish/route.ts', name: 'Gallery Publish API Route' },
    { path: 'public/uploads/gallery', name: 'Gallery Images Directory' },
    { path: 'data/gallery-publish-status.json', name: 'Gallery Publish Status' }
  ];
  
  for (const item of criticalPaths) {
    const fullPath = path.join(process.cwd(), item.path);
    if (fs.existsSync(fullPath)) {
      logResult(item.name, 'PASS');
    } else {
      logResult(item.name, 'FAIL', 'Not found');
    }
  }
}

function checkImageFiles() {
  log('\n🖼️ Checking Image Files', 'cyan');
  
  const galleryDir = path.join(process.cwd(), 'public/uploads/gallery');
  
  if (!fs.existsSync(galleryDir)) {
    logResult('Gallery Directory', 'FAIL', 'Directory not found');
    return;
  }
  
  const categories = fs.readdirSync(galleryDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  logResult('Gallery Categories', 'PASS', `Found ${categories.length} categories: ${categories.join(', ')}`);
  
  let totalImages = 0;
  for (const category of categories) {
    const categoryPath = path.join(galleryDir, category);
    const files = fs.readdirSync(categoryPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i.test(file));
    
    totalImages += files.length;
    logResult(`${category} Category`, 'PASS', `${files.length} files`);
  }
  
  logResult('Total Images', 'PASS', `${totalImages} files`);
}

function checkPublishStatus() {
  log('\n📋 Checking Publish Status', 'cyan');
  
  const statusFile = path.join(process.cwd(), 'data/gallery-publish-status.json');
  
  if (!fs.existsSync(statusFile)) {
    logResult('Publish Status File', 'WARN', 'Not found - no images published');
    return;
  }
  
  try {
    const statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    const publishedCount = Object.keys(statusData).filter(key => statusData[key].isPublished).length;
    const totalCount = Object.keys(statusData).length;
    
    logResult('Publish Status File', 'PASS', `${publishedCount}/${totalCount} images published`);
  } catch (error) {
    logResult('Publish Status File', 'FAIL', `Invalid JSON: ${error.message}`);
  }
}

async function checkApiEndpoints() {
  log('\n🔌 Checking API Endpoints', 'cyan');
  
  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    { path: '/api/gallery', name: 'Gallery API' },
    { path: '/api/gallery/categories', name: 'Categories API' },
    { path: '/api/gallery/list', name: 'List API' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${baseUrl}${endpoint.path}`);
      if (response.ok) {
        const data = await response.json();
        logResult(endpoint.name, 'PASS', `HTTP ${response.status}`);
      } else {
        logResult(endpoint.name, 'FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      logResult(endpoint.name, 'FAIL', error.message);
    }
  }
}

async function checkGalleryPage() {
  log('\n📄 Checking Gallery Page', 'cyan');
  
  try {
    const response = await makeRequest('http://localhost:3000/gallery');
    if (response.ok) {
      const html = await response.text();
      
      // Check for loading skeleton (indicates stuck in loading state)
      if (html.includes('Loading gallery') || html.includes('Skeleton')) {
        logResult('Gallery Page Loading', 'FAIL', 'Stuck in loading state');
      } else if (html.includes('Photo Gallery') || html.includes('gallery')) {
        logResult('Gallery Page Loading', 'PASS', 'Page loaded successfully');
      } else {
        logResult('Gallery Page Loading', 'WARN', 'Unexpected content');
      }
    } else {
      logResult('Gallery Page Loading', 'FAIL', `HTTP ${response.status}`);
    }
  } catch (error) {
    logResult('Gallery Page Loading', 'FAIL', error.message);
  }
}

async function checkImageAccessibility() {
  log('\n🌐 Checking Image Accessibility', 'cyan');
  
  try {
    const response = await makeRequest('http://localhost:3000/api/gallery');
    if (!response.ok) {
      logResult('Image Accessibility', 'FAIL', 'Cannot fetch gallery data');
      return;
    }
    
    const galleryData = await response.json();
    const categories = Object.keys(galleryData);
    
    let testedImages = 0;
    let accessibleImages = 0;
    
    for (const category of categories.slice(0, 2)) { // Test first 2 categories
      const images = galleryData[category];
      if (Array.isArray(images)) {
        for (const imagePath of images.slice(0, 3)) { // Test first 3 images per category
          testedImages++;
          try {
            const imageResponse = await makeRequest(`http://localhost:3000${imagePath}`);
            if (imageResponse.ok) {
              accessibleImages++;
            }
          } catch (error) {
            // Image not accessible
          }
        }
      }
    }
    
    if (testedImages > 0) {
      const successRate = (accessibleImages / testedImages) * 100;
      if (successRate >= 80) {
        logResult('Image Accessibility', 'PASS', `${accessibleImages}/${testedImages} images accessible`);
      } else {
        logResult('Image Accessibility', 'FAIL', `Only ${accessibleImages}/${testedImages} images accessible`);
      }
    } else {
      logResult('Image Accessibility', 'WARN', 'No images to test');
    }
  } catch (error) {
    logResult('Image Accessibility', 'FAIL', error.message);
  }
}

function checkCompilationErrors() {
  log('\n🔨 Checking Compilation Errors', 'cyan');
  
  try {
    // Check TypeScript compilation for app directory only
    execSync('npx tsc --noEmit --skipLibCheck app/**/*.ts app/**/*.tsx', { stdio: 'pipe' });
    logResult('TypeScript Compilation', 'PASS');
  } catch (error) {
    logResult('TypeScript Compilation', 'WARN', 'Compilation errors found in app directory');
  }
  
  // Check for Next.js build cache issues
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    logResult('Next.js Build Cache', 'PASS', 'Cache exists');
  } else {
    logResult('Next.js Build Cache', 'WARN', 'No build cache found');
  }
}

function suggestFixes() {
  log('\n🔧 Suggested Fixes', 'magenta');
  log('═'.repeat(50), 'magenta');
  
  const fixes = [
    '1. Clear Next.js cache: rm -rf .next && npm run dev',
    '2. Ensure images are in public/uploads/gallery/',
    '3. Check if images are published via Gallery Manager',
    '4. Verify API routes are returning correct data',
    '5. Check for webpack module loading errors in dev server logs',
    '6. Ensure gallery page component is properly compiled',
    '7. Check for client-side hydration issues'
  ];
  
  fixes.forEach(fix => log(fix, 'yellow'));
}

async function runDiagnostics() {
  log('🔍 Gallery Diagnostic Tool', 'cyan');
  log('═'.repeat(50), 'cyan');
  
  checkFileStructure();
  checkImageFiles();
  checkPublishStatus();
  checkCompilationErrors();
  await checkApiEndpoints();
  await checkGalleryPage();
  await checkImageAccessibility();
  suggestFixes();
  
  log('\n✅ Diagnostic complete!', 'green');
}

// Run diagnostics if called directly
if (require.main === module) {
  runDiagnostics().catch(error => {
    log(`\n💥 Diagnostic failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runDiagnostics }; 