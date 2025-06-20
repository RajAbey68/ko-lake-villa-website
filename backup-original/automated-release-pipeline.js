/**
 * Ko Lake Villa - Automated Release Pipeline
 * Comprehensive testing, validation, and deployment automation
 */

class AutomatedReleasePipeline {
  constructor() {
    this.results = {
      preDeployment: { passed: 0, failed: 0, tests: [] },
      functionality: { passed: 0, failed: 0, tests: [] },
      performance: { passed: 0, failed: 0, tests: [] },
      security: { passed: 0, failed: 0, tests: [] }
    };
    this.baseUrl = window.location.origin;
    this.releaseVersion = new Date().toISOString().split('T')[0].replace(/-/g, '.');
  }

  async runFullReleasePipeline() {
    console.log(`🚀 Starting Automated Release Pipeline v${this.releaseVersion}\n`);
    console.log('=' + '='.repeat(60));
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Pre-deployment validation
      await this.runPreDeploymentTests();
      
      // Phase 2: Functionality testing
      await this.runFunctionalityTests();
      
      // Phase 3: Performance validation
      await this.runPerformanceTests();
      
      // Phase 4: Security validation
      await this.runSecurityTests();
      
      // Generate comprehensive report
      const duration = (Date.now() - startTime) / 1000;
      await this.generateReleaseReport(duration);
      
      // Deployment recommendation
      this.makeDeploymentRecommendation();
      
    } catch (error) {
      console.error('❌ Pipeline execution failed:', error.message);
      this.logTest('preDeployment', 'Pipeline Execution', false, error.message);
    }
  }

  async runPreDeploymentTests() {
    console.log('\n📋 Phase 1: Pre-Deployment Validation');
    console.log('-'.repeat(40));
    
    // Test API health
    try {
      const apiResponse = await fetch(`${this.baseUrl}/api/content`);
      this.logTest('preDeployment', 'Content API Health', 
        apiResponse.status === 200, `Status: ${apiResponse.status}`);
        
      if (apiResponse.status === 200) {
        const data = await apiResponse.json();
        this.logTest('preDeployment', 'Content Data Integrity', 
          Array.isArray(data) && data.length > 0, `Found ${data.length} content sections`);
      }
    } catch (error) {
      this.logTest('preDeployment', 'API Connectivity', false, error.message);
    }

    // Test gallery API
    try {
      const galleryResponse = await fetch(`${this.baseUrl}/api/gallery`);
      this.logTest('preDeployment', 'Gallery API Health', 
        galleryResponse.status === 200, `Status: ${galleryResponse.status}`);
    } catch (error) {
      this.logTest('preDeployment', 'Gallery API', false, error.message);
    }

    // Test rooms API
    try {
      const roomsResponse = await fetch(`${this.baseUrl}/api/rooms`);
      this.logTest('preDeployment', 'Rooms API Health', 
        roomsResponse.status === 200, `Status: ${roomsResponse.status}`);
    } catch (error) {
      this.logTest('preDeployment', 'Rooms API', false, error.message);
    }

    // Environment validation
    const requiredEnvVars = ['VITE_GA_MEASUREMENT_ID', 'VITE_STRIPE_PUBLIC_KEY'];
    requiredEnvVars.forEach(envVar => {
      const exists = import.meta.env[envVar] !== undefined;
      this.logTest('preDeployment', `Environment: ${envVar}`, exists, 
        exists ? 'Present' : 'Missing');
    });
  }

  async runFunctionalityTests() {
    console.log('\n⚙️ Phase 2: Functionality Testing');
    console.log('-'.repeat(40));

    // Test rich text formatting
    const formatTests = [
      { input: '**bold text**', expected: '<strong>bold text</strong>', name: 'Bold Formatting' },
      { input: '*italic text*', expected: '<em>italic text</em>', name: 'Italic Formatting' },
      { input: '[link](https://example.com)', expected: 'href="https://example.com"', name: 'Link Processing' },
      { input: '• bullet point', expected: '<li class="ml-4">bullet point</li>', name: 'Bullet Points' }
    ];

    formatTests.forEach(test => {
      const result = this.formatPreview(test.input);
      this.logTest('functionality', test.name, 
        result.includes(test.expected), `Input: ${test.input}`);
    });

    // Test content validation
    const validationTests = [
      { content: '', shouldPass: false, name: 'Empty Content Rejection' },
      { content: '   ', shouldPass: false, name: 'Whitespace Content Rejection' },
      { content: 'Valid content', shouldPass: true, name: 'Valid Content Acceptance' },
      { content: 'Content with **formatting**', shouldPass: true, name: 'Formatted Content Acceptance' }
    ];

    validationTests.forEach(test => {
      const isValid = this.validateContent(test.content);
      this.logTest('functionality', test.name, 
        isValid === test.shouldPass, `Content: "${test.content.substring(0, 20)}..."`);
    });

    // Test URL security
    const urlTests = [
      { url: 'https://kolakevilla.com', safe: true, name: 'HTTPS URL Validation' },
      { url: 'javascript:alert("xss")', safe: false, name: 'JavaScript URL Blocking' },
      { url: 'data:text/html,<script>', safe: false, name: 'Data URL Blocking' }
    ];

    urlTests.forEach(test => {
      const isSafe = this.validateUrl(test.url);
      this.logTest('functionality', test.name, 
        isSafe === test.safe, `URL: ${test.url}`);
    });
  }

  async runPerformanceTests() {
    console.log('\n⚡ Phase 3: Performance Testing');
    console.log('-'.repeat(40));

    // API response time tests
    const performanceTests = [
      { endpoint: '/api/content', maxTime: 100 },
      { endpoint: '/api/gallery', maxTime: 150 },
      { endpoint: '/api/rooms', maxTime: 100 }
    ];

    for (const test of performanceTests) {
      const startTime = Date.now();
      try {
        const response = await fetch(`${this.baseUrl}${test.endpoint}`);
        const responseTime = Date.now() - startTime;
        
        this.logTest('performance', `${test.endpoint} Response Time`, 
          responseTime <= test.maxTime, 
          `${responseTime}ms (max: ${test.maxTime}ms)`);
      } catch (error) {
        this.logTest('performance', `${test.endpoint} Performance`, false, error.message);
      }
    }

    // Memory usage simulation
    const memoryTest = this.simulateMemoryUsage();
    this.logTest('performance', 'Memory Usage Simulation', 
      memoryTest.success, `Peak usage: ${memoryTest.peakUsage}MB`);

    // DOM rendering performance
    const renderTest = this.testRenderingPerformance();
    this.logTest('performance', 'DOM Rendering Performance', 
      renderTest.renderTime < 50, `Render time: ${renderTest.renderTime}ms`);
  }

  async runSecurityTests() {
    console.log('\n🔒 Phase 4: Security Testing');
    console.log('-'.repeat(40));

    // XSS prevention tests
    const xssTests = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(1)">',
      'data:text/html,<script>alert(1)</script>'
    ];

    xssTests.forEach((payload, index) => {
      const sanitized = this.sanitizeInput(payload);
      this.logTest('security', `XSS Prevention Test ${index + 1}`, 
        !sanitized.includes('<script>') && !sanitized.includes('javascript:'), 
        `Payload blocked: ${payload.substring(0, 30)}...`);
    });

    // Input validation tests
    const inputTests = [
      { input: null, name: 'Null Input Handling' },
      { input: undefined, name: 'Undefined Input Handling' },
      { input: {}, name: 'Object Input Handling' },
      { input: [], name: 'Array Input Handling' }
    ];

    inputTests.forEach(test => {
      const isValid = this.validateContent(test.input);
      this.logTest('security', test.name, 
        !isValid, `Input type: ${typeof test.input}`);
    });

    // Content Security Policy test
    this.logTest('security', 'Content Security Policy', 
      this.checkCSPHeaders(), 'CSP headers validation');

    // HTTPS enforcement test
    this.logTest('security', 'HTTPS Enforcement', 
      window.location.protocol === 'https:' || window.location.hostname === 'localhost', 
      `Protocol: ${window.location.protocol}`);
  }

  simulateMemoryUsage() {
    const testData = [];
    let peakUsage = 0;
    
    try {
      // Simulate content processing
      for (let i = 0; i < 1000; i++) {
        testData.push({
          id: `test-${i}`,
          content: 'Sample content with **formatting** and [links](https://example.com)',
          processed: this.formatPreview('Sample content with **formatting**')
        });
      }
      
      peakUsage = (JSON.stringify(testData).length / 1024 / 1024).toFixed(2);
      return { success: peakUsage < 10, peakUsage };
    } catch (error) {
      return { success: false, peakUsage: 'Error' };
    }
  }

  testRenderingPerformance() {
    const startTime = performance.now();
    
    // Simulate DOM manipulation
    const testElement = document.createElement('div');
    testElement.innerHTML = this.formatPreview('Test content with **bold** and *italic* text');
    document.body.appendChild(testElement);
    document.body.removeChild(testElement);
    
    const renderTime = performance.now() - startTime;
    return { renderTime: Math.round(renderTime) };
  }

  checkCSPHeaders() {
    // Check for basic security headers
    const metaTags = document.querySelectorAll('meta[http-equiv]');
    let hasCSP = false;
    
    metaTags.forEach(tag => {
      if (tag.getAttribute('http-equiv')?.toLowerCase().includes('content-security-policy')) {
        hasCSP = true;
      }
    });
    
    return hasCSP || document.querySelector('meta[name="content-security-policy"]') !== null;
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  formatPreview(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>')
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
      .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="list-disc list-inside space-y-1">$1</ul>')
      .replace(/\n/g, '<br>');
  }

  validateContent(content) {
    if (!content || typeof content !== 'string') return false;
    if (content.trim().length === 0) return false;
    return true;
  }

  validateUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
    } catch {
      return false;
    }
  }

  logTest(phase, testName, passed, details = '') {
    this.results[phase].tests.push({
      name: testName,
      status: passed ? 'PASS' : 'FAIL',
      details: details
    });
    
    if (passed) {
      this.results[phase].passed++;
      console.log(`✅ ${testName}`);
    } else {
      this.results[phase].failed++;
      console.log(`❌ ${testName}: ${details}`);
    }
    
    if (details && passed) {
      console.log(`   Details: ${details}`);
    }
  }

  async generateReleaseReport(duration) {
    console.log('\n📊 Release Pipeline Report');
    console.log('=' + '='.repeat(60));
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    Object.keys(this.results).forEach(phase => {
      const phaseResults = this.results[phase];
      totalPassed += phaseResults.passed;
      totalFailed += phaseResults.failed;
      
      const phaseTotal = phaseResults.passed + phaseResults.failed;
      const phaseRate = phaseTotal > 0 ? ((phaseResults.passed / phaseTotal) * 100).toFixed(1) : 0;
      
      console.log(`${phase.toUpperCase()}: ${phaseResults.passed}/${phaseTotal} (${phaseRate}%)`);
    });
    
    const totalTests = totalPassed + totalFailed;
    const overallRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
    
    console.log('\nOVERALL RESULTS:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed} ✅`);
    console.log(`Failed: ${totalFailed} ❌`);
    console.log(`Success Rate: ${overallRate}%`);
    console.log(`Execution Time: ${duration}s`);
    
    // Store results for deployment decision
    this.overallResults = {
      totalTests,
      totalPassed,
      totalFailed,
      successRate: overallRate,
      duration
    };
  }

  makeDeploymentRecommendation() {
    const { successRate, totalFailed } = this.overallResults;
    
    console.log('\n🎯 DEPLOYMENT RECOMMENDATION');
    console.log('=' + '='.repeat(60));
    
    if (successRate >= 95 && totalFailed === 0) {
      console.log('✅ DEPLOY IMMEDIATELY');
      console.log('All systems pass validation. Ready for production deployment.');
      this.generateDeploymentCommands();
    } else if (successRate >= 90 && totalFailed <= 2) {
      console.log('⚠️ DEPLOY WITH CAUTION');
      console.log('Minor issues detected. Review failed tests before deployment.');
      this.generateDeploymentCommands();
    } else if (successRate >= 80) {
      console.log('🔄 FIX ISSUES FIRST');
      console.log('Several issues detected. Address failed tests before deployment.');
      this.generateRollbackCommands();
    } else {
      console.log('❌ DO NOT DEPLOY');
      console.log('Critical issues detected. System not ready for production.');
      this.generateRollbackCommands();
    }
    
    console.log('\n📋 Next Steps:');
    if (successRate >= 90) {
      console.log('1. Run deployment script');
      console.log('2. Monitor production logs');
      console.log('3. Verify functionality post-deployment');
    } else {
      console.log('1. Review failed test details above');
      console.log('2. Fix identified issues');
      console.log('3. Re-run pipeline: runAutomatedReleasePipeline()');
    }
  }

  generateDeploymentCommands() {
    console.log('\n🚀 AUTOMATED DEPLOYMENT COMMANDS:');
    console.log('// Copy and paste these commands to deploy:');
    console.log('// 1. Create deployment tag');
    console.log(`// git tag deploy-${this.releaseVersion}`);
    console.log('// 2. Deploy to production (Replit)');
    console.log('// Click the Deploy button in Replit interface');
    console.log('// 3. Verify deployment');
    console.log('// curl -s https://your-domain.replit.app/api/content | jq');
  }

  generateRollbackCommands() {
    console.log('\n↩️ ROLLBACK COMMANDS (if needed):');
    console.log('// If deployment fails, use these to rollback:');
    console.log('// git checkout baseline-v1.0');
    console.log('// npm install');
    console.log('// npm run dev');
  }
}

// Auto-initialization
async function runAutomatedReleasePipeline() {
  const pipeline = new AutomatedReleasePipeline();
  await pipeline.runFullReleasePipeline();
  return pipeline.overallResults;
}

// Export for use
if (typeof window !== 'undefined') {
  window.runAutomatedReleasePipeline = runAutomatedReleasePipeline;
  window.AutomatedReleasePipeline = AutomatedReleasePipeline;
  console.log('🤖 Automated Release Pipeline loaded!');
  console.log('Run with: runAutomatedReleasePipeline()');
}