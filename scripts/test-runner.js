#!/usr/bin/env node

/**
 * Ko Lake Villa - Unified Test Runner
 * Runs all pre-deployment tests in sequence
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.testResults = {
      preDeployment: null,
      visualRegression: null,
      integration: null,
      build: null
    };
    
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async runPreDeploymentTests() {
    this.log('🚀 Running Pre-Deployment Tests...', 'info');
    
    try {
      execSync('node scripts/pre-deployment-tests.js', { stdio: 'inherit' });
      this.testResults.preDeployment = 'PASSED';
      this.log('✅ Pre-deployment tests passed', 'success');
    } catch (error) {
      this.testResults.preDeployment = 'FAILED';
      this.log('❌ Pre-deployment tests failed', 'error');
      throw error;
    }
  }

  async runVisualRegressionTests() {
    this.log('🎭 Running Visual Regression Tests...', 'info');
    
    try {
      execSync('node scripts/visual-regression-tests.js', { stdio: 'inherit' });
      this.testResults.visualRegression = 'PASSED';
      this.log('✅ Visual regression tests passed', 'success');
    } catch (error) {
      this.testResults.visualRegression = 'FAILED';
      this.log('❌ Visual regression tests failed', 'error');
      // Don't throw - visual tests are non-blocking
    }
  }

  async runBuildTests() {
    this.log('🏗️  Running Build Tests...', 'info');
    
    try {
      // Clean build test
      execSync('rm -rf .next', { stdio: 'pipe' });
      execSync('npm run build', { stdio: 'inherit' });
      
      this.testResults.build = 'PASSED';
      this.log('✅ Build tests passed', 'success');
    } catch (error) {
      this.testResults.build = 'FAILED';
      this.log('❌ Build tests failed', 'error');
      throw error;
    }
  }

  async runIntegrationTests() {
    this.log('🔗 Running Integration Tests...', 'info');
    
    // Check if Playwright is available
    try {
      execSync('npx playwright --version', { stdio: 'pipe' });
    } catch (error) {
      this.log('⚠️  Playwright not installed, skipping integration tests', 'warning');
      this.testResults.integration = 'SKIPPED';
      return;
    }

    try {
      // Start dev server in background
      this.log('Starting development server...', 'info');
      const serverProcess = execSync('npm run dev &', { stdio: 'pipe' });
      
      // Wait for server to start
      await this.waitForServer('http://localhost:3000', 30000);
      
      // Run Playwright tests
      execSync('npx playwright test tests/integration-tests.spec.js', { stdio: 'inherit' });
      
      this.testResults.integration = 'PASSED';
      this.log('✅ Integration tests passed', 'success');
      
      // Kill dev server
      execSync('pkill -f "next dev"', { stdio: 'pipe' });
      
    } catch (error) {
      this.testResults.integration = 'FAILED';
      this.log('❌ Integration tests failed', 'error');
      
      // Clean up
      try {
        execSync('pkill -f "next dev"', { stdio: 'pipe' });
      } catch (e) {
        // Server may not be running
      }
      
      // Don't throw - integration tests are optional
    }
  }

  async waitForServer(url, timeout = 30000) {
    const http = require('http');
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const checkServer = () => {
        if (Date.now() - startTime > timeout) {
          reject(new Error('Server startup timeout'));
          return;
        }
        
        const req = http.get(url, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            setTimeout(checkServer, 1000);
          }
        });
        
        req.on('error', () => {
          setTimeout(checkServer, 1000);
        });
      };
      
      checkServer();
    });
  }

  async runQuickTests() {
    this.log('⚡ Running Quick Tests (Build + Pre-deployment)...', 'info');
    
    await this.runBuildTests();
    await this.runPreDeploymentTests();
    await this.runVisualRegressionTests();
    
    this.generateReport();
  }

  async runFullTests() {
    this.log('🎯 Running Full Test Suite...', 'info');
    
    await this.runBuildTests();
    await this.runPreDeploymentTests();
    await this.runVisualRegressionTests();
    await this.runIntegrationTests();
    
    this.generateReport();
  }

  generateReport() {
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    console.log('\n' + '='.repeat(60));
    console.log('🏁 TEST SUITE SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Total Duration: ${duration}s`);
    console.log(`🏗️  Build Tests: ${this.testResults.build}`);
    console.log(`🚀 Pre-deployment Tests: ${this.testResults.preDeployment}`);
    console.log(`🎭 Visual Regression: ${this.testResults.visualRegression}`);
    console.log(`🔗 Integration Tests: ${this.testResults.integration}`);
    
    const criticalTests = [this.testResults.build, this.testResults.preDeployment];
    const hasCriticalFailures = criticalTests.includes('FAILED');
    
    console.log('\n📊 DEPLOYMENT RECOMMENDATION:');
    
    if (hasCriticalFailures) {
      console.log('🚫 DEPLOYMENT NOT RECOMMENDED');
      console.log('   Critical test failures detected');
      process.exit(1);
    } else if (this.testResults.visualRegression === 'FAILED' || this.testResults.integration === 'FAILED') {
      console.log('⚠️  DEPLOYMENT WITH CAUTION');
      console.log('   Non-critical test failures detected');
      process.exit(0);
    } else {
      console.log('🎉 READY FOR DEPLOYMENT');
      console.log('   All tests passed successfully');
      process.exit(0);
    }
  }

  showHelp() {
    console.log(`
Ko Lake Villa Test Runner

Usage:
  node scripts/test-runner.js [command]

Commands:
  quick     Run quick tests (build + pre-deployment + visual)
  full      Run all tests including integration tests
  help      Show this help message

Examples:
  node scripts/test-runner.js quick
  node scripts/test-runner.js full

For manual testing, see: tests/manual-test-checklist.md
    `);
  }
}

// Main execution
async function main() {
  const testRunner = new TestRunner();
  const command = process.argv[2] || 'quick';
  
  switch (command) {
    case 'quick':
      await testRunner.runQuickTests();
      break;
    case 'full':
      await testRunner.runFullTests();
      break;
    case 'help':
    case '--help':
    case '-h':
      testRunner.showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      testRunner.showHelp();
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner; 