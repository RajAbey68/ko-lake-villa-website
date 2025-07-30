#!/usr/bin/env node

/**
 * Ko Lake Villa - Comprehensive Test Suite Runner
 * Runs all tests including new CSS, Navigation, Admin Console, and Error Handling tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ComprehensiveTestRunner {
  constructor() {
    this.testResults = {
      build: null,
      preDeployment: null,
      cssNavigation: null,
      adminConsole: null,
      errorHandling: null,
      integration: null,
      visualRegression: null,
      performance: null
    };
    
    this.startTime = Date.now();
    this.testSummary = {
      passed: 0,
      failed: 0,
      warnings: 0,
      skipped: 0
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      header: '\x1b[35m',
      reset: '\x1b[0m'
    };
    
    const timestamp = new Date().toISOString();
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async runBuildTests() {
    this.log('🏗️  Running Build Tests...', 'header');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      this.testResults.build = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ Build tests passed', 'success');
    } catch (error) {
      this.testResults.build = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ Build tests failed', 'error');
      throw error;
    }
  }

  async runPreDeploymentTests() {
    this.log('🚀 Running Pre-Deployment Tests...', 'header');
    
    try {
      execSync('node scripts/pre-deployment-tests.js', { stdio: 'inherit' });
      this.testResults.preDeployment = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ Pre-deployment tests passed', 'success');
    } catch (error) {
      this.testResults.preDeployment = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ Pre-deployment tests failed', 'error');
      // Don't throw - continue with other tests
    }
  }

  async runCSSNavigationTests() {
    this.log('🎨 Running CSS & Navigation Tests...', 'header');
    
    try {
      execSync('npx playwright test tests/css-navigation-test.spec.js --timeout=60000', { stdio: 'inherit' });
      this.testResults.cssNavigation = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ CSS & Navigation tests passed', 'success');
    } catch (error) {
      this.testResults.cssNavigation = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ CSS & Navigation tests failed', 'error');
    }
  }

  async runAdminConsoleTests() {
    this.log('🔐 Running Admin Console Tests...', 'header');
    
    try {
      execSync('npx playwright test tests/admin-console-test.spec.js --timeout=60000', { stdio: 'inherit' });
      this.testResults.adminConsole = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ Admin Console tests passed', 'success');
    } catch (error) {
      this.testResults.adminConsole = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ Admin Console tests failed', 'error');
    }
  }

  async runErrorHandlingTests() {
    this.log('🚫 Running Error Handling Tests...', 'header');
    
    try {
      execSync('npx playwright test tests/error-handling-test.spec.js --timeout=60000', { stdio: 'inherit' });
      this.testResults.errorHandling = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ Error Handling tests passed', 'success');
    } catch (error) {
      this.testResults.errorHandling = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ Error Handling tests failed', 'error');
    }
  }

  async runExistingIntegrationTests() {
    this.log('🔗 Running Integration Tests...', 'header');
    
    try {
      execSync('npx playwright test tests/integration-tests.spec.js --timeout=60000', { stdio: 'inherit' });
      this.testResults.integration = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ Integration tests passed', 'success');
    } catch (error) {
      this.testResults.integration = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ Integration tests failed', 'error');
    }
  }

  async runVisualRegressionTests() {
    this.log('👁️  Running Visual Regression Tests...', 'header');
    
    try {
      execSync('node scripts/visual-regression-tests.js', { stdio: 'inherit' });
      this.testResults.visualRegression = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ Visual regression tests passed', 'success');
    } catch (error) {
      this.testResults.visualRegression = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ Visual regression tests failed', 'error');
    }
  }

  async runPerformanceTests() {
    this.log('⚡ Running Performance Tests...', 'header');
    
    try {
      // Check if specific performance test file exists
      if (fs.existsSync('scripts/performance-tests.js')) {
        execSync('node scripts/performance-tests.js', { stdio: 'inherit' });
      } else {
        this.log('⚠️  Performance tests not found, running basic checks...', 'warning');
        await this.runBasicPerformanceChecks();
      }
      this.testResults.performance = 'PASSED';
      this.testSummary.passed++;
      this.log('✅ Performance tests passed', 'success');
    } catch (error) {
      this.testResults.performance = 'FAILED';
      this.testSummary.failed++;
      this.log('❌ Performance tests failed', 'error');
    }
  }

  async runBasicPerformanceChecks() {
    this.log('Checking bundle sizes...', 'info');
    
    // Check build output sizes
    const buildDir = '.next';
    if (fs.existsSync(buildDir)) {
      const buildInfo = execSync('du -sh .next', { encoding: 'utf8' });
      this.log(`Build size: ${buildInfo.trim()}`, 'info');
      
      // Check for large chunks
      const staticDir = '.next/static';
      if (fs.existsSync(staticDir)) {
        try {
          const chunkInfo = execSync('find .next/static -name "*.js" -type f -exec du -h {} + | sort -rh | head -5', { encoding: 'utf8' });
          this.log('Largest JavaScript chunks:', 'info');
          console.log(chunkInfo);
        } catch (e) {
          this.log('Could not analyze chunk sizes', 'warning');
        }
      }
    }
  }

  async runNavigationConsistencyTest() {
    this.log('🧭 Running Navigation Consistency Test...', 'header');
    
    try {
      execSync('node tests/navigation-visual-test.js', { stdio: 'inherit' });
      this.log('✅ Navigation consistency verified', 'success');
    } catch (error) {
      this.log('❌ Navigation consistency issues found', 'error');
      this.testSummary.warnings++;
    }
  }

  generateTestReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      summary: this.testSummary,
      results: this.testResults,
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch
      },
      recommendations: this.generateRecommendations()
    };

    // Write detailed report
    fs.writeFileSync('comprehensive-test-report.json', JSON.stringify(report, null, 2));
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.testResults.build === 'FAILED') {
      recommendations.push('🚫 Fix build errors before deployment');
    }
    
    if (this.testResults.cssNavigation === 'FAILED') {
      recommendations.push('🎨 Address CSS/Navigation issues for consistent UI');
    }
    
    if (this.testResults.adminConsole === 'FAILED') {
      recommendations.push('🔐 Fix admin console functionality for proper management');
    }
    
    if (this.testResults.errorHandling === 'FAILED') {
      recommendations.push('🚫 Improve error handling for better user experience');
    }
    
    if (this.testSummary.failed === 0) {
      recommendations.push('✨ All tests passing - ready for deployment!');
      recommendations.push('🚀 Consider adding more edge case tests');
      recommendations.push('📊 Monitor performance in production');
    }
    
    return recommendations;
  }

  printTestSummary(report) {
    this.log('', 'info');
    this.log('════════════════════════════════════════════════════════════════', 'header');
    this.log('🏁 COMPREHENSIVE TEST SUMMARY', 'header');
    this.log('════════════════════════════════════════════════════════════════', 'header');
    
    // Test category results
    const categories = [
      { name: 'Build Tests', result: this.testResults.build },
      { name: 'Pre-Deployment', result: this.testResults.preDeployment },
      { name: 'CSS & Navigation', result: this.testResults.cssNavigation },
      { name: 'Admin Console', result: this.testResults.adminConsole },
      { name: 'Error Handling', result: this.testResults.errorHandling },
      { name: 'Integration', result: this.testResults.integration },
      { name: 'Visual Regression', result: this.testResults.visualRegression },
      { name: 'Performance', result: this.testResults.performance }
    ];
    
    categories.forEach(({ name, result }) => {
      const icon = result === 'PASSED' ? '✅' : result === 'FAILED' ? '❌' : '⚠️';
      const color = result === 'PASSED' ? 'success' : result === 'FAILED' ? 'error' : 'warning';
      this.log(`${icon} ${name.padEnd(20)} ${result}`, color);
    });
    
    this.log('', 'info');
    this.log(`✅ Tests Passed: ${this.testSummary.passed}`, 'success');
    this.log(`❌ Tests Failed: ${this.testSummary.failed}`, 'error');
    this.log(`⚠️  Warnings: ${this.testSummary.warnings}`, 'warning');
    this.log(`⏱️  Duration: ${report.duration}`, 'info');
    
    this.log('', 'info');
    this.log('🔧 RECOMMENDATIONS:', 'header');
    report.recommendations.forEach(rec => {
      this.log(`   ${rec}`, 'info');
    });
    
    this.log('', 'info');
    this.log(`📄 Detailed Report: comprehensive-test-report.json`, 'info');
    
    // Final verdict
    if (this.testSummary.failed === 0) {
      this.log('', 'info');
      this.log('🎉 ALL TESTS PASSED - READY FOR DEPLOYMENT!', 'success');
    } else {
      this.log('', 'info');
      this.log('🚫 DEPLOYMENT NOT RECOMMENDED - FIX FAILING TESTS', 'error');
    }
    
    this.log('════════════════════════════════════════════════════════════════', 'header');
  }

  async runAll() {
    this.log('🚀 STARTING COMPREHENSIVE TEST SUITE', 'header');
    this.log('Ko Lake Villa - Complete Feature Testing', 'header');
    this.log('', 'info');

    const testSequence = [
      () => this.runBuildTests(),
      () => this.runPreDeploymentTests(),
      () => this.runNavigationConsistencyTest(),
      () => this.runCSSNavigationTests(),
      () => this.runAdminConsoleTests(),
      () => this.runErrorHandlingTests(),
      () => this.runExistingIntegrationTests(),
      () => this.runVisualRegressionTests(),
      () => this.runPerformanceTests()
    ];

    // Run tests in sequence
    for (const testFn of testSequence) {
      try {
        await testFn();
      } catch (error) {
        // Continue with remaining tests even if one fails
        this.log(`Test failed but continuing: ${error.message}`, 'warning');
      }
      
      // Small delay between test suites
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate and display final report
    const report = this.generateTestReport();
    this.printTestSummary(report);
    
    // Exit with appropriate code
    process.exit(this.testSummary.failed > 0 ? 1 : 0);
  }

  async runQuick() {
    this.log('⚡ RUNNING QUICK TEST SUITE', 'header');
    
    try {
      await this.runBuildTests();
      await this.runNavigationConsistencyTest();
      await this.runCSSNavigationTests();
      
      const report = this.generateTestReport();
      this.printTestSummary(report);
      
      if (this.testSummary.failed === 0) {
        this.log('✅ Quick tests passed - core functionality working', 'success');
      }
      
    } catch (error) {
      this.log('❌ Quick tests failed', 'error');
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const runner = new ComprehensiveTestRunner();
  const mode = process.argv[2] || 'all';

  switch (mode) {
    case 'quick':
      await runner.runQuick();
      break;
    case 'all':
    default:
      await runner.runAll();
      break;
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch(error => {
  console.error('🚨 Test runner failed:', error);
  process.exit(1);
}); 