#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Pre-Deployment Validation...\n');

let testsPassed = 0;
let testsFailed = 0;
let server;

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
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
    const { stdout } = await execPromise(`curl -s -o /dev/null -w "%{http_code}" ${url}`);
    const statusCode = parseInt(stdout.trim().replace('%', ''));
    
    if (statusCode === expectedStatus) {
      log('✅', `${description}: ${statusCode}`);
      testsPassed++;
      return true;
    } else {
      log('❌', `${description}: Expected ${expectedStatus}, got ${statusCode}`);
      testsFailed++;
      return false;
    }
  } catch (error) {
    log('❌', `${description}: Network error - ${error.error.message}`);
    testsFailed++;
    return false;
  }
}

async function testPageContent(url, expectedContent, description) {
  try {
    const { stdout } = await execPromise(`curl -s ${url}`);
    
    if (stdout.includes(expectedContent)) {
      log('✅', `${description}: Content found`);
      testsPassed++;
      return true;
    } else {
      log('❌', `${description}: Content "${expectedContent}" not found`);
      testsFailed++;
      return false;
    }
  } catch (error) {
    log('❌', `${description}: Error - ${error.error.message}`);
    testsFailed++;
    return false;
  }
}

async function validateBuild() {
  log('🔨', 'Testing production build...');
  
  try {
    await execPromise('npm run build');
    log('✅', 'Production build successful');
    testsPassed++;
    return true;
  } catch (error) {
    log('❌', 'Production build failed');
    console.log('Build error:', error.stderr);
    testsFailed++;
    return false;
  }
}

async function startProductionServer() {
  log('🌐', 'Starting production server...');
  
  return new Promise((resolve) => {
    server = spawn('npm', ['start'], {
      env: { ...process.env, PORT: '3001' },
      stdio: 'pipe'
    });

    let started = false;
    
    server.stdout.on('data', (data) => {
      if (data.toString().includes('Ready') || data.toString().includes('started server')) {
        if (!started) {
          started = true;
          log('✅', 'Production server started on port 3001');
          setTimeout(resolve, 2000); // Give server time to fully start
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.log('Server stderr:', data.toString());
    });

    // Fallback timeout
    setTimeout(() => {
      if (!started) {
        log('⚠️', 'Server start timeout, proceeding with tests...');
        resolve();
      }
    }, 10000);
  });
}

async function runRuntimeTests() {
  const baseUrl = 'http://localhost:3001';
  
  log('🧪', 'Running runtime functionality tests...\n');

  // Test critical pages load
  await testHttpResponse(`${baseUrl}/`, 200, 'Homepage loads');
  await testHttpResponse(`${baseUrl}/contact`, 200, 'Contact page loads');
  await testHttpResponse(`${baseUrl}/gallery`, 200, 'Gallery page loads');
  await testHttpResponse(`${baseUrl}/deals`, 200, 'Deals page loads');
  await testHttpResponse(`${baseUrl}/accommodation`, 200, 'Accommodation page loads');
  // Admin gallery expects 307 redirect if not authenticated (this is correct behavior)
  await testHttpResponse(`${baseUrl}/admin/gallery`, 307, 'Admin gallery redirects (expected)');

  // Test API endpoints
  await testHttpResponse(`${baseUrl}/api/health`, 200, 'Health API works');
  await testHttpResponse(`${baseUrl}/api/gallery/list`, 200, 'Gallery API works');

  // Test critical content
  await testPageContent(`${baseUrl}/`, 'Ko Lake Villa', 'Homepage has brand name');
  await testPageContent(`${baseUrl}/contact`, '+94 71 776 5780', 'Contact has GM phone');
  await testPageContent(`${baseUrl}/contact`, '+94 77 315 0602', 'Contact has Team Lead phone');
  await testPageContent(`${baseUrl}/contact`, '+94 711730345', 'Contact has Owner phone');
  await testPageContent(`${baseUrl}/contact`, 'The Reception is open from 7am to 10:30pm', 'Contact has reception hours');
  await testPageContent(`${baseUrl}/gallery`, 'Ko Lake Villa Gallery', 'Gallery has title');
}

async function validateDeploymentReadiness() {
  log('\n📋', 'Checking deployment readiness...');

  // Check protected files exist
  const protectedFiles = [
    'app/contact/page.tsx',
    'app/gallery/page.tsx',
    'components/admin/gallery-management.tsx',
    'lib/firebase-listings.ts',
    'vercel.json'
  ];

  for (const file of protectedFiles) {
    if (fs.existsSync(file)) {
      log('✅', `Protected file exists: ${file}`);
      testsPassed++;
    } else {
      log('❌', `Missing protected file: ${file}`);
      testsFailed++;
    }
  }

  // Check critical configurations
  if (fs.existsSync('vercel.json')) {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    if (vercelConfig.functions) {
      log('✅', 'Vercel functions configured');
      testsPassed++;
    } else {
      log('❌', 'Vercel functions not configured');
      testsFailed++;
    }
  }

  // Check .vercelignore excludes gallery to prevent 250MB limit
  if (fs.existsSync('.vercelignore')) {
    const vercelIgnore = fs.readFileSync('.vercelignore', 'utf8');
    if (vercelIgnore.includes('public/uploads/gallery')) {
      log('✅', 'Gallery images excluded from functions');
      testsPassed++;
    } else {
      log('❌', 'Gallery images not excluded - will cause 250MB limit');
      testsFailed++;
    }
  }
}

async function cleanup() {
  if (server) {
    log('🧹', 'Stopping test server...');
    server.kill();
  }
}

async function main() {
  try {
    // Step 1: Validate build
    const buildSuccess = await validateBuild();
    if (!buildSuccess) {
      log('💥', 'Build failed - aborting deployment validation');
      process.exit(1);
    }

    // Step 2: Start production server
    await startProductionServer();

    // Step 3: Run runtime tests
    await runRuntimeTests();

    // Step 4: Check deployment readiness
    await validateDeploymentReadiness();

    // Step 5: Results
    console.log('\n📊 Test Results:');
    log('✅', `Passed: ${testsPassed}`);
    log('❌', `Failed: ${testsFailed}`);

    if (testsFailed === 0) {
      log('🎉', 'ALL TESTS PASSED - DEPLOYMENT READY!');
      process.exit(0);
    } else {
      log('💥', `TESTS FAILED - DO NOT DEPLOY (${testsFailed} failures)`);
      process.exit(1);
    }

  } catch (error) {
    log('💥', `Validation failed: ${error.message}`);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

main(); 