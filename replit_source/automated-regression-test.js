
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class KoLakeVillaRegressionTester {
  constructor() {
    this.baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'http://localhost:5000';
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📝',
      success: '✅', 
      warning: '⚠️',
      error: '❌',
      critical: '🚨'
    }[type] || '📝';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async testEndpoint(endpoint, expectedStatus = 200, method = 'GET') {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(`${this.baseUrl}${endpoint}`, { method });
      
      const success = response.status === expectedStatus;
      this.results.total++;
      
      if (success) {
        this.results.passed++;
        this.log(`${endpoint} - Status ${response.status}`, 'success');
      } else {
        this.results.failed++;
        this.log(`${endpoint} - Expected ${expectedStatus}, got ${response.status}`, 'error');
      }
      
      this.results.tests.push({
        endpoint,
        expectedStatus,
        actualStatus: response.status,
        success,
        timestamp: new Date().toISOString()
      });
      
      return success;
    } catch (error) {
      this.results.total++;
      this.results.failed++;
      this.log(`${endpoint} - Error: ${error.message}`, 'error');
      
      this.results.tests.push({
        endpoint,
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      });
      
      return false;
    }
  }

  async runFrontendTests() {
    this.log('🎨 Testing Frontend Pages...', 'info');
    
    const pages = [
      '/',
      '/gallery', 
      '/booking',
      '/contact',
      '/accommodation',
      '/dining',
      '/experiences'
    ];
    
    for (const page of pages) {
      await this.testEndpoint(page, 200);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async runAPITests() {
    this.log('🔌 Testing API Endpoints...', 'info');
    
    const apis = [
      { endpoint: '/api/gallery', status: 200 },
      { endpoint: '/api/rooms', status: 200 },
      { endpoint: '/api/testimonials', status: 200 },
      { endpoint: '/api/activities', status: 200 },
      { endpoint: '/api/nonexistent', status: 404 }
    ];
    
    for (const api of apis) {
      await this.testEndpoint(api.endpoint, api.status);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async runStaticResourceTests() {
    this.log('📁 Testing Static Resources...', 'info');
    
    const resources = [
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml'
    ];
    
    for (const resource of resources) {
      await this.testEndpoint(resource, 200);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async runPerformanceTests() {
    this.log('⚡ Running Performance Tests...', 'info');
    
    const startTime = Date.now();
    const success = await this.testEndpoint('/', 200);
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      this.log(`Homepage load time: ${loadTime}ms (Good)`, 'success');
    } else if (loadTime < 5000) {
      this.log(`Homepage load time: ${loadTime}ms (Acceptable)`, 'warning');
      this.results.warnings++;
    } else {
      this.log(`Homepage load time: ${loadTime}ms (Too slow)`, 'error');
      this.results.failed++;
    }
    
    this.results.total++;
    if (loadTime < 5000) this.results.passed++;
  }

  async checkCriticalFiles() {
    this.log('📋 Checking Critical Files...', 'info');
    
    const criticalFiles = [
      'package.json',
      'client/index.html',
      'server/index.ts',
      '.replit'
    ];
    
    for (const file of criticalFiles) {
      this.results.total++;
      if (fs.existsSync(file)) {
        this.results.passed++;
        this.log(`${file} exists`, 'success');
      } else {
        this.results.failed++;
        this.log(`${file} missing`, 'error');
      }
    }
  }

  generateReport() {
    const successRate = Math.round((this.results.passed / this.results.total) * 100);
    
    const report = `
🏞️ Ko Lake Villa - Regression Test Report
==========================================
Generated: ${new Date().toISOString()}
Environment: ${this.baseUrl}

📊 SUMMARY
----------
Total Tests: ${this.results.total}
Passed: ${this.results.passed}
Failed: ${this.results.failed}
Warnings: ${this.results.warnings}
Success Rate: ${successRate}%

${successRate >= 90 ? '🎉 EXCELLENT - Ready for production!' : 
  successRate >= 75 ? '⚠️ GOOD - Minor issues to address' : 
  '🚨 NEEDS ATTENTION - Critical issues found'}

📝 DETAILED RESULTS
-------------------
${this.results.tests.map(test => 
  `${test.success ? '✅' : '❌'} ${test.endpoint || 'File Check'} - ${test.actualStatus || test.error || 'OK'}`
).join('\n')}

🔍 RECOMMENDATIONS
------------------
${this.results.failed > 0 ? '• Fix failed tests before deployment' : ''}
${this.results.warnings > 0 ? '• Review warning items for optimization' : ''}
${successRate < 90 ? '• Run detailed diagnostics on failing components' : ''}
${successRate >= 90 ? '• System is ready for production deployment' : ''}

==========================================
Ko Lake Villa Development Team
`;

    return report;
  }

  async saveReport() {
    const report = this.generateReport();
    const filename = `regression-test-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    
    fs.writeFileSync(filename, report);
    this.log(`Report saved to ${filename}`, 'success');
    
    return filename;
  }

  async runFullSuite() {
    this.log('🚀 Starting Ko Lake Villa Regression Test Suite...', 'info');
    
    try {
      await this.checkCriticalFiles();
      await this.runFrontendTests();
      await this.runAPITests();
      await this.runStaticResourceTests();
      await this.runPerformanceTests();
      
      console.log(this.generateReport());
      await this.saveReport();
      
      this.log('🏁 Regression testing complete!', 'success');
      
      // Exit with appropriate code
      process.exit(this.results.failed > 0 ? 1 : 0);
      
    } catch (error) {
      this.log(`Test suite error: ${error.message}`, 'critical');
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const tester = new KoLakeVillaRegressionTester();
  tester.runFullSuite();
}

module.exports = KoLakeVillaRegressionTester;
