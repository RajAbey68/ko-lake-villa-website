
/**
 * Ko Lake Villa - Final Comprehensive Fix Test
 * This is your ONE CHANCE test to verify everything works
 */

class FinalComprehensiveTest {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = [];
    this.criticalIssues = [];
  }

  async log(test, status, message) {
    const result = { test, status, message, timestamp: new Date().toISOString() };
    this.results.push(result);
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} ${test}: ${message}`);
    
    if (status === 'FAIL') {
      this.criticalIssues.push(`${test}: ${message}`);
    }
  }

  async testAPI(endpoint, method = 'GET', body = null) {
    try {
      const options = { method };
      if (body) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return { ok: response.ok, status: response.status, data: await response.json() };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async runCriticalTests() {
    console.log('🔥 FINAL COMPREHENSIVE TEST - ONE CHANCE TO GET IT RIGHT');
    console.log('=' .repeat(60));

    // Test 1: Server Health
    const health = await this.testAPI('/health');
    if (health.ok) {
      await this.log('SERVER_HEALTH', 'PASS', 'Server is responding');
    } else {
      await this.log('SERVER_HEALTH', 'FAIL', `Server unreachable: ${health.error || health.status}`);
      return this.generateReport();
    }

    // Test 2: Gallery API
    const gallery = await this.testAPI('/api/gallery');
    if (gallery.ok) {
      await this.log('GALLERY_API', 'PASS', `Gallery API works - ${gallery.data?.length || 0} images`);
    } else {
      await this.log('GALLERY_API', 'FAIL', `Gallery API failed: ${gallery.error || gallery.status}`);
    }

    // Test 3: Upload Endpoint Check
    const uploadCheck = await this.testAPI('/api/upload', 'POST', {});
    if (uploadCheck.status === 400) {
      await this.log('UPLOAD_ENDPOINT', 'PASS', 'Upload endpoint exists and validates');
    } else {
      await this.log('UPLOAD_ENDPOINT', 'FAIL', `Upload endpoint issue: ${uploadCheck.status}`);
    }

    // Test 4: Admin Routes
    const adminGallery = await this.testAPI('/api/admin/gallery');
    if (adminGallery.ok) {
      await this.log('ADMIN_ROUTES', 'PASS', 'Admin routes accessible');
    } else {
      await this.log('ADMIN_ROUTES', 'FAIL', `Admin routes failed: ${adminGallery.error || adminGallery.status}`);
    }

    // Test 5: Static File Serving
    const staticTest = await this.testAPI('/uploads/gallery/default/');
    await this.log('STATIC_FILES', staticTest.ok ? 'PASS' : 'WARN', 
      staticTest.ok ? 'Static files served' : 'Static file serving may have issues');

    // Test 6: AI Analysis Endpoint
    const aiTest = await this.testAPI('/api/analyze-media', 'POST', {});
    await this.log('AI_ANALYSIS', aiTest.status === 400 ? 'PASS' : 'WARN',
      aiTest.status === 400 ? 'AI endpoint exists' : 'AI endpoint may need attention');

    return this.generateReport();
  }

  generateReport() {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;
    const total = this.results.length;

    console.log('\n🏁 FINAL TEST RESULTS');
    console.log('=' .repeat(40));
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`📊 Success Rate: ${Math.round((passed / total) * 100)}%`);

    if (this.criticalIssues.length === 0) {
      console.log('\n🎉 SUCCESS! Your Ko Lake Villa site is ready for production!');
      console.log('🚀 All critical systems are operational.');
    } else {
      console.log('\n🚨 CRITICAL ISSUES FOUND:');
      this.criticalIssues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
      });
      console.log('\n🔧 Fix these issues before deployment!');
    }

    return {
      passed,
      failed,
      warnings,
      total,
      criticalIssues: this.criticalIssues,
      ready: this.criticalIssues.length === 0
    };
  }
}

// Run the final test
async function runFinalTest() {
  const tester = new FinalComprehensiveTest();
  return await tester.runCriticalTests();
}

// Auto-run
if (typeof window === 'undefined') {
  runFinalTest().catch(console.error);
}

module.exports = { FinalComprehensiveTest, runFinalTest };
