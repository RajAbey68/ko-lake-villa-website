#!/usr/bin/env node

/**
 * Ko Lake Villa Gallery System Test Runner
 * Easy execution of Playwright test suite
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Ko Lake Villa Gallery System Test Suite');
console.log('==========================================\n');

// Test execution options
const testOptions = {
  all: 'npx playwright test',
  headed: 'npx playwright test --headed',
  debug: 'npx playwright test --debug',
  ui: 'npx playwright test --ui',
  specific: (testName) => `npx playwright test -g "${testName}"`,
  mobile: 'npx playwright test --project="Mobile Chrome"',
  report: 'npx playwright show-report'
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'all';

function runCommand(cmd) {
  console.log(`Executing: ${cmd}\n`);
  
  const process = exec(cmd, { cwd: __dirname });
  
  process.stdout.on('data', (data) => {
    console.log(data);
  });
  
  process.stderr.on('data', (data) => {
    console.error(data);
  });
  
  process.on('close', (code) => {
    console.log(`\nTest execution completed with code: ${code}`);
    if (code === 0) {
      console.log('✅ All tests passed!');
    } else {
      console.log('❌ Some tests failed. Check the report for details.');
    }
  });
}

// Execute based on command
switch(command) {
  case 'all':
    console.log('Running all gallery system tests...');
    runCommand(testOptions.all);
    break;
    
  case 'headed':
    console.log('Running tests with browser UI visible...');
    runCommand(testOptions.headed);
    break;
    
  case 'debug':
    console.log('Running tests in debug mode...');
    runCommand(testOptions.debug);
    break;
    
  case 'ui':
    console.log('Opening Playwright UI for interactive testing...');
    runCommand(testOptions.ui);
    break;
    
  case 'mobile':
    console.log('Running mobile-specific tests...');
    runCommand(testOptions.mobile);
    break;
    
  case 'report':
    console.log('Opening test report...');
    runCommand(testOptions.report);
    break;
    
  case 'upload':
    console.log('Running upload functionality tests...');
    runCommand(testOptions.specific('Upload'));
    break;
    
  case 'validation':
    console.log('Running validation tests...');
    runCommand(testOptions.specific('validation'));
    break;
    
  case 'ai':
    console.log('Running AI integration tests...');
    runCommand(testOptions.specific('AI'));
    break;
    
  case 'performance':
    console.log('Running performance tests...');
    runCommand(testOptions.specific('performance'));
    break;
    
  default:
    console.log('Available commands:');
    console.log('  all        - Run all tests (default)');
    console.log('  headed     - Run with visible browser');
    console.log('  debug      - Run in debug mode');
    console.log('  ui         - Open interactive UI');
    console.log('  mobile     - Run mobile tests only');
    console.log('  upload     - Run upload tests only');
    console.log('  validation - Run validation tests only');
    console.log('  ai         - Run AI integration tests only');
    console.log('  performance- Run performance tests only');
    console.log('  report     - Show test report');
    console.log('\nExample: node run-gallery-tests.js headed');
}